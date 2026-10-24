'use client'
import { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import { supabase } from '../lib/supabase'

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const NAV = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Customers', href: '#customers' },
  { label: 'Pricing', href: '#pricing' },
]

const APPS = [
  { name: 'Shopify', color: '#5E8E3E' },
  { name: 'WordPress', color: '#21759B' },
  { name: 'Webflow', color: '#146EF5' },
  { name: 'Wix', color: '#0C0C0C' },
]

const MARQUEE = [
  'Shopify', 'WordPress', 'Webflow', 'Wix', 'Squarespace', 'Framer', 'Custom sites', 'Any website',
]

const CAPS = [
  {
    kicker: 'Collect',
    title: 'One link. Real reviews.',
    text: 'Send a single link by email, DM, or QR code. Customers rate and write in about 30 seconds — no account required.',
    icon: 'link',
    tint: 'blue',
  },
  {
    kicker: 'Curate',
    title: 'You control the wall.',
    text: 'Every submission lands in one tidy inbox. Approve, archive, or reply with a single click.',
    icon: 'check',
    tint: 'violet',
  },
  {
    kicker: 'Publish',
    title: 'Live on your site.',
    text: 'Paste one line of code. New approved reviews appear automatically, everywhere you embed it.',
    icon: 'code',
    tint: 'mint',
  },
  {
    kicker: 'Grow',
    title: 'Proof that sells.',
    text: 'Show star ratings, response rates, and your best quotes right where buyers make the decision.',
    icon: 'chart',
    tint: 'peach',
  },
]

const HOW_STICKY_TOP = 96
const DEMO_STICKY_TOP = 112

const HERO_STEPS = [
  { key: 'collect', label: 'Collect', icon: 'link', caption: 'A customer leaves a review' },
  { key: 'curate', label: 'Curate', icon: 'check', caption: 'You approve it in one click' },
  { key: 'publish', label: 'Publish', icon: 'code', caption: 'It goes live on your site' },
]

const SHOWCASE = [
  {
    icon: 'link',
    title: 'Collect reviews',
    text: 'Send one link. Customers rate and write in 30 seconds — no account, no app, no friction.',
    gradient: 'g-violet',
  },
  {
    icon: 'check',
    title: 'Curate with one click',
    text: 'Every review lands in your dashboard. Approve, reply, or archive without a spreadsheet in sight.',
    gradient: 'g-peach',
  },
  {
    icon: 'code',
    title: 'Publish everywhere',
    text: 'Your best reviews become a live widget on your site — updated automatically, forever.',
    gradient: 'g-mint',
  },
  {
    icon: 'chart',
    title: 'Track what works',
    text: 'Watch ratings and response rates climb, and see the proof that turns browsers into buyers.',
    gradient: 'g-blue',
  },
]

const STATS = [
  { end: 500, suffix: '+', decimals: 0, label: 'businesses on TrustDrop' },
  { end: 10, suffix: 'k+', decimals: 0, label: 'reviews collected' },
  { end: 4.9, suffix: '', decimals: 1, star: true, label: 'average star rating' },
  { end: 30, suffix: 's', decimals: 0, label: 'to leave a review' },
]

const STORIES = [
  {
    metric: '3×',
    metricLabel: 'more reviews collected',
    quote:
      'We swapped manual follow-ups for one TrustDrop link. Reviews tripled in the first month — and we never had to chase a single customer.',
    name: 'Sarah K.',
    role: 'Founder, Bloom & Co.',
  },
  {
    metric: '30s',
    metricLabel: 'from link to submitted review',
    quote:
      'Customers actually finish it. One link, five stars, a couple of sentences — done before they close the tab. Our response rate doubled.',
    name: 'Michael T.',
    role: 'Owner, Northline Studio',
  },
  {
    metric: '1 line',
    metricLabel: 'of code to go live',
    quote:
      'Our site now shows a live wall of love that updates itself. Setup took less time than my coffee order, and it looks like we hired a designer.',
    name: 'Amina H.',
    role: 'Marketing lead, Lumen Skincare',
  },
]

const PLAN_FEATURES = [
  'Unlimited review collection',
  'Embeddable website widget',
  'Approval dashboard',
  'Custom collection page',
  'Star ratings and insights',
  'Email notifications',
  'Cancel anytime',
]

/* ------------------------------------------------------------------ */
/*  Small helpers                                                     */
/* ------------------------------------------------------------------ */

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
      if (mq.addEventListener) mq.addEventListener('change', onChange)
      else mq.addListener(onChange)
      return () => {
        if (mq.removeEventListener) mq.removeEventListener('change', onChange)
        else mq.removeListener(onChange)
      }
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}

function useInViewReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const ICONS = {
  link: (
    <>
      <path d="M10.5 13.5a4.5 4.5 0 0 0 6.4.4l2-2a4.5 4.5 0 0 0-6.4-6.4l-1.1 1.1" />
      <path d="M13.5 10.5a4.5 4.5 0 0 0-6.4-.4l-2 2a4.5 4.5 0 0 0 6.4 6.4l1.1-1.1" />
    </>
  ),
  check: (
    <>
      <path d="M20 6 9 17l-5-5" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  code: (
    <>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m13.5 5-3 14" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="m7 14 4-4 3 3 5-6" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h13" />
      <path d="m12.5 5.5 6.5 6.5-6.5 6.5" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  chevronLeft: (
    <>
      <path d="m15 18-6-6 6-6" />
    </>
  ),
  chevronRight: (
    <>
      <path d="m9 18 6-6-6-6" />
    </>
  ),
  play: (
    <>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
      <path d="M19 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.5 2.8v5.7c0 4.6-3.2 7.5-7.5 8.5-4.3-1-7.5-3.9-7.5-8.5V5.8L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
}

function Icon({ name, size = 20, strokeWidth = 1.8, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  )
}

function Star({ size = 16, filled = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={filled ? 'star is-filled' : 'star'}>
      <path
        d="M12 2.6l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.68l-5.9 3.1 1.13-6.58L2.45 9.54l6.6-.96L12 2.6Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Stars({ size = 16, animated = false, className = '' }) {
  return (
    <span className={`rating ${animated ? 'is-animated' : ''} ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={animated ? { animationDelay: `${i * 90}ms` } : undefined}>
          <Star size={size} />
        </span>
      ))}
    </span>
  )
}

const STAR_PATH =
  'M20 9.9 22.7 16.8 30.1 17.2 24.4 22 26.3 29.1 20 25.2 13.7 29.1 15.6 22 9.9 17.2 17.3 16.8Z'

function Logo({ light = false, size = 32 }) {
  const gid = light ? 'td-logo-foot' : 'td-logo-nav'
  return (
    <span className="brand">
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2E7CFF" />
            <stop offset="1" stopColor="#0B4FE3" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill={`url(#${gid})`} />
        <path d={STAR_PATH} fill="#FFC62E" />
      </svg>
      <span className={`brand-name${light ? ' is-light' : ''}`}>TrustDrop</span>
    </span>
  )
}

function CountUp({ end, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const started = useRef(false)
  const [value, setValue] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return
        started.current = true
        const duration = 1500
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setValue(end * eased)
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [end, reduced])

  return (
    <span ref={ref} className="count">
      {(reduced ? end : value).toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero demo                                                         */
/* ------------------------------------------------------------------ */

function HeroDemo() {
  const [step, setStep] = useState(0)
  const [sub, setSub] = useState(0)
  const [paused, setPaused] = useState(false)
  const [typed, setTyped] = useState('')
  const reduced = usePrefersReducedMotion()
  const isWide = useMediaQuery('(min-width: 1021px)')
  const scrollDriven = isWide && !reduced
  const stageRef = useRef(null)
  const stickyRef = useRef(null)
  const windowRef = useRef(null)
  const progressRef = useRef(null)
  const tabRefs = useRef([])
  const stepRef = useRef(0)
  const quote = 'Fast, friendly, and flawless.'

  useEffect(() => {
    if (reduced || paused) return
    const a = setTimeout(() => setSub(1), 1400)
    const b = setTimeout(() => setSub(2), 2500)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [step, paused, reduced])

  useEffect(() => {
    if (reduced) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setTyped(quote.slice(0, i))
      if (i >= quote.length) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [step, reduced])

  useEffect(() => {
    if (scrollDriven || paused || reduced) return
    const t = setTimeout(() => {
      const next = (step + 1) % HERO_STEPS.length
      stepRef.current = next
      setStep(next)
      setSub(0)
      setTyped('')
    }, 5600)
    return () => clearTimeout(t)
  }, [step, paused, reduced, scrollDriven])

  useEffect(() => {
    const win = windowRef.current
    if (!scrollDriven) {
      if (win) win.style.transform = ''
      if (progressRef.current) progressRef.current.style.removeProperty('--demo-seg')
      return
    }
    const stage = stageRef.current
    const sticky = stickyRef.current
    if (!stage || !sticky || !win) return

    let current = 1
    let target = 1
    let frame = 0

    const tick = () => {
      const diff = target - current
      current = Math.abs(diff) < 0.001 ? target : current + diff * 0.16
      win.style.transform = `scale(${current.toFixed(4)})`
      frame = Math.abs(target - current) > 0.0005 ? requestAnimationFrame(tick) : 0
    }

    const measure = () => {
      const rect = stage.getBoundingClientRect()
      const vh = window.innerHeight
      const total = stage.offsetHeight - sticky.offsetHeight
      const pinned = Math.min(Math.max(DEMO_STICKY_TOP - rect.top, 0), Math.max(total, 0))
      const progress = total > 0 ? pinned / total : 0
      const next = Math.min(HERO_STEPS.length - 1, Math.floor(progress * HERO_STEPS.length))

      const entry = Math.min(Math.max((vh * 0.92 - rect.top) / (vh * 0.92 - DEMO_STICKY_TOP), 0), 1)
      const eased = 1 - Math.pow(1 - entry, 3)
      target = (0.70 + 0.30 * eased) * (1 + next * 0.015)

      if (progressRef.current) {
        const within = Math.min(Math.max(progress * HERO_STEPS.length - next, 0), 1)
        progressRef.current.style.setProperty('--demo-seg', `${(within * 100).toFixed(1)}%`)
      }
      if (stepRef.current !== next) {
        stepRef.current = next
        setStep(next)
        setSub(0)
        setTyped('')
      }
      if (!frame) frame = requestAnimationFrame(tick)
    }

    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(frame)
    }
  }, [scrollDriven])

  const goToStep = (next) => {
    if (scrollDriven) {
      const stage = stageRef.current
      const sticky = stickyRef.current
      if (stage && sticky) {
        const total = Math.max(stage.offsetHeight - sticky.offsetHeight, 0)
        const start = stage.getBoundingClientRect().top + window.scrollY - DEMO_STICKY_TOP
        window.scrollTo({
          top: start + total * ((next + 0.18) / HERO_STEPS.length),
          behavior: 'smooth',
        })
        return
      }
    }
    stepRef.current = next
    setStep(next)
    setSub(0)
    setTyped('')
  }

  const onTabKeyDown = (event, index) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const dir = event.key === 'ArrowRight' ? 1 : -1
    const next = (index + dir + HERO_STEPS.length) % HERO_STEPS.length
    goToStep(next)
    tabRefs.current[next]?.focus()
  }

  const current = HERO_STEPS[step]
  const pause = { onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false) }

  return (
    <div
      className={`demo-stage${scrollDriven ? ' is-scroll' : ''}${step === HERO_STEPS.length - 1 ? ' is-last' : ''}`}
      ref={stageRef}
    >
      <div className="demo-sticky" ref={stickyRef}>
        <div className="demo-window" ref={windowRef}>
          <div className="demo-card" {...pause}>
      <div className="demo-rail">
        <div className="demo-tabs" role="tablist" aria-label="Product demo">
          {HERO_STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === step}
              tabIndex={i === step ? 0 : -1}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              className={`demo-tab${i === step ? ' is-active' : ''}`}
              onClick={() => goToStep(i)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
            >
              <Icon name={s.icon} size={16} />
              {s.label}
            </button>
          ))}
        </div>
        <div className="demo-arrows">
          <button
            type="button"
            className="demo-arrow"
            aria-label="Previous step"
            onClick={() => goToStep((step - 1 + HERO_STEPS.length) % HERO_STEPS.length)}
          >
            <Icon name="chevronLeft" size={16} />
          </button>
          <button
            type="button"
            className="demo-arrow"
            aria-label="Next step"
            onClick={() => goToStep((step + 1) % HERO_STEPS.length)}
          >
            <Icon name="chevronRight" size={16} />
          </button>
        </div>
      </div>

      <div className="demo-progress" aria-hidden="true" ref={progressRef}>
        {HERO_STEPS.map((s, i) => (
          <span key={s.key} className={`seg${i === step ? ' is-active' : ''}${i < step ? ' is-done' : ''}`}>
            <span
              key={`${step}-${paused}`}
              className="seg-bar"
              style={{ animationPlayState: paused || reduced ? 'paused' : 'running' }}
            />
          </span>
        ))}
      </div>

      <div className="demo-body">
        <span className="demo-eyebrow">
          {step + 1} / {HERO_STEPS.length} &nbsp;·&nbsp; {current.caption}
        </span>

        {step === 0 && (
          <div className="demo-panel" key="collect">
            <div className="collect-shell">
              <div className="collect-head">
                <span className="org-avatar">B</span>
                <div className="org-meta">
                  <strong>Bloom &amp; Co.</strong>
                  <span>Verified business</span>
                </div>
                <span className="org-rating">
                  <Star size={12} /> 4.9
                </span>
              </div>
              <h4 className="collect-q">How was your experience?</h4>
              <Stars size={24} animated />
              <div className="quote-box">
                <span className="typed">{(reduced ? quote : typed) || '\u00A0'}</span>
                {(reduced ? quote : typed).length < quote.length && <span className="caret" />}
              </div>
              <div className="collect-foot">
                <div className="person">
                  <span className="person-avatar">S</span>
                  <div>
                    <strong>Sarah K.</strong>
                    <span>1 minute ago</span>
                  </div>
                </div>
                <span className={`demo-btn${sub >= 2 ? ' is-sent' : ''}`}>
                  {sub >= 2 ? (
                    <>
                      <Icon name="check" size={15} /> Sent
                    </>
                  ) : (
                    'Submit review'
                  )}
                </span>
              </div>
            </div>
            <div className="chip chip-tl">
              <span className="chip-dot" />
              Link shared
            </div>
            <div className={`chip chip-br${sub >= 2 ? ' is-visible' : ''}`}>
              <Icon name="checkCircle" size={15} />
              Review received
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="demo-panel" key="curate">
            <div className="dash">
              <div className="dash-head">
                <div>
                  <strong>Reviews</strong>
                  <span>Bloom &amp; Co. dashboard</span>
                </div>
                <span className="dash-count">3 new</span>
              </div>
              <div className="dash-row is-new">
                <span className="person-avatar">S</span>
                <div className="dash-main">
                  <div className="dash-name">
                    Sarah K.
                    <Stars size={12} />
                  </div>
                  <p className="dash-text">Fast, friendly, and flawless.</p>
                </div>
                <span className={`approve${sub >= 1 ? ' is-approved' : ''}`}>
                  {sub >= 1 ? (
                    <>
                      <Icon name="check" size={13} /> Approved
                    </>
                  ) : (
                    'Approve'
                  )}
                </span>
              </div>
              <div className="dash-row">
                <span className="person-avatar alt">M</span>
                <div className="dash-main">
                  <div className="dash-name">
                    Michael T.
                    <Stars size={12} />
                  </div>
                  <p className="dash-text">Best purchase I made this year.</p>
                </div>
                <span className="approve is-approved">
                  <Icon name="check" size={13} /> Approved
                </span>
              </div>
              <div className="dash-row">
                <span className="person-avatar alt2">A</span>
                <div className="dash-main">
                  <div className="dash-name">
                    Amina H.
                    <Stars size={12} />
                  </div>
                  <p className="dash-text">Really happy with everything.</p>
                </div>
                <span className="approve is-approved">
                  <Icon name="check" size={13} /> Approved
                </span>
              </div>
            </div>
            <div className="chip chip-tr">
              <Icon name="shield" size={15} />
              You stay in control
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="demo-panel" key="publish">
            <div className="site">
              <div className="site-bar">
                <i />
                <i />
                <i />
                <span className="site-url">bloomandco.com</span>
              </div>
              <div className="site-body">
                <div className="site-brand">
                  BLOOM &amp; CO.
                  <span className="site-nav-links">
                    <i>Shop</i>
                    <i>About</i>
                  </span>
                </div>
                <div className="site-hero">Made for slow mornings.</div>
                <div className="site-lines">
                  <i />
                  <i />
                </div>
                <div className={`pub-widget${sub >= 1 ? ' is-live' : ''}`}>
                  <div className="pub-top">
                    <Stars size={13} />
                    <span className="pub-verified">
                      <Icon name="checkCircle" size={12} /> Verified
                    </span>
                  </div>
                  <p>&ldquo;Fast, friendly, and flawless.&rdquo;</p>
                  <span className="pub-author">Sarah K.</span>
                </div>
                <span className={`live-chip${sub >= 1 ? ' is-visible' : ''}`}>
                  <span className="live-dot" /> Live on your site
                </span>
                <div className="powered">Powered by TrustDrop</div>
              </div>
            </div>
          </div>
        )}
      </div>
          </div>
        </div>
        <div className="demo-hint" aria-hidden="true">
          <span>Scroll to explore</span>
          <i />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Showcase (auto-advancing feature tabs)                            */
/* ------------------------------------------------------------------ */

function Showcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = usePrefersReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1081px)')
  const trackRef = useRef(null)
  const stickyRef = useRef(null)

  useEffect(() => {
    if (!isDesktop || reduced) return
    let frame = 0
    const update = () => {
      frame = 0
      const track = trackRef.current
      const sticky = stickyRef.current
      if (!track || !sticky) return
      const total = track.offsetHeight - sticky.offsetHeight
      if (total <= 0) return
      const scrolled = Math.min(
        Math.max(HOW_STICKY_TOP - track.getBoundingClientRect().top, 0),
        total
      )
      const step = Math.min(SHOWCASE.length - 1, Math.floor((scrolled / total) * SHOWCASE.length))
      setActive((current) => (current === step ? current : step))
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isDesktop, reduced])

  useEffect(() => {
    if (isDesktop || paused || reduced) return
    const t = setTimeout(() => setActive((a) => (a + 1) % SHOWCASE.length), 6500)
    return () => clearTimeout(t)
  }, [active, paused, reduced, isDesktop])

  const select = (index) => {
    setActive(index)
    if (!isDesktop || !trackRef.current || !stickyRef.current) return
    const track = trackRef.current
    const sticky = stickyRef.current
    const total = track.offsetHeight - sticky.offsetHeight
    const start = track.getBoundingClientRect().top + window.scrollY - HOW_STICKY_TOP
    window.scrollTo({
      top: start + total * ((index + 0.2) / SHOWCASE.length),
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  const item = SHOWCASE[active]

  return (
    <div className="how-track" ref={trackRef}>
      <div className="how-sticky" ref={stickyRef}>
        <div className="wrap">
          <div className="how-head reveal">
            <span className="eyebrow">How it works</span>
            <h2 className="h2">Easy testimonials ahead.</h2>
            <p className="sub">
              Collect, curate, and publish social proof without touching a spreadsheet. It all happens in one calm,
              tidy place.
            </p>
          </div>
          <div
            className="showcase"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="show-list">
        {SHOWCASE.map((s, i) => (
          <button
            key={s.title}
            type="button"
            className={`show-item${i === active ? ' is-active' : ''}`}
            onClick={() => select(i)}
            aria-expanded={i === active}
          >
            <span className="show-head">
              <span className="show-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="show-title">{s.title}</span>
              <Icon name="arrowUpRight" size={17} className="show-arrow" />
            </span>
            <span className="show-desc">{s.text}</span>
            <span className="show-meter" aria-hidden="true">
              <span />
            </span>
          </button>
        ))}
        <span className="show-hint" aria-hidden="true">
          Scroll to explore <i />
        </span>
      </div>

            <div className={`show-visual ${item.gradient}`}>
              <span className="visual-glow a" />
              <span className="visual-glow b" />
              <span className="show-badge" key={`badge-${active}`}>
                {String(active + 1).padStart(2, '0')} / {String(SHOWCASE.length).padStart(2, '0')}
              </span>
              <div className="mock-inner" key={item.title}>
          {active === 0 && (
            <div className="mock-card">
              <div className="mock-org">
                <span className="org-avatar">B</span>
                <div>
                  <strong>Bloom &amp; Co.</strong>
                  <span>invites you to share a review</span>
                </div>
                <span className="org-rating">
                  <Star size={12} /> 4.9
                </span>
              </div>
              <div className="mock-q">How was your experience?</div>
              <Stars size={20} animated />
              <div className="mock-field">&ldquo;The whole thing took me 20 seconds.&rdquo;</div>
              <div className="mock-btn">Submit review</div>
              <div className="mock-note">No account needed · 30 seconds</div>
            </div>
          )}

          {active === 1 && (
            <div className="mock-card">
              <div className="mock-head">
                <strong>Inbox</strong>
                <span className="mock-tag">3 new</span>
              </div>
              {[
                { n: 'Sarah K.', t: 'Fast, friendly, and flawless.', new: true },
                { n: 'Michael T.', t: 'Best purchase this year.' },
                { n: 'Amina H.', t: 'Really happy with everything.' },
              ].map((r) => (
                <div className="mock-row" key={r.n}>
                  <span className={`mini-avatar${r.new ? ' new' : ''}`}>{r.n[0]}</span>
                  <div className="mock-row-text">
                    <strong>{r.n}</strong>
                    <span>{r.t}</span>
                  </div>
                  <span className={`mini-pill${r.new ? ' is-pending' : ''}`}>
                    {r.new ? (
                      <>
                        <Icon name="check" size={12} /> Approved
                      </>
                    ) : (
                      'Approved'
                    )}
                  </span>
                </div>
              ))}
              <div className="mock-note">
                <Icon name="shield" size={13} /> Nothing goes live until you approve it
              </div>
            </div>
          )}

          {active === 2 && (
            <div className="mock-card">
              <div className="mock-head">
                <strong>Your embed</strong>
                <span className="mock-tag green">Live</span>
              </div>
              <code className="code-snip">
                <span className="tok">&lt;script</span> src=
                <span className="str">&quot;trustdrop.app/widget.js&quot;</span>
                <span className="tok">&gt;&lt;/script&gt;</span>
              </code>
              <div className="mini-widget">
                <Stars size={13} />
                <p>&ldquo;Fast, friendly, and flawless.&rdquo;</p>
                <span>Sarah K. · Verified review</span>
              </div>
              <div className="mock-note">
                <span className="live-dot" /> Updates automatically — forever
              </div>
            </div>
          )}

          {active === 3 && (
            <div className="mock-card">
              <div className="mock-head">
                <strong>Last 30 days</strong>
                <span className="mock-tag green">+38%</span>
              </div>
              <div className="bars" aria-hidden="true">
                {[34, 48, 42, 61, 70, 84, 96].map((h, i) => (
                  <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }} />
                ))}
              </div>
              <div className="mock-kpis">
                <div>
                  <strong>4.9</strong>
                  <span>avg rating</span>
                </div>
                <div>
                  <strong>92%</strong>
                  <span>response rate</span>
                </div>
                <div>
                  <strong>3×</strong>
                  <span>more proof</span>
                </div>
              </div>
            </div>
          )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Stories carousel                                                  */
/* ------------------------------------------------------------------ */

function Stories() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (paused || reduced) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % STORIES.length), 7000)
    return () => clearTimeout(t)
  }, [index, paused, reduced])

  const go = (dir) => setIndex((i) => (i + dir + STORIES.length) % STORIES.length)

  return (
    <div
      className="stories reveal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="story-panel">
        <span className="visual-glow a" />
        <span className="visual-glow b" />
        <div className="story-viewport">
          <div className="story-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {STORIES.map((s, i) => (
              <article className="story-slide" key={s.name} aria-hidden={i !== index}>
                <div className="story-left">
                  <span className="story-metric">{s.metric}</span>
                  <span className="story-metric-label">{s.metricLabel}</span>
                  <div className="story-person">
                    <span className="story-avatar">{s.name[0]}</span>
                    <div>
                      <strong>{s.name}</strong>
                      <span>{s.role}</span>
                    </div>
                  </div>
                </div>
                <div className="story-quote">
                  <span className="quote-glyph" aria-hidden="true">
                    &ldquo;
                  </span>
                  <p>{s.quote}</p>
                  <div className="story-stars">
                    <Stars size={15} />
                    <span>Verified review</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <div className="story-controls">
        <button type="button" className="round-btn" aria-label="Previous story" onClick={() => go(-1)}>
          <Icon name="chevronLeft" size={18} />
        </button>
        <div className="dots">
          {STORIES.map((s, i) => (
            <button
              type="button"
              key={s.name}
              className={`dot${i === index ? ' is-active' : ''}`}
              aria-label={`Go to story ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button type="button" className="round-btn" aria-label="Next story" onClick={() => go(1)}>
          <Icon name="chevronRight" size={18} />
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useInViewReveal()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setLoggedIn(true)
    })
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const primaryHref = loggedIn ? '/dashboard' : '/auth?mode=signup'
  const primaryLabel = loggedIn ? 'Go to dashboard' : 'Get started free'

  return (
    <main className="td-page">
      <style>{`
        .td-page {
          --bg: #FCFBF8;
          --ink: #071A31;
          --ink-soft: #33465C;
          --body: #5D6E82;
          --muted: #8391A2;
          --blue: #0069FF;
          --blue-dark: #0052CC;
          --blue-soft: #EAF2FF;
          --line: #E8E4DA;
          --line-soft: #F0EDE5;
          --white: #FFFFFF;
          --green: #0E9F6E;
          --green-soft: #E7F8EF;
          --lime: #D9F27A;
          --violet: #6B5CE7;
          --shadow-sm: 0 1px 2px rgba(7,26,49,.05), 0 8px 24px rgba(7,26,49,.05);
          --shadow-md: 0 18px 50px rgba(7,26,49,.10);
          --ease: cubic-bezier(.16,1,.3,1);
          position: relative;
          background: var(--bg);
          color: var(--ink);
          font-family: var(--font-body), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          overflow-x: clip;
          -webkit-font-smoothing: antialiased;
        }
        .td-page *, .td-page *::before, .td-page *::after { box-sizing: border-box; }
        .td-page h1, .td-page h2, .td-page h3, .td-page h4 {
          font-family: var(--font-display), var(--font-body), sans-serif;
          margin: 0;
          color: var(--ink);
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .td-page a { color: inherit; text-decoration: none; }
        .td-page button { font-family: inherit; }
        .td-page section { scroll-margin-top: 96px; }
        .td-page ::selection { background: rgba(0,105,255,.18); }
        .wrap { width: 100%; max-width: 1180px; margin: 0 auto; padding: 0 28px; }
        .brand { display: inline-flex; align-items: center; gap: 10px; }
        .brand-name {
          font-family: var(--font-display), sans-serif;
          font-weight: 800;
          font-size: 21px;
          letter-spacing: -0.04em;
          color: var(--ink);
        }
        .brand-name.is-light { color: #fff; }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid transparent;
          border-radius: 999px;
          padding: 13px 24px;
          font-size: 15px;
          font-weight: 600;
          line-height: 1;
          cursor: pointer;
          transition: transform .28s var(--ease), background .2s, box-shadow .28s, border-color .2s, color .2s;
          white-space: nowrap;
        }
        .btn svg { transition: transform .28s var(--ease); }
        .btn:hover svg { transform: translateX(3px); }
        .btn-primary {
          background: var(--blue);
          color: #fff;
          box-shadow: 0 10px 24px rgba(0,105,255,.24);
        }
        .btn-primary:hover { background: var(--blue-dark); transform: translateY(-2px); box-shadow: 0 14px 30px rgba(0,105,255,.3); }
        .btn-secondary {
          background: transparent;
          color: var(--ink);
          border-color: rgba(7,26,49,.16);
        }
        .btn-secondary:hover { background: #fff; border-color: rgba(7,26,49,.3); transform: translateY(-2px); }
        .btn-light {
          background: #fff;
          color: var(--ink);
          box-shadow: 0 12px 30px rgba(7,26,49,.18);
        }
        .btn-light:hover { transform: translateY(-2px); box-shadow: 0 18px 38px rgba(7,26,49,.22); }
        .btn-lime {
          background: var(--lime);
          color: var(--ink);
        }
        .btn-lime:hover { background: #E7FA9C; transform: translateY(-2px); box-shadow: 0 16px 34px rgba(217,242,122,.22); }
        .btn-sm { padding: 10px 18px; font-size: 14px; }
        .btn-lg { padding: 16px 30px; font-size: 16px; }
        .btn-white-outline {
          background: rgba(255,255,255,.1);
          border-color: rgba(255,255,255,.4);
          color: #fff;
          backdrop-filter: blur(8px);
        }
        .btn-white-outline:hover { background: rgba(255,255,255,.2); transform: translateY(-2px); }
        .btn:focus-visible, .nav-burger:focus-visible, .demo-tab:focus-visible,
        .demo-arrow:focus-visible, .show-item:focus-visible, .dot:focus-visible,
        .round-btn:focus-visible, .nav-links a:focus-visible, .nav-login:focus-visible {
          outline: 2px solid var(--blue);
          outline-offset: 3px;
        }

        /* Nav */
        .td-nav {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 60;
          background: rgba(252,251,248,.86);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid transparent;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .td-nav.is-scrolled { border-bottom-color: var(--line); box-shadow: 0 6px 24px rgba(7,26,49,.05); }
        .nav-inner { display: flex; align-items: center; gap: 28px; height: 74px; }
        .nav-brand { display: inline-flex; }
        .nav-links { display: flex; align-items: center; gap: 30px; margin-left: 18px; }
        .nav-links a {
          font-size: 14.5px;
          font-weight: 500;
          color: var(--ink-soft);
          transition: color .18s;
          position: relative;
        }
        .nav-links a::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -7px;
          height: 2px;
          border-radius: 2px;
          background: var(--blue);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .25s var(--ease);
        }
        .nav-links a:hover { color: var(--ink); }
        .nav-links a:hover::after { transform: scaleX(1); }
        .nav-actions { display: flex; align-items: center; gap: 18px; margin-left: auto; }
        .nav-login { font-size: 14.5px; font-weight: 500; color: var(--ink-soft); transition: color .18s; }
        .nav-login:hover { color: var(--ink); }
        .nav-burger {
          display: none;
          width: 40px; height: 40px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: #fff;
          color: var(--ink);
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .mobile-menu {
          border-top: 1px solid var(--line);
          background: var(--bg);
          padding: 12px 28px 22px;
          box-shadow: 0 20px 40px rgba(7,26,49,.08);
          animation: menuIn .28s var(--ease) both;
        }
        .mobile-menu a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 4px;
          font-size: 16px;
          font-weight: 500;
          color: var(--ink);
          border-bottom: 1px solid var(--line-soft);
        }
        .mobile-menu .mobile-actions { display: flex; gap: 10px; margin-top: 16px; }
        .mobile-menu .mobile-actions .btn { flex: 1; }

        /* Hero */
        .hero-section { padding: 102px 12px 0; }
        .hero-panel {
          position: relative;
          overflow: clip;
          border-radius: 32px;
          padding: 62px 24px 76px;
          background:
            radial-gradient(110% 90% at 8% 0%, #2C5BCB 0%, rgba(44,91,203,0) 58%),
            radial-gradient(90% 90% at 102% 4%, #8B6BEE 0%, rgba(139,107,238,0) 56%),
            radial-gradient(100% 90% at 88% 100%, #F49BC2 0%, rgba(244,155,194,0) 62%),
            radial-gradient(90% 80% at 22% 104%, #F9C79C 0%, rgba(249,199,156,0) 66%),
            linear-gradient(155deg, #3A62D2 0%, #7A64E2 44%, #DE9AD6 74%, #F7C9AC 100%);
          isolation: isolate;
        }
        .hero-panel::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(7,26,49,.16) 0%, rgba(7,26,49,0) 32%, rgba(7,26,49,0) 70%, rgba(7,26,49,.1) 100%);
          pointer-events: none;
          z-index: 0;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(62px);
          opacity: .6;
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 0;
          will-change: transform;
        }
        .blob-a { width: 520px; height: 520px; background: #5E9BFF; top: -140px; left: -80px; animation: driftA 26s ease-in-out infinite; }
        .blob-b { width: 460px; height: 460px; background: #C79BFF; top: 40px; right: -100px; animation: driftB 30s ease-in-out infinite; }
        .blob-c { width: 560px; height: 560px; background: #FFB3C9; bottom: -220px; right: 6%; animation: driftC 34s ease-in-out infinite; }
        .blob-d { width: 380px; height: 380px; background: #FFD6A3; bottom: -160px; left: 4%; animation: driftA 38s ease-in-out infinite reverse; }
        .hero-inner { position: relative; z-index: 1; max-width: 980px; margin: 0 auto; text-align: center; }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.28);
          background: rgba(255,255,255,.14);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          animation: fadeUp .9s var(--ease) .1s both;
        }
        .hero-badge .rating { color: #FFD66B; }
        .hero-badge .rating svg { width: 13px; height: 13px; }
        .badge-divider { width: 1px; height: 14px; background: rgba(255,255,255,.32); }
        .badge-soft { color: rgba(255,255,255,.8); }
        .td-page .hero-h1 {
          margin: 26px auto 0;
          font-size: clamp(44px, 6.6vw, 78px);
          font-weight: 600;
          line-height: 1.01;
          letter-spacing: -0.045em;
          color: #fff;
          text-wrap: balance;
        }
        .hero-h1 .line { display: block; overflow: hidden; padding-bottom: .09em; margin-bottom: -.05em; }
        .hero-h1 .line > span {
          display: block;
          transform: translateY(114%);
          animation: lineUp 1.05s var(--ease) both;
        }
        .hero-h1 .line:nth-child(2) > span { animation-delay: .12s; }
        .hero-h1 .mark { color: #EAFFA6; }
        .hero-sub {
          max-width: 620px;
          margin: 26px auto 0;
          color: rgba(255,255,255,.9);
          font-size: clamp(16px, 1.5vw, 18.5px);
          line-height: 1.65;
          animation: fadeUp .9s var(--ease) .42s both;
        }
        .hero-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
          animation: fadeUp .9s var(--ease) .52s both;
        }
        .hero-note {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          color: rgba(255,255,255,.72);
          font-size: 13.5px;
          animation: fadeUp .9s var(--ease) .6s both;
        }
        .hero-note svg { width: 15px; height: 15px; }
        .app-row {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin: 32px auto 0;
          animation: fadeUp .9s var(--ease) .7s both;
        }
        .app-tile {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,.94);
          border-radius: 13px;
          padding: 10px 15px;
          font-family: var(--font-display), sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--ink);
          box-shadow: 0 10px 22px rgba(10,26,60,.18);
          transition: transform .3s var(--ease), box-shadow .3s;
        }
        .app-tile:hover { transform: translateY(-4px); box-shadow: 0 16px 30px rgba(10,26,60,.24); }
        .app-tile i { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .app-caption { color: rgba(255,255,255,.62); font-size: 12.5px; margin-left: 6px; }
        .demo-stage { position: relative; }
        .demo-sticky { position: relative; }
        .demo-window {
          width: 100%;
          max-width: 880px;
          margin: 34px auto 0;
          transform-origin: 50% 50%;
          will-change: transform;
        }
        .demo-hint {
          display: none;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
          transition: opacity .4s var(--ease), transform .4s var(--ease);
          color: rgba(255,255,255,.78);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .demo-stage.is-last .demo-hint { opacity: 0; transform: translateY(6px); }
        .demo-hint i {
          width: 1px;
          height: 26px;
          background: linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,0));
          animation: hintLine 2.1s ease-in-out infinite;
        }
        .demo-card {
          position: relative;
          z-index: 2;
          width: 100%;
          margin: 0 auto;
          padding: 16px 16px 18px;
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 36px 90px rgba(8,22,52,.32), 0 2px 0 rgba(255,255,255,.6) inset;
          text-align: left;
          animation: fadeUp 1s var(--ease) .78s both;
        }
        .demo-rail { display: flex; align-items: center; gap: 12px; padding: 2px 4px 0; }
        .demo-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
        .demo-tab {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 0;
          background: transparent;
          color: #7C899A;
          font-size: 13.5px;
          font-weight: 600;
          padding: 9px 13px;
          border-radius: 999px;
          cursor: pointer;
          transition: background .2s, color .2s;
        }
        .demo-tab:hover { color: var(--ink); background: #F4F7FB; }
        .demo-tab.is-active { background: var(--blue-soft); color: var(--blue-dark); }
        .demo-arrows { display: flex; gap: 6px; margin-left: auto; }
        .demo-arrow {
          width: 30px; height: 30px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid #E9EEF5;
          background: #fff;
          color: #6C7A8C;
          cursor: pointer;
          transition: border-color .2s, color .2s, background .2s;
        }
        .demo-arrow:hover { border-color: #C9D6E6; color: var(--ink); background: #F8FAFD; }
        .demo-progress { display: flex; gap: 6px; padding: 12px 4px 4px; }
        .seg { flex: 1; height: 3px; border-radius: 999px; background: #EEF1F5; overflow: hidden; }
        .seg-bar { display: block; height: 100%; width: 0; background: var(--blue); border-radius: 999px; }
        .seg.is-active .seg-bar { animation: segFill 5.6s linear forwards; }
        .seg.is-done .seg-bar { width: 100%; }
        .demo-stage.is-scroll .seg.is-active .seg-bar { width: var(--demo-seg, 0%); animation: none; }
        @media (min-width: 1021px) {
          .demo-stage { height: calc(100vh + 120vh); }
          .demo-stage.is-scroll .demo-sticky {
            position: sticky;
            top: 112px;
            min-height: calc(100vh - 112px);
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .demo-stage.is-scroll .demo-window { margin-top: 0; }
          .demo-stage.is-scroll .demo-hint { display: flex; margin-top: auto; margin-bottom: 14px; }
        }
        .demo-body {
          position: relative;
          min-height: 392px;
          margin-top: 10px;
          border-radius: 16px;
          background:
            radial-gradient(80% 100% at 50% 0%, #F7FAFF 0%, #F3F6FB 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 34px 26px;
          overflow: hidden;
        }
        .demo-body::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(7,26,49,.06) 1px, transparent 1px);
          background-size: 22px 22px;
          opacity: .5;
          pointer-events: none;
        }
        .demo-eyebrow {
          position: absolute;
          top: 13px;
          left: 16px;
          z-index: 3;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: #93A0B0;
        }
        .demo-panel {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: panelIn .55s var(--ease) both;
        }
        .collect-shell {
          width: min(100%, 470px);
          background: #fff;
          border: 1px solid #E9EEF5;
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 18px 44px rgba(16,37,74,.1);
        }
        .collect-head, .mock-org { display: flex; align-items: center; gap: 10px; }
        .org-avatar {
          width: 36px; height: 36px;
          flex: 0 0 36px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: linear-gradient(140deg, #F3C9A8, #E49AB6);
          color: #6B2C3D;
          font-family: var(--font-display), sans-serif;
          font-weight: 800;
          font-size: 15px;
        }
        .org-meta { display: flex; flex-direction: column; line-height: 1.3; }
        .org-meta strong { font-size: 14px; font-weight: 700; color: var(--ink); }
        .org-meta span { font-size: 11.5px; color: #8B97A6; }
        .org-rating {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #FFF7E6;
          color: #A96A00;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 12px;
          font-weight: 700;
        }
        .org-rating svg { color: #F5B120; }
        .rating { display: inline-flex; align-items: center; gap: 2px; color: #F5B120; }
        .rating.is-animated span { display: inline-flex; animation: starPop .42s var(--ease) both; }
        .collect-q { font-size: 19px; font-weight: 700; margin: 16px 0 8px !important; letter-spacing: -0.02em; }
        .quote-box {
          margin-top: 14px;
          min-height: 62px;
          border: 1px solid #E9EEF5;
          background: #F8FAFD;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14.5px;
          color: var(--ink-soft);
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }
        .caret {
          display: inline-block;
          width: 2px;
          height: 17px;
          margin-left: 2px;
          background: var(--blue);
          animation: blink .9s steps(1) infinite;
        }
        .collect-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; }
        .person { display: flex; align-items: center; gap: 9px; }
        .person-avatar, .mini-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #EAF2FF;
          color: #0057D9;
          font-weight: 700;
          font-size: 13px;
          flex: 0 0 auto;
        }
        .mini-avatar { width: 30px; height: 30px; font-size: 12px; }
        .person div { display: flex; flex-direction: column; line-height: 1.35; }
        .person strong { font-size: 13px; color: var(--ink); }
        .person span { font-size: 11.5px; color: #8B97A6; }
        .demo-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--blue);
          color: #fff;
          border-radius: 10px;
          padding: 10px 15px;
          font-size: 13px;
          font-weight: 600;
          transition: transform .3s var(--ease), background .3s;
        }
        .demo-btn.is-sent { background: var(--green); transform: scale(1.02); animation: popIn .3s var(--ease) both; }
        .chip {
          position: absolute;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid #EBEFF5;
          border-radius: 999px;
          padding: 9px 15px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink-soft);
          box-shadow: 0 14px 34px rgba(10,26,60,.14);
          animation: floaty 5.5s ease-in-out infinite;
        }
        .chip-tl { top: 24px; left: 24px; }
        .chip-br { right: 18px; bottom: 18px; opacity: 0; transform: translateY(10px); transition: opacity .5s, transform .5s var(--ease); animation: none; }
        .chip-br.is-visible { opacity: 1; transform: none; }
        .chip-tr { top: 34px; right: 44px; animation-delay: -1.6s; }
        .chip-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 0 rgba(14,159,110,.5); animation: pulseDot 2s infinite; }
        .chip svg { color: var(--green); }

        /* Dashboard mock */
        .dash {
          width: min(100%, 530px);
          background: #fff;
          border: 1px solid #E9EEF5;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 18px 44px rgba(16,37,74,.1);
        }
        .dash-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px 14px; border-bottom: 1px solid #EFF3F8; }
        .dash-head div { display: flex; flex-direction: column; }
        .dash-head strong { font-size: 15px; font-family: var(--font-display), sans-serif; }
        .dash-head span { font-size: 11.5px; color: #8B97A6; }
        .dash-count { background: #EAF2FF; color: var(--blue-dark) !important; font-weight: 700; border-radius: 999px; padding: 4px 10px; font-size: 11.5px !important; }
        .dash-row { display: flex; align-items: center; gap: 12px; padding: 13px 18px; border-bottom: 1px solid #F3F6FA; }
        .dash-row:last-child { border-bottom: 0; }
        .dash-row.is-new { background: #FAFCFF; }
        .dash-main { flex: 1; min-width: 0; }
        .dash-name { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: var(--ink); }
        .dash-name .rating svg { width: 11px; height: 11px; }
        .dash-text { font-size: 12.5px; color: #7C899A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
        .person-avatar.alt { background: #F2EEFF; color: #6B5CE7; }
        .person-avatar.alt2 { background: #E7F8EF; color: #0E9F6E; }
        .approve {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border-radius: 999px;
          padding: 6px 11px;
          font-size: 11.5px;
          font-weight: 600;
          background: var(--blue-soft);
          color: var(--blue-dark);
          white-space: nowrap;
          transition: background .45s, color .45s, transform .45s var(--ease);
        }
        .approve.is-approved { background: var(--green-soft); color: var(--green); }
        .dash-row.is-new .approve.is-approved { animation: popIn .4s var(--ease) both; }

        /* Site mock */
        .site { width: min(100%, 540px); background: #fff; border: 1px solid #E9EEF5; border-radius: 18px; overflow: hidden; box-shadow: 0 18px 44px rgba(16,37,74,.1); }
        .site-bar { display: flex; align-items: center; gap: 5px; padding: 9px 14px; background: #F7F9FC; border-bottom: 1px solid #EDF1F7; }
        .site-bar i { width: 8px; height: 8px; border-radius: 50%; background: #DEE5EE; }
        .site-url { margin-left: 10px; background: #fff; border: 1px solid #E9EEF5; border-radius: 6px; font-size: 10.5px; color: #94A0AF; padding: 3px 10px; }
        .site-body { position: relative; padding: 18px 24px 52px; }
        .site-brand { display: flex; align-items: center; justify-content: space-between; font-family: var(--font-display), sans-serif; font-size: 10px; font-weight: 800; letter-spacing: .18em; color: var(--ink); }
        .site-nav-links { display: flex; gap: 14px; font-family: var(--font-body), sans-serif; font-style: normal; letter-spacing: 0; font-weight: 500; font-size: 10.5px; color: #94A0AF; }
        .site-nav-links i { font-style: normal; }
        .site-hero { font-family: var(--font-display), sans-serif; font-size: 26px; font-weight: 700; letter-spacing: -0.04em; margin-top: 16px; color: var(--ink); }
        .site-lines { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
        .site-lines i { display: block; height: 6px; border-radius: 999px; background: #EEF2F7; }
        .site-lines i:last-child { width: 62%; }
        .pub-widget {
          margin-top: 14px;
          border: 1px solid #E9EEF5;
          border-radius: 12px;
          padding: 13px 15px;
          background: #fff;
          box-shadow: 0 12px 28px rgba(16,37,74,.08);
          opacity: .3;
          transform: translateY(12px) scale(.985);
          transition: opacity .6s var(--ease), transform .6s var(--ease);
        }
        .pub-widget.is-live { opacity: 1; transform: none; }
        .pub-top { display: flex; align-items: center; justify-content: space-between; }
        .pub-verified { display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 600; color: var(--green); }
        .pub-verified svg { width: 12px; height: 12px; }
        .pub-widget p { font-size: 13.5px; color: var(--ink-soft); margin: 8px 0 5px; }
        .pub-author { font-size: 11px; color: #94A0AF; }
        .live-chip {
          position: absolute;
          right: 18px;
          bottom: 18px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--green-soft);
          color: var(--green);
          border-radius: 999px;
          padding: 6px 11px;
          font-size: 11px;
          font-weight: 600;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity .5s, transform .5s var(--ease);
        }
        .live-chip.is-visible { opacity: 1; transform: none; }
        .live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulseDot 2.2s infinite; }
        .powered { position: absolute; left: 24px; bottom: 20px; font-size: 9.5px; color: #AEB8C4; }

        /* Trust marquee */
        .trust { padding: 34px 0 8px; }
        .trust-inner { display: flex; align-items: center; gap: 30px; }
        .trust-label { flex: 0 0 auto; font-size: 12.5px; font-weight: 600; color: #93A0B0; max-width: 180px; line-height: 1.45; }
        .marquee { position: relative; flex: 1; overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
        .marquee-track { display: flex; width: max-content; animation: marquee 32s linear infinite; }
        .marquee:hover .marquee-track { animation-play-state: paused; }
        .marquee-group { display: flex; align-items: center; gap: 38px; padding-right: 38px; }
        .marquee-item { display: inline-flex; align-items: center; gap: 9px; white-space: nowrap; font-family: var(--font-display), sans-serif; font-size: 14px; font-weight: 700; letter-spacing: -0.02em; color: #A9B2BE; }
        .marquee-item i { width: 5px; height: 5px; border-radius: 50%; background: #D8D2C6; }

        /* Sections */
        .section { padding: 104px 0 0; }
        .sec-head { max-width: 720px; }
        .sec-head.center { margin: 0 auto; text-align: center; }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--blue);
          margin-bottom: 16px;
        }
        .eyebrow::before { content: ''; width: 22px; height: 1px; background: currentColor; opacity: .5; }
        .h2 { font-size: clamp(32px, 4.2vw, 52px); font-weight: 700; letter-spacing: -0.04em; line-height: 1.05; }
        .sub { margin-top: 22px; font-size: 17px; line-height: 1.65; color: var(--body); max-width: 600px; }
        .sec-head.center .sub { margin-left: auto; margin-right: auto; }

        /* Capability cards */
        .caps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 44px; }
        .cap-card {
          position: relative;
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 22px 22px 20px;
          transition: transform .35s var(--ease), box-shadow .35s var(--ease), border-color .25s;
          overflow: hidden;
        }
        .cap-card::after {
          content: '';
          position: absolute;
          inset: auto 0 0 0;
          height: 3px;
          background: linear-gradient(90deg, #6AA8FF, #A48CF9, #F4A9C8);
          opacity: 0;
          transition: opacity .3s;
        }
        .cap-card:hover { transform: translateY(-6px); box-shadow: 0 22px 48px rgba(7,26,49,.09); border-color: transparent; }
        .cap-card:hover::after { opacity: 1; }
        .cap-icon { width: 44px; height: 44px; border-radius: 13px; display: grid; place-items: center; margin-bottom: 44px; transition: transform .35s var(--ease), box-shadow .35s; }
        .cap-card:hover .cap-icon { transform: translateY(-3px) rotate(-4deg); box-shadow: 0 10px 22px rgba(7,26,49,.10); }
        .tint-blue { background: #EAF2FF; color: #0069FF; }
        .tint-violet { background: #F1EDFF; color: #6B5CE7; }
        .tint-mint { background: #E7F8EF; color: #0E9F6E; }
        .tint-peach { background: #FFF1E7; color: #D9772B; }
        .cap-label { font-size: 11px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: #9AA6B5; }
        .cap-card h3 { font-size: 19px; font-weight: 700; letter-spacing: -0.025em; margin-top: 6px; }
        .cap-card p { font-size: 13.5px; line-height: 1.6; color: var(--body); margin-top: 8px; }
        .cap-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 18px; font-size: 13px; font-weight: 600; color: var(--blue); }
        .cap-link svg { transition: transform .3s var(--ease); }
        .cap-card:hover .cap-link svg { transform: translateX(3px); }

        /* Showcase */
        .how-track { position: relative; height: 300vh; margin-top: 44px; }
        .how-sticky { position: sticky; top: 96px; min-height: calc(100vh - 116px); display: flex; align-items: flex-start; padding-top: 26px; }
        .how-sticky > .wrap { width: 100%; }
        .how-head { max-width: 680px; margin: 0 auto 34px; text-align: center; }
        .how-head .h2 { font-size: clamp(30px, 3.5vw, 44px); }
        .how-head .sub { margin-top: 14px; font-size: 15.5px; }
        .showcase { display: grid; grid-template-columns: .92fr 1.08fr; gap: 56px; align-items: center; }
        .show-list { display: flex; flex-direction: column; }
        .show-item {
          display: block;
          width: 100%;
          text-align: left;
          border: 0;
          border-top: 1px solid var(--line);
          background: none;
          padding: 20px 0 18px;
          cursor: pointer;
          opacity: .48;
          transition: opacity .35s;
        }
        .show-item:last-child { border-bottom: 1px solid var(--line); }
        .show-item.is-active, .show-item:hover { opacity: 1; }
        .show-head { display: flex; align-items: center; gap: 12px; }
        .show-num {
          width: 26px; height: 26px;
          flex: 0 0 26px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 10.5px;
          font-weight: 700;
          background: #F0EDE6;
          color: #8C8477;
          transition: background .3s, color .3s;
        }
        .show-item.is-active .show-num { background: var(--blue); color: #fff; }
        .show-title { font-family: var(--font-display), sans-serif; font-size: 19px; font-weight: 600; letter-spacing: -0.025em; color: var(--ink); }
        .show-arrow { margin-left: auto; color: #AEB8C4; opacity: 0; transform: translate(-4px, 4px); transition: opacity .3s, transform .3s; }
        .show-item.is-active .show-arrow { opacity: 1; transform: none; color: var(--blue); }
        .show-desc {
          display: block;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          margin-left: 38px;
          color: var(--body);
          font-size: 14px;
          line-height: 1.6;
          transition: max-height .5s var(--ease), opacity .35s, margin-top .35s;
        }
        .show-item.is-active .show-desc { max-height: 110px; opacity: 1; margin-top: 8px; }
        .show-meter { display: block; height: 2px; border-radius: 999px; background: #EAE6DD; margin: 16px 0 0 38px; overflow: hidden; opacity: 0; transition: opacity .3s; }
        .show-item.is-active .show-meter { opacity: 1; }
        .show-meter span { display: block; height: 100%; width: 0; background: linear-gradient(90deg, var(--blue), #8B6BEE); border-radius: 999px; transition: width .55s var(--ease); }
        .show-item.is-active .show-meter span { width: 100%; }

        .show-visual {
          position: relative;
          min-height: 458px;
          border-radius: 26px;
          padding: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
        }
        .g-violet { background: linear-gradient(150deg, #6D7EEA 0%, #A18BF2 52%, #F1B0CC 100%); }
        .g-peach { background: linear-gradient(150deg, #F5A96B 0%, #F593AE 55%, #BE9BF2 100%); }
        .g-mint { background: linear-gradient(150deg, #65D2B4 0%, #86C8F4 52%, #A99BF2 100%); }
        .g-blue { background: linear-gradient(150deg, #4E7FE8 0%, #8A8CF4 52%, #F0AFC8 100%); }
        .visual-glow { position: absolute; border-radius: 50%; filter: blur(50px); opacity: .55; mix-blend-mode: screen; pointer-events: none; z-index: 0; }
        .visual-glow.a { width: 300px; height: 300px; background: #FFE5B8; top: -90px; left: -60px; animation: driftA 20s ease-in-out infinite; }
        .visual-glow.b { width: 260px; height: 260px; background: #D6C6FF; bottom: -80px; right: -50px; animation: driftB 24s ease-in-out infinite; }
        .mock-inner { position: relative; z-index: 1; width: 100%; max-width: 405px; animation: panelIn .55s var(--ease) both; }
        .mock-card {
          width: 100%;
          background: #fff;
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 26px 60px rgba(18,24,68,.22);
        }
        .mock-org { display: flex; align-items: center; gap: 9px; }
        .mock-org div { display: flex; flex-direction: column; line-height: 1.3; }
        .mock-org strong { font-size: 12.5px; color: var(--ink); }
        .mock-org span { font-size: 10.5px; color: #8B97A6; }
        .mock-q { font-family: var(--font-display), sans-serif; font-size: 16px; font-weight: 700; margin: 15px 0 7px; letter-spacing: -0.02em; }
        .mock-field { margin-top: 12px; border: 1px solid #E9EEF5; background: #F8FAFD; border-radius: 10px; padding: 11px 12px; font-size: 12.5px; color: var(--ink-soft); }
        .mock-btn { margin-top: 12px; text-align: center; background: var(--blue); color: #fff; border-radius: 9px; padding: 9px; font-size: 12.5px; font-weight: 600; }
        .mock-note { display: flex; align-items: center; gap: 6px; margin-top: 12px; font-size: 10.5px; color: #94A0AF; }
        .mock-note svg { width: 13px; height: 13px; }
        .mock-note.green, .mock-note .live-dot + * { color: var(--green); }
        .mock-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
        .mock-head strong { font-family: var(--font-display), sans-serif; font-size: 14px; }
        .mock-tag { background: var(--blue-soft); color: var(--blue-dark); border-radius: 999px; padding: 3px 9px; font-size: 10.5px; font-weight: 700; }
        .mock-tag.green { background: var(--green-soft); color: var(--green); }
        .mock-row { display: flex; align-items: center; gap: 9px; padding: 10px 0; border-bottom: 1px solid #F2F5F9; }
        .mock-row-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .mock-row-text strong { font-size: 11.5px; color: var(--ink); }
        .mock-row-text span { font-size: 10.5px; color: #8B97A6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mini-avatar.new { background: var(--green-soft); color: var(--green); }
        .mini-pill { background: var(--green-soft); color: var(--green); border-radius: 999px; padding: 3px 8px; font-size: 9.5px; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; }
        .mini-pill svg { width: 11px; height: 11px; }
        .mini-pill.is-pending { background: var(--blue-soft); color: var(--blue-dark); animation: pillFlip 1.4s var(--ease) infinite alternate; }
        .code-snip {
          display: block;
          background: #0B1B33;
          color: #B7C7DC;
          border-radius: 10px;
          padding: 12px 14px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10.5px;
          line-height: 1.6;
          overflow-x: auto;
          white-space: nowrap;
        }
        .code-snip .tok { color: #7FD8FF; }
        .code-snip .str { color: #D9F27A; }
        .mini-widget { margin-top: 12px; border: 1px solid #E9EEF5; border-radius: 11px; padding: 12px 13px; background: #fff; box-shadow: 0 8px 20px rgba(16,37,74,.06); }
        .mini-widget p { font-size: 12.5px; color: var(--ink-soft); margin: 6px 0 4px; }
        .mini-widget span { font-size: 10px; color: #94A0AF; }
        .bars { display: flex; align-items: flex-end; gap: 7px; height: 118px; margin: 16px 0 18px; padding-bottom: 1px; border-bottom: 1px solid #EFF2F7; }
        .bars span {
          flex: 1;
          border-radius: 6px 6px 2px 2px;
          background: linear-gradient(180deg, #7FB2FF, #0069FF);
          transform-origin: bottom;
          animation: growBar .8s var(--ease) both;
        }
        .bars span:nth-child(6) { background: linear-gradient(180deg, #A993FF, #6B5CE7); }
        .mock-kpis { display: flex; gap: 18px; }
        .mock-kpis div { display: flex; flex-direction: column; }
        .mock-kpis strong { font-family: var(--font-display), sans-serif; font-size: 17px; letter-spacing: -0.03em; }
        .mock-kpis span { font-size: 10px; color: #94A0AF; }

        /* Stats */
        .stats-section { padding-top: 104px; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .stat { padding: 34px 26px; border-left: 1px solid var(--line); }
        .stat:first-child { border-left: 0; padding-left: 0; }
        .stat-num {
          display: flex;
          align-items: baseline;
          gap: 3px;
          font-family: var(--font-display), sans-serif;
          font-size: clamp(38px, 4vw, 52px);
          font-weight: 700;
          letter-spacing: -0.05em;
          color: var(--ink);
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .stat-num .star { width: .62em; height: .62em; color: #F5B120; align-self: center; }
        .stat-label { display: block; margin-top: 8px; font-size: 13px; color: var(--body); }

        /* Stories */
        .stories { max-width: 1020px; margin: 48px auto 0; }
        .stories:hover .story-quote { transform: translateY(-3px); }
        .story-panel { position: relative; border-radius: 28px; overflow: hidden; background: linear-gradient(135deg, #F0E9FF 0%, #FBE7EF 48%, #FFEFDF 100%); }
        .story-panel .visual-glow.a { background: #E9C9FF; top: -80px; right: 10%; left: auto; }
        .story-panel .visual-glow.b { background: #FFD9A8; bottom: -100px; left: 6%; right: auto; }
        .story-viewport { overflow: hidden; }
        .story-track { display: flex; transition: transform .85s var(--ease); }
        .story-slide {
          min-width: 100%;
          display: grid;
          grid-template-columns: .72fr 1.28fr;
          gap: 48px;
          padding: 52px 56px;
          align-items: center;
        }
        .story-left { position: relative; z-index: 1; }
        .story-metric {
          display: block;
          font-family: var(--font-display), sans-serif;
          font-size: clamp(52px, 6vw, 76px);
          font-weight: 700;
          letter-spacing: -0.055em;
          line-height: 1;
          background: linear-gradient(120deg, #16335A, #4C3FA8 70%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .story-metric-label { display: block; margin-top: 10px; font-size: 13.5px; font-weight: 600; color: #5C5A7C; }
        .story-person { display: flex; align-items: center; gap: 11px; margin-top: 30px; }
        .story-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #fff;
          color: var(--ink);
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 6px 16px rgba(60,40,90,.14);
        }
        .story-person div { display: flex; flex-direction: column; line-height: 1.35; }
        .story-person strong { font-size: 13px; color: var(--ink); }
        .story-person span { font-size: 11.5px; color: #6E6A88; }
        .story-quote { position: relative; z-index: 1; transition: transform .4s var(--ease); background: rgba(255,255,255,.82); backdrop-filter: blur(8px); border-radius: 20px; padding: 30px 32px; box-shadow: 0 18px 44px rgba(60,40,90,.09); }
        .quote-glyph {
          display: block;
          font-family: var(--font-display), serif;
          font-size: 58px;
          line-height: .7;
          color: #C9B8F5;
          height: 22px;
        }
        .story-quote p { font-size: clamp(17px, 1.9vw, 21px); line-height: 1.55; letter-spacing: -0.015em; color: var(--ink); margin-top: 8px; }
        .story-stars { display: flex; align-items: center; gap: 9px; margin-top: 18px; font-size: 11.5px; font-weight: 600; color: #6E6A88; }
        .story-controls { display: flex; align-items: center; justify-content: center; gap: 18px; margin-top: 22px; }
        .round-btn {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1px solid var(--line);
          background: #fff;
          color: var(--ink-soft);
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: border-color .2s, transform .2s var(--ease), color .2s;
        }
        .round-btn:hover { border-color: #CFC8BA; transform: translateY(-2px); color: var(--ink); }
        .dots { display: flex; align-items: center; gap: 7px; }
        .dot {
          width: 8px; height: 8px;
          border-radius: 999px;
          border: 0;
          background: #DDD7CB;
          cursor: pointer;
          padding: 0;
          transition: width .35s var(--ease), background .25s;
        }
        .dot.is-active { width: 26px; background: var(--blue); }

        /* Pricing */
        .price-card {
          display: grid;
          grid-template-columns: 1.02fr 1fr;
          max-width: 940px;
          margin: 46px auto 0;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 26px 70px rgba(7,26,49,.07);
        }
        .price-left { padding: 44px 44px 40px; background: linear-gradient(165deg, #F3F8FF 0%, #EEF4FF 52%, #F8F2FF 100%); border-right: 1px solid var(--line-soft); }
        .price-badge { display: inline-flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #DCE7F7; border-radius: 999px; padding: 6px 12px; font-size: 11.5px; font-weight: 700; color: var(--blue-dark); }
        .price-amount { display: flex; align-items: baseline; margin-top: 24px; font-family: var(--font-display), sans-serif; font-weight: 700; color: var(--ink); letter-spacing: -0.05em; }
        .price-amount .cur { font-size: 26px; align-self: flex-start; margin-top: 9px; margin-right: 3px; }
        .price-amount { font-size: 68px; line-height: 1; }
        .price-amount .per { font-family: var(--font-body), sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0; color: var(--body); margin-left: 6px; }
        .price-note { margin-top: 14px; font-size: 14px; line-height: 1.6; color: var(--body); max-width: 330px; }
        .price-left .btn { margin-top: 24px; width: 100%; }
        .price-fine { display: flex; align-items: center; gap: 6px; justify-content: center; margin-top: 12px; font-size: 12px; color: #7C899A; }
        .price-fine svg { width: 14px; height: 14px; color: var(--green); }
        .price-right { padding: 44px 40px 40px; }
        .price-list-title { font-family: var(--font-display), sans-serif; font-size: 13px; font-weight: 700; letter-spacing: .02em; color: var(--ink); }
        .checks { list-style: none; margin: 16px 0 0; padding: 0; }
        .checks li { display: flex; align-items: center; gap: 10px; padding: 9px 0; font-size: 14px; color: var(--ink-soft); border-bottom: 1px solid var(--line-soft); }
        .checks li:last-child { border-bottom: 0; }
        .checks .tick { width: 20px; height: 20px; flex: 0 0 20px; border-radius: 50%; background: var(--green-soft); color: var(--green); display: grid; place-items: center; }
        .checks .tick svg { width: 12px; height: 12px; }
        .price-guarantee { display: flex; align-items: center; gap: 10px; margin-top: 20px; padding: 12px 14px; border-radius: 12px; background: #FAF8F2; border: 1px solid var(--line-soft); font-size: 12px; color: var(--body); }
        .price-guarantee svg { width: 16px; height: 16px; color: var(--green); flex: 0 0 auto; }

        /* Final CTA + footer */
        .final-wrap { padding: 104px 12px 12px; }
        .final-block { position: relative; overflow: hidden; border-radius: 32px; background: #071A31; color: #fff; }
        .cta { position: relative; padding: 100px 24px 84px; text-align: center; overflow: hidden; }
        .cta::before {
          content: '';
          position: absolute;
          inset: -30% -10% auto;
          height: 620px;
          background:
            radial-gradient(45% 55% at 30% 30%, rgba(0,105,255,.35), transparent 70%),
            radial-gradient(40% 50% at 72% 22%, rgba(120,90,230,.28), transparent 70%),
            radial-gradient(35% 45% at 52% 60%, rgba(217,242,122,.12), transparent 70%);
          pointer-events: none;
        }
        .cta-inner { position: relative; z-index: 2; max-width: 760px; margin: 0 auto; }
        .cta-eyebrow { display: inline-block; font-size: 11.5px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.55); margin-bottom: 20px; }
        .cta h2 { color: #fff; font-size: clamp(34px, 5vw, 58px); font-weight: 600; letter-spacing: -0.045em; line-height: 1.06; }
        .cta h2 em { font-style: normal; color: var(--lime); }
        .cta p { color: rgba(255,255,255,.66); font-size: 17px; line-height: 1.65; max-width: 520px; margin: 20px auto 0; }
        .cta .btn { margin-top: 32px; }
        .cta small { display: block; margin-top: 16px; font-size: 12.5px; color: rgba(255,255,255,.46); }
        .float-pill {
          position: absolute;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.16);
          background: rgba(255,255,255,.07);
          backdrop-filter: blur(8px);
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,.82);
          animation: floaty 7s ease-in-out infinite;
          white-space: nowrap;
        }
        .float-pill svg { color: var(--lime); }
        .float-pill.p1 { top: 19%; left: 7%; }
        .float-pill.p2 { top: 30%; right: 6%; animation-delay: -2.2s; }
        .float-pill.p3 { bottom: 22%; left: 12%; animation-delay: -4s; }
        .float-pill.p4 { bottom: 16%; right: 12%; animation-delay: -1s; }
        .float-pill .stars-mini { display: inline-flex; gap: 1px; color: #FFD66B; }
        .footer { position: relative; z-index: 2; padding: 10px 0 0; }
        .footer::before { content: ''; display: block; height: 1px; background: rgba(255,255,255,.11); margin: 0 44px; }
        .foot-top { display: flex; justify-content: space-between; gap: 60px; padding-top: 46px; padding-bottom: 40px; }
        .foot-brand { max-width: 320px; }
        .foot-brand p { margin-top: 16px; font-size: 13.5px; line-height: 1.65; color: rgba(255,255,255,.5); }
        .foot-made { display: inline-flex; align-items: center; gap: 7px; margin-top: 18px; font-size: 12px; color: rgba(255,255,255,.42); }
        .foot-made .live-dot { background: var(--lime); box-shadow: none; animation: none; }
        .foot-cols { display: flex; gap: 72px; }
        .foot-col h4 { font-family: var(--font-body), sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.4); margin: 0 0 14px; }
        .foot-col a { display: block; font-size: 13.5px; color: rgba(255,255,255,.72); padding: 5px 0; transition: color .2s; }
        .foot-col a:hover { color: #fff; }
        .foot-bottom { display: flex; justify-content: space-between; gap: 20px; align-items: center; padding-top: 22px; padding-bottom: 30px; border-top: 1px solid rgba(255,255,255,.09); font-size: 12px; color: rgba(255,255,255,.4); }
        .foot-bottom a { color: rgba(255,255,255,.62); }
        .foot-bottom a:hover { color: #fff; }

        /* Reveal */
        .reveal { opacity: 0; transform: translateY(26px); transition: opacity .85s var(--ease), transform .85s var(--ease); transition-delay: var(--d, 0ms); }
        .reveal.is-in { opacity: 1; transform: none; }

        .show-hint {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin: 20px 0 0 38px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #9AA6B5;
        }
        .show-hint i {
          width: 22px;
          height: 22px;
          border: 1px solid var(--line);
          border-radius: 50%;
          position: relative;
        }
        .show-hint i::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 6px;
          width: 5px;
          height: 5px;
          border-right: 1.5px solid #8B97A6;
          border-bottom: 1.5px solid #8B97A6;
          transform: translateX(-50%) rotate(45deg);
          animation: hintBounce 1.8s ease-in-out infinite;
        }
        .show-badge {
          position: absolute;
          z-index: 3;
          top: 18px;
          left: 18px;
          padding: 5px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.42);
          background: rgba(255,255,255,.24);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
          animation: popIn .45s var(--ease) both;
        }

        /* Keyframes */
        @keyframes lineUp { to { transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        @keyframes hintBounce { 0%, 100% { transform: translateX(-50%) translateY(0) rotate(45deg); } 50% { transform: translateX(-50%) translateY(4px) rotate(45deg); } }
        @keyframes menuIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @keyframes panelIn { from { opacity: 0; transform: translateY(16px) scale(.985); } to { opacity: 1; transform: none; } }
        @keyframes segFill { from { width: 0; } to { width: 100%; } }
        @keyframes floaty { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-11px); } }
        @keyframes driftA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(140px, -70px) scale(1.12); }
          66% { transform: translate(-90px, 60px) scale(1.05); }
        }
        @keyframes driftB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-120px, 90px) scale(1.15); }
          75% { transform: translate(70px, -60px) scale(1.05); }
        }
        @keyframes driftC {
          0%, 100% { transform: translate(0, 0) scale(1); }
          35% { transform: translate(-110px, -80px) scale(1.1); }
          70% { transform: translate(90px, 70px) scale(1.16); }
        }
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes starPop { 0% { opacity: 0; transform: scale(.4) rotate(-16deg); } 100% { opacity: 1; transform: none; } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(.9); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes marquee { to { transform: translateX(-50%); } }
        @keyframes pulseDot { 0% { box-shadow: 0 0 0 0 rgba(14,159,110,.45); } 70% { box-shadow: 0 0 0 7px rgba(14,159,110,0); } 100% { box-shadow: 0 0 0 0 rgba(14,159,110,0); } }
        @keyframes hintLine { 0%, 100% { transform: scaleY(.35); opacity: .45; } 50% { transform: scaleY(1); opacity: 1; } }
        @keyframes growBar { from { transform: scaleY(.06); } to { transform: scaleY(1); } }
        @keyframes pillFlip { from { background: var(--blue-soft); color: var(--blue-dark); } to { background: var(--green-soft); color: var(--green); } }

        /* Responsive */
        @media (max-width: 1020px) {
          .demo-stage { height: auto; }
          .demo-sticky { position: static; }
          .demo-window { transform: none !important; }
          .demo-hint { display: none !important; }
        }
        @media (max-width: 1080px) {
          .how-track { height: auto; margin-top: 0; }
          .how-sticky { position: static; min-height: 0; display: block; }
          .how-head { margin-bottom: 0; }
          .showcase { margin-top: 30px; }
          .show-hint { display: none; }
          .caps { grid-template-columns: repeat(2, 1fr); }
          .showcase { grid-template-columns: 1fr; gap: 34px; }
          .show-visual { order: -1; min-height: 420px; }
          .price-card { max-width: 720px; }
          .price-left, .price-right { padding: 36px 32px; }
          .story-slide { padding: 44px 40px; gap: 32px; }
        }
        @media (max-width: 900px) {
          .nav-links, .nav-login { display: none; }
          .nav-burger { display: inline-flex; }
          .hero-panel { padding: 56px 18px 64px; border-radius: 26px; }
          .hero-h1 { font-size: clamp(40px, 8.2vw, 60px); }
          .demo-window { max-width: 700px; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .stat { padding: 28px 22px; }
          .stat:nth-child(3) { border-left: 0; padding-left: 0; }
          .stat:nth-child(-n + 2) { border-bottom: 1px solid var(--line); }
          .story-slide { grid-template-columns: 1fr; gap: 26px; }
          .story-person { margin-top: 20px; }
          .float-pill.p1 { left: 3%; }
          .float-pill.p2 { right: 3%; }
          .foot-top { flex-direction: column; gap: 38px; }
          .foot-cols { gap: 52px; }
        }
        @media (max-width: 720px) {
          .wrap { padding: 0 20px; }
          .hero-section { padding: 92px 8px 0; }
          .hero-panel { padding: 46px 14px 46px; border-radius: 22px; }
          .hero-badge { font-size: 11.5px; padding: 7px 12px; gap: 7px; }
          .badge-soft, .badge-divider { display: none; }
          .hero-h1 { margin-top: 20px; font-size: clamp(36px, 10.6vw, 52px); }
          .hero-sub { font-size: 15.5px; margin-top: 22px; }
          .hero-actions { gap: 9px; margin-top: 24px; }
          .hero-actions .btn { padding: 13px 20px; font-size: 14.5px; }
          .app-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; margin: 26px auto 0; max-width: 300px; }
          .app-tile { padding: 8px 11px; font-size: 11.5px; justify-content: center; }
          .app-caption { display: none; }
          .demo-window { margin-top: 26px; }
          .demo-card { padding: 12px 12px 14px; border-radius: 18px; }
          .demo-tabs { gap: 2px; }
          .demo-tab { font-size: 12px; padding: 8px 10px; gap: 5px; }
          .demo-tab svg { width: 14px; height: 14px; }
          .demo-body { min-height: 354px; padding: 32px 12px 22px; }
          .demo-eyebrow { top: 10px; left: 12px; font-size: 9.5px; }
          .collect-shell { padding: 16px; }
          .chip { display: none; }
          .dash, .site { width: 100%; }
          .dash-head { padding: 13px 14px 11px; }
          .dash-row { padding: 11px 14px; gap: 9px; }
          .approve { padding: 5px 8px; font-size: 10.5px; }
          .site-body { padding: 14px 16px 46px; }
          .site-hero { font-size: 21px; }
          .trust-inner { flex-direction: column; gap: 16px; align-items: flex-start; }
          .trust-label { max-width: none; }
          .marquee { width: 100%; }
          .section { padding-top: 76px; }
          .h2 { font-size: clamp(29px, 8vw, 38px); }
          .sub { font-size: 15.5px; margin-top: 14px; }
          .caps { grid-template-columns: 1fr; gap: 10px; margin-top: 30px; }
          .cap-card { padding: 20px; }
          .cap-icon { margin-bottom: 28px; }
          .showcase { margin-top: 34px; gap: 26px; }
          .show-visual { min-height: 370px; padding: 22px 16px; border-radius: 22px; }
          .mock-inner { max-width: 100%; }
          .show-item { padding: 17px 0 15px; }
          .show-title { font-size: 17px; }
          .stats-section { padding-top: 76px; }
          .stat { padding: 24px 16px; }
          .stat-num { font-size: 38px; }
          .stat-label { font-size: 12px; }
          .stories { margin-top: 30px; }
          .story-panel { border-radius: 22px; }
          .story-slide { padding: 28px 22px; gap: 22px; }
          .story-quote { padding: 22px; border-radius: 16px; }
          .story-quote p { font-size: 16px; }
          .story-metric { font-size: 54px; }
          .story-person { margin-top: 18px; }
          .story-controls { margin-top: 16px; }
          .price-card { grid-template-columns: 1fr; margin-top: 30px; border-radius: 22px; }
          .price-left { border-right: 0; border-bottom: 1px solid var(--line-soft); padding: 30px 24px; }
          .price-right { padding: 28px 24px; }
          .price-amount { font-size: 58px; }
          .final-wrap { padding-top: 76px; padding-left: 8px; padding-right: 8px; }
          .final-block { border-radius: 22px; }
          .cta { padding: 70px 20px 62px; }
          .cta p { font-size: 15.5px; }
          .float-pill { display: none; }
          .footer::before { margin: 0 24px; }
          .foot-cols { gap: 40px; flex-wrap: wrap; }
          .foot-bottom { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
        @media (max-width: 440px) {
          .nav-inner { height: 66px; gap: 10px; }
          .nav-actions { gap: 9px; }
          .nav-actions .btn-sm { padding: 9px 12px; font-size: 12.5px; }
          .brand-name { font-size: 19px; }
          .hero-actions { flex-direction: column; }
          .hero-actions .btn { width: 100%; }
          .demo-arrows { display: none; }
          .demo-tab { padding: 8px; }
          .demo-tab svg { display: none; }
          .demo-body { min-height: 340px; }
          .stat-num { font-size: 33px; }
          .round-btn { width: 36px; height: 36px; }
        }
        @media (max-width: 360px) {
          .wrap { padding: 0 14px; }
          .brand-name { font-size: 17px; }
          .nav-actions .btn-sm { padding: 8px 10px; font-size: 12px; }
          .hero-h1 { font-size: 34px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .td-page *, .td-page *::before, .td-page *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
          }
          .reveal { opacity: 1 !important; transform: none !important; }
          .demo-stage { height: auto !important; }
          .demo-sticky { position: static !important; }
          .demo-window { transform: none !important; }
          .demo-hint { display: none !important; }
          .seg-bar { width: 100% !important; }
          .how-track { height: auto !important; }
          .how-sticky { position: static !important; min-height: 0 !important; display: block !important; }
          .hero-h1 .line > span { transform: none !important; }
        }
      `}</style>

      {/* NAV */}
      <header className={`td-nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="wrap nav-inner">
          <a className="nav-brand" href="#top" aria-label="TrustDrop home">
            <Logo />
          </a>
          <nav className="nav-links" aria-label="Main navigation">
            {NAV.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            {loggedIn ? (
              <a className="btn btn-primary btn-sm" href="/dashboard">
                Dashboard <Icon name="arrow" size={15} />
              </a>
            ) : (
              <>
                <a className="nav-login" href="/auth">
                  Log in
                </a>
                <a className="btn btn-primary btn-sm" href="/auth?mode=signup">
                  Get started free
                </a>
              </>
            )}
            <button
              type="button"
              className="nav-burger"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            {NAV.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
                {l.label}
                <Icon name="arrowUpRight" size={16} />
              </a>
            ))}
            <div className="mobile-actions">
              <a className="btn btn-secondary btn-sm" href={loggedIn ? '/dashboard' : '/auth'}>
                {loggedIn ? 'Dashboard' : 'Log in'}
              </a>
              <a className="btn btn-primary btn-sm" href={primaryHref}>
                {loggedIn ? 'Open dashboard' : 'Get started'}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="hero-section" id="top">
        <div className="hero-panel">
          <span className="blob blob-a" aria-hidden="true" />
          <span className="blob blob-b" aria-hidden="true" />
          <span className="blob blob-c" aria-hidden="true" />
          <span className="blob blob-d" aria-hidden="true" />

          <div className="hero-inner">
            <span className="hero-badge">
              <Stars size={12} />
              <span>Trusted by 500+ businesses</span>
              <span className="badge-divider" />
              <span className="badge-soft">4.9 average rating</span>
            </span>

            <h1 className="hero-h1">
              <span className="line">
                <span>All your customer proof,</span>
              </span>
              <span className="line">
                <span>
                  <span className="mark">handled.</span>
                </span>
              </span>
            </h1>

            <p className="hero-sub">
              TrustDrop collects reviews with one link, curates the best ones, and publishes them as a live wall of
              love on your website — in minutes, not weeks.
            </p>

            <div className="hero-actions">
              <a className="btn btn-light btn-lg" href={primaryHref}>
                {primaryLabel} <Icon name="arrow" size={17} />
              </a>
              <a className="btn btn-white-outline btn-lg" href="#how">
                <Icon name="play" size={16} /> See how it works
              </a>
            </div>

            <p className="hero-note">
              <Icon name="check" size={15} />
              14-day free trial · No credit card required
            </p>

            <div className="app-row">
              {APPS.map((a) => (
                <span className="app-tile" key={a.name}>
                  <i style={{ background: a.color }} />
                  {a.name}
                </span>
              ))}
              <span className="app-caption">Works with your site</span>
            </div>

            <HeroDemo />
          </div>
        </div>
      </section>

      {/* TRUST MARQUEE */}
      <div className="trust">
        <div className="wrap trust-inner">
          <p className="trust-label">Built for businesses that live on word of mouth</p>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {[0, 1].map((g) => (
                <div className="marquee-group" key={g}>
                  {MARQUEE.map((m) => (
                    <span className="marquee-item" key={`${g}-${m}`}>
                      <i />
                      {m}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CAPABILITIES */}
      <section className="section" id="features">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">From link to live widget</span>
            <h2 className="h2">
              Everything your reviews need.
              <br />
              Nothing they don&rsquo;t.
            </h2>
            <p className="sub">
              Four simple steps replace your spreadsheet, your follow-up email threads, and that widget plugin you
              never finished setting up.
            </p>
          </div>

          <div className="caps">
            {CAPS.map((c, i) => (
              <a className="cap-card reveal" href="#how" key={c.title} style={{ '--d': `${i * 80}ms` }}>
                <span className={`cap-icon tint-${c.tint}`}>
                  <Icon name={c.icon} size={22} />
                </span>
                <span className="cap-label">{c.kicker}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <span className="cap-link">
                  Learn more <Icon name="arrow" size={15} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <Showcase />
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="wrap">
          <div className="stats reveal">
            {STATS.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat-num">
                  <CountUp end={s.end} decimals={s.decimals} suffix={s.suffix} />
                  {s.star && <Star size={26} />}
                </div>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMERS */}
      <section className="section" id="customers">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Loved by businesses</span>
            <h2 className="h2">
              A wall of love that works
              <br />
              while you sleep.
            </h2>
            <p className="sub">
              Real reviews from the businesses that swapped chasing feedback for a link that does the asking for
              them.
            </p>
          </div>
          <Stories />
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing">
        <div className="wrap">
          <div className="sec-head center reveal">
            <span className="eyebrow">Pricing</span>
            <h2 className="h2">Simple pricing. Serious proof.</h2>
            <p className="sub">
              One plan with everything included. Start free for 14 days — no credit card, no contracts, no surprise
              upgrade prompts.
            </p>
          </div>

          <div className="price-card reveal">
            <div className="price-left">
              <span className="price-badge">
                <Icon name="sparkle" size={13} /> Everything included
              </span>
              <div className="price-amount">
                <span className="cur">$</span>19<span className="per">/month</span>
              </div>
              <p className="price-note">
                Everything you need to turn happy customers into your best marketing channel. Cancel anytime.
              </p>
              <a className="btn btn-primary btn-lg" href={primaryHref}>
                {loggedIn ? 'Go to dashboard' : 'Start your free trial'} <Icon name="arrow" size={17} />
              </a>
              <p className="price-fine">
                <Icon name="checkCircle" size={14} /> No credit card required for the trial
              </p>
            </div>
            <div className="price-right">
              <p className="price-list-title">What you get</p>
              <ul className="checks">
                {PLAN_FEATURES.map((f) => (
                  <li key={f}>
                    <span className="tick">
                      <Icon name="check" size={12} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="price-guarantee">
                <Icon name="clock" size={16} />
                Set up in under five minutes — most businesses collect their first review the same day.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA + FOOTER */}
      <div className="final-wrap">
        <div className="final-block">
          <section className="cta">
            <span className="float-pill p1">
              <Icon name="checkCircle" size={14} /> Review received
            </span>
            <span className="float-pill p2">
              <span className="stars-mini">
                <Star size={12} />
                <Star size={12} />
                <Star size={12} />
                <Star size={12} />
                <Star size={12} />
              </span>
              New 5-star review
            </span>
            <span className="float-pill p3">
              <Icon name="check" size={14} /> Approved by you
            </span>
            <span className="float-pill p4">
              <Icon name="code" size={14} /> Live on your site
            </span>

            <div className="wrap cta-inner reveal">
              <span className="cta-eyebrow">Ready when you are</span>
              <h2>
                Your best marketing is already your <em>customers.</em>
              </h2>
              <p>Give them a place to say it. Start collecting reviews in the next five minutes.</p>
              <a className="btn btn-lime btn-lg" href={primaryHref}>
                {primaryLabel} <Icon name="arrow" size={17} />
              </a>
              <small>14-day free trial · No credit card required</small>
            </div>
          </section>

          <footer className="footer">
            <div className="wrap foot-top">
              <div className="foot-brand">
                <Logo light />
                <p>Collect, curate, and publish customer testimonials without the busywork.</p>
                <span className="foot-made">
                  <span className="live-dot" /> Built for businesses that earn their reviews
                </span>
              </div>
              <div className="foot-cols">
                <div className="foot-col">
                  <h4>Product</h4>
                  <a href="#features">Features</a>
                  <a href="#how">How it works</a>
                  <a href="#pricing">Pricing</a>
                  <a href="#customers">Customers</a>
                </div>
                <div className="foot-col">
                  <h4>Account</h4>
                  <a href="/auth?mode=signup">Create an account</a>
                  <a href="/auth">Log in</a>
                  <a href="/dashboard">Dashboard</a>
                </div>
              </div>
            </div>
            <div className="wrap foot-bottom">
              <p>© 2026 TrustDrop. Built by Abrham Tekuam.</p>
              <p>Made for businesses that live on word of mouth.</p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}
