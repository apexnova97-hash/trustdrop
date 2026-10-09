import { NextResponse } from 'next/server'
import { getPaddleClient } from '../../../../lib/paddle'
import { getSupabaseAdmin } from '../../../../lib/supabaseAdmin'

export const runtime = 'nodejs'

function getCustomData(data) {
  return data?.customData || data?.custom_data || {}
}

function mapSubscriptionStatus(status) {
  if (status === 'active') return 'active'
  if (status === 'trialing') return 'trialing'
  if (status === 'canceled' || status === 'cancelled') return 'cancelled'
  if (status === 'past_due' || status === 'paused' || status === 'inactive') return 'expired'
  return null
}

export async function POST(request) {
  const signature = request.headers.get('paddle-signature')
  const secret = process.env.PADDLE_WEBHOOK_SECRET
  if (!signature || !secret) {
    return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 400 })
  }

  // Signature verification requires the exact, untouched request body.
  const rawBody = await request.text()
  let event
  try {
    event = await getPaddleClient().webhooks.unmarshal(rawBody, secret, signature)
  } catch (error) {
    console.warn('Rejected Paddle webhook signature:', error?.message || 'invalid signature')
    return NextResponse.json({ error: 'Invalid Paddle signature.' }, { status: 401 })
  }

  const eventId = event?.eventId || event?.event_id
  const eventType = event?.eventType || event?.event_type
  const data = event?.data
  if (!eventId || !eventType || !data) {
    return NextResponse.json({ error: 'Malformed Paddle event.' }, { status: 400 })
  }

  const supported = new Set([
    'subscription.created',
    'subscription.updated',
    'subscription.activated',
    'subscription.canceled',
    'subscription.paused',
    'subscription.resumed',
    'subscription.past_due',
  ])

  // Valid, unrelated events should be acknowledged without modifying access.
  if (!supported.has(eventType)) {
    return NextResponse.json({ received: true, ignored: true })
  }

  const customData = getCustomData(data)
  const businessId = customData.trustdrop_business_id
  const subscriptionId = data.id
  const status = mapSubscriptionStatus(data.status)

  if (!businessId || !subscriptionId || !status) {
    console.warn('Paddle subscription event missing expected mapping/status:', eventType)
    return NextResponse.json({ error: 'Subscription event is missing required data.' }, { status: 400 })
  }

  // Do not grant access for an event that isn't for the configured Pro price.
  const priceId = process.env.PADDLE_PRICE_ID
  const items = Array.isArray(data.items) ? data.items : []
  const hasExpectedPrice = items.some(item =>
    item?.price?.id === priceId ||
    item?.priceId === priceId ||
    item?.price_id === priceId
  )
  if (priceId && items.length > 0 && !hasExpectedPrice) {
    console.warn('Ignored Paddle subscription for unexpected price:', subscriptionId)
    return NextResponse.json({ received: true, ignored: true })
  }

  const admin = getSupabaseAdmin()
  const { data: business, error: lookupError } = await admin
    .from('businesses')
    .select('id,paddle_subscription_id,paddle_updated_at')
    .eq('id', businessId)
    .maybeSingle()

  if (lookupError) {
    console.error('Paddle webhook business lookup failed:', lookupError)
    return NextResponse.json({ error: 'Database lookup failed.' }, { status: 500 })
  }
  if (!business) {
    // Return non-2xx so Paddle retries; this may be a temporary ordering issue.
    return NextResponse.json({ error: 'TrustDrop business not found.' }, { status: 404 })
  }

  const eventTime = event?.occurredAt || event?.occurred_at || new Date().toISOString()
  const eventMs = Date.parse(eventTime)
  const priorMs = business.paddle_updated_at ? Date.parse(business.paddle_updated_at) : 0
  if (Number.isFinite(eventMs) && eventMs < priorMs) {
    return NextResponse.json({ received: true, ignored: true, reason: 'stale_event' })
  }

  // Once a business is linked to a subscription, a different subscription must not
  // overwrite it unless the old subscription has already ended.
  if (
    business.paddle_subscription_id &&
    business.paddle_subscription_id !== subscriptionId &&
    !['cancelled', 'expired'].includes(status)
  ) {
    console.warn('Rejected unexpected Paddle subscription for business:', businessId)
    return NextResponse.json({ error: 'Business is already linked to another subscription.' }, { status: 409 })
  }

  const patch = {
    plan: status === 'active' ? 'pro' : 'free',
    subscription_status: status,
    paddle_subscription_id: subscriptionId,
    paddle_customer_id: data.customerId || data.customer_id || null,
    paddle_updated_at: Number.isFinite(eventMs) ? new Date(eventMs).toISOString() : new Date().toISOString(),
    paddle_last_event_id: eventId,
  }

  // A live paid subscription clears the trial deadline. For a trialing Paddle
  // subscription, use Paddle's billing period; TrustDrop's own 14-day trial is
  // otherwise preserved and remains governed by trial_ends_at.
  if (status === 'active') patch.trial_ends_at = null
  if (status === 'trialing') {
    const periodEnd = data.currentBillingPeriod?.endsAt || data.current_billing_period?.ends_at
    if (periodEnd) patch.trial_ends_at = periodEnd
  }

  const { error: updateError } = await admin
    .from('businesses')
    .update(patch)
    .eq('id', businessId)

  if (updateError) {
    console.error('Paddle webhook business update failed:', updateError)
    return NextResponse.json({ error: 'Could not update subscription.' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
