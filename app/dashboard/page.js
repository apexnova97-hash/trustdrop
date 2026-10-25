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
function buildReviewSeries(reviews, range) {
  const now = new Date()
  const buckets = []

  if (range === 'month') {
    for (let i = 11; i >= 0; i--) {
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
    const total = range === 'week' ? 12 : 30
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
  --ease:cubic-bezier(.16,1,.3,1); --shadow-sm:0 1px 2px rgba(7,26,49,.05), 0 8px 24px rgba(7,26,49,.05);
  --shadow-md:0 18px 50px rgba(7,26,49,.10);
  min-height:100vh; background:var(--bg); color:var(--ink); font-family:var(--font-body),'Inter',sans-serif; overflow-x:clip; }
.tdd * { box-sizing:border-box; }
.tdd-wrap { max-width:1180px; margin:0 auto; padding:0 28px; }
.tdd ::selection { background:rgba(0,105,255,.16); }

/* motion */
@keyframes tddFadeUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:none} }
@keyframes tddPop { 0%{opacity:0; transform:scale(.86)} 100%{opacity:1; transform:scale(1)} }
@keyframes tddPanel { from{opacity:0; transform:translateY(16px) scale(.985)} to{opacity:1; transform:none} }
@keyframes tddGrow { from{transform:scaleY(.05)} to{transform:scaleY(1)} }
@keyframes tddPulse { 0%{box-shadow:0 0 0 0 rgba(14,159,110,.45)} 70%{box-shadow:0 0 0 7px rgba(14,159,110,0)} 100%{box-shadow:0 0 0 0 rgba(14,159,110,0)} }
@keyframes tddFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
@keyframes tddDrift { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(70px,-40px) scale(1.1)} }
.tdd-rise { animation:tddFadeUp .7s var(--ease) both; }
.tdd-reduced .tdd-rise, .tdd-reduced .tdd-pop, .tdd-reduced .tdd-bar { animation:none !important; }
@media (prefers-reduced-motion: reduce) {
  .tdd-rise, .tdd-pop, .tdd-bar, .tdd-blob { animation:none !important; }
  .tdd * { transition:none !important; }
}

/* nav */
.tdd-nav { position:sticky; top:0; z-index:50; background:rgba(252,251,248,.86); backdrop-filter:blur(14px); border-bottom:1px solid var(--line); }
.tdd-nav-in { height:68px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
.tdd-brand { display:flex; align-items:center; gap:10px; text-decoration:none; color:var(--ink); }
.tdd-brand-name { font-family:var(--font-display),sans-serif; font-weight:800; font-size:19px; letter-spacing:-.03em; }
.tdd-crumb { display:flex; align-items:center; gap:10px; margin-left:18px; font-size:13.5px; color:var(--muted); }
.tdd-crumb b { color:var(--ink); font-weight:600; }
.tdd-nav-right { display:flex; align-items:center; gap:10px; }

/* buttons */
.tdd-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; border-radius:999px; border:1px solid transparent;
  font-family:inherit; font-size:14px; font-weight:600; line-height:1; cursor:pointer; text-decoration:none; padding:12px 20px;
  transition:transform .28s var(--ease), background .2s, box-shadow .3s var(--ease), border-color .2s, color .2s; white-space:nowrap; }
