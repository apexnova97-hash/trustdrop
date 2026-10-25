'use client'
import { useState, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import ReviewTrend from './ReviewTrend'

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

function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}

const PAID_STATUSES = ['active']
const PAID_PLANS = ['paid', 'pro', 'active']

const PRODUCT_TINTS = [
  { bg: '#EAF2FF', fg: '#0052CC', grad: 'linear-gradient(135deg,#2E7CFF,#0052CC)' },
  { bg: '#F1ECFE', fg: '#6B5CE7', grad: 'linear-gradient(135deg,#8B7BF0,#6B5CE7)' },
  { bg: '#E7F8EF', fg: '#0E9F6E', grad: 'linear-gradient(135deg,#3ED598,#0E9F6E)' },
  { bg: '#FFF3E4', fg: '#C2740B', grad: 'linear-gradient(135deg,#F5A96B,#E0830F)' },
  { bg: '#FDECF2', fg: '#D6336C', grad: 'linear-gradient(135deg,#F58FB6,#D6336C)' },
]

const REVIEW_TINTS = PRODUCT_TINTS

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/* Build review counts over time for the trend chart */
function buildReviewSeries(reviews, range, compact) {
  const now = new Date()
  const buckets = []

  if (range === 'month') {
    const months = compact ? 6 : 12
    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      buckets.push({
        start,
        end,
        label: start.toLocaleDateString('en-US', { month: 'short' }),
        full: start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        count: 0,
      })
    }
  } else {
    const step = range === 'week' ? 7 : 1
    const total = compact ? (range === 'week' ? 8 : 14) : (range === 'week' ? 12 : 30)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    for (let i = total - 1; i >= 0; i--) {
      const start = new Date(today.getTime() - i * step * 86400000)
      const end = new Date(start.getTime() + step * 86400000)
      buckets.push({
        start,
        end,
        label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        full: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        count: 0,
      })
    }
  }

  reviews.forEach((t) => {
    const d = new Date(t.created_at)
    const b = buckets.find((x) => d >= x.start && d < x.end)
    if (b) b.count++
  })

  return buckets
}

function initials(name) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function shortDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function lastReviewLabel(reviews) {
  if (!reviews.length) return null
  const newest = reviews.reduce((a, b) => (new Date(a.created_at) > new Date(b.created_at) ? a : b))
  const days = Math.floor((Date.now() - new Date(newest.created_at).getTime()) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return days + ' days ago'
  return shortDate(newest.created_at)
}

/* Animated number for the stat cards */
function useCountUp(target, active) {
  const [value, setValue] = useState(active ? 0 : target)
  useEffect(() => {
    let raf = 0
    if (!active) {
      raf = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(raf)
    }
    const start = performance.now()
    const duration = 700
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active])
  return value
}


/* TEMP PREVIEW ONLY — screenshots, remove before pushing */
function demoProducts() {
  return [
    { id: 'p1', name: 'Books', slug: 'books' },
    { id: 'p2', name: 'Flowers', slug: 'flowers' },
    { id: 'p3', name: 'Gift boxes', slug: 'gift-boxes' },
  ]
}
function demoReviews() {
  const now = Date.now(), day = 86400000
  const m = (id, name, email, rating, approved, ago, text, productId) => ({
    id, reviewer_name: name, reviewer_email: email, star_rating: rating, approved,
    review_text: text, product_id: productId, created_at: new Date(now - ago * day).toISOString(),
  })
  return [
    m('d1', 'Sarah Kim', 'sarah.k@example.com', 5, true, 1, 'Arrived in two days and the binding is gorgeous. Already ordered the sequel.', 'p1'),
    m('d2', 'Michael Torres', 'm.torres@example.com', 5, true, 3, 'The bouquet lasted almost two weeks. My mum was thrilled.', 'p2'),
    m('d3', 'Amina Haddad', 'amina@example.com', 4, false, 4, 'Lovely story, but the box was dented on arrival.', 'p1'),
    m('d4', 'Jonas Meyer', 'jonas.m@example.com', 5, true, 7, 'Best flowers I have sent anyone. The card was handwritten.', 'p2'),
    m('d5', 'Priya Nair', 'priya.n@example.com', 4, false, 9, 'Good read, shipping took an extra day.', 'p1'),
    m('d6', 'Liam Osei', 'liam@example.com', 5, true, 12, 'The gift box felt considered — every item was useful.', 'p3'),
  ]
}
const DEMO_BUSINESS = {
  id: 'demo', business_name: 'Bloom & Co.', slug: 'apexnova97', email: 'demo@example.com',
  plan: 'trial', subscription_status: 'trialing',
  trial_ends_at: new Date(Date.now() + 9 * 86400000).toISOString(),
}

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
  return false
}

function daysRemaining(business) {
  if (!business?.trial_ends_at) return null
  const ms = new Date(business.trial_ends_at).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}

