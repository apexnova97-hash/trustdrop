'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeReview, setActiveReview] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setLoggedIn(true)
    })
  }, [])

  const reviews = [
    { n: 'Sample review', r: 5, t: 'This is placeholder text so you can see the layout. Your real reviews replace this once customers start submitting them.' },
    { n: 'Another example', r: 4, t: 'The widget only shows reviews you\u2019ve approved. Nothing goes live without you choosing it first.' },
    { n: 'Third example', r: 5, t: 'Embed this anywhere on your site \u2014 it updates on its own as you approve new reviews.' },
  ]

  return (
    <main style={{ fontFamily: "'Source Serif 4', Georgia, serif", background: '#fbf9f4', minHeight: '100vh', color: '#1c1a17', overflowX: 'hidden', fontSize: '16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; overflow-x: hidden; -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
        body { font-size: 16px; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        .mono { font-family: 'IBM Plex Mono', monospace; }

        @keyframes riseIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .rise { animation: riseIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .rise-1 { animation-delay: 0.05s; }
        .rise-2 { animation-delay: 0.15s; }
        .rise-3 { animation-delay: 0.25s; }

        .nav-a { color: #6b6456; text-decoration: none; font-size: 15px; transition: color 0.15s; border-bottom: 1px solid transparent; }
        .nav-a:hover { color: #1c1a17; border-bottom-color: #1c1a17; }

        .btn-p {
          display: inline-flex; align-items: center; gap: 6px;
          background: #1c1a17; color: #fbf9f4;
          padding: 12px 24px; border-radius: 3px;
          font-size: 15px; font-weight: 600; font-family: 'IBM Plex Mono', monospace;
          text-decoration: none; border: none; cursor: pointer;
          white-space: nowrap; transition: background 0.15s, transform 0.1s;
        }
        .btn-p:hover { background: #3a342b; transform: translateY(-1px); }

        .btn-g {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: #1c1a17;
          padding: 11px 22px; border-radius: 3px;
          font-size: 15px; font-weight: 500; font-family: 'IBM Plex Mono', monospace;
          text-decoration: none; border: 1px solid #1c1a17; cursor: pointer;
          white-space: nowrap; transition: all 0.15s;
        }
        .btn-g:hover { background: #1c1a17; color: #fbf9f4; }

        .feat-item {
          border-top: 1px solid #ded7c6; padding: 22px 0;
        }
        .feat-item:last-child { border-bottom: 1px solid #ded7c6; }

        .step-num {
          font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #a89d85;
          border: 1px solid #ded7c6; border-radius: 50%; width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .review-tab {
          background: none; border: none; cursor: pointer; font-family: inherit;
          padding: 10px 0; color: #a89d85; font-size: 14px; border-bottom: 2px solid transparent;
          transition: color 0.15s, border-color 0.15s;
        }
        .review-tab.active { color: #1c1a17; border-bottom-color: #c2501f; }

        .price-box {
          border: 1px solid #1c1a17; border-radius: 4px; padding: 36px;
        }

        @media (max-width: 1024px) { .feat-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 640px) {
          .hero-h1 { font-size: 34px !important; }
          .hero-btns { flex-direction: column !important; align-items: stretch !important; }
          .hero-btns a { justify-content: center !important; text-align: center !important; }
          .nav-links { display: none !important; }
          .s { padding: 48px 20px !important; }
          .hero-s { padding: 96px 20px 48px !important; }
          nav { padding: 0 20px !important; }
          .foot-row { flex-direction: column !important; gap: 14px !important; align-items: flex-start !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6%', background: 'rgba(251,249,244,0.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #ded7c6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mono" style={{ fontWeight: 600, fontSize: '16px', color: '#1c1a17' }}>TrustDrop</span>
          <span className="mono" style={{ fontSize: 11, color: '#c2501f' }}>_</span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: 30 }}>
          <a href="#what" className="nav-a">What it does</a>
          <a href="#how" className="nav-a">How it works</a>
          <a href="#pricing" className="nav-a">Pricing</a>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {loggedIn ? (
            <a href="/dashboard" className="btn-p" style={{ padding: '8px 16px', fontSize: '13px' }}>Dashboard</a>
          ) : (
            <>
              <a href="/auth" className="btn-g" style={{ padding: '8px 16px', fontSize: '13px' }}>Log in</a>
              <a href="/auth?mode=signup" className="btn-p" style={{ padding: '8px 16px', fontSize: '13px' }}>Sign up</a>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-s" style={{ padding: '128px 6% 60px' }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <p className="mono rise" style={{ color: '#c2501f', fontSize: 13, marginBottom: 18, letterSpacing: '0.5px' }}>
            [ JUST LAUNCHED \u2014 LOOKING FOR FIRST USERS ]
          </p>

          <h1 className="hero-h1 rise rise-1" style={{ fontSize: 50, fontWeight: 600, lineHeight: 1.15, color: '#1c1a17', marginBottom: 22 }}>
            Customer reviews, collected without the usual hassle.
          </h1>

          <p className="rise rise-2" style={{ fontSize: 18, color: '#4a4438', lineHeight: 1.7, marginBottom: 32, maxWidth: 520 }}>
            Send a link. Customers leave a review in under a minute. You decide what gets published, and it appears on your site with one line of code.
          </p>

          <div className="hero-btns rise rise-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="/auth?mode=signup" className="btn-p" style={{ padding: '14px 28px', fontSize: '16px' }}>Start free trial</a>
            <a href="#how" className="btn-g" style={{ padding: '13px 26px', fontSize: '16px' }}>See how it works</a>
          </div>
          <p className="mono" style={{ color: '#a89d85', fontSize: 13, marginTop: 18 }}>No card required &middot; 14 days free</p>
        </div>
      </section>

      {/* INTERACTIVE DEMO — tabs you can click, not a passive screenshot */}
      <section className="s" style={{ padding: '40px 6% 64px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', border: '1px solid #ded7c6', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
          <div style={{ borderBottom: '1px solid #ded7c6', padding: '0 20px', display: 'flex', gap: 24 }}>
            {reviews.map((r, i) => (
              <button key={i} className={`review-tab ${activeReview === i ? 'active' : ''}`} onClick={() => setActiveReview(i)}>
                Example {i + 1}
              </button>
            ))}
          </div>
          <div style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, background: '#f1ece0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#6b6456', fontSize: 13 }}>
                {reviews[activeReview].n[0]}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: '#1c1a17' }}>{reviews[activeReview].n}</p>
                <span style={{ color: '#c2501f', fontSize: 12 }}>{'\u2605'.repeat(reviews[activeReview].r)}{'\u2606'.repeat(5 - reviews[activeReview].r)}</span>
              </div>
            </div>
            <p style={{ color: '#4a4438', fontSize: 15, lineHeight: 1.7 }}>{reviews[activeReview].t}</p>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES — numbered list, not icon-card grid */}
      <section id="what" className="s" style={{ padding: '56px 6%' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p className="mono" style={{ color: '#c2501f', fontSize: 13, marginBottom: 10 }}>WHAT IT DOES</p>
          <h2 style={{ fontSize: 30, fontWeight: 600, marginBottom: 8, color: '#1c1a17' }}>Six things, nothing more.</h2>

          {[
            { t: 'A link you send anywhere', d: 'Every account gets a unique collection link \u2014 drop it in a WhatsApp message, an email, or your Instagram bio. No app for customers to install.' },
            { t: 'You approve every review before it\u2019s public', d: 'Nothing goes live automatically. Everything sits in your dashboard until you choose to publish it.' },
            { t: 'A one-line embed for your site', d: 'Paste an embed snippet anywhere on your website. It updates on its own each time you approve something new.' },
            { t: 'Star rating plus written feedback', d: 'Customers leave 1\u20135 stars alongside their comment \u2014 a quick score and the actual words, together.' },
            { t: 'A dashboard that\u2019s just a list', d: 'See every review in one place. Filter by approved or pending. No settings to dig through.' },
            { t: 'Works on any website', d: 'If you can paste HTML into your site, the widget works there \u2014 no specific platform required.' },
          ].map((f, i) => (
            <div key={i} className="feat-item" style={{ display: 'flex', gap: 20 }}>
              <span className="mono" style={{ color: '#a89d85', fontSize: 13, minWidth: 24 }}>0{i + 1}</span>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: '#1c1a17' }}>{f.t}</h3>
                <p style={{ color: '#6b6456', lineHeight: 1.65, fontSize: 15 }}>{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="s" style={{ padding: '56px 6%', background: '#1c1a17' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p className="mono" style={{ color: '#d97757', fontSize: 13, marginBottom: 10 }}>HOW IT WORKS</p>
          <h2 style={{ fontSize: 30, fontWeight: 600, marginBottom: 32, color: '#fbf9f4' }}>Three steps, five minutes.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { n: '1', t: 'Sign up', d: 'Create an account \u2014 you get a collection link immediately, no setup required first.' },
              { n: '2', t: 'Share your link', d: 'Send it to customers after a purchase, a call, or whenever a project wraps up.' },
              { n: '3', t: 'Approve, then embed', d: 'Review what comes in, approve what you want public, paste the widget code once.' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, minWidth: 28, border: '1px solid #4a4438', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97757', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace' }}>
                  {s.n}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: '#fbf9f4' }}>{s.t}</h3>
                  <p style={{ color: '#a8a195', lineHeight: 1.6, fontSize: 15 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="s" style={{ padding: '64px 6%' }}>
        <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
          <p className="mono" style={{ color: '#c2501f', fontSize: 13, marginBottom: 10 }}>PRICING</p>
          <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 28, color: '#1c1a17' }}>One plan. Nothing hidden.</h2>

          <div className="price-box">
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
              <span style={{ fontSize: 44, fontWeight: 700, color: '#1c1a17' }}>$19</span>
              <span className="mono" style={{ color: '#a89d85', fontSize: 14 }}>/month</span>
            </div>
            {['Unlimited reviews', 'Embeddable widget', 'Approval dashboard', 'Your own collection link', 'Cancel anytime'].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid #ded7c6', fontSize: 14, color: '#4a4438', textAlign: 'left' }}>
                <span className="mono" style={{ color: '#c2501f' }}>+</span> {f}
              </div>
            ))}
            <a href={loggedIn ? '/dashboard' : '/auth?mode=signup'} className="btn-p" style={{ display: 'block', marginTop: 24, padding: '13px 0', fontSize: '15px' }}>
              {loggedIn ? 'Go to dashboard' : 'Start free trial'}
            </a>
            <p className="mono" style={{ color: '#a89d85', fontSize: 12, marginTop: 12 }}>14 days free, then $19/mo</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #ded7c6', padding: '28px 6%' }}>
        <div className="foot-row" style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <span className="mono" style={{ fontWeight: 600, fontSize: '14px', color: '#1c1a17' }}>TrustDrop</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['What it does', '#what'], ['How it works', '#how'], ['Pricing', '#pricing']].map(([l, h]) => (
              <a key={l} href={h} style={{ color: '#a89d85', fontSize: '13px', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
          <span className="mono" style={{ color: '#a89d85', fontSize: 12 }}>Built by Abrham Tekuam</span>
        </div>
      </footer>
    </main>
  )
}