.tdd-btn svg { transition:transform .28s var(--ease); }
.tdd-btn:hover svg { transform:translateX(3px); }
.tdd-btn-primary { background:linear-gradient(135deg,#2E7CFF,#0052CC); color:#fff; box-shadow:0 10px 24px -8px rgba(0,105,255,.55); }
.tdd-btn-primary:hover { transform:translateY(-2px); box-shadow:0 16px 32px -10px rgba(0,105,255,.62); }
.tdd-btn-ghost { background:#fff; border-color:rgba(7,26,49,.14); color:var(--ink); }
.tdd-btn-ghost:hover { border-color:rgba(7,26,49,.3); transform:translateY(-2px); box-shadow:var(--shadow-sm); }
.tdd-btn-soft { background:var(--blue-soft); border-color:#D8E6FF; color:var(--blue-dark); }
.tdd-btn-soft:hover { background:#DFEBFF; transform:translateY(-2px); }
.tdd-btn-sm { padding:10px 16px; font-size:13.5px; }
.tdd-btn-block { width:100%; border-radius:14px; padding:14px 18px; }
.tdd-icon-btn { width:34px; height:34px; display:inline-flex; align-items:center; justify-content:center; border-radius:10px;
  border:1px solid var(--line); background:#fff; color:#A6AFB9; cursor:pointer; transition:color .2s, border-color .2s, transform .25s var(--ease), background .2s; }
.tdd-icon-btn:hover { color:#D6336C; border-color:#F8D3DE; background:#FFF7FA; transform:translateY(-1px); }
.tdd-logout { display:inline-flex; align-items:center; gap:7px; border:none; background:transparent; font-family:inherit; font-size:13.5px;
  font-weight:500; color:var(--body); cursor:pointer; padding:8px 6px; border-radius:9px; transition:color .2s, background .2s; }
.tdd-logout:hover { color:var(--ink); background:rgba(7,26,49,.04); }
.tdd-avatar-nav { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#2E7CFF,#0052CC); color:#fff;
  display:inline-flex; align-items:center; justify-content:center; font-size:12.5px; font-weight:700; box-shadow:0 4px 14px -4px rgba(0,105,255,.6); }

/* hero */
.tdd-main { padding:44px 0 76px; position:relative; }
.tdd-blob { position:absolute; width:520px; height:520px; border-radius:50%; filter:blur(110px); pointer-events:none;
  background:linear-gradient(150deg,#BFD7FF,#E6D9FF); opacity:.4; top:-140px; right:-160px; animation:tddDrift 26s var(--ease) infinite; }
.tdd-eyebrow { display:flex; align-items:center; gap:9px; font-size:11.5px; font-weight:700; letter-spacing:.16em; color:var(--blue); margin-bottom:14px; }
.tdd-eyebrow i { width:24px; height:2px; border-radius:2px; background:linear-gradient(90deg,#2E7CFF,#8B7BF0); display:block; }
.tdd-hero-row { display:flex; align-items:flex-end; justify-content:space-between; gap:24px; flex-wrap:wrap; }
.tdd-h1 { font-family:var(--font-display),sans-serif; font-size:56px; line-height:1.02; letter-spacing:-.045em; font-weight:800; margin:0 0 10px; }
.tdd-sub { font-size:15.5px; color:var(--body); margin:0 0 16px; }
.tdd-meta { display:flex; align-items:center; gap:10px; flex-wrap:wrap; font-size:13px; color:var(--muted); }
.tdd-live-pill { display:inline-flex; align-items:center; gap:7px; background:#E7F8EF; color:#0E9F6E; font-weight:600; font-size:12.5px; padding:5px 11px; border-radius:999px; }
.tdd-live-pill i { width:6px; height:6px; border-radius:50%; background:#12B76A; display:block; animation:tddPulse 2.6s infinite; }
.tdd-hero-actions { display:flex; align-items:center; gap:10px; padding-bottom:4px; }

/* trial banner */
.tdd-banner { display:flex; align-items:center; justify-content:space-between; gap:18px; flex-wrap:wrap;
  background:linear-gradient(120deg,#EDF4FF 0%,#F3F0FF 55%,#FFF4EA 100%); border:1px solid #E1E8FA; border-radius:18px;
  padding:16px 18px; margin:30px 0 22px; box-shadow:0 10px 30px -24px rgba(7,26,49,.4); }
.tdd-banner-left { display:flex; align-items:center; gap:14px; }
.tdd-banner-icon { width:42px; height:42px; border-radius:12px; background:#fff; display:inline-flex; align-items:center; justify-content:center;
  box-shadow:0 4px 14px -8px rgba(7,26,49,.35); animation:tddFloat 5s var(--ease) infinite; }
.tdd-banner-title { font-size:14.5px; font-weight:700; margin:0 0 3px; }
.tdd-banner-sub { font-size:13px; color:#5B6B8C; margin:0; }

/* stats */
.tdd-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:22px; }
.tdd-stat { background:var(--card); border:1px solid var(--line); border-radius:18px; padding:18px 20px;
  transition:transform .35s var(--ease), box-shadow .35s var(--ease), border-color .25s; }
.tdd-stat:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); border-color:#DED9CE; }
.tdd-stat-icon { width:38px; height:38px; border-radius:11px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px; color:#fff; }
.tdd-stat-icon.blue { background:linear-gradient(135deg,#2E7CFF,#0052CC); box-shadow:0 8px 18px -10px rgba(0,105,255,.8); }
.tdd-stat-icon.green { background:linear-gradient(135deg,#3ED598,#0E9F6E); box-shadow:0 8px 18px -10px rgba(14,159,110,.8); }
.tdd-stat-icon.amber { background:linear-gradient(135deg,#F5C06B,#E0830F); box-shadow:0 8px 18px -10px rgba(224,131,15,.8); }
.tdd-stat-icon.violet { background:linear-gradient(135deg,#9B8CF4,#6B5CE7); box-shadow:0 8px 18px -10px rgba(107,92,231,.8); }
.tdd-stat-label { font-size:10.5px; font-weight:700; letter-spacing:.12em; color:var(--muted); text-transform:uppercase; margin:0 0 8px; }
.tdd-stat-value { font-family:var(--font-display),sans-serif; font-size:33px; font-weight:800; letter-spacing:-.035em; line-height:1; margin:0; font-variant-numeric:tabular-nums; }
.tdd-stat-value span { font-size:14px; font-weight:600; color:#B6BFC9; letter-spacing:0; }
.tdd-stars-row { color:#F5A524; font-size:13px; letter-spacing:2px; margin-top:3px; }
.tdd-stat-foot { font-size:12.5px; color:var(--muted); margin:12px 0 0; }

/* layout */
.tdd-grid { display:grid; grid-template-columns:1.72fr 1fr; gap:16px; align-items:start; }
.tdd-col { display:flex; flex-direction:column; gap:16px; }
.tdd-card { background:var(--card); border:1px solid var(--line); border-radius:20px; padding:22px; box-shadow:var(--shadow-sm); }

/* chart */
.tdd-chart-head { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; flex-wrap:wrap; margin-bottom:18px; }
.tdd-chart-title { font-size:15.5px; font-weight:700; margin:0 0 3px; }
.tdd-chart-sub { font-size:12.5px; color:var(--muted); margin:0; }
.tdd-chart-controls { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.tdd-select-wrap { position:relative; display:inline-flex; }
.tdd-select { appearance:none; -webkit-appearance:none; border:1px solid var(--line); background:#FCFBF8; color:var(--ink-soft);
  font-family:inherit; font-size:12.5px; font-weight:600; padding:8px 30px 8px 12px; border-radius:10px; cursor:pointer;
  transition:border-color .2s, box-shadow .25s; max-width:170px; }
.tdd-select:hover { border-color:#D8D2C6; }
.tdd-select:focus { outline:none; border-color:rgba(0,105,255,.5); box-shadow:0 0 0 4px rgba(0,105,255,.1); }
.tdd-select-wrap svg { position:absolute; right:10px; top:50%; transform:translateY(-50%); pointer-events:none; }
.tdd-seg { display:inline-flex; gap:2px; background:#F2EFE8; border-radius:11px; padding:3px; }
.tdd-seg-btn { border:none; background:transparent; font-family:inherit; font-size:12.5px; font-weight:600; color:#77808C;
  padding:7px 13px; border-radius:9px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;
  transition:background .25s var(--ease), color .2s, box-shadow .25s var(--ease), transform .2s var(--ease); }
.tdd-seg-btn:hover { color:var(--ink); }
.tdd-seg-btn.is-on { background:#fff; color:var(--ink); box-shadow:0 2px 8px -2px rgba(7,26,49,.18); }
.tdd-seg-btn span { font-size:11px; color:#A6AFB9; font-weight:700; }
.tdd-seg-btn.is-on span { color:var(--blue); }
.tdd-bars { display:flex; align-items:flex-end; gap:4px; height:124px; }
.tdd-bar-col { flex:1; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; }
.tdd-bar-count { font-size:10px; font-weight:700; color:var(--blue); margin-bottom:5px; }
.tdd-bar-count.is-empty { color:transparent; }
.tdd-bar { width:100%; max-width:26px; border-radius:5px 5px 2px 2px; transform-origin:bottom;
  background:linear-gradient(180deg,#7FB2FF,#0069FF); animation:tddGrow .6s var(--ease) both; }
.tdd-bar.is-empty { background:#EFF1F4; }
.tdd-bar-col:hover .tdd-bar:not(.is-empty) { filter:brightness(1.06); }
.tdd-bar-labels { display:flex; gap:4px; margin-top:10px; border-top:1px solid var(--line-soft); padding-top:9px; }
.tdd-bar-label { flex:1; text-align:center; font-size:10px; color:#A6AFB9; white-space:nowrap; overflow:hidden; }

/* reviews */
.tdd-reviews { padding:22px 22px 6px; }
.tdd-reviews-head { display:flex; align-items:center; justify-content:space-between; gap:14px; margin-bottom:4px; flex-wrap:wrap; }
.tdd-reviews-title { display:flex; align-items:center; gap:9px; font-family:var(--font-display),sans-serif; font-size:21px; font-weight:800; letter-spacing:-.02em; margin:0; }
.tdd-count-chip { font-family:var(--font-body),sans-serif; font-size:11.5px; font-weight:700; color:#77808C; background:#F2EFE8; border-radius:7px; padding:2px 8px; letter-spacing:0; }
.tdd-review { display:block; padding:20px 4px; border-top:1px solid var(--line-soft); border-radius:14px;
  transition:background .25s; animation:tddFadeUp .5s var(--ease) both; }
.tdd-review:first-of-type { border-top:none; }
.tdd-review:hover { background:#FCFBF8; }
.tdd-review-top { display:flex; gap:12px; }
.tdd-review-avatar { width:38px; height:38px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;
  font-size:12.5px; font-weight:700; flex-shrink:0; }
.tdd-review-id { min-width:0; flex:1; }
.tdd-review-name { display:flex; align-items:center; gap:7px; font-size:14.5px; font-weight:700; margin-bottom:2px; flex-wrap:wrap; }
.tdd-chip { font-size:10.5px; font-weight:700; padding:2px 7px; border-radius:6px; }
.tdd-chip.live { background:#E7F8EF; color:#0E9F6E; }
.tdd-chip.pending { background:#FFF3E4; color:#B45309; }
.tdd-chip.product { background:#F2EFE8; color:#5D6E82; }
.tdd-review-meta { display:flex; align-items:center; gap:6px; font-size:12.5px; color:var(--muted); flex-wrap:wrap; }
.tdd-review-stars { color:#F5A524; letter-spacing:1.5px; margin-left:2px; }
.tdd-review-text { font-size:14px; line-height:1.65; color:var(--ink-soft); margin:9px 0 0 50px; }
.tdd-review-foot { display:flex; align-items:center; justify-content:space-between; gap:12px; margin:14px 0 0 50px; flex-wrap:wrap; }
.tdd-verified { display:inline-flex; align-items:center; gap:6px; font-size:12px; color:#A6AFB9; }
.tdd-review-actions { display:flex; align-items:center; gap:8px; }
.tdd-empty { text-align:center; padding:42px 16px 48px; }
.tdd-empty-icon { width:48px; height:48px; border-radius:15px; background:linear-gradient(150deg,#EAF2FF,#F4EEFF);
  color:var(--blue); display:inline-flex; align-items:center; justify-content:center; margin-bottom:14px; animation:tddFloat 5s var(--ease) infinite; }
.tdd-empty-title { font-size:15px; font-weight:700; margin:0 0 5px; }
.tdd-empty-sub { font-size:13px; color:var(--muted); margin:0 0 18px; }

/* products */
.tdd-products-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:4px; }
.tdd-products-title { display:flex; align-items:center; gap:8px; font-size:15px; font-weight:700; margin:0; }
.tdd-products-sub { font-size:12.5px; color:var(--muted); margin:6px 0 14px; }
.tdd-product { display:flex; align-items:flex-start; gap:11px; padding:11px 0; border-top:1px solid var(--line-soft); }
.tdd-product:first-of-type { border-top:none; }
.tdd-product-dot { width:32px; height:32px; border-radius:9px; display:inline-flex; align-items:center; justify-content:center;
  color:#fff; font-size:11.5px; font-weight:800; flex-shrink:0; }
.tdd-product-main { min-width:0; flex:1; }
.tdd-product-name { display:flex; align-items:center; gap:7px; font-size:13.5px; font-weight:700; }
.tdd-product-count { font-size:11px; font-weight:600; color:var(--muted); background:#F2EFE8; padding:1px 6px; border-radius:5px; }
.tdd-product-link { display:flex; align-items:center; gap:6px; margin-top:3px; }
.tdd-product-url { font-size:11px; color:#9AA6B4; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:168px; }
.tdd-mini-btn { border:none; background:transparent; color:var(--blue); font-family:inherit; font-size:11px; font-weight:700; cursor:pointer;
  padding:2px 4px; border-radius:5px; transition:background .2s, color .2s; }
.tdd-mini-btn:hover { background:var(--blue-soft); }
.tdd-product-actions { display:flex; align-items:center; gap:4px; opacity:0; transition:opacity .25s; }
.tdd-product:hover .tdd-product-actions { opacity:1; }
.tdd-product-actions .tdd-icon-btn { width:28px; height:28px; border-radius:8px; }
.tdd-products-empty { text-align:center; padding:20px 8px 8px; }
.tdd-products-empty p { font-size:12.5px; color:var(--muted); margin:0 0 12px; }
.tdd-notice { display:flex; gap:8px; font-size:11.5px; line-height:1.5; color:#8A6B24; background:#FFF8E8; border:1px solid #F5E3B8;
  border-radius:10px; padding:9px 11px; margin-top:12px; }
.tdd-notice code { font-size:11px; background:#fff; border-radius:4px; padding:1px 4px; }

/* link card */
.tdd-link-card { background:linear-gradient(165deg,#F3F8FF 0%,#EEF4FF 52%,#F8F2FF 100%); border:1px solid #E1E8FA; border-radius:20px;
  padding:22px; position:relative; overflow:hidden; }
.tdd-link-card::after { content:''; position:absolute; width:220px; height:220px; border-radius:50%; right:-90px; top:-110px;
  background:linear-gradient(150deg,#C9DCFF,#E7DBFF); filter:blur(40px); opacity:.55; pointer-events:none; }
.tdd-link-title { display:flex; align-items:center; gap:8px; font-size:15px; font-weight:700; margin:0 0 8px; position:relative; }
.tdd-link-sub { font-size:13px; color:#5B6B8C; line-height:1.6; margin:0 0 16px; position:relative; }
.tdd-input { position:relative; width:100%; border:1px solid #DDE7FA; background:#fff; border-radius:11px; padding:10px 12px;
  font-family:inherit; font-size:12.5px; color:var(--ink-soft); margin-bottom:12px;
  transition:border-color .2s, box-shadow .25s; }
.tdd-input:focus { outline:none; border-color:rgba(0,105,255,.45); box-shadow:0 0 0 4px rgba(0,105,255,.1); }
.tdd-link-actions { display:flex; gap:8px; position:relative; }
.tdd-link-actions .tdd-btn { flex:1; border-radius:12px; }
.tdd-link-note { display:flex; align-items:center; gap:6px; font-size:11.5px; color:#8F9DB4; margin:12px 0 0; position:relative; }

/* trial card */
.tdd-trial-title { display:flex; align-items:center; gap:7px; font-size:14px; font-weight:700; margin:0 0 10px; }
.tdd-trial-big { font-family:var(--font-display),sans-serif; font-size:30px; font-weight:800; letter-spacing:-.03em; margin:0 0 14px; line-height:1; }
.tdd-trial-big span { font-size:15px; font-weight:600; color:var(--muted); letter-spacing:-.01em; }
.tdd-progress { height:7px; border-radius:99px; background:#F0EDE6; overflow:hidden; margin-bottom:9px; }
.tdd-progress i { display:block; height:100%; border-radius:99px; background:linear-gradient(90deg,#7FB2FF,#8B7BF0);
  transform-origin:left; animation:tddGrow .9s var(--ease) both; }
.tdd-progress-labels { display:flex; justify-content:space-between; font-size:11.5px; color:#A6AFB9; margin-bottom:16px; }

/* modal */
.tdd-backdrop { position:fixed; inset:0; z-index:90; background:rgba(7,26,49,.32); backdrop-filter:blur(6px);
  display:flex; align-items:center; justify-content:center; padding:24px; animation:tddPop .25s var(--ease) both; }
.tdd-modal { width:100%; max-width:420px; background:#fff; border-radius:22px; padding:26px; border:1px solid var(--line);
  box-shadow:0 30px 70px -30px rgba(7,26,49,.45); animation:tddPanel .4s var(--ease) both; }
.tdd-modal h3 { font-family:var(--font-display),sans-serif; font-size:20px; letter-spacing:-.03em; font-weight:800; margin:0 0 6px; }
.tdd-modal p { font-size:13px; color:var(--body); margin:0 0 18px; line-height:1.55; }
.tdd-field { width:100%; border:1px solid var(--line); background:#FCFBF8; border-radius:11px; padding:12px 14px;
  font-family:inherit; font-size:14px; color:var(--ink); transition:border-color .2s, box-shadow .25s, background .2s; }
.tdd-field::placeholder { color:#B6BFC9; }
.tdd-field:focus { outline:none; background:#fff; border-color:rgba(0,105,255,.5); box-shadow:0 0 0 4px rgba(0,105,255,.1); }
.tdd-slug-preview { font-size:11.5px; color:var(--muted); margin:9px 0 0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tdd-modal-actions { display:flex; gap:9px; margin-top:20px; }
.tdd-modal-actions .tdd-btn { flex:1; }
.tdd-error { font-size:12px; color:#B42318; background:#FEF3F2; border:1px solid #FBD9D4; border-radius:9px; padding:8px 10px; margin-top:12px; }

/* toast */
.tdd-toast { position:fixed; left:50%; bottom:28px; transform:translateX(-50%); z-index:100; background:#071A31; color:#fff;
  font-size:13px; font-weight:600; padding:11px 18px; border-radius:999px; box-shadow:0 18px 40px -16px rgba(7,26,49,.6);
  animation:tddPop .3s var(--ease) both; display:flex; align-items:center; gap:8px; }

/* states */
.tdd-center { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; background:#FCFBF8; }
.tdd-state-card { background:#fff; border:1px solid var(--line); border-radius:22px; padding:40px 34px; max-width:440px; width:100%;
  text-align:center; box-shadow:var(--shadow-sm); animation:tddPanel .5s var(--ease) both; }
.tdd-state-title { font-family:var(--font-display),sans-serif; font-size:22px; font-weight:800; letter-spacing:-.02em; margin:0 0 10px; }
.tdd-state-sub { font-size:14px; color:var(--body); line-height:1.65; margin:0 0 22px; }
.tdd-spinner { width:34px; height:34px; border:2px solid #EDEAE2; border-top-color:#0069FF; border-radius:50%;
  animation:tddSpin .8s linear infinite; margin:0 auto 16px; }
@keyframes tddSpin { to { transform:rotate(360deg); } }

@media (max-width: 980px) {
  .tdd-h1 { font-size:42px; }
  .tdd-stats { grid-template-columns:repeat(2,1fr); }
  .tdd-grid { grid-template-columns:1fr; }
}
@media (max-width: 620px) {
  .tdd-wrap { padding:0 18px; }
  .tdd-h1 { font-size:34px; }
  .tdd-crumb { display:none; }
  .tdd-hero-actions { width:100%; }
  .tdd-hero-actions .tdd-btn { flex:1; }
  .tdd-stats { grid-template-columns:1fr; }
  .tdd-review-text, .tdd-review-foot { margin-left:0; }
  .tdd-nav-right .tdd-btn-ghost { display:none; }
  .tdd-product-actions { opacity:1; }
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
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
    setTestimonials(data || [])
    setLoading(false)
  }

  async function fetchProducts(businessId) {
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
  const series = buildReviewSeries(trendReviews, trendRange)
  const seriesTotal = series.reduce((n, b) => n + b.count, 0)
  const seriesPeak = Math.max(...series.map((b) => b.count), 1)

  const totalCount = useCountUp(testimonials.length, productsReady)
  const liveAnimated = useCountUp(liveCount, productsReady)
  const pendingAnimated = useCountUp(pendingCount, productsReady)
  const ratingAnimated = useCountUp(Number(avgRating), productsReady)

  const siteUrl = 'https://trustdrop-lac.vercel.app'
  const reviewUrl = business ? siteUrl + '/collect/' + business.slug : siteUrl
  const widgetUrl = business ? siteUrl + '/widget/' + business.slug : siteUrl
  const widgetEmbedCode = business
    ? `<iframe
  src="${widgetUrl}"
  title="Customer reviews"
  width="100%"
  height="560"
  loading="lazy"
  style="border:0;border-radius:16px;width:100%;max-width:100%;"
></iframe>`
    : ''

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

            <div className="tdd-col">
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

              <section className="tdd-card tdd-rise" style={{ animationDelay: '.27s' }}>
                <div className="tdd-products-head">
                  <p className="tdd-products-title"><IconBox /> Website Widget</p>
                </div>
                <p className="tdd-products-sub">Display your approved customer reviews on your website.</p>
                <input
                  className="tdd-input"
                  readOnly
                  value={widgetUrl}
                  onFocus={(e) => e.target.select()}
                  aria-label="Website widget URL"
                />
                <div className="tdd-link-actions">
                  <a className="tdd-btn tdd-btn-primary tdd-btn-sm" href={widgetUrl} target="_blank" rel="noreferrer">
                    <IconArrow /> Open widget
                  </a>
                  <button className="tdd-btn tdd-btn-ghost tdd-btn-sm" onClick={() => copyText(widgetUrl, 'Widget link copied')} style={{ background: '#fff' }}>
                    <IconCopy /> Copy widget URL
                  </button>
                </div>
                <p className="tdd-products-sub" style={{ marginTop: 16, marginBottom: 7 }}>Embed code</p>
                <textarea
                  className="tdd-field"
                  readOnly
                  rows={5}
                  value={widgetEmbedCode}
                  onFocus={(e) => e.target.select()}
                  aria-label="Website widget embed code"
                  style={{ resize: 'vertical', minHeight: 120, fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', fontSize: 11.5, lineHeight: 1.6 }}
                />
                <button
                  className="tdd-btn tdd-btn-primary tdd-btn-sm tdd-btn-block"
                  style={{ marginTop: 9 }}
                  onClick={() => copyText(widgetEmbedCode, 'Embed code copied')}
                >
                  <IconCopy /> Copy embed code
                </button>
              </section>

              <section className="tdd-link-card tdd-rise" style={{ animationDelay: '.28s' }}>
                <p className="tdd-link-title"><IconLink /> Your review link</p>
                <p className="tdd-link-sub">Send this to a happy customer. One tap, thirty seconds, no account needed.</p>
                <input className="tdd-input" readOnly value={reviewUrl} onFocus={(e) => e.target.select()} />
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