const STYLES = `
.tdd { --bg:#FCFBF8; --card:#FFFFFF; --line:#E8E4DA; --line-soft:#F0EDE5; --ink:#071A31; --ink-soft:#33465C; --body:#5D6E82; --muted:#8391A2;
  --blue:#0069FF; --blue-dark:#0052CC; --blue-soft:#EAF2FF; --violet:#6B5CE7; --lime:#D9F27A; --green:#0E9F6E;
  --ease:cubic-bezier(.16,1,.3,1);
  --shadow-sm:0 1px 2px rgba(7,26,49,.05), 0 8px 24px rgba(7,26,49,.05);
  --shadow-md:0 18px 50px rgba(7,26,49,.10);
  --shadow-lg:0 28px 70px -24px rgba(7,26,49,.28);
  --fs-eyebrow:clamp(10px, .5vw + 8.4px, 11.5px);
  --fs-h1:clamp(30px, 4.4vw + 12px, 58px);
  --fs-section:clamp(18px, 1.1vw + 13px, 22px);
  --fs-title:clamp(14.5px, .35vw + 13px, 15.5px);
  --fs-body:clamp(13.5px, .3vw + 12.2px, 15px);
  --fs-small:clamp(11.5px, .2vw + 10.8px, 12.5px);
  --fs-stat:clamp(26px, 2.2vw + 14px, 34px);
  --pad-card:clamp(15px, 1.5vw, 22px);
  --gap:clamp(12px, 1.3vw, 16px);
  --r-card:clamp(16px, 1.4vw, 20px);
  min-height:100vh; background:var(--bg); color:var(--ink);
  font-family:var(--font-body),'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
  font-size:var(--fs-body); line-height:1.6; overflow-x:clip;
  -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
  -webkit-tap-highlight-color:transparent; }
.tdd *, .tdd *::before, .tdd *::after { box-sizing:border-box; }
.tdd :where(h1,h2,h3,p) { margin:0; }
.tdd svg { display:block; max-width:100%; }
.tdd button, .tdd a, .tdd select, .tdd input { touch-action:manipulation; }
.tdd ::selection { background:rgba(0,105,255,.16); }

/* ambient background */
.tdd-main { position:relative; padding:clamp(24px, 3.4vw, 44px) 0 clamp(52px, 6vw, 80px); }
.tdd-blob { position:absolute; border-radius:50%; filter:blur(110px); pointer-events:none; z-index:0;
  background:linear-gradient(150deg,#BFD7FF,#E6D9FF); opacity:.42; width:min(520px,60vw); height:min(520px,60vw);
  top:-150px; right:-140px; animation:tddDrift 26s var(--ease) infinite; }
.tdd-blob.b { background:linear-gradient(150deg,#FFE0C2,#FFD6E7); opacity:.32; top:auto; bottom:-180px; left:-160px; right:auto;
  width:min(440px,55vw); height:min(440px,55vw); animation:tddDrift 32s var(--ease) infinite reverse; }
.tdd-wrap { position:relative; z-index:1; max-width:1180px; margin:0 auto; padding:0 clamp(16px, 4vw, 28px); }

/* motion */
@keyframes tddFadeUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:none} }
@keyframes tddPop { 0%{opacity:0; transform:scale(.86)} 100%{opacity:1; transform:scale(1)} }
@keyframes tddPanel { from{opacity:0; transform:translateY(16px) scale(.985)} to{opacity:1; transform:none} }
@keyframes tddGrow { from{transform:scaleY(.05)} to{transform:scaleY(1)} }
@keyframes tddPulse { 0%{box-shadow:0 0 0 0 rgba(14,159,110,.45)} 70%{box-shadow:0 0 0 7px rgba(14,159,110,0)} 100%{box-shadow:0 0 0 0 rgba(14,159,110,0)} }
@keyframes tddFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
@keyframes tddDrift { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(70px,-40px) scale(1.1)} }
@keyframes tddSpin { to { transform:rotate(360deg) } }
.tdd-rise { animation:tddFadeUp .7s var(--ease) both; }
.tdd-reduced .tdd-rise, .tdd-reduced .tdd-bar, .tdd-reduced .tdd-blob, .tdd-reduced .tdd-progress i { animation:none !important; }

/* nav */
.tdd-nav { position:sticky; top:0; z-index:50; background:rgba(252,251,248,.88); backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px); border-bottom:1px solid var(--line); }
.tdd-nav-in { min-height:clamp(58px, 7vw, 68px); display:flex; align-items:center; justify-content:space-between; gap:12px; }
.tdd-brand { display:inline-flex; align-items:center; gap:clamp(7px,1vw,10px); text-decoration:none; color:var(--ink); flex-shrink:0; }
.tdd-brand svg { width:clamp(26px, 3.4vw, 32px); height:auto; }
.tdd-brand-name { font-family:var(--font-display),sans-serif; font-weight:800; font-size:clamp(16px, 1.5vw, 19px); letter-spacing:-.03em; }
.tdd-crumb { display:flex; align-items:center; gap:8px; margin-left:clamp(10px,1.6vw,18px); font-size:var(--fs-small); color:var(--muted); }
.tdd-crumb b { color:var(--ink); font-weight:600; }
.tdd-nav-right { display:flex; align-items:center; gap:clamp(6px,1vw,10px); min-width:0; }

/* buttons */
.tdd-btn { position:relative; min-width:0; display:inline-flex; align-items:center; justify-content:center; gap:7px; border-radius:999px;
  border:1px solid transparent; font-family:inherit; font-weight:600; font-size:clamp(12.5px, 1vw, 14px); line-height:1; cursor:pointer;
  text-decoration:none; padding:clamp(10px, 1.2vw, 12px) clamp(14px, 1.8vw, 20px); min-height:42px;
  transition:transform .28s var(--ease), background .2s, box-shadow .3s var(--ease), border-color .2s, color .2s; white-space:nowrap; }
.tdd-btn svg { transition:transform .28s var(--ease); }
.tdd-btn:hover svg { transform:translateX(3px); }
.tdd-btn:active { transform:scale(.975); }
.tdd-btn-primary { background:linear-gradient(135deg,#2E7CFF 0%,#0052CC 100%); color:#fff; box-shadow:0 10px 24px -8px rgba(0,105,255,.55); overflow:hidden; }
.tdd-btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(120deg,transparent 20%,rgba(255,255,255,.35) 50%,transparent 80%);
  transform:translateX(-120%); transition:transform .7s var(--ease); }
.tdd-btn-primary:hover { transform:translateY(-2px); box-shadow:0 16px 32px -10px rgba(0,105,255,.62); }
.tdd-btn-primary:hover::after { transform:translateX(120%); }
.tdd-btn-ghost { background:#fff; border-color:rgba(7,26,49,.14); color:var(--ink); }
.tdd-btn-ghost:hover { border-color:rgba(7,26,49,.3); transform:translateY(-2px); box-shadow:var(--shadow-sm); }
.tdd-btn-soft { background:var(--blue-soft); border-color:#D8E6FF; color:var(--blue-dark); }
.tdd-btn-soft:hover { background:#DFEBFF; transform:translateY(-2px); }
.tdd-btn-sm { padding:clamp(8px,1vw,10px) clamp(11px,1.4vw,16px); font-size:clamp(12px,.9vw,13.5px); min-height:38px; }
.tdd-btn-block { width:100%; border-radius:14px; padding:clamp(12px,1.4vw,14px) 18px; min-height:48px; }
.tdd-icon-btn { width:clamp(32px,3.4vw,34px); height:clamp(32px,3.4vw,34px); display:inline-flex; align-items:center; justify-content:center;
  border-radius:10px; border:1px solid var(--line); background:#fff; color:#98A2AE; cursor:pointer;
  transition:color .2s, border-color .2s, transform .25s var(--ease), background .2s; }
.tdd-icon-btn:hover { color:#D6336C; border-color:#F8D3DE; background:#FFF7FA; transform:translateY(-1px); }
.tdd-logout { display:inline-flex; align-items:center; gap:6px; border:none; background:transparent; font-family:inherit;
  font-size:var(--fs-small); font-weight:500; color:var(--body); cursor:pointer; padding:8px 6px; border-radius:9px;
  transition:color .2s, background .2s; white-space:nowrap; }
.tdd-logout:hover { color:var(--ink); background:rgba(7,26,49,.04); }
.tdd-avatar-nav { width:clamp(32px,3.6vw,38px); height:clamp(32px,3.6vw,38px); border-radius:50%; flex-shrink:0;
  background:linear-gradient(135deg,#2E7CFF,#0052CC); color:#fff; display:inline-flex; align-items:center; justify-content:center;
  font-size:clamp(11px,1vw,12.5px); font-weight:700; box-shadow:0 4px 14px -4px rgba(0,105,255,.6); }

/* hero */
.tdd-eyebrow { display:flex; align-items:center; gap:9px; font-size:var(--fs-eyebrow); font-weight:700; letter-spacing:.16em;
  color:var(--blue); margin-bottom:clamp(10px,1.4vw,14px); text-transform:uppercase; }
.tdd-eyebrow i { width:clamp(18px,2vw,24px); height:2px; border-radius:2px; background:linear-gradient(90deg,#2E7CFF,#8B7BF0); display:block; }
.tdd-hero-row { display:flex; align-items:flex-end; justify-content:space-between; gap:clamp(16px,2.4vw,24px); flex-wrap:wrap; }
.tdd-h1 { font-family:var(--font-display),sans-serif; font-size:var(--fs-h1); line-height:1.03; letter-spacing:-.045em;
  font-weight:800; margin:0 0 clamp(6px,1vw,10px); overflow-wrap:anywhere; text-wrap:balance; }
.tdd-sub { font-size:var(--fs-body); color:var(--body); margin:0 0 clamp(10px,1.4vw,16px); max-width:46ch; }
.tdd-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:var(--fs-small); color:var(--muted); }
.tdd-live-pill { display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg,#E9F9F1,#DFF6EB);
  color:#0E9F6E; font-weight:600; font-size:var(--fs-small); padding:5px 11px; border-radius:999px; border:1px solid #CFF0E0; }
.tdd-live-pill i { width:6px; height:6px; border-radius:50%; background:#12B76A; display:block; animation:tddPulse 2.6s infinite; }
.tdd-hero-actions { display:flex; align-items:center; gap:10px; padding-bottom:4px; flex-wrap:wrap; }

/* trial banner */
.tdd-banner { display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;
  background:linear-gradient(120deg,#EDF4FF 0%,#F3F0FF 52%,#FFF4EA 100%); border:1px solid #E1E8FA;
  border-radius:clamp(14px,1.6vw,18px); padding:clamp(13px,1.5vw,16px) clamp(14px,1.7vw,18px);
  margin:clamp(20px,2.6vw,30px) 0 clamp(16px,2vw,22px); box-shadow:0 10px 30px -24px rgba(7,26,49,.4); }
.tdd-banner-left { display:flex; align-items:center; gap:clamp(10px,1.4vw,14px); min-width:0; }
.tdd-banner-icon { width:clamp(36px,4vw,42px); height:clamp(36px,4vw,42px); border-radius:12px; background:#fff; flex-shrink:0;
  display:inline-flex; align-items:center; justify-content:center; box-shadow:0 4px 14px -8px rgba(7,26,49,.35); animation:tddFloat 5s var(--ease) infinite; }
.tdd-banner-title { font-size:var(--fs-title); font-weight:700; margin:0 0 2px; }
.tdd-banner-sub { font-size:var(--fs-small); color:#5B6B8C; margin:0; }

/* stats */
.tdd-stats { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:var(--gap); margin-bottom:var(--gap); }
.tdd-stat { position:relative; background:var(--card); border:1px solid var(--line); border-radius:var(--r-card);
  padding:var(--pad-card); overflow:hidden; transition:transform .35s var(--ease), box-shadow .35s var(--ease), border-color .25s; }
.tdd-stat::after { content:''; position:absolute; inset:0; opacity:0; pointer-events:none;
  background:radial-gradient(120% 90% at 100% 0%, rgba(0,105,255,.09), transparent 60%); transition:opacity .35s var(--ease); }
.tdd-stat:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); border-color:#DED9CE; }
.tdd-stat:hover::after { opacity:1; }
.tdd-stat-icon { width:clamp(34px,3.4vw,38px); height:clamp(34px,3.4vw,38px); border-radius:11px; display:inline-flex;
  align-items:center; justify-content:center; margin-bottom:clamp(12px,1.4vw,16px); color:#fff; }
.tdd-stat-icon.blue { background:linear-gradient(135deg,#4D91FF,#0052CC); box-shadow:0 10px 20px -12px rgba(0,105,255,.9); }
.tdd-stat-icon.green { background:linear-gradient(135deg,#4FE0A6,#0E9F6E); box-shadow:0 10px 20px -12px rgba(14,159,110,.9); }
.tdd-stat-icon.amber { background:linear-gradient(135deg,#F8CD84,#E0830F); box-shadow:0 10px 20px -12px rgba(224,131,15,.9); }
.tdd-stat-icon.violet { background:linear-gradient(135deg,#A99BF6,#6B5CE7); box-shadow:0 10px 20px -12px rgba(107,92,231,.9); }
.tdd-stat-label { font-size:var(--fs-eyebrow); font-weight:700; letter-spacing:.11em; color:var(--muted); text-transform:uppercase; margin:0 0 7px; }
.tdd-stat-value { font-family:var(--font-display),sans-serif; font-size:var(--fs-stat); font-weight:800; letter-spacing:-.035em; font-variant-numeric:tabular-nums;
  line-height:1; font-variant-numeric:tabular-nums; }
.tdd-stat-value span { font-size:clamp(12px,1.1vw,14px); font-weight:600; color:#B6BFC9; letter-spacing:0; }
.tdd-stars-row { color:#F5A524; font-size:clamp(11px,1vw,13px); letter-spacing:2px; margin-top:3px; }
.tdd-stat-foot { font-size:var(--fs-small); color:var(--muted); margin-top:clamp(8px,1vw,12px); }

/* layout */
.tdd-grid { display:grid; grid-template-columns:minmax(0,1.72fr) minmax(0,1fr); gap:var(--gap); align-items:start; }
.tdd-col { display:flex; flex-direction:column; gap:var(--gap); min-width:0; }
.tdd-card { background:var(--card); border:1px solid var(--line); border-radius:var(--r-card); padding:var(--pad-card);
  box-shadow:var(--shadow-sm); min-width:0; }

/* chart */
.tdd-chart-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:clamp(14px,1.6vw,18px); }
.tdd-chart-title { font-size:var(--fs-title); font-weight:700; margin:0 0 3px; }
.tdd-chart-sub { font-size:var(--fs-small); color:var(--muted); }
.tdd-chart-controls { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.tdd-select-wrap { position:relative; display:inline-flex; min-width:0; }
.tdd-select { appearance:none; -webkit-appearance:none; border:1px solid var(--line); background:#FCFBF8; color:var(--ink-soft);
  font-family:inherit; font-size:var(--fs-small); font-weight:600; padding:8px 28px 8px 11px; border-radius:10px; cursor:pointer;
  max-width:min(46vw,170px); text-overflow:ellipsis; transition:border-color .2s, box-shadow .25s; }
.tdd-select:hover { border-color:#D8D2C6; }
.tdd-select:focus { outline:none; border-color:rgba(0,105,255,.5); box-shadow:0 0 0 4px rgba(0,105,255,.1); }
.tdd-select-wrap svg { position:absolute; right:9px; top:50%; transform:translateY(-50%); pointer-events:none; }
.tdd-seg { display:inline-flex; gap:2px; background:#F2EFE8; border-radius:11px; padding:3px; max-width:100%; }
.tdd-seg-btn { border:none; background:transparent; font-family:inherit; font-size:var(--fs-small); font-weight:600; color:#77808C;
  padding:7px 11px; border-radius:9px; cursor:pointer; display:inline-flex; align-items:center; gap:5px; white-space:nowrap;
  transition:background .25s var(--ease), color .2s, box-shadow .25s var(--ease); }
.tdd-seg-btn:hover { color:var(--ink); }
.tdd-seg-btn.is-on { background:#fff; color:var(--ink); box-shadow:0 2px 8px -2px rgba(7,26,49,.18); }
.tdd-seg-btn span { font-size:clamp(10px,.9vw,11px); color:#A6AFB9; font-weight:700; }
.tdd-seg-btn.is-on span { color:var(--blue); }
.tdd-bars { display:flex; align-items:flex-end; gap:clamp(2px,.4vw,4px); height:clamp(96px,15vw,128px); }
.tdd-bar-col { flex:1 1 0; min-width:0; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; }
.tdd-bar-count { font-size:clamp(8.5px,.9vw,10px); font-weight:700; color:var(--blue); margin-bottom:4px; }
.tdd-bar-count.is-empty { color:transparent; }
.tdd-bar { width:100%; max-width:26px; border-radius:5px 5px 2px 2px; transform-origin:bottom;
  background:linear-gradient(180deg,#7FB2FF,#0069FF); animation:tddGrow .6s var(--ease) both; }
.tdd-bar.is-empty { background:#EFF1F4; }
.tdd-bar-col:hover .tdd-bar:not(.is-empty) { filter:brightness(1.06); }
.tdd-bar-labels { display:flex; gap:clamp(2px,.4vw,4px); margin-top:9px; border-top:1px solid var(--line-soft); padding-top:9px; padding-inline:2px; }
.tdd-bar-label { position:relative; flex:1 1 0; min-width:0; height:14px; }
.tdd-bar-label span { position:absolute; top:0; left:50%; transform:translateX(-50%); white-space:nowrap;
  font-size:clamp(9px,.8vw,10.5px); color:#A6AFB9; letter-spacing:-.01em; }

/* reviews */
.tdd-reviews { padding:var(--pad-card) var(--pad-card) 6px; }
.tdd-reviews-head { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; margin-bottom:4px; }
.tdd-reviews-title { display:flex; align-items:center; gap:8px; font-family:var(--font-display),sans-serif; font-size:var(--fs-section);
  font-weight:800; letter-spacing:-.02em; }
.tdd-count-chip { font-family:var(--font-body),sans-serif; font-size:var(--fs-small); font-weight:700; color:#77808C;
  background:#F2EFE8; border-radius:7px; padding:2px 8px; letter-spacing:0; }
.tdd-review { display:block; padding:clamp(14px,1.7vw,20px) 2px; border-top:1px solid var(--line-soft); border-radius:14px;
  transition:background .25s; animation:tddFadeUp .5s var(--ease) both; }
.tdd-review:first-of-type { border-top:none; }
.tdd-review:hover { background:#FCFBF8; }
.tdd-review-top { display:flex; gap:clamp(9px,1.1vw,12px); }
.tdd-review-avatar { width:clamp(32px,3.4vw,38px); height:clamp(32px,3.4vw,38px); border-radius:50%; display:inline-flex;
  align-items:center; justify-content:center; font-size:clamp(11px,1vw,12.5px); font-weight:700; flex-shrink:0; }
.tdd-review-id { min-width:0; flex:1; }
.tdd-review-name { display:flex; align-items:center; gap:6px; font-size:var(--fs-title); font-weight:700; margin-bottom:2px; flex-wrap:wrap; overflow-wrap:anywhere; }
.tdd-chip { font-size:clamp(9.5px,.85vw,10.5px); font-weight:700; padding:2px 7px; border-radius:6px; white-space:nowrap; }
.tdd-chip.live { background:#E7F8EF; color:#0E9F6E; }
.tdd-chip.pending { background:#FFF3E4; color:#B45309; }
.tdd-chip.product { background:#F2EFE8; color:#5D6E82; }
.tdd-review-meta { display:flex; align-items:center; gap:6px; font-size:var(--fs-small); color:var(--muted); flex-wrap:wrap; overflow-wrap:anywhere; }
.tdd-review-stars { color:#F5A524; letter-spacing:1.5px; margin-left:2px; }
.tdd-review-text { font-size:var(--fs-body); line-height:1.68; color:var(--ink-soft); margin-top:9px;
  padding-left:calc(clamp(32px,3.4vw,38px) + clamp(9px,1.1vw,12px)); }
.tdd-review-foot { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;
  margin-top:clamp(10px,1.3vw,14px); padding-left:calc(clamp(32px,3.4vw,38px) + clamp(9px,1.1vw,12px)); }
.tdd-verified { display:inline-flex; align-items:center; gap:6px; font-size:var(--fs-small); color:#A6AFB9; }
.tdd-review-actions { display:flex; align-items:center; gap:8px; }
.tdd-empty { text-align:center; padding:clamp(28px,4vw,44px) 12px clamp(32px,4vw,48px); }
.tdd-empty-icon { width:clamp(42px,4.4vw,48px); height:clamp(42px,4.4vw,48px); border-radius:15px;
  background:linear-gradient(150deg,#EAF2FF,#F4EEFF); color:var(--blue); display:inline-flex; align-items:center;
  justify-content:center; margin-bottom:14px; animation:tddFloat 5s var(--ease) infinite; }
.tdd-empty-title { font-size:var(--fs-title); font-weight:700; margin:0 0 5px; }
.tdd-empty-sub { font-size:var(--fs-small); color:var(--muted); margin:0 0 16px; }

/* products */
.tdd-products-head { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:4px; }
.tdd-products-title { display:flex; align-items:center; gap:7px; font-size:var(--fs-title); font-weight:700; }
.tdd-products-sub { font-size:var(--fs-small); color:var(--muted); margin:5px 0 12px; }
.tdd-product { display:flex; align-items:flex-start; gap:10px; padding:11px 0; border-top:1px solid var(--line-soft); }
.tdd-product:first-of-type { border-top:none; }
.tdd-product-dot { width:clamp(28px,3vw,32px); height:clamp(28px,3vw,32px); border-radius:9px; display:inline-flex;
  align-items:center; justify-content:center; color:#fff; font-size:clamp(10px,.95vw,11.5px); font-weight:800; flex-shrink:0; }
.tdd-product-main { min-width:0; flex:1; }
.tdd-product-name { display:flex; align-items:center; gap:6px; font-size:var(--fs-title); font-weight:700; overflow-wrap:anywhere; }
.tdd-product-count { font-size:clamp(10px,.9vw,11px); font-weight:700; color:var(--muted); background:#F2EFE8; padding:1px 6px; border-radius:5px; }
.tdd-product-link { display:flex; align-items:center; gap:5px; margin-top:2px; min-width:0; }
.tdd-product-url { font-size:clamp(10px,.85vw,11px); color:#9AA6B4; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tdd-mini-btn { border:none; background:transparent; color:var(--blue); font-family:inherit; font-size:clamp(10px,.9vw,11px);
  font-weight:700; cursor:pointer; padding:4px 5px; border-radius:5px; transition:background .2s, color .2s; }
.tdd-mini-btn:hover { background:var(--blue-soft); }
.tdd-product-actions { display:flex; align-items:center; gap:4px; opacity:0; transition:opacity .25s; }
.tdd-product:hover .tdd-product-actions, .tdd-product:focus-within .tdd-product-actions { opacity:1; }
.tdd-product-actions .tdd-icon-btn { width:30px; height:30px; border-radius:8px; }
.tdd-products-empty { text-align:center; padding:16px 8px 8px; }
.tdd-products-empty p { font-size:var(--fs-small); color:var(--muted); margin:0 0 12px; }
.tdd-notice { display:flex; gap:8px; font-size:var(--fs-small); line-height:1.5; color:#8A6B24; background:#FFF8E8;
  border:1px solid #F5E3B8; border-radius:10px; padding:9px 11px; margin-top:12px; overflow-wrap:anywhere; }
.tdd-notice code { font-size:inherit; background:#fff; border-radius:4px; padding:1px 4px; }

/* link card */
.tdd-link-card { position:relative; overflow:hidden; border-radius:var(--r-card); padding:var(--pad-card);
  background:linear-gradient(165deg,#F3F8FF 0%,#EEF4FF 48%,#F8F2FF 100%); border:1px solid #E1E8FA; }
.tdd-link-card::after { content:''; position:absolute; width:min(220px,50vw); height:min(220px,50vw); border-radius:50%;
  right:-70px; top:-90px; background:linear-gradient(150deg,#C9DCFF,#E7DBFF); filter:blur(42px); opacity:.6; pointer-events:none; }
.tdd-link-title { position:relative; display:flex; align-items:center; gap:7px; font-size:var(--fs-title); font-weight:700; margin:0 0 7px; }
.tdd-link-sub { position:relative; font-size:var(--fs-small); color:#5B6B8C; line-height:1.6; margin:0 0 14px; }
.tdd-input { position:relative; width:100%; border:1px solid #DDE7FA; background:#fff; border-radius:11px;
  padding:10px 12px; font-family:inherit; font-size:clamp(11.5px,.95vw,12.5px); color:var(--ink-soft); margin-bottom:11px;
  transition:border-color .2s, box-shadow .25s; }
.tdd-input:focus { outline:none; border-color:rgba(0,105,255,.45); box-shadow:0 0 0 4px rgba(0,105,255,.1); }
.tdd-link-url { display:block; text-align:left; cursor:copy; line-height:1.5; white-space:normal; overflow-wrap:anywhere;
  -webkit-user-select:all; user-select:all; }
.tdd-link-url:hover { border-color:rgba(0,105,255,.35); box-shadow:0 0 0 3px rgba(0,105,255,.07); }
.tdd-link-actions { position:relative; display:flex; gap:8px; }
.tdd-link-actions .tdd-btn { flex:1 1 0; border-radius:12px; }
.tdd-link-note { position:relative; display:flex; align-items:center; gap:6px; font-size:var(--fs-small); color:#8F9DB4; margin:11px 0 0; }

/* trial card */
.tdd-trial-title { display:flex; align-items:center; gap:7px; font-size:var(--fs-title); font-weight:700; margin:0 0 9px; }
.tdd-trial-big { font-family:var(--font-display),sans-serif; font-size:clamp(24px,2.4vw,30px); font-weight:800; letter-spacing:-.03em; line-height:1; margin:0 0 clamp(15px,1.7vw,19px); }
.tdd-trial-big span { font-size:clamp(13px,1.2vw,15px); font-weight:600; color:var(--muted); letter-spacing:-.01em; }
.tdd-progress { height:8px; border-radius:99px; background:#F0EDE6; overflow:hidden; margin:0 0 10px; }
.tdd-progress i { display:block; height:100%; border-radius:99px; background:linear-gradient(90deg,#2E7CFF,#8B7BF0);
  transform-origin:left; animation:tddGrow .9s var(--ease) both; }
.tdd-progress-labels { display:flex; justify-content:space-between; font-size:var(--fs-small); color:#A6AFB9; margin-bottom:14px; }

/* modal */
.tdd-backdrop { position:fixed; inset:0; z-index:90; padding:clamp(14px,3vw,24px); display:flex; align-items:center; justify-content:center;
  background:rgba(7,26,49,.34); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); animation:tddPop .25s var(--ease) both; }
.tdd-modal { width:100%; max-width:420px; max-height:calc(100dvh - 32px); overflow-y:auto; background:#fff; border-radius:clamp(18px,2vw,22px);
  padding:clamp(18px,2.2vw,26px); border:1px solid var(--line); box-shadow:0 30px 70px -30px rgba(7,26,49,.45);
  animation:tddPanel .4s var(--ease) both; }
.tdd-modal h3 { font-family:var(--font-display),sans-serif; font-size:clamp(18px,1.8vw,20px); letter-spacing:-.03em; font-weight:800; margin:0 0 5px; }
.tdd-modal p { font-size:var(--fs-small); color:var(--body); margin:0 0 16px; line-height:1.55; }
.tdd-field { width:100%; border:1px solid var(--line); background:#FCFBF8; border-radius:11px; padding:12px 14px;
  font-family:inherit; font-size:16px; color:var(--ink); transition:border-color .2s, box-shadow .25s, background .2s; }
.tdd-field::placeholder { color:#B6BFC9; }
.tdd-field:focus { outline:none; background:#fff; border-color:rgba(0,105,255,.5); box-shadow:0 0 0 4px rgba(0,105,255,.1); }
.tdd-slug-preview { font-size:var(--fs-small); color:var(--muted); margin:8px 0 0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tdd-modal-actions { display:flex; gap:9px; margin-top:18px; }
.tdd-modal-actions .tdd-btn { flex:1 1 0; }
.tdd-error { font-size:var(--fs-small); color:#B42318; background:#FEF3F2; border:1px solid #FBD9D4; border-radius:9px; padding:8px 10px; margin-top:11px; }

/* toast */
.tdd-toast { position:fixed; left:50%; bottom:calc(20px + env(safe-area-inset-bottom,0px)); transform:translateX(-50%); z-index:100;
  max-width:calc(100vw - 32px); background:linear-gradient(135deg,#0B2440,#071A31); color:#fff; font-size:var(--fs-small); font-weight:600;
  padding:11px 18px; border-radius:999px; box-shadow:0 18px 40px -16px rgba(7,26,49,.6);
  animation:tddPop .3s var(--ease) both; display:flex; align-items:center; gap:8px; }

/* states */
.tdd-center { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:clamp(16px,4vw,24px); background:#FCFBF8; }
.tdd-state-card { background:#fff; border:1px solid var(--line); border-radius:22px; padding:clamp(26px,4vw,40px) clamp(20px,3.4vw,34px);
  max-width:440px; width:100%; text-align:center; box-shadow:var(--shadow-sm); animation:tddPanel .5s var(--ease) both; }
.tdd-state-title { font-family:var(--font-display),sans-serif; font-size:clamp(19px,2vw,22px); font-weight:800; letter-spacing:-.02em; margin:0 0 9px; }
.tdd-state-sub { font-size:var(--fs-body); color:var(--body); line-height:1.65; margin:0 0 20px; }
.tdd-spinner { width:34px; height:34px; border:2px solid #EDEAE2; border-top-color:#0069FF; border-radius:50%;
  animation:tddSpin .8s linear infinite; margin:0 auto 16px; }

/* ---------- tablet ---------- */
@media (max-width: 1024px) {
  .tdd-grid { grid-template-columns:minmax(0,1fr); }
}
/* the side rail follows the reviews list on desktop */
@media (min-width: 1025px) {
  .tdd-rail { align-self:start; position:sticky; top:calc(clamp(58px,7vw,68px) + 14px); }
}
@media (max-width: 980px) {
  .tdd-hero-row { align-items:flex-start; }
  .tdd-banner { flex-direction:column; align-items:stretch; }
  .tdd-banner .tdd-btn { width:100%; }
}
@media (max-width: 760px) {
  .tdd-stats { grid-template-columns:repeat(2,minmax(0,1fr)); }
}

/* ---------- phone ---------- */
@media (max-width: 720px) {
  .tdd-crumb { display:none; }
  .tdd-nav-right .tdd-btn-ghost { display:none; }
  .tdd-hero-actions { width:100%; }
  .tdd-hero-actions .tdd-btn { flex:1 1 0; }
  .tdd-banner { flex-direction:column; align-items:stretch; }
  .tdd-banner .tdd-btn { width:100%; }
  .tdd-product-actions { opacity:1; }
  .tdd-review-text, .tdd-review-foot { padding-left:0; }
  .tdd-review-actions { width:auto; }
  .tdd-review-actions .tdd-btn { flex:0 0 auto; }
  .tdd-reviews-head { align-items:flex-start; }
  .tdd-seg { width:100%; }
  .tdd-seg-btn { flex:1 1 0; justify-content:center; }
  .tdd-chart-head { flex-direction:column; align-items:stretch; }
  .tdd-chart-controls { justify-content:space-between; }
  .tdd-select { max-width:44vw; }
  .tdd-input, .tdd-field { font-size:16px; }
  .tdd-modal-actions { flex-direction:column-reverse; }
  .tdd-modal-actions .tdd-btn { width:100%; }
}
@media (max-width: 560px) {
  .tdd-stats { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .tdd-stat { padding:clamp(12px,3vw,15px); }
  .tdd-stat-icon { width:32px; height:32px; border-radius:10px; margin-bottom:11px; }
  .tdd-stat-icon svg { width:16px; height:16px; }
  .tdd-stat-label { font-size:9.5px; letter-spacing:.075em; margin-bottom:4px; min-height:2.2em; }
  .tdd-stat-value { font-size:clamp(23px,7vw,29px); }
  .tdd-stars-row { font-size:10.5px; letter-spacing:1.4px; }
  .tdd-stat-foot { font-size:10.5px; margin-top:3px; line-height:1.35; }
  .tdd-bars { height:100px; }
  .tdd-bar-count { display:none; }
  .tdd-toast { width:calc(100vw - 28px); justify-content:center; }
  .tdd-h1 { text-wrap:pretty; }
}
@media (max-width: 359px) {
  .tdd-stats { gap:10px; }
  .tdd-stat { padding:12px 11px; }
  .tdd-stat-label { font-size:9px; letter-spacing:.05em; }
  .tdd-stat-value { font-size:23px; }
  .tdd-stat-foot { font-size:9.5px; }
}
@media (max-width: 380px) {
  .tdd-wrap { padding:0 13px; }
  .tdd-btn { font-size:12.5px; padding:10px 14px; }
  .tdd-brand-name { font-size:16px; }
  .tdd-trial-big { font-size:22px; }
}
@media (hover: none) {
  .tdd-product-actions { opacity:1; }
  .tdd-btn { min-height:46px; }
  .tdd-icon-btn { width:38px; height:38px; }
  .tdd-seg-btn { min-height:34px; }
  .tdd-stat:hover { transform:none; box-shadow:var(--shadow-sm); }
  .tdd-btn:hover { transform:none; }
  .tdd-btn-primary::after { display:none; }
}


/* ---------- very small screens + high zoom ---------- */
@media (max-width: 420px) {
  .tdd-hero-actions { flex-direction:column; align-items:stretch; }
  .tdd-hero-actions .tdd-btn { width:100%; }
  .tdd-btn { min-width:0; }
  .tdd-nav-in { gap:8px; }
  .tdd-logout { padding:8px 2px; }
  .tdd-banner-left { align-items:flex-start; }
  .tdd-chart-controls { flex-direction:column; align-items:stretch; gap:7px; }
  .tdd-select { max-width:none; width:100%; }
  .tdd-select-wrap { width:100%; }
  .tdd-review-meta { font-size:var(--fs-small); }
  .tdd-product-url { max-width:42vw; }
}

/* ---------- accessibility ---------- */
@media (prefers-reduced-motion: reduce) {
  .tdd-rise, .tdd-bar, .tdd-blob, .tdd-progress i, .tdd-banner-icon, .tdd-empty-icon, .tdd-live-pill i { animation:none !important; }
  .tdd *, .tdd *::before, .tdd *::after { transition:none !important; }
}
`

