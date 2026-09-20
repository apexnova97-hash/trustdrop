'use client'
import { useState, use } from 'react'
import { supabase } from '../../../lib/supabase'

export default function CollectPage({ params }) {
  const { slug } = use(params)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(0)

  async function handleSubmit() {
    setLoading(true)
    const { data: business } = await supabase
      .from('businesses').select('id').eq('slug', slug).single()
    if (!business) { alert('Business not found'); setLoading(false); return }
    const { error } = await supabase.from('testimonials').insert({
      business_id: business.id,
      reviewer_name: name,
      reviewer_email: email,
      star_rating: rating,
      review_text: review,
    })
    if (!error) { setSubmitted(true) } else { alert('Something went wrong') }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
        <div style={{ position: 'absolute', width: 400, height: 400, background: '#1d4ed8', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.07, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <div style={{ background: '#0a0e1a', border: '1px solid #141c2e', borderRadius: 20, padding: '48px 40px', maxWidth: 420, width: '100%', textAlign: 'center', position: 'relative' }}>
          <div style={{ width: 64, height: 64, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 24px' }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 10 }}>Thank you!</h2>
          <p style={{ color: '#555', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>Your review has been submitted successfully.</p>
          <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.12)', borderRadius: 10, padding: '12px 16px' }}>
            <span style={{ color: '#f59e0b', letterSpacing: '2px' }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
          </div>
          <p style={{ color: '#222', fontSize: 12, marginTop: 24 }}>Powered by <span style={{ color: '#2563eb', fontWeight: 600 }}>TrustDrop</span></p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .field {
          width: 100%;
          background: #070b14;
          border: 1px solid #141c2e;
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 15px;
          color: white;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field:focus { border-color: rgba(37,99,235,0.5); box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .field::placeholder { color: #2a3550; }
        .star { background: none; border: none; cursor: pointer; font-size: 28px; line-height: 1; padding: 0 3px; transition: transform 0.1s; color: #f59e0b; }
        .star:hover { transform: scale(1.2); }
        .submit {
          width: 100%;
          background: #2563eb;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, transform 0.15s;
          letter-spacing: 0.2px;
        }
        .submit:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
        .submit:disabled { opacity: 0.3; cursor: not-allowed; }
        label { display: block; font-size: 12px; font-weight: 600; color: #3a4a6b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.6px; }
      `}</style>

      <div style={{ position: 'absolute', width: 500, height: 500, background: '#1d4ed8', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.06, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

      <div style={{ background: '#0a0e1a', border: '1px solid #141c2e', borderRadius: 20, padding: '40px 36px', maxWidth: 460, width: '100%', position: 'relative' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⭐</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>TrustDrop</span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 6 }}>Leave a review</h1>
        <p style={{ color: '#3a4a6b', fontSize: 14, lineHeight: 1.5, marginBottom: 28 }}>Your feedback helps others make better decisions.</p>

        {/* Stars */}
        <div style={{ marginBottom: 28 }}>
          <label>Your rating</label>
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {[1,2,3,4,5].map(s => (
              <button key={s} className="star"
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
                style={{ opacity: s <= (hovered || rating) ? 1 : 0.12 }}
              >★</button>
            ))}
            {(hovered || rating) > 0 && (
              <span style={{ color: '#3a4a6b', fontSize: 13, marginLeft: 8 }}>
                {['','Poor','Fair','Good','Great','Excellent'][hovered || rating]}
              </span>
            )}
          </div>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <label>Your name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="field" />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label>Email <span style={{ textTransform: 'none', fontWeight: 400, color: '#2a3550' }}>(optional)</span></label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className="field" />
        </div>

        {/* Review */}
        <div style={{ marginBottom: 24 }}>
          <label>Your review *</label>
          <textarea value={review} onChange={e => setReview(e.target.value)}
            placeholder="What did you think? Be honest."
            rows={4} className="field" style={{ resize: 'none', lineHeight: 1.6 }} />
          <div style={{ textAlign: 'right', marginTop: 5 }}>
            <span style={{ fontSize: 11, color: review.length > 0 ? '#2563eb' : '#1a2030' }}>{review.length}</span>
          </div>
        </div>

        <button className="submit" onClick={handleSubmit} disabled={!name || !review || rating === 0 || loading}>
          {loading ? 'Submitting...' : 'Submit review'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#1a2030', marginTop: 20 }}>
          Powered by <span style={{ color: '#2563eb' }}>TrustDrop</span>
        </p>
      </div>
    </div>
  )
}
