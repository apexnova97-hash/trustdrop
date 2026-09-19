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

  const starLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent']

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f7ff 0%, #ede9fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>
        <div style={{ background: 'white', borderRadius: 24, padding: 48, maxWidth: 440, width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(108,62,244,0.12)' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginBottom: 10 }}>Thank you!</h2>
          <p style={{ color: '#666', fontSize: 16, lineHeight: 1.7 }}>Your review has been submitted. It means a lot to us!</p>
          <div style={{ marginTop: 32, padding: 20, background: '#f8f7ff', borderRadius: 16 }}>
            <p style={{ color: '#6c3ef4', fontWeight: 600, fontSize: 14 }}>⭐ {'⭐'.repeat(rating - 1)} You gave {rating} stars</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f7ff 0%, #ede9fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, textarea { outline: none; }
        input:focus, textarea:focus { border-color: #6c3ef4 !important; box-shadow: 0 0 0 3px rgba(108,62,244,0.1); }
        .star-btn { background: none; border: none; cursor: pointer; font-size: 40px; transition: transform 0.1s; padding: 4px; }
        .star-btn:hover { transform: scale(1.2); }
        .submit-btn { width: 100%; background: #6c3ef4; color: white; border: none; padding: 16px; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.2s; font-family: inherit; }
        .submit-btn:hover { background: #5a2fd9; }
        .submit-btn:disabled { background: #c4b5fd; cursor: not-allowed; }
      `}</style>

      <div style={{ background: 'white', borderRadius: 24, padding: '40px 36px', maxWidth: 460, width: '100%', boxShadow: '0 8px 40px rgba(108,62,244,0.12)' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: '#ede9fe', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>
            ⭐
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>
            How was your experience?
          </h1>
          <p style={{ color: '#888', fontSize: 15, lineHeight: 1.6 }}>
            Your honest feedback helps us improve and helps others make the right choice.
          </p>
        </div>

        {/* Star Rating */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="star-btn"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                style={{ opacity: star <= (hovered || rating) ? 1 : 0.25 }}
              >
                ⭐
              </button>
            ))}
          </div>
          <p style={{ color: '#6c3ef4', fontWeight: 600, fontSize: 14, height: 20 }}>
            {hovered ? starLabels[hovered] : rating ? starLabels[rating] : 'Tap a star to rate'}
          </p>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>
            Your name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', fontSize: 15, color: '#1a1a2e', transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'inherit' }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>
            Email <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', fontSize: 15, color: '#1a1a2e', transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'inherit' }}
          />
        </div>

        {/* Review */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>
            Your review *
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us what you loved, what could be better, and anything else you'd like to share..."
            rows={4}
            style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', fontSize: 15, color: '#1a1a2e', resize: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'inherit', lineHeight: 1.6 }}
          />
          <p style={{ textAlign: 'right', fontSize: 12, color: '#bbb', marginTop: 4 }}>{review.length} characters</p>
        </div>

        {/* Submit */}
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!name || !review || rating === 0 || loading}
        >
          {loading ? '⏳ Submitting...' : 'Submit Review →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#ccc', marginTop: 16 }}>
          Powered by <span style={{ color: '#6c3ef4', fontWeight: 600 }}>TrustDrop</span>
        </p>
      </div>
    </div>
  )
}
