'use client'
import { useState, use } from 'react'
import { supabase } from '../../../lib/supabase'

export default function CollectPage({ params }) {
  const { slug } = use(params)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

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
    const { error } = await supabase
      .from('testimonials')
      .insert({
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank you!</h2>
          <p className="text-gray-500">Your review has been submitted successfully.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Leave a Review ⭐</h1>
        <p className="text-gray-500 mb-6">We love to hear about your experience!</p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map((star) => (
              <button key={star} onClick={() => setRating(star)}
                className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? 'opacity-100' : 'opacity-30'}`}>
                ⭐
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
          <textarea value={review} onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us about your experience..." rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" />
        </div>
        <button onClick={handleSubmit} disabled={!name || !review || loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  )
}
