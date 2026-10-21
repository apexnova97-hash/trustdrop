'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [text, setText] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setLoggedIn(true)
    })
  }, [])

  return (
    <main style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#f1f0ee', minHeight: '100vh', color: '#161616', overflowX: 'hidden', fontSize: '16px' }}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; overflow-x: hidden; scroll-behavior: smooth; }
        body { font-size: 16px; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        .btn-p {
          display: inline-flex; align-items: center; gap: 6px;
          background: #6248ff; color: #fff;
          padding: 13px 24px; border-radius: 10px;
          font-size: 15px; font-weight: 500;
          text-decoration: none; border: none; cursor: pointer;
          white-space: nowrap; transition: background 0.15s;
        }
        .btn-p:hover { background: #5238e0; }

        .btn-g {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: #161616;
          padding: 12px 22px; border-radius: 10px;
          font-size: 15px; font-weight: 500;
          text-decoration: none; border: 1px solid #e4e2df; cursor: pointer;
          white-space: nowrap; transition: border-color 0.15s, background 0.15s;
        }
        .btn-g:hover { background: #e9e8e5; }

        .surface {
          background: #ffffff; border: 1px solid #e4e2df; border-radius: 16px;
        }

        .star-btn { background: none; border: none; cursor: pointer; font-size: 26px; padding: 2px; line-height: 1; color: #6248ff; }

        .demo-input {
          width: 100%; border: 1px solid #e4e2df; border-radius: 10px; padding: 11px 14px;
          font-size: 14px; font-family: inherit; outline: none; color: #161616; background: #fff;
        }
        .demo-input:focus { border-color: #6248ff; }

        .price-row {
          display: flex; align-items: center; gap: 10px; padding: 11px 0;
          border-top: 1px solid #e9e8e5; font-size: 14px; color: #3e3e3e;
        }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div { max-width: 100% !important; }
        }
        @media (max-width: 560px) {
          .hero-h1 { font-size: 36px !important; }
          .nav-links { display: none !important; }
          nav { padding: 0 20px !important; }
          .s { padding-left: 20px !important; padding-right: 20px !important; }
        }
      \`}</style>

      {/* NAV */}
      <nav style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6%', borderBottom: '1px solid #e4e2df' }}>
        <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: '-0.3px' }}>TrustDrop</span>
        <div style={{ display: 'flex', gap: 10 }}>
          {loggedIn ? (
            <a href="/dashboard" className="btn-p" style={{ padding: '9px 18px', fontSize: 14 }}>Dashboard</a>
          ) : (
            <>
              <a href="/auth" className="btn-g" style={{ padding: '9px 18px', fontSize: 14 }}>Log in</a>
              <a href="/auth?mode=signup" className="btn-p" style={{ padding: '9px 18px', fontSize: 14 }}>Sign up</a>
            </>
          )}
        </div>
      </nav>

      {/* HERO — giant regular-weight display type, real working demo beside it */}
      <section className="s" style={{ padding: '72px 6% 64px' }}>
        <div className="hero-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 64, alignItems: 'center' }}>
          <div style={{ maxWidth: 480 }}>
            <h1 className="hero-h1" style={{ fontSize: 50, fontWeight: 400, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 20, color: '#161616' }}>
              Customer reviews, collected without the hassle.
            </h1>
            <p style={{ fontSize: 17, color: '#3e3e3e', lineHeight: 1.65, marginBottom: 28 }}>
              Send customers a link. They leave a review in under a minute, using the exact form shown to the right. You decide what gets published, then embed it on your site with one line of code.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              <a href="/auth?mode=signup" className="btn-p" style={{ padding: '14px 26px', fontSize: 16 }}>Start free trial</a>
              <a href="#pricing" className="btn-g" style={{ padding: '13px 24px', fontSize: 16 }}>See pricing</a>
            </div>
            <p style={{ fontSize: 13, color: '#6b6b6b' }}>No card required &middot; 14 days free</p>
          </div>

          {/* Real, working demo form */}
          <div className="surface" style={{ padding: 26 }}>
            <p style={{ fontSize: 12, color: '#6b6b6b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              The exact form your customers fill out
            </p>
            <p style={{ fontSize: 13, color: '#3e3e3e', marginBottom: 8 }}>Rating</p>
            <div style={{ display: 'flex', gap: 2, marginBottom: 18 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} className="star-btn"
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)}
                  style={{ opacity: s <= (hovered || rating) ? 1 : 0.2 }}>
                  ★
                </button>
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#3e3e3e', marginBottom: 8 }}>Your review</p>
            <textarea
              className="demo-input"
              rows={3}
              placeholder="Try typing something..."
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ resize: 'none', marginBottom: 16 }}
            />
            <button
              disabled
              style={{ width: '100%', background: '#e9e8e5', color: '#8a8a8a', border: 'none', padding: 13, borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'not-allowed' }}
            >
              Submit (disabled in this preview)
            </button>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES — single paragraph, no icon grid */}
      <section className="s" style={{ padding: '48px 6%', borderTop: '1px solid #e4e2df' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 16, color: '#222222', lineHeight: 1.9 }}>
            You sign up and get a link right away &mdash; something like <code style={{ background: '#e9e8e5', padding: '2px 7px', borderRadius: 5, fontSize: 14 }}>trustdrop.app/collect/yourname</code>. Send that to customers after a sale, a call, or a finished project. Their reviews land in your dashboard, where nothing is public until you approve it. Once you do, it shows up automatically wherever you've embedded the widget. That's the entire product &mdash; there isn't more to it.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="s" style={{ padding: '56px 6%', borderTop: '1px solid #e4e2df' }}>
        <div style={{ maxWidth: 360, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 6, letterSpacing: '-0.3px' }}>Pricing</h2>
          <p style={{ color: '#6b6b6b', fontSize: 14, marginBottom: 24 }}>One plan. Nothing hidden.</p>
          <div className="surface" style={{ padding: 28, textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <span style={{ fontSize: 38, fontWeight: 400, letterSpacing: '-1px' }}>$19</span>
              <span style={{ color: '#6b6b6b', fontSize: 14 }}> /month</span>
            </div>
            {['Unlimited reviews', 'Embeddable widget', 'Approval dashboard', 'Your own collection link', 'Cancel anytime'].map((f, i) => (
              <div key={i} className="price-row" style={{ borderTop: i === 0 ? 'none' : undefined }}>
                <span style={{ color: '#6248ff' }}>&#10003;</span> {f}
              </div>
            ))}
            <a href={loggedIn ? '/dashboard' : '/auth?mode=signup'} className="btn-p" style={{ display: 'block', textAlign: 'center', marginTop: 20, padding: '12px 0' }}>
              {loggedIn ? 'Go to dashboard' : 'Start free trial'}
            </a>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#6b6b6b', marginTop: 10 }}>14 days free, then $19/month</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #e4e2df', padding: '22px 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>TrustDrop</span>
        <span style={{ color: '#6b6b6b', fontSize: 13 }}>Built by Abrham Tekuam</span>
      </footer>
    </main>
  )
}
