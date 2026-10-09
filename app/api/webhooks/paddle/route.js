import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../lib/supabaseAdmin'

export const runtime = 'nodejs'

function verifyPaddleSignature(rawBody, signatureHeader, secret) {
  const parts = Object.fromEntries(
    signatureHeader.split(';').map(part => {
      const separator = part.indexOf('=')
      return separator < 0 ? [part, ''] : [part.slice(0, separator), part.slice(separator + 1)]
    })
  )

  const timestamp = parts.ts
  const suppliedSignature = parts.h1
  if (!timestamp || !suppliedSignature || !/^\d+$/.test(timestamp)) return false

  // Reject stale requests to reduce replay risk; signature covers exact raw bytes.
  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (!Number.isFinite(ageSeconds) || ageSeconds > 5) return false

  const expected = createHmac('sha256', secret)
    .update(`${timestamp}:${rawBody}`, 'utf8')
    .digest()
  let supplied
  try {
    supplied = Buffer.from(suppliedSignature, 'hex')
  } catch {
    return false
  }
  return supplied.length === expected.length && timingSafeEqual(supplied, expected)
}

function getCustomData(data) {
  return data?.custom_data || data?.customData || {}
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

  const rawBody = await request.text()
  if (!verifyPaddleSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Invalid Paddle signature.' }, { status: 401 })
  }

  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Malformed event JSON.' }, { status: 400 })
  }

  const eventId = event?.event_id
  const eventType = event?.event_type
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
  if (!supported.has(eventType)) {
    return NextResponse.json({ received: true, ignored: true })
  }

  const customData = getCustomData(data)
  const businessId = customData.trustdrop_business_id
  const subscriptionId = data.id
  const status = mapSubscriptionStatus(data.status)
  if (!businessId || !subscriptionId || !status) {
    return NextResponse.json({ error: 'Subscription event is missing required data.' }, { status: 400 })
  }

  const priceId = process.env.PADDLE_PRICE_ID
  const items = Array.isArray(data.items) ? data.items : []
  const hasExpectedPrice = items.some(item =>
    item?.price?.id === priceId ||
    item?.price_id === priceId ||
    item?.priceId === priceId
  )
  if (!priceId || !hasExpectedPrice) {
    console.warn('Ignored Paddle subscription without the configured TrustDrop price:', subscriptionId)
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
    return NextResponse.json({ error: 'TrustDrop business not found.' }, { status: 404 })
  }

  const eventTime = event?.occurred_at || new Date().toISOString()
  const eventMs = Date.parse(eventTime)
  const priorMs = business.paddle_updated_at ? Date.parse(business.paddle_updated_at) : 0
  if (Number.isFinite(eventMs) && eventMs < priorMs) {
    return NextResponse.json({ received: true, ignored: true, reason: 'stale_event' })
  }

  if (
    business.paddle_subscription_id &&
    business.paddle_subscription_id !== subscriptionId &&
    !['cancelled', 'expired'].includes(status)
  ) {
    return NextResponse.json({ error: 'Business is already linked to another subscription.' }, { status: 409 })
  }

  const patch = {
    plan: status === 'active' ? 'pro' : 'free',
    subscription_status: status,
    paddle_subscription_id: subscriptionId,
    paddle_customer_id: data.customer_id || null,
    paddle_updated_at: Number.isFinite(eventMs) ? new Date(eventMs).toISOString() : new Date().toISOString(),
    paddle_last_event_id: eventId,
  }

  // Only a verified active paid subscription clears TrustDrop's own trial deadline.
  // Paddle-side trial events do not extend or replace TrustDrop's 14-day trial.
  if (status === 'active') patch.trial_ends_at = null

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