function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="m7 14 3.5-4 3 2.6L19 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8.6 12.2 2.3 2.3 4.6-4.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconClock() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v4.3l2.6 1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconStar() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 4.6 2.3 4.7 5.2.7-3.8 3.6.9 5.1-4.6-2.5-4.6 2.5.9-5.1L4.5 10l5.2-.7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}
function IconLink() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7L11.5 6.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.1-1.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function IconCopy() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 6.5A2.5 2.5 0 0 0 12.5 4H6.5A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 7h14M10 7V5.5A1.5 1.5 0 0 1 11.5 4h1A1.5 1.5 0 0 1 14 5.5V7m-8 0 .8 11.1A2 2 0 0 0 8.8 20h6.4a2 2 0 0 0 2-1.9L18 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
function IconArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconSpark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m11 3 1.8 4.8L17.6 9.6l-4.8 1.8L11 16.2 9.2 11.4 4.4 9.6l4.8-1.8Z" fill="#0069FF" />
      <path d="M17.8 14.6 18.7 17l2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9Z" fill="#8B7BF0" />
    </svg>
  )
}
function IconLogout() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 8V6.5A2.5 2.5 0 0 0 11.5 4h-4A2.5 2.5 0 0 0 5 6.5v11A2.5 2.5 0 0 0 7.5 20h4a2.5 2.5 0 0 0 2.5-2.5V16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10 12h10m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
function IconBox() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m4.4 7.7 7.6 4.4 7.6-4.4M12 12.1V21" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function BrandMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="tdd-logo" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2E7CFF" />
          <stop offset="1" stopColor="#0B4FE3" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#tdd-logo)" />
      <path d="M20 9.9 22.7 16.8 30.1 17.2 24.4 22 26.3 29.1 20 25.2 13.7 29.1 15.6 22 9.9 17.2 17.3 16.8Z" fill="#FFC62E" />
    </svg>
  )
}

