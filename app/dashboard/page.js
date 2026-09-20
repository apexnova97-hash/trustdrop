'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [testimonials, setTestimonials] = useState([])
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = '/login'
      return
    }

    const { data: businessData } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!businessData) {
      window.location.href = '/login'
      return
    }

    setBusiness(businessData)
    fetchTestimonials(businessData.id)
  }

  async function fetchTestimonials(businessId) {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
    setTestimonials(data || [])
    setLoading(false)
  }

  async function approveTestimonial(id, currentStatus) {
    await supabase.from('testimonials').update({ approved: !currentStatus }).eq('id', id)
    fetchTestimonials(business.id)
  }

  async function deleteTestimonial(id) {
    await supabase.from('testimonials').delete().eq('id', id)
    fetchTestimonials(business.id)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const filtered = testimonials.filter(t => {
    if (filter === 'approved') return t.approved
    if (filter === 'pending') return !t.approved
    return true
  })

  const avgRating = testimonials.length
    ? (testimonials.reduce((sum, t) => sum + t.star_rating, 0) / testimonials.length).toFixed(1)
    : '0.0'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #1a2030', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#555' }}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050810', fontFamily: "'Inter', sans-serif", color: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .stat-card { background: #0d1117; border: 1px solid #1a2030; border-radius: 16px; padding: 24px; transition: border-color 0.2s; }
        .stat-card:hover { border-color: #2563eb; }
        .filter-btn { background: transparent; border: 1px solid #1a2030; color: #666; padding: 8px 18px; border-radius: 8px; font-size: 14px; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .filter-btn.active { background: rgba(37,99,235,0.15); border-color: rgba(37,99,235,0.4); color: #60a5fa; }
        .filter-btn:hover { border-color: #333; color: #aaa; }
        .action-btn { border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .action-btn:hover { transform: translateY(-1px); }
        .review-card { background: #0d1117; border: 1px solid #1a2030; border-radius: 16px; padding: 24px; transition: border-color 0.2s; }
        .review-card:hover { border-color: #252535; }
        .logout-btn { background: transparent; border: 1px solid #1a2030; color: #555; padding: 8px 16px; border-radius: 8px; font-size: 13px; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .logout-btn:hover { border-color: #ef4444; color: #ef4444; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } .header-row { flex-direction: column !important; gap: 16px !important; } }
      `}</style>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid #111', padding: '0 5%', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,8,16,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, boxShadow: '0 0 10px rgba(37,99,235,0.4)' }}>⭐</div>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>TrustDrop</span>
          </a>
          <span style={{ color: '#333', margin: '0 4px' }}>/</span>
          <span style={{ color: '#555', fontSize: 15 }}>Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {business && (
            <a href={`/collect/${business.slug}`} target="_blank" style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', color: '#60a5fa', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              My collection link →
            </a>
          )}
          <button className="logout-btn" onClick={handleLogout}>Log out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 5%' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 6 }}>
            {business?.business_name}
          </h1>
          <p style={{ color: '#555', fontSize: 15 }}>
            Your collection link: <span style={{ color: '#60a5fa' }}>trustdrop-lac.vercel.app/collect/{business?.slug}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Total Reviews', value: testimonials.length, color: '#60a5fa', icon: '📝' },
            { label: 'Approved', value: testimonials.filter(t => t.approved).length, color: '#34d399', icon: '✅' },
            { label: 'Pending', value: testimonials.filter(t => !t.approved).length, color: '#f59e0b', icon: '⏳' },
            { label: 'Avg Rating', value: avgRating + ' ★', color: '#a78bfa', icon: '⭐' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: 20, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4, letterSpacing: '-1px' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#555' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['all', 'approved', 'pending'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span style={{ marginLeft: 6, opacity: 0.6, fontSize: 12 }}>
                ({f === 'all' ? testimonials.length : f === 'approved' ? testimonials.filter(t => t.approved).length : testimonials.filter(t => !t.approved).length})
              </span>
            </button>
          ))}
        </div>

        {/* Reviews */}
        {filtered.length === 0 ? (
          <div style={{ background: '#0d1117', border: '1px solid #1a2030', borderRadius: 20, padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ color: '#555', fontSize: 16 }}>No reviews here yet.</p>
            <p style={{ color: '#333', fontSize: 14, marginTop: 8 }}>Share your collection link to start receiving reviews.</p>
            {business && (
              <a href={`/collect/${business.slug}`} target="_blank" style={{ display: 'inline-block', marginTop: 20, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', color: '#60a5fa', padding: '10px 20px', borderRadius: 8, fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>
                Open my collection page →
              </a>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((t) => (
              <div key={t.id} className="review-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                      <div style={{ width: 40, height: 40, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#60a5fa', fontSize: 15, flexShrink: 0 }}>
                        {t.reviewer_name[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>{t.reviewer_name}</p>
                        {t.reviewer_email && <p style={{ fontSize: 12, color: '#444', marginTop: 2 }}>{t.reviewer_email}</p>}
                      </div>
                      <span style={{ color: '#f59e0b', fontSize: 14 }}>{'★'.repeat(t.star_rating)}{'☆'.repeat(5 - t.star_rating)}</span>
                      <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: t.approved ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)', color: t.approved ? '#34d399' : '#f59e0b', border: `1px solid ${t.approved ? 'rgba(52,211,153,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
                        {t.approved ? '✓ Approved' : '⏳ Pending'}
                      </span>
                    </div>
                    <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7, paddingLeft: 52 }}>{t.review_text}</p>
                    <p style={{ color: '#333', fontSize: 12, marginTop: 10, paddingLeft: 52 }}>
                      {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button className="action-btn" onClick={() => approveTestimonial(t.id, t.approved)}
                      style={{ background: t.approved ? 'rgba(255,255,255,0.05)' : 'rgba(52,211,153,0.15)', color: t.approved ? '#555' : '#34d399', border: `1px solid ${t.approved ? '#1a2030' : 'rgba(52,211,153,0.3)'}` }}>
                      {t.approved ? 'Unapprove' : '✓ Approve'}
                    </button>
                    <button className="action-btn" onClick={() => deleteTestimonial(t.id)}
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
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
