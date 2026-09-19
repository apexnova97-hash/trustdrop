import { supabase } from '../../../lib/supabase'

export async function GET(request, { params }) {
  const { slug } = await params

  const { data: business } = await supabase
    .from('businesses')
    .select('id, business_name')
    .eq('slug', slug)
    .single()

  if (!business) {
    return new Response('Business not found', { status: 404 })
  }

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('business_id', business.id)
    .eq('approved', true)
    .order('created_at', { ascending: false })

  const stars = (rating) => '⭐'.repeat(rating)

  const html = `
    <div style="font-family: sans-serif; max-width: 100%;">
      <h3 style="color: #7c3aed; margin-bottom: 16px;">
        What people say about ${business.business_name}
      </h3>
      ${testimonials && testimonials.length > 0 
        ? testimonials.map(t => `
          <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 12px; border: 1px solid #e5e7eb;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <div style="width: 36px; height: 36px; background: #ede9fe; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #7c3aed;">
                ${t.reviewer_name[0].toUpperCase()}
              </div>
              <div>
                <p style="margin: 0; font-weight: 600; color: #1f2937;">${t.reviewer_name}</p>
                <p style="margin: 0; font-size: 12px; color: #9ca3af;">${stars(t.star_rating)}</p>
              </div>
            </div>
            <p style="margin: 0; color: #4b5563; font-size: 14px;">${t.review_text}</p>
          </div>
        `).join('')
        : '<p style="color: #9ca3af;">No reviews yet.</p>'
      }
      <p style="font-size: 11px; color: #d1d5db; text-align: right; margin-top: 8px;">
        Powered by TrustDrop
      </p>
    </div>

    <script>
      // Auto resize
      if (window.parent !== window) {
        window.parent.postMessage({ height: document.body.scrollHeight }, '*');
      }
    </script>
  `

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
    },
  })
}