export default function Dashboard() {
  const [testimonials, setTestimonials] = useState([])
  const [products, setProducts] = useState([])
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [filterProduct, setFilterProduct] = useState('all')
  const [trendRange, setTrendRange] = useState('day')
  const [noBusiness, setNoBusiness] = useState(false)
  const [productsReady, setProductsReady] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProductName, setNewProductName] = useState('')
  const [savingProduct, setSavingProduct] = useState(false)
  const [productError, setProductError] = useState('')
  const [toast, setToast] = useState('')
  const reduced = usePrefersReducedMotion()
  const compact = useMediaQuery('(max-width: 760px)')
  const IS_DEMO = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('demo')

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(id)
  }, [toast])

  useEffect(() => {
    if (!showAddProduct) return
    const onKey = (e) => { if (e.key === 'Escape') setShowAddProduct(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showAddProduct])

  async function fetchTestimonials(businessId) {
    if (IS_DEMO) return
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
    setTestimonials(data || [])
    setLoading(false)
  }

  async function fetchProducts(businessId) {
    if (IS_DEMO) return
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: true })
    if (error) {
      setProductsReady(false)
      return
    }
    setProductsReady(true)
    setProducts(data || [])
  }

  async function checkUser() {
    if (IS_DEMO) {
      setBusiness(DEMO_BUSINESS)
      setProducts(demoProducts())
      setTestimonials(demoReviews())
      setLoading(false)
      return
    }
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
    fetchProducts(businessData.id)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    checkUser()
  }, [])

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

  async function addProduct() {
    const name = newProductName.trim()
    if (!name || !business) return
    setSavingProduct(true)
    setProductError('')

    let slug = slugify(name)
    if (!slug) slug = 'product'
    const taken = new Set(products.map((p) => p.slug))
    if (taken.has(slug)) {
      let n = 2
      while (taken.has(slug + '-' + n)) n++
      slug = slug + '-' + n
    }

    const { data, error } = await supabase
      .from('products')
      .insert({ business_id: business.id, name, slug })
      .select()
      .single()

    setSavingProduct(false)
    if (error) {
      setProductError(
        /relation|does not exist|schema/i.test(error.message || '')
          ? 'Products are not set up yet. Run supabase/migrations/20261025_products.sql in the Supabase SQL editor.'
          : error.message
      )
      return
    }
    setProducts((prev) => [...prev, data])
    setNewProductName('')
    setShowAddProduct(false)
    setToast('Product added')
  }

  async function deleteProduct(product) {
    if (filterProduct === product.id) setFilterProduct('all')
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
      setTestimonials((prev) => prev.map((t) => (t.product_id === product.id ? { ...t, product_id: null } : t)))
      setToast('Product removed')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  function copyText(text, message) {
    if (!navigator.clipboard) {
      setToast('Copy is blocked here — select the link and copy manually')
      return
    }
    navigator.clipboard.writeText(text).then(
      () => setToast(message),
      () => setToast('Copy failed — select the link and copy manually')
    )
  }

  const liveCount = testimonials.filter((t) => t.approved).length
  const pendingCount = testimonials.length - liveCount

  const productName = (t) => {
    const found = products.find((p) => p.id === t.product_id)
    return found ? found.name : t.category || null
  }

  const filtered = testimonials.filter((t) => {
    if (filterProduct !== 'all' && t.product_id !== filterProduct) return false
    if (filter === 'approved') return t.approved
    if (filter === 'pending') return !t.approved
    return true
  })

  const avgRating = testimonials.length
    ? (testimonials.reduce((sum, t) => sum + (t.star_rating || 0), 0) / testimonials.length).toFixed(1)
    : '0.0'

  const trendReviews = filterProduct === 'all'
    ? testimonials
    : testimonials.filter((t) => t.product_id === filterProduct)
  const series = buildReviewSeries(trendReviews, trendRange, compact)
  const seriesTotal = series.reduce((n, b) => n + b.count, 0)
  const seriesPeak = Math.max(...series.map((b) => b.count), 1)

  const totalCount = useCountUp(testimonials.length, productsReady)
  const liveAnimated = useCountUp(liveCount, productsReady)
  const pendingAnimated = useCountUp(pendingCount, productsReady)
  const ratingAnimated = useCountUp(Number(avgRating), productsReady)

  const siteUrl = 'https://trustdrop-lac.vercel.app'
  const reviewUrl = business ? siteUrl + '/collect/' + business.slug : siteUrl

  const checkoutUrl = business
    ? `https://trustdrop7.lemonsqueezy.com/checkout/buy/f805ed02-332c-426b-a866-078eba3c3c21?checkout[email]=${encodeURIComponent(business.email)}`
    : 'https://trustdrop7.lemonsqueezy.com/checkout/buy/f805ed02-332c-426b-a866-078eba3c3c21'

  if (loading) {
    return (
      <div className="tdd">
        <style>{STYLES}</style>
        <div className="tdd-center">
          <div style={{ textAlign: 'center' }}>
            <div className="tdd-spinner" />
            <p style={{ color: '#8391A2', fontSize: 13.5 }}>Loading your workspace…</p>
          </div>
        </div>
      </div>
    )
  }

  if (noBusiness) {
    return (
      <div className="tdd">
        <style>{STYLES}</style>
        <div className="tdd-center">
          <div className="tdd-state-card">
            <div style={{ fontSize: 30, marginBottom: 14 }}>⚠️</div>
            <h2 className="tdd-state-title">No business found</h2>
            <p className="tdd-state-sub">
              You are signed in, but we could not find a business record linked to this account. This can happen if signup was interrupted.
            </p>
            <button
              className="tdd-btn tdd-btn-primary tdd-btn-block"
              onClick={async () => { await supabase.auth.signOut(); window.location.href = '/auth?mode=signup' }}
            >
              Log out and sign up again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isExpired(business)) {
    return (
      <div className="tdd">
        <style>{STYLES}</style>
        <div className="tdd-center">
          <div className="tdd-state-card">
            <div style={{ width: 54, height: 54, borderRadius: 16, background: 'linear-gradient(150deg,#FFF3E4,#FFE7CC)', color: '#C2740B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <IconClock />
            </div>
            <h2 className="tdd-state-title">Your free trial has ended</h2>
            <p className="tdd-state-sub">
              Your 14-day TrustDrop trial is over. Upgrade to keep your dashboard, widget and collection page live.
            </p>
            <a className="tdd-btn tdd-btn-primary tdd-btn-block" href={checkoutUrl} target="_blank" rel="noreferrer" style={{ marginBottom: 10 }}>
              Upgrade for $19/month
            </a>
            <button className="tdd-btn tdd-btn-ghost tdd-btn-block" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </div>
    )
  }

  const trialDays = daysRemaining(business)
  const showTrial = !isPaid(business)
  const trialElapsedPct = trialDays === null ? 0 : Math.min(100, Math.max(0, ((14 - trialDays) / 14) * 100))
  const lastReview = lastReviewLabel(testimonials)
  const businessInitials = initials(business?.business_name)

  const statCards = [
    { label: 'Total reviews', value: Math.round(totalCount), tint: 'blue', foot: 'Collected all time', icon: <IconChart /> },
    { label: 'Live on site', value: Math.round(liveAnimated), tint: 'green', foot: 'Visible in your widget', icon: <IconCheck /> },
    { label: 'Awaiting approval', value: Math.round(pendingAnimated), tint: 'amber', foot: 'Needs a quick look', icon: <IconClock /> },
    { label: 'Average rating', value: ratingAnimated.toFixed(1), tint: 'violet', foot: '', icon: <IconStar /> },
  ]

  return (
    <div className={'tdd' + (reduced ? ' tdd-reduced' : '')}>
      <style>{STYLES}</style>

      <nav className="tdd-nav">
        <div className="tdd-wrap tdd-nav-in">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link className="tdd-brand" href="/">
              <BrandMark />
              <span className="tdd-brand-name">TrustDrop</span>
            </Link>
            <div className="tdd-crumb">
              <span>Workspace</span>
              <span style={{ color: '#CFC9BE' }}>/</span>
              <b>Dashboard</b>
            </div>
          </div>
          <div className="tdd-nav-right">
            <a className="tdd-btn tdd-btn-ghost tdd-btn-sm" href={reviewUrl} target="_blank" rel="noreferrer">
              Review page <IconArrow />
            </a>
            <span className="tdd-avatar-nav" title={business?.business_name}>{businessInitials}</span>
            <button className="tdd-logout" onClick={handleLogout}>
              <IconLogout /> Log out
            </button>
          </div>
        </div>
      </nav>

      <main className="tdd-main">
        <span className="tdd-blob" aria-hidden="true" />
        <span className="tdd-blob b" aria-hidden="true" />
        <div className="tdd-wrap">

          <header className="tdd-rise">
            <div className="tdd-eyebrow"><i />DASHBOARD</div>
            <div className="tdd-hero-row">
              <div>
                <h1 className="tdd-h1">{business?.business_name}</h1>
                <p className="tdd-sub">Every kind word your customers left, in one calm place.</p>
                <div className="tdd-meta">
                  <span className="tdd-live-pill"><i />{liveCount} live on your site</span>
                  {lastReview && <span>•</span>}
                  {lastReview && <span>Last review {lastReview}</span>}
                </div>
              </div>
              <div className="tdd-hero-actions">
                <a className="tdd-btn tdd-btn-ghost" href={reviewUrl} target="_blank" rel="noreferrer">
                  Open review page <IconArrow />
                </a>
                <button className="tdd-btn tdd-btn-primary" onClick={() => copyText(reviewUrl, 'Review link copied')}>
                  <IconCopy /> Copy link
                </button>
              </div>
            </div>
          </header>

          {showTrial && (
            <div className="tdd-banner tdd-rise" style={{ animationDelay: '.06s' }}>
              <div className="tdd-banner-left">
                <span className="tdd-banner-icon"><IconSpark /></span>
                <div>
                  <p className="tdd-banner-title">
                    {trialDays === null
                      ? 'Free trial'
                      : trialDays === 0
                        ? 'Your trial ends today'
                        : trialDays + ' day' + (trialDays === 1 ? '' : 's') + ' left in your trial'}
                  </p>
                  <p className="tdd-banner-sub">Upgrade to keep your inbox, widget and collection page live — $19/month, cancel anytime.</p>
                </div>
              </div>
              <a className="tdd-btn tdd-btn-primary" href={checkoutUrl} target="_blank" rel="noreferrer">
                Upgrade <span aria-hidden="true">→</span>
              </a>
            </div>
          )}

          <section className="tdd-stats">
            {statCards.map((card, i) => (
              <div className="tdd-stat tdd-rise" key={card.label} style={{ animationDelay: (0.08 + i * 0.05) + 's' }}>
                <span className={'tdd-stat-icon ' + card.tint}>{card.icon}</span>
                <p className="tdd-stat-label">{card.label}</p>
                <p className="tdd-stat-value">
                  {card.value}
                  {card.label === 'Average rating' && <span> /5</span>}
                </p>
                {card.label === 'Average rating'
                  ? <div className="tdd-stars-row" aria-hidden="true">★★★★★</div>
                  : null}
                {card.foot && <p className="tdd-stat-foot">{card.foot}</p>}
              </div>
            ))}
          </section>

          <div className="tdd-grid">
            <div className="tdd-col">
              <ReviewTrend
                series={series}
                peak={seriesPeak}
                total={seriesTotal}
                range={trendRange}
                onRangeChange={setTrendRange}
                product={filterProduct}
                onProductChange={setFilterProduct}
                products={products}
                reduced={reduced}
                compact={compact}
                delay={0.16}
              />

              <section className="tdd-card tdd-reviews tdd-rise" style={{ animationDelay: '.2s' }}>
                <div className="tdd-reviews-head">
                  <h2 className="tdd-reviews-title">
                    Reviews <span className="tdd-count-chip">{testimonials.length}</span>
                  </h2>
                  <div className="tdd-seg">
                    {[
                      { key: 'all', label: 'All', n: testimonials.length },
                      { key: 'approved', label: 'Live', n: liveCount },
                      { key: 'pending', label: 'Pending', n: pendingCount },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        className={'tdd-seg-btn' + (filter === tab.key ? ' is-on' : '')}
                        onClick={() => setFilter(tab.key)}
                      >
                        {tab.label} <span>{tab.n}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <div className="tdd-empty">
                    <span className="tdd-empty-icon"><IconCheck /></span>
                    <p className="tdd-empty-title">
                      {filterProduct === 'all' ? 'Nothing here yet' : 'No reviews for this product yet'}
                    </p>
                    <p className="tdd-empty-sub">
                      {filterProduct === 'all'
                        ? 'Share your review link to start collecting kind words.'
                        : 'Send that product’s own link and its reviews will land here.'}
                    </p>
                    <button
                      className="tdd-btn tdd-btn-soft tdd-btn-sm"
                      onClick={() => copyText(
                        filterProduct === 'all'
                          ? reviewUrl
                          : reviewUrl + '?product=' + (products.find((p) => p.id === filterProduct)?.slug || ''),
                        'Link copied'
                      )}
                    >
                      <IconCopy /> Copy review link
                    </button>
                  </div>
                ) : (
                  filtered.map((t, index) => {
                    const tint = REVIEW_TINTS[index % REVIEW_TINTS.length]
                    const label = productName(t)
                    return (
                      <article
                        className="tdd-review"
                        key={t.id}
                        style={{ animationDelay: Math.min(index * 0.04, 0.3) + 's' }}
                      >
                        <div className="tdd-review-top">
                          <span className="tdd-review-avatar" style={{ background: tint.bg, color: tint.fg }}>
                            {initials(t.reviewer_name)}
                          </span>
                          <div className="tdd-review-id">
                            <div className="tdd-review-name">
                              {t.reviewer_name}
                              <span className={'tdd-chip ' + (t.approved ? 'live' : 'pending')}>
                                {t.approved ? 'Live' : 'Pending'}
                              </span>
                              {label && <span className="tdd-chip product">{label}</span>}
                            </div>
                            <div className="tdd-review-meta">
                              {t.reviewer_email && <span>{t.reviewer_email}</span>}
                              {t.reviewer_email && <span style={{ color: '#DAD5CB' }}>·</span>}
                              <span>{shortDate(t.created_at)}</span>
                              <span className="tdd-review-stars" aria-label={t.star_rating + ' out of 5'}>
                                {'★'.repeat(t.star_rating)}{'☆'.repeat(Math.max(0, 5 - t.star_rating))}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="tdd-review-text">{t.review_text}</p>

                        <div className="tdd-review-foot">
                          <span className="tdd-verified">
                            <IconCheck /> Verified customer
                          </span>
                          <div className="tdd-review-actions">
                            <button
                              className="tdd-btn tdd-btn-ghost tdd-btn-sm"
                              onClick={() => approveTestimonial(t.id, t.approved)}
                            >
                              {t.approved ? 'Unpublish' : 'Approve'}
                            </button>
                            <button
                              className="tdd-icon-btn"
                              onClick={() => deleteTestimonial(t.id)}
                              aria-label={'Delete review from ' + t.reviewer_name}
                              title="Delete"
                            >
                              <IconTrash />
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  })
                )}
              </section>
            </div>

            <div className="tdd-col tdd-rail">
              <section className="tdd-card tdd-rise" style={{ animationDelay: '.24s' }}>
                <div className="tdd-products-head">
                  <p className="tdd-products-title"><IconBox /> Products</p>
                  <button className="tdd-btn tdd-btn-soft tdd-btn-sm" onClick={() => { setProductError(''); setShowAddProduct(true) }}>
                    <IconPlus /> Add
                  </button>
                </div>
                <p className="tdd-products-sub">Each product gets its own link, so reviews never mix.</p>

                {products.length === 0 ? (
                  <div className="tdd-products-empty">
                    <p>{productsReady ? 'No products yet — add what you sell.' : 'Products are not set up in your database yet.'}</p>
                    <button className="tdd-btn tdd-btn-ghost tdd-btn-sm" onClick={() => { setProductError(''); setShowAddProduct(true) }}>
                      <IconPlus /> Add your first product
                    </button>
                  </div>
                ) : (
                  products.map((p, i) => {
                    const tint = PRODUCT_TINTS[i % PRODUCT_TINTS.length]
                    const count = testimonials.filter((t) => t.product_id === p.id).length
                    const url = reviewUrl + '?product=' + p.slug
                    return (
                      <div className="tdd-product" key={p.id}>
                        <span className="tdd-product-dot" style={{ background: tint.grad }}>{initials(p.name)}</span>
                        <div className="tdd-product-main">
                          <div className="tdd-product-name">
                            {p.name}
                            <span className="tdd-product-count">{count}</span>
                          </div>
                          <div className="tdd-product-link">
                            <span className="tdd-product-url">?product={p.slug}</span>
                            <button className="tdd-mini-btn" onClick={() => copyText(url, p.name + ' link copied')}>copy</button>
                          </div>
                        </div>
                        <div className="tdd-product-actions">
                          <button
                            className="tdd-icon-btn"
                            onClick={() => deleteProduct(p)}
                            title={'Delete ' + p.name}
                            aria-label={'Delete ' + p.name}
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}

                {!productsReady && (
                  <div className="tdd-notice">
                    <span>⚠️</span>
                    <span>
                      Run <code>supabase/migrations/20261025_products.sql</code> in Supabase to save products.
                    </span>
                  </div>
                )}
              </section>

              <section className="tdd-link-card tdd-rise" style={{ animationDelay: '.28s' }}>
                <p className="tdd-link-title"><IconLink /> Your review link</p>
                <p className="tdd-link-sub">Send this to a happy customer. One tap, thirty seconds, no account needed.</p>
                <button
                  type="button"
                  className="tdd-input tdd-link-url"
                  onClick={() => copyText(reviewUrl, 'Review link copied')}
                  title={'Copy ' + reviewUrl}
                >
                  {reviewUrl}
                </button>
                <div className="tdd-link-actions">
                  <button className="tdd-btn tdd-btn-primary tdd-btn-sm" onClick={() => copyText(reviewUrl, 'Review link copied')}>
                    <IconCopy /> Copy
                  </button>
                  <a className="tdd-btn tdd-btn-ghost tdd-btn-sm" href={reviewUrl} target="_blank" rel="noreferrer" style={{ background: '#fff' }}>
                    Preview <IconArrow />
                  </a>
                </div>
                <p className="tdd-link-note">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="12" cy="8" r="1" fill="currentColor" />
                  </svg>
                  Nothing appears on your site until you approve it.
                </p>
              </section>

              {showTrial && (
                <section className="tdd-card tdd-rise" style={{ animationDelay: '.32s' }}>
                  <p className="tdd-trial-title"><IconClock /> Free trial</p>
                  <p className="tdd-trial-big">
                    {trialDays === null ? '14 days' : trialDays + ' day' + (trialDays === 1 ? '' : 's')}
                    {trialDays !== null && <span> left</span>}
                  </p>
                  <div className="tdd-progress"><i style={{ width: Math.max(4, trialElapsedPct) + '%' }} /></div>
                  <div className="tdd-progress-labels">
                    <span>14-day trial</span>
                    <span>{business?.trial_ends_at ? shortDate(business.trial_ends_at) : ''}</span>
                  </div>
                  <a className="tdd-btn tdd-btn-primary tdd-btn-block" href={checkoutUrl} target="_blank" rel="noreferrer">
                    Upgrade for $19/mo →
                  </a>
                </section>
              )}
            </div>
          </div>

        </div>
      </main>

      {showAddProduct && (
        <div className="tdd-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowAddProduct(false) }}>
          <div className="tdd-modal" role="dialog" aria-modal="true" aria-labelledby="tdd-add-product-title">
            <h3 id="tdd-add-product-title">Add a product</h3>
            <p>Name what you sell — books, flowers, gift boxes, anything. You get a separate review link for each one.</p>
            <input
              className="tdd-field"
              autoFocus
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addProduct() }}
              placeholder="e.g. Hardcover novels"
              maxLength={60}
            />
            <p className="tdd-slug-preview">
              Link: {reviewUrl}?product={slugify(newProductName) || '…'}
            </p>
            {productError && <div className="tdd-error">{productError}</div>}
            <div className="tdd-modal-actions">
              <button className="tdd-btn tdd-btn-ghost" onClick={() => setShowAddProduct(false)}>Cancel</button>
              <button
                className="tdd-btn tdd-btn-primary"
                onClick={addProduct}
                disabled={savingProduct || !newProductName.trim()}
                style={{ opacity: savingProduct || !newProductName.trim() ? 0.5 : 1 }}
              >
                {savingProduct ? 'Adding…' : 'Add product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="tdd-toast" role="status">
          <IconCheck /> {toast}
        </div>
      )}
    </div>
  )
}
