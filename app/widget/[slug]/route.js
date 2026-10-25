import { supabase } from '../../../lib/supabase'
import { renderWidgetDocument } from '../../../lib/widgetHtml'

function widgetResponse(data, status = 200) {
  return new Response(renderWidgetDocument(data), {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'unsafe-inline'; frame-ancestors *; base-uri 'none'; form-action 'none'",
      'Cache-Control': 'no-store',
    },
  })
}

export async function GET(request, { params }) {
  const { slug } = await params

  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id, business_name')
    .eq('slug', slug)
    .maybeSingle()

  if (businessError) {
    return widgetResponse({ state: 'error', businessName: '', reviews: [] }, 500)
  }

  if (!business) {
    return widgetResponse({ state: 'notFound', businessName: '', reviews: [] }, 404)
  }

  const { data: testimonials, error: reviewsError } = await supabase
    .from('testimonials')
    .select('reviewer_name, star_rating, review_text, created_at')
    .eq('business_id', business.id)
    .eq('approved', true)
    .order('created_at', { ascending: false })

  if (reviewsError) {
    return widgetResponse({ state: 'error', businessName: business.business_name, reviews: [] }, 500)
  }

  const reviews = (testimonials || []).map((review) => ({
    name: review.reviewer_name || 'Customer',
    rating: review.star_rating,
    text: review.review_text || '',
    date: review.created_at || '',
  }))

  return widgetResponse({
    state: 'ready',
    businessName: business.business_name,
    reviews,
  })
}
