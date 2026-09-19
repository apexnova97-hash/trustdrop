'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const businessId = 'd919f037-d91d-4981-91d2-c4bc7443004e' // your test business ID

  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })

    setTestimonials(data || [])
    setLoading(false)
  }

  async function approveTestimonial(id, currentStatus) {
    await supabase
      .from('testimonials')
      .update({ approved: !currentStatus })
      .eq('id', id)

    fetchTestimonials()
  }

  async function deleteTestimonial(id) {
    await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)

    fetchTestimonials()
  }

  const stars = (rating) => '⭐'.repeat(rating)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Reviews 📋</h1>
          <p className="text-gray-500 mt-1">Manage and approve testimonials</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-purple-600">{testimonials.length}</p>
            <p className="text-gray-500 text-sm">Total Reviews</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-green-600">
              {testimonials.filter(t => t.approved).length}
            </p>
            <p className="text-gray-500 text-sm">Approved</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {testimonials.filter(t => !t.approved).length}
            </p>
            <p className="text-gray-500 text-sm">Pending</p>
          </div>
        </div>

        {/* Collection Link */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-8">
          <p className="text-sm font-medium text-purple-700 mb-1">
            Your collection link — share this with your customers:
          </p>
          <p className="text-purple-600 font-mono text-sm">
            http://localhost:3000/collect/testbiz
          </p>
        </div>

        {/* Reviews List */}
        {testimonials.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-500">No reviews yet. Share your collection link!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold">
                          {t.reviewer_name[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{t.reviewer_name}</p>
                        <p className="text-xs text-gray-400">{t.reviewer_email}</p>
                      </div>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        t.approved 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {t.approved ? '✓ Approved' : '⏳ Pending'}
                      </span>
                    </div>
                    <p className="text-yellow-500 mb-2">{stars(t.star_rating)}</p>
                    <p className="text-gray-600">{t.review_text}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => approveTestimonial(t.id, t.approved)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        t.approved
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {t.approved ? 'Unapprove' : 'Approve'}
                    </button>
                    <button
                      onClick={() => deleteTestimonial(t.id)}
                      className="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}