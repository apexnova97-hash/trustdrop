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
      .from('businesses')
      .select('id, business_name')
      .eq('slug', slug)
      .single()
    if (!business) {
      alert('Business not found')
      setLoading(false)
      return
    }
    const { error } = await supabase
      .from('testimonials')
      .insert({
        business_id: business.id,
        reviewer_name: name,
        reviewer_email: email,
        star_rating: rating,
        review_text: review,
      })
    if (!error) { setSubmitted(true) } else { alert('Something went wrong, try again') }
    setLoading(false)
  }

  const starLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!']

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
        <div style={{ position: 'absolute', width: 400, height: 400, background: '#1d4ed8', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.1, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <div style={{ background: '#0d1117', border: '1px solid #1a2030', borderRadius: 24, padding: 48, maxWidth: 440, width: '100%', textAlign: 'center', boxShadow: '0 0 60px rgba(37,99,235,0.15)', position: 'relative' }}>
          <div style={{ width: 72, height: 72, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 12, letterSpacing: '-0.5px' }}>Thank you!</h2>
          <p style={{ color: '#666', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>Your review has been submitted. It truly means a lot to us!</p>
          <div style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 12, padding: 16 }}>
            <p style={{ color: '#60a5fa', fontWeight: 600, fontSize: 15 }}>
              {'★'.repeat(rating)}{'☆'.repeat(5 - rating)} · {['','Poor','Fair','Good','Great','Excellent!'][rating]}
            </p>
          </div>
          <p style={{ color: '#333', fontSize: 12, marginTop: 24 }}>Powered by <span style={{ color: '#2563eb', fontWeight: 600 }}>TrustDrop</span></p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .star-btn { background: none; border: none; cursor: pointer; font-size: 36px; transition: transform 0.15s; padding: 4px 6px; line-height: 1; }
        .star-btn:hover { transform: scale(1.25); }
        .field { width: 100%; background: #0a0e1a; border: 1px solid #1a2030; border-radius: 12px; padding: 14px 18px; font-size: 15px; color: white; font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .field:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .field::placeholder { color: #333; }
        .submit-btn { width: 100%; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 16px; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; box-shadow: 0 0 30px rgba(37,99,235,0.3); }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 50px rgba(37,99,235,0.5); }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
      `}</style>

      {/* Background glow */}
      <div style={{ position: 'absolute', width: 500, height: 500, background: '#1d4ed8', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.08, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 200, height: 200, background: '#2563eb', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.06, top: '20%', left: '10%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 200, height: 200, background: '#2563eb', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.06, bottom: '20%', right: '10%', pointerEvents: 'none' }} />

      <div style={{ background: '#0d1117', border: '1px solid #1a2030', borderRadius: 24, padding: '40px 36px', maxWidth: 480, width: '100%', boxShadow: '0 0 80px rgba(37,99,235,0.12)', position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24, boxShadow: '0 0 20px rgba(37,99,235,0.2)' }}>
            ⭐
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: '-0.5px' }}>
            How was your experience?
          </h1>
          <p style={{ color: '#555', fontSize: 15, lineHeight: 1.6 }}>
            Your honest feedback helps us improve and helps others make the right choice.
          </p>
        </div>

        {/* Star Rating */}
        <div style={{ textAlign: 'center', marginBottom: 32, background: '#0a0e1a', border: '1px solid #1a2030', borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 10 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="star-btn"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                style={{ opacity: star <= (hovered || rating) ? 1 : 0.15, filter: star <= (hovered || rating) ? 'drop-shadow(0 0 6px rgba(251,191,36,0.6))' : 'none' }}
              >
                ★
              </button>
            ))}
          </div>
          <p style={{ color: hovered || rating ? '#60a5fa' : '#333', fontWeight: 600, fontSize: 14, height: 20, transition: 'color 0.2s' }}>
            {hovered ? starLabels[hovered] : rating ? starLabels[rating] : 'Tap a star to rate'}
          </p>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Your name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="field"
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Email <span style={{ color: '#333', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="field"
          />
        </div>

        {/* Review */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Your review *
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us what you loved, what could be better..."
            rows={4}
            className="field"
            style={{ resize: 'none', lineHeight: 1.7 }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
            <span style={{ fontSize: 12, color: review.length > 0 ? '#2563eb' : '#333' }}>{review.length} chars</span>
          </div>
        </div>

        {/* Submit */}
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!name || !review || rating === 0 || loading}
        >
          {loading ? '⏳ Submitting...' : 'Submit Review →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#222', marginTop: 20 }}>
          Powered by <span style={{ color: '#2563eb', fontWeight: 600 }}>TrustDrop</span>
        </p>
      </div>
    </div>
  )
}
