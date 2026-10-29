'use client'
import { useState, useEffect, use } from 'react'
import { supabase } from '../../../lib/supabase'

const STARS = [1, 2, 3, 4, 5]
const LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent']

export default function CollectPage({ params }) {
  const { slug } = use(params)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(0)
  const [product, setProduct] = useState(null)
  const [businessName, setBusinessName] = useState('')

  useEffect(() => {
    const productSlug = new URLSearchParams(window.location.search).get('product')
    if (!productSlug) return
    let cancelled = false
    ;(async () => {
      const { data: biz } = await supabase
        .from('businesses')
        .select('id, business_name')
        .eq('slug', slug)
        .single()
      if (cancelled || !biz) return
      setBusinessName(biz.business_name || '')
      const { data: prod } = await supabase
        .from('products')
        .select('id, name')
        .eq('business_id', biz.id)
        .eq('slug', productSlug)
        .maybeSingle()
      if (!cancelled && prod) setProduct(prod)
    })()
    return () => { cancelled = true }
  }, [slug])

  async function handleSubmit() {
    setLoading(true)
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('slug', slug)
      .single()
    if (!business) {
      alert('Business not found')
      setLoading(false)
      return
    }

    const base = {
      business_id: business.id,
      reviewer_name: name.trim(),
      reviewer_email: email.trim(),
      star_rating: rating,
      review_text: review.trim(),
    }

    let error = null
    if (product?.id) {
      const first = await supabase.from('testimonials').insert({ ...base, product_id: product.id })
      error = first.error
      if (error && /product_id/i.test(error.message || '')) {
        const retry = await supabase.from('testimonials').insert(base)
        error = retry.error
      }
    } else {
      const res = await supabase.from('testimonials').insert(base)
      error = res.error
    }

    if (error) alert('Something went wrong')
    else setSubmitted(true)
    setLoading(false)
  }

  const canSubmit = name.trim() && review.trim() && rating > 0 && !loading

  return (
    <div className="cpg">
      <style>{`        .cpg { --bg:#F5F9FF; --ink:#071A31; --ink-soft:#24486B; --body:#5D6E82; --muted:#5F7285; --line:#DCE7F5;
          --blue:#0069FF; --blue-dark:#0052CC; --violet:#6B5CE7; --lime:#D9F27A; --ease:cubic-bezier(.16,1,.3,1);
          min-height:100vh; min-height:100dvh; background:var(--bg); color:var(--ink);
          font-family:var(--font-body),'Inter',-apple-system,BlinkMacSystemFont,sans-serif; -webkit-font-smoothing:antialiased;
          display:flex; align-items:center; justify-content:center;
          padding:clamp(14px,4vw,28px); padding-bottom:calc(clamp(14px,4vw,28px) + env(safe-area-inset-bottom,0px));
          position:relative; overflow-x:clip; -webkit-tap-highlight-color:transparent; }
        .cpg *, .cpg *::before, .cpg *::after { box-sizing:border-box; }
        .cpg :where(h1,h2,p) { margin:0; }

        .cpg-blob { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
        .cpg-blob.a { width:min(520px,70vw); height:min(520px,70vw); top:-180px; right:-120px;
          background:linear-gradient(150deg,#8FBBFF,#B8A6F7); opacity:.45; animation:driftA 22s var(--ease) infinite; }
        .cpg-blob.b { width:min(460px,65vw); height:min(460px,65vw); bottom:-200px; left:-140px;
          background:linear-gradient(150deg,#A6E9D2,#C9D6FA); opacity:.4; animation:driftB 26s var(--ease) infinite; }
        @keyframes driftA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-60px,40px) scale(1.08)} }
        @keyframes driftB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(50px,-40px) scale(1.06)} }
        @keyframes panelIn { from{opacity:0; transform:translateY(18px) scale(.985)} to{opacity:1; transform:none} }
        @keyframes starPop { 0%{opacity:0; transform:scale(.4) rotate(-16deg)} 100%{opacity:1; transform:none} }
        @keyframes popIn { 0%{opacity:0; transform:scale(.85)} 100%{opacity:1; transform:scale(1)} }
        @keyframes pulseDot { 0%{box-shadow:0 0 0 0 rgba(14,159,110,.45)} 70%{box-shadow:0 0 0 8px rgba(14,159,110,0)} 100%{box-shadow:0 0 0 0 rgba(14,159,110,0)} }

        .cpg-card { position:relative; width:100%; max-width:min(480px, 100%); background:rgba(255,255,255,.88);
          backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border:1px solid var(--line);
          border-radius:clamp(18px,2.6vw,24px); padding:clamp(20px,4.4vw,34px) clamp(18px,4vw,32px);
          box-shadow:0 24px 60px -28px rgba(7,26,49,.28); animation:panelIn .6s var(--ease) both; }
        .cpg-brand { display:inline-flex; align-items:center; gap:clamp(7px,1.2vw,9px); margin-bottom:clamp(16px,3vw,24px); }
        .cpg-brand svg { width:clamp(24px,4vw,28px); height:auto; }
        .cpg-brand-name { font-family:var(--font-brand),cursive; font-weight:400;
          font-size:clamp(19px,2.3vw,21px); letter-spacing:0; line-height:1; padding-bottom:2px; }
        .cpg-product { display:inline-flex; align-items:center; gap:7px; font-size:clamp(11px,1.3vw,12px); font-weight:600;
          color:#0E9F6E; background:#E7F8EF; border:1px solid #CBEFDD; padding:4px 10px; border-radius:999px;
          margin-bottom:12px; animation:popIn .4s var(--ease) both; max-width:100%; overflow-wrap:anywhere; }
        .cpg-product i { width:5px; height:5px; border-radius:50%; background:#0E9F6E; display:block; flex-shrink:0; animation:pulseDot 2.4s infinite; }
        .cpg h1 { font-family:var(--font-display),sans-serif; font-size:clamp(21px,3.4vw,27px); line-height:1.16; letter-spacing:-.035em; font-weight:800; margin-bottom:6px; text-wrap:balance; }
        .cpg-script { font-family:var(--font-script),cursive; font-weight:600; font-size:1.2em;
          letter-spacing:0; color:var(--blue); padding-right:.04em; }
        .cpg-hand { font-family:var(--font-hand),cursive; font-size:1.12em; font-weight:600;
          letter-spacing:0; color:var(--muted); }
        .cpg-sub { color:var(--body); font-size:clamp(13px,1.4vw,14.5px); line-height:1.55; margin-bottom:4px; }
        .cpg label { display:block; font-size:clamp(10px,.95vw,11.5px); font-weight:700; color:var(--ink-soft);
          text-transform:uppercase; letter-spacing:.09em; margin-bottom:7px; }
        .cpg label span { text-transform:none; letter-spacing:0; font-weight:500; color:var(--muted); }
        .cpg-field { width:100%; background:#fff; border:1px solid var(--line); border-radius:12px;
          padding:clamp(11px,1.6vw,12px) clamp(12px,1.8vw,14px); font-size:16px; color:var(--ink);
          font-family:inherit; outline:none; transition:border-color .2s, box-shadow .25s; }
        .cpg-field::placeholder { color:#93A6BA; }
        .cpg-field:focus { border-color:rgba(0,105,255,.5); box-shadow:0 0 0 4px rgba(0,105,255,.1); }
        .cpg-row { margin-top:clamp(14px,2.4vw,18px); animation:panelIn .5s var(--ease) both; }
        .cpg-row:nth-of-type(2) { animation-delay:.05s; }
        .cpg-row:nth-of-type(3) { animation-delay:.1s; }
        .cpg-row:nth-of-type(4) { animation-delay:.15s; }
        .cpg-row:nth-of-type(5) { animation-delay:.2s; }
        .cpg-stars { display:flex; align-items:center; gap:2px; flex-wrap:wrap; }
        .cpg-star { background:none; border:none; cursor:pointer; padding:2px 3px; font-size:clamp(26px,7vw,32px);
          line-height:1; color:#F5A524; transition:transform .22s var(--ease); -webkit-tap-highlight-color:transparent; }
        .cpg-star:hover { transform:scale(1.16) rotate(-4deg); }
        .cpg-star:active { transform:scale(.94); }
        .cpg-star.on { animation:starPop .38s var(--ease) both; }
        .cpg-star.off { color:#DCE7F5; }
        .cpg-star-label { margin-left:8px; font-family:var(--font-hand),cursive;
          font-size:clamp(17px,2vw,19px); font-weight:600; color:var(--body); }
        .cpg-count { text-align:right; font-size:11px; color:#93A6BA; margin-top:4px; }
        .cpg-submit { margin-top:clamp(16px,2.6vw,20px); animation:panelIn .5s var(--ease) .25s both; }
        .cpg-submit { width:100%; border:none; border-radius:14px; padding:clamp(13px,2vw,15px);
          font-family:inherit; font-size:clamp(14px,1.6vw,15px); font-weight:700; color:#fff; cursor:pointer;
          background:linear-gradient(135deg,#2E7CFF,#0052CC); box-shadow:0 14px 30px -12px rgba(0,105,255,.65);
          min-height:50px; transition:transform .3s var(--ease), box-shadow .3s var(--ease), opacity .2s; }
        .cpg-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 20px 38px -14px rgba(0,105,255,.7); }
        .cpg-submit:active:not(:disabled) { transform:scale(.985); }
        .cpg-submit:disabled { opacity:.38; cursor:not-allowed; box-shadow:none; }
        .cpg-foot { text-align:center; font-family:var(--font-hand),cursive;
          font-size:clamp(15px,1.8vw,17px); color:#5F7285; margin-top:16px; }
        .cpg-foot b { color:var(--blue); font-weight:600; }
        .cpg-done { text-align:center; padding:10px 0 4px; animation:panelIn .6s var(--ease) both; }
        .cpg-done-icon { width:clamp(60px,13vw,74px); height:clamp(60px,13vw,74px); border-radius:50%; margin:0 auto 18px;
          display:flex; align-items:center; justify-content:center; font-size:clamp(26px,6vw,32px);
          background:linear-gradient(150deg,#D9F8E8,#BFE9FF); box-shadow:0 18px 40px -18px rgba(14,159,110,.5);
          animation:popIn .5s var(--ease) both; }
        .cpg-done h2 { font-family:var(--font-quote),cursive; font-size:clamp(30px,4.4vw,38px);
          letter-spacing:0; line-height:1.06; margin-bottom:8px; font-weight:400; }
        .cpg-done p { color:var(--body); font-size:clamp(13px,1.5vw,14px); margin-bottom:16px; line-height:1.6; }
        .cpg-done-stars { display:inline-flex; gap:3px; color:#F5A524; font-size:clamp(18px,4vw,22px); letter-spacing:2px; }

        @media (max-width: 420px) {
          .cpg-card { border-radius:18px; }
          .cpg-stars { gap:0; }
          .cpg-star { padding:2px; }
          .cpg-star-label { width:100%; margin:6px 0 0; }
        }
        @media (hover: none) {
          .cpg-star:hover { transform:none; }
          .cpg-submit:hover:not(:disabled) { transform:none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cpg-blob, .cpg-card, .cpg-star, .cpg-product, .cpg-done-icon, .cpg-row, .cpg-submit { animation:none !important; }
          .cpg *, .cpg *::before, .cpg *::after { transition:none !important; }
        }
`}</style>

      <span className="cpg-blob a" aria-hidden="true" />
      <span className="cpg-blob b" aria-hidden="true" />

      <div className="cpg-card">
        <div className="cpg-brand">
          <svg width="28" height="28" viewBox="0 0 40 40" aria-hidden="true">
            <defs>
              <linearGradient id="cpg-logo" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#2E7CFF" />
                <stop offset="1" stopColor="#0B4FE3" />
              </linearGradient>
            </defs>
            <rect width="40" height="40" rx="11" fill="url(#cpg-logo)" />
            <path d="M20 9.9 22.7 16.8 30.1 17.2 24.4 22 26.3 29.1 20 25.2 13.7 29.1 15.6 22 9.9 17.2 17.3 16.8Z" fill="#FFC62E" />
          </svg>
          <span className="cpg-brand-name">TrustDrop</span>
        </div>

        {submitted ? (
          <div className="cpg-done">
            <div className="cpg-done-icon" aria-hidden="true">🎉</div>
            <h2>Thank you{name ? ', ' + name.split(' ')[0] : ''}!</h2>
            <p>Your review is in. {businessName ? businessName + ' will ' : 'It will '}take a look before it goes live.</p>
            <div className="cpg-done-stars" aria-label={rating + ' out of 5'}>
              {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
            </div>
          </div>
        ) : (
          <>
            {product && (
              <span className="cpg-product"><i />{product.name}</span>
            )}
            <h1>Leave a <span className="cpg-script">review</span></h1>
            <p className="cpg-sub">
              {product
                ? 'How was your ' + product.name.toLowerCase() + '? Your feedback helps others decide.'
                : 'Your feedback helps others make better decisions.'}
            </p>

            <div className="cpg-row">
              <label>Your rating</label>
              <div className="cpg-stars">
                {STARS.map((s) => {
                  const active = s <= (hovered || rating)
                  return (
                    <button
                      key={s}
                      type="button"
                      className={'cpg-star' + (active ? ' on' : ' off')}
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(s)}
                      aria-label={s + ' star' + (s === 1 ? '' : 's')}
                    >
                      ★
                    </button>
                  )
                })}
                {(hovered || rating) > 0 && (
                  <span className="cpg-star-label">{LABELS[hovered || rating]}</span>
                )}
              </div>
            </div>

            <div className="cpg-row">
              <label>Your name *</label>
              <input
                className="cpg-field"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>

            <div className="cpg-row">
              <label>Email <span>(optional)</span></label>
              <input
                className="cpg-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
              />
            </div>

            <div className="cpg-row">
              <label>Your review *</label>
              <textarea
                className="cpg-field"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What did you think? Be honest."
                rows={4}
                style={{ resize: 'none', lineHeight: 1.6 }}
              />
              <div className="cpg-count">{review.length}</div>
            </div>

            <button className="cpg-submit" onClick={handleSubmit} disabled={!canSubmit}>
              {loading ? 'Submitting…' : 'Submit review'}
            </button>

            <p className="cpg-foot">Powered by <b>TrustDrop</b></p>
          </>
        )}
      </div>
    </div>
  )
}
