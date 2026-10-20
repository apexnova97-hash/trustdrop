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
    <main style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#ffffff', minHeight: '100vh', color: '#111', overflowX: 'hidden', fontSize: '16px' }}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; overflow-x: hidden; scroll-behavior: smooth; }
        body { font-size: 16px; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        .btn-p {
          display: inline-flex; align-items: center; gap: 6px;
          background: #111; color: #fff;
          padding: 13px 24px; border-radius: 6px;
          font-size: 15px; font-weight: 600;
          text-decoration: none; border: none; cursor: pointer;
          white-space: nowrap; transition: background 0.15s;
        }
        .btn-p:hover { background: #333; }

        .btn-g {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: #111;
          padding: 12px 22px; border-radius: 6px;
          font-size: 15px; font-weight: 500;
          text-decoration: none; border: 1px solid #ddd; cursor: pointer;
          white-space: nowrap; transition: border-color 0.15s;
        }
        .btn-g:hover { border-color: #111; }

        .star-btn { background: none; border: none; cursor: pointer; font-size: 26px; padding: 2px; line-height: 1; color: #f5b82e; }

        .demo-input {
          width: 100%; border: 1px solid #ddd; border-radius: 6px; padding: 10px 12px;
          font-size: 14px; font-family: inherit; outline: none; color: #111;
        }
        .demo-input:focus { border-color: #111; }

        .price-row {
          display: flex; align-items: center; gap: 10px; padding: 10px 0;
          border-bottom: 1px solid #eee; font-size: 14px; color: #444;
        }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div { max-width: 100% !important; }
        }
        @media (max-width: 560px) {
          .hero-h1 { font-size: 32px !important; }
          .nav-links { display: none !important; }
          nav { padding: 0 20px !important; }
          .s { padding: 0 20px !important; }
        }
      \`}</style>

      <nav style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6%', borderBottom: '1px solid #eee' }}>
        <span style={{ fontWeight: 700, fontSize: 17 }}>TrustDrop</span>
        <div style={{ display: 'flex', gap: 10 }}>
          {loggedIn ? (
            <a href="/dashboard" className="btn-p" style={{ padding: '8px 16px', fontSize: 14 }}>Dashboard</a>
          ) : (
            <>
              <a href="/auth" className="btn-g" style={{ padding: '8px 16px', fontSize: 14 }}>Log in</a>
              <a href="/auth?mode=signup" className="btn-p" style={{ padding: '8px 16px', fontSize: 14 }}>Sign up</a>
            </>
          )}
        </div>
      </nav>

      <section className="s" style={{ padding: '64px 6% 56px' }}>
        <div className="hero-grid" style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div style={{ maxWidth: 440 }}>
            <h1 className="hero-h1" style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.2, marginBottom: 18, letterSpacing: '-0.5px' }}>
              Customer reviews, without the usual hassle.
            </h1>
            <p style={{ fontSize: 17, color: '#555', lineHeight: 1.65, marginBottom: 24 }}>
              Send customers a link. They leave a review in under a minute, using the exact form on the right. You approve what gets published, then embed it on your site with one line of code.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              <a href="/auth?mode=signup" className="btn-p" style={{ padding: '14px 26px', fontSize: 16 }}>Start free trial</a>
              <a href="#pricing" className="btn-g" style={{ padding: '13px 24px', fontSize: 16 }}>See pricing</a>
            </div>
            <p style={{ fontSize: 13, color: '#999' }}>No card required &middot; 14 days free &middot; Just launched, looking for first users</p>
          </div>

          <div style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 24, background: '#fafafa' }}>
            <p style={{ fontSize: 12, color: '#999', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              This is the exact form your customers fill out
            </p>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>Rating</p>
            <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} className="star-btn"
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)}
                  style={{ opacity: s <= (hovered || rating) ? 1 : 0.25 }}>
                  ★
                </button>
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>Your review</p>
            <textarea
              className="demo-input"
              rows={3}
              placeholder="Try typing something..."
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ resize: 'none', marginBottom: 14 }}
            />
            <button
              disabled
              style={{ width: '100%', background: '#e5e5e5', color: '#999', border: 'none', padding: 12, borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'not-allowed' }}
            >
              Submit (disabled in this preview)
            </button>
          </div>
        </div>
      </section>

      <section className="s" style={{ padding: '48px 6%', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 16, color: '#333', lineHeight: 1.9 }}>
            You sign up and get a link right away &mdash; something like <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 4, fontSize: 14 }}>trustdrop.app/collect/yourname</code>. Send that link to customers after a sale, a call, or a finished project. Their reviews land in your dashboard, where nothing is public until you approve it. Once you do, the review shows up automatically wherever you've embedded the widget on your own site. That's the entire product &mdash; there isn't more to it.
          </p>
        </div>
      </section>

      <section id="pricing" className="s" style={{ padding: '56px 6%', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: 360, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Pricing</h2>
          <p style={{ color: '#777', fontSize: 14, marginBottom: 24 }}>One plan. Nothing hidden.</p>
          <div style={{ border: '1px solid #e5e5e5', borderRadius: 10, padding: 28, textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <span style={{ fontSize: 38, fontWeight: 700 }}>$19</span>
              <span style={{ color: '#999', fontSize: 14 }}> /month</span>
            </div>
            {['Unlimited reviews', 'Embeddable widget', 'Approval dashboard', 'Your own collection link', 'Cancel anytime'].map((f, i) => (
              <div key={i} className="price-row" style={{ borderTop: i === 0 ? 'none' : undefined }}>
                <span style={{ color: '#111' }}>&#10003;</span> {f}
              </div>
            ))}
            <a href={loggedIn ? '/dashboard' : '/auth?mode=signup'} className="btn-p" style={{ display: 'block', textAlign: 'center', marginTop: 20, padding: '12px 0' }}>
              {loggedIn ? 'Go to dashboard' : 'Start free trial'}
            </a>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#999', marginTop: 10 }}>14 days free, then $19/month</p>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #eee', padding: '20px 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>TrustDrop</span>
        <span style={{ color: '#999', fontSize: 13 }}>Built by Abrham Tekuam</span>
      </footer>
    </main>
  )
}
