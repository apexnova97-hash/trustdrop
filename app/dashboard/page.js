'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Logo } from '../page'

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (mq.addEventListener) mq.addEventListener('change', onChange)
      else mq.addListener(onChange)
      return () => {
        if (mq.removeEventListener) mq.removeEventListener('change', onChange)
        else mq.removeListener(onChange)
      }
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  )
}

const PAID_STATUSES = ['active']
const PAID_PLANS = ['paid', 'pro', 'active']

/* Time bucket for sparkline graph: 'day' | 'week' | 'month' */
const TIME_BUCKETS = { day: (d) => d, week: (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay()), month: (d) => new Date(d.getFullYear(), d.getMonth(), 1) }

function isPaid(business) {
  if (!business) return false
  if (PAID_STATUSES.includes(business.subscription_status)) return true
  if (business.plan && PAID_PLANS.includes(business.plan)) return true
  return false
}

function isExpired(business) {
  if (!business) return false
  if (isPaid(business)) return false
  if (business.subscription_status === 'expired') return true
  if (business.subscription_status === 'trialing' && business.trial_ends_at) {
    return new Date(business.trial_ends_at) <= new Date()
  }
  // No trial_ends_at at all -> don't crash, treat as normal/active trial
  return false
}

function daysRemaining(business) {
  if (!business?.trial_ends_at) return null
  const ms = new Date(business.trial_ends_at).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}

