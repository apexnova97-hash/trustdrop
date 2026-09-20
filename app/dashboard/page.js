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

  async function fetchTestimonials(businessId) {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
    setTestimonials(data || [])
    setLoading(false)
  }

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    const { data: businessData } = await supabase
      .from('businesses').select('*').eq('id', user.id).single()
    if (!businessData) { window.location.href = '/login'; return }
    setBusiness(businessData)
    fetchTestimonials(businessData.id)
  }

  async function approveTestimonial(id, currentStatus) {
    const { error } = await supabase
      .from('testimonials')
      .update({ approved: !currentStatus })
      .eq('id', id)
    if (!error) fetchTestimonials(business.id)
  }

  async function deleteTestimonial(id) {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)
    if (!error) fetchTestimonials(business.id)
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
          <div style={{ width: 36, height: 36, border: '2px solid #1a2030', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#444', fontSize: 14 }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050810', fontFamily: "'Inter', sans-serif", color: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .stat-card {
          background: #0a0e1a;
          border: 1px solid #141c2e;
          border-radius: 16px;
          padding: 20px 24px;
          transition: border-color 0.2s, transform 0.2s;
          cursor: default;
        }
        .stat-card:hover { border-color: rgba(37,99,235,0.4); transform: translateY(-2px); }

        .filter-btn {
          background: transparent;
          border: 1px solid #141c2e;
          color: #555;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .filter-btn:hover { border-color: #2a3550; color: #888; }
        .filter-btn.active { background: rgba(37,99,235,0.12); border-color: rgba(37,99,235,0.35); color: #60a5fa; }

        .review-card {
          background: #0a0e1a;
          border: 1px solid #141c2e;
          border-radius: 16px;
          padding: 22px 24px;
          transition: border-color 0.2s;
          animation: fadeIn 0.3s ease;
        }
        .review-card:hover { border-color: #1e2a40; }

        .approve-btn {
          border: none;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .approve-btn:hover { transform: translateY(-1px); }

        .delete-btn {
          border: 1px solid rgba(239,68,68,0.2);
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          background: rgba(239,68,68,0.08);
          color: #ef4444;
          white-space: nowrap;
        }
        .delete-btn:hover { background: rgba(239,68,68,0.18); transform: translateY(-1px); }

        .nav-link-btn {
          background: rgba(37,99,235,0.1);
          border: 1px solid rgba(37,99,235,0.25);
          color: #60a5fa;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .nav-link-btn:hover { background: rgba(37,99,235,0.18); border-color: rgba(37,99,235,0.4); }

        .logout-btn {
          background: transparent;
          border: 1px solid #141c2e;
          color: #444;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .logout-btn:hover { border-color: rgba(239,68,68,0.3); color: #ef4444; }

        .copy-btn {
          background: transparent;
          border: 1px solid #141c2e;
          color: #555;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .copy-btn:hover { border-color: rgba(37,99,235,0.3); color: #60a5fa; }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .review-actions { flex-direction: column !important; }
          .review-meta { flex-wrap: wrap !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid #0e1420', padding: '0 5%', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,8,16,0.95)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, boxShadow: '0 0 12px rgba(37,99,235,0.35)' }}>⭐</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>TrustDrop</span>
          </a>
          <span style={{ color: '#222', fontSize: 14, margin: '0 2px' }}>/</span>
          <span style={{ color: '#444', fontSize: 14 }}>Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {business && (
            <a href={`/collect/${business.slug}`} target="_blank" className="nav-link-btn">
              My link →
            </a>
          )}
          <button className="logout-btn" onClick={handleLogout}>Log out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 5% 80px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6, color: 'white' }}>
            {business?.business_name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ color: '#444', fontSize: 13 }}>Collection link:</span>
            <code style={{ color: '#60a5fa', fontSize: 13, background: 'rgba(37,99,235,0.08)', padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(37,99,235,0.15)' }}>
              trustdrop-lac.vercel.app/collect/{business?.slug}
            </code>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(`https://trustdrop-lac.vercel.app/collect/${business?.slug}`)}>
              Copy
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total', value: testimonials.length, color: '#60a5fa' },
            { label: 'Approved', value: testimonials.filter(t => t.approved).length, color: '#34d399' },
            { label: 'Pending', value: testimonials.filter(t => !t.approved).length, color: '#f59e0b' },
            { label: 'Avg Rating', value: `${avgRating} ★`, color: '#a78bfa' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, marginBottom: 4, letterSpacing: '-1px' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#444', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
          {['all', 'approved', 'pending'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {' '}
              <span style={{ opacity: 0.5, fontSize: 11 }}>
                ({f === 'all' ? testimonials.length : f === 'approved' ? testimonials.filter(t => t.approved).length : testimonials.filter(t => !t.approved).length})
              </span>
            </button>
          ))}
        </div>

        {/* REVIEWS */}
        {filtered.length === 0 ? (
          <div style={{ background: '#0a0e1a', border: '1px solid #141c2e', borderRadius: 20, padding: '56px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 14, opacity: 0.4 }}>📭</div>
            <p style={{ color: '#444', fontSize: 15, marginBottom: 6 }}>No reviews here yet</p>
            <p style={{ color: '#2a3550', fontSize: 13 }}>Share your collection link to start receiving reviews</p>
            {business && (
              <a href={`/collect/${business.slug}`} target="_blank" className="nav-link-btn" style={{ display: 'inline-block', marginTop: 20, fontSize: 13 }}>
                Open collection page →
              </a>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((t) => (
              <div key={t.id} className="review-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>

                    {/* Reviewer info */}
                    <div className="review-meta" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 36, height: 36, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#60a5fa', fontSize: 14, flexShrink: 0 }}>
                        {t.reviewer_name[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14, color: 'white', marginBottom: 1 }}>{t.reviewer_name}</p>
                        {t.reviewer_email && <p style={{ fontSize: 12, color: '#333' }}>{t.reviewer_email}</p>}
                      </div>
                      <span style={{ color: '#f59e0b', fontSize: 13, letterSpacing: '1px' }}>
                        {'★'.repeat(t.star_rating)}{'☆'.repeat(5 - t.star_rating)}
                      </span>
                      <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: t.approved ? 'rgba(52,211,153,0.08)' : 'rgba(245,158,11,0.08)', color: t.approved ? '#34d399' : '#f59e0b', border: `1px solid ${t.approved ? 'rgba(52,211,153,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                        {t.approved ? '✓ Live' : '⏳ Pending'}
                      </span>
                      <span style={{ color: '#2a3550', fontSize: 12, marginLeft: 'auto' }}>
                        {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Review text */}
                    <p style={{ color: '#777', fontSize: 14, lineHeight: 1.7, paddingLeft: 46 }}>
                      "{t.review_text}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="review-actions" style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      className="approve-btn"
                      onClick={() => approveTestimonial(t.id, t.approved)}
                      style={{
                        background: t.approved ? 'rgba(255,255,255,0.04)' : 'rgba(52,211,153,0.1)',
                        color: t.approved ? '#333' : '#34d399',
                        border: `1px solid ${t.approved ? '#141c2e' : 'rgba(52,211,153,0.25)'}`,
                      }}
                    >
                      {t.approved ? 'Unpublish' : '✓ Approve'}
                    </button>
                    <button className="delete-btn" onClick={() => deleteTestimonial(t.id)}>
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
