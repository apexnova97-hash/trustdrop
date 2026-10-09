import { NextResponse } from 'next/server'
import { getPaddleApiBaseUrl } from '../../../../lib/paddle'
import { getSupabaseAdmin } from '../../../../lib/supabaseAdmin'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const apiKey = process.env.PADDLE_API_KEY
    const priceId = process.env.PADDLE_PRICE_ID

    if (!supabaseUrl || !anonKey || !apiKey || !priceId) {
      return NextResponse.json({ error: 'Billing is not configured yet.' }, { status: 503 })
    }

    const authorization = request.headers.get('authorization')
    const bearer = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
    if (!bearer) {
      return NextResponse.json({ error: 'Please log in to continue.' }, { status: 401 })
    }

    // Verify the access token with Supabase Auth rather than trusting client data.
    const { createClient } = await import('@supabase/supabase-js')
    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${bearer}` } },
    })
    const { data: { user }, error: userError } = await authClient.auth.getUser(bearer)
    if (userError || !user) {
      return NextResponse.json({ error: 'Your session is invalid. Please log in again.' }, { status: 401 })
    }

    const admin = getSupabaseAdmin()
    const { data: business, error: businessError } = await admin
      .from('businesses')
      .select('id,email,plan,subscription_status,trial_ends_at,paddle_subscription_id')
      .eq('id', user.id)
      .maybeSingle()

    if (businessError) {
      console.error('Paddle checkout business lookup failed:', businessError)
      return NextResponse.json({ error: 'Could not load your business.' }, { status: 500 })
    }
    if (!business) {
      return NextResponse.json({ error: 'No business is linked to this account.' }, { status: 404 })
    }
    if (business.paddle_subscription_id && business.subscription_status === 'active') {
      return NextResponse.json({ error: 'Your subscription is already active.' }, { status: 409 })
    }

    const siteUrl = process.env.SITE_URL || new URL(request.url).origin
    const paddleResponse = await fetch(`${getPaddleApiBaseUrl()}/transactions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }],
        custom_data: {
          trustdrop_business_id: business.id,
          trustdrop_user_id: user.id,
        },
        checkout: { url: siteUrl },
        enable_checkout: true,
      }),
      cache: 'no-store',
    })

    const payload = await paddleResponse.json().catch(() => ({}))
    if (!paddleResponse.ok || !payload?.data?.id) {
      console.error('Paddle transaction creation failed:', {
        status: paddleResponse.status,
        response: payload,
      })
      return NextResponse.json({ error: 'Paddle could not create checkout. Please try again.' }, { status: 502 })
    }

    return NextResponse.json({ transactionId: payload.data.id })
  } catch (error) {
    console.error('Paddle checkout error:', error)
    return NextResponse.json({ error: 'Could not start checkout.' }, { status: 500 })
  }
}