export default function Dashboard() {
  const [testimonials, setTestimonials] = useState([])
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [filterBucket, setFilterBucket] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [noBusiness, setNoBusiness] = useState(false)
  const reduced = usePrefersReducedMotion()

  /* Bucket sparkline counts */
  const filteredForBuckets = filterBucket === 'all'
    ? testimonials
    : testimonials.filter((t) => t.category === filterCategory)
  const buckets = [0, 0, 0]
  filteredForBuckets.forEach((t) => {
    const d = new Date(t.created_at)
    const bi = filterBucket === 'day' ? 0 : filterBucket === 'week' ? 1 : 2
    buckets[bi]++
  })

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
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = '/auth'; return }

    const { data: businessData } = await supabase
      .from('businesses').select('*').eq('id', session.user.id).single()

    if (!businessData) {
      setNoBusiness(true)
      setLoading(false)
      return
    }
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
    const tCategory = t.category || 'all'
    if (filterCategory !== 'all' && tCategory !== filterCategory) return false
    if (filter === 'approved') return t.approved
    if (filter === 'pending') return !t.approved
    return true
  })

  const avgRating = testimonials.length
    ? (testimonials.reduce((sum, t) => sum + t.star_rating, 0) / testimonials.length).toFixed(1)
    : '0.0'

  const checkoutUrl = business
    ? `https://trustdrop7.lemonsqueezy.com/checkout/buy/f805ed02-332c-426b-a866-078eba3c3c21?checkout[email]=${encodeURIComponent(business.email)}`
    : 'https://trustdrop7.lemonsqueezy.com/checkout/buy/f805ed02-332c-426b-a866-078eba3c3c21'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '2px solid #1a2030', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#444', fontSize: 14 }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (noBusiness) {
    return (
      <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: 24 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>
        <div style={{ background: '#0a0e1a', border: '1px solid #141c2e', borderRadius: 20, padding: '40px 34px', maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 10 }}>No business found</h2>
          <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            Your account is logged in, but we couldn't find a business record linked to it. This can happen if signup was interrupted.
          </p>
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/auth?mode=signup' }}
            style={{ background: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Log out and try signing up again
          </button>
        </div>
      </div>
    )
  }

  // ── TRIAL EXPIRED SCREEN ──
  if (isExpired(business)) {
    return (
      <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: 24 }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); *{box-sizing:border-box} @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(2.2); opacity: 0; } }`}</style>
        <div style={{ position: 'absolute', width: 400, height: 400, background: '#1d4ed8', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.08, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <div style={{ background: '#0a0e1a', border: '1px solid #141c2e', borderRadius: 20, padding: '44px 36px', maxWidth: 460, width: '100%', textAlign: 'center', position: 'relative' }}>
          <div style={{ width: 64, height: 64, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', fontSize: 28 }}>⏰</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 12, letterSpacing: '-0.5px' }}>Your free trial has ended</h1>
          <p style={{ color: '#666', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            Your 14-day TrustDrop trial has expired. Upgrade to keep using your dashboard and collecting customer reviews.
          </p>
          <a
            href={checkoutUrl}
            target="_blank"
            style={{ display: 'block', background: '#2563eb', color: 'white', textDecoration: 'none', padding: '15px 0', borderRadius: 10, fontSize: 16, fontWeight: 700, marginBottom: 14, transition: 'background 0.15s' }}
          >
            Upgrade for $19/month →
          </a>
          <button
            onClick={handleLogout}
            style={{ background: 'transparent', border: '1px solid #141c2e', color: '#555', padding: '12px 0', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}
          >
            Log out
          </button>
        </div>
      </div>
    )
  }

  const trialDays = daysRemaining(business)
  const showTrialBanner = !isPaid(business)

  return (
    <div style={{ minHeight: '100vh', background: '#050810', fontFamily: "'Inter', sans-serif", color: 'white' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid #0e1420', padding: '0 5%', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,8,16,0.95)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Logo light={true} size={24} />
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>TrustDrop</span>
          </a>
          <span style={{ color: '#222', fontSize: 14, margin: '0 2x' }}>/</span>
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
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6, color: 'white' }}>
            {business?.business_name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ color: '#444', fontSize: 13 }}>Collection link:</span>
            <code style={{ color: '#60a5fa', fontSize: 13, background: 'rgba(37,99,235,0.08)', padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(37,99,235,0.15)' }}>
              trustdrop-lac.vercel.app/collect/{business?.slug}
            </code>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(`https://trustdrop-lac.vercel.app/collect/${business?.slug}`)}>Copy</button>
          </div>
        </div>

        {/* UPGRADE / TRIAL CARD */}
        {showTrialBanner && (
          <div className={`upgrade-card ${trialDays !== null && trialDays <= 3 ? 'urgent' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className={`live-dot ${trialDays !== null && trialDays <= 3 ? 'urgent' : ''}`} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 2 }}>
                  {trialDays === null
                    ? 'Free trial'
                    : trialDays === 0
                    ? 'Free trial — ends today'
                    : `Free trial — ${trialDays} day${trialDays === 1 ? '' : 's'} remaining`}
                </p>
                <p style={{ fontSize: 13, color: '#888' }}>Upgrade to keep collecting reviews after your trial ends — just $19/month</p>
              </div>
            </div>
            <a href={checkoutUrl} target="_blank" className="upgrade-btn">Upgrade now →</a>
          </div>
        )}

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
          <button key="category-all" className={`filter-btn ${filterBucket === 'all' ? 'active' : ''}`} onClick={() => setFilterBucket('all')} style={{ marginLeft: 16, minWidth: 100 }}>
            Cat: {filterCategory === 'all' ? 'All' : filterCategory}
            {' '}
            <span style={{ opacity: 0.5, fontSize: 11 }}>({testimonials.length})</span>
          </button>
          <button key="category-books" className={`filter-btn ${filterCategory === 'books' ? 'active' : ''}`} onClick={() => setFilterCategory('books')} style={{ marginLeft: 8, minWidth: 80 }}>
            Books
          </button>
          <button key="category-flowers" className={`filter-btn ${filterCategory === 'flowers' ? 'active' : ''}`} onClick={() => setFilterCategory('flowers')} style={{ marginLeft: 8, minWidth: 80 }}>
            Flowers
          </button>
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
                      <span style={{ color: '#f59e0b', fontSize: 13, letterSpacing: '1x' }}>
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