'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setLoggedIn(true)
    })
  }, [])

  return (
    <main style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#050810', minHeight: '100vh', color: 'white', overflowX: 'hidden', fontSize: '16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; overflow-x: hidden; -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
        body { font-size: 16px; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        .nav-a { color: #64748b; text-decoration: none; font-size: 15px; font-weight: 500; transition: color 0.15s; }
        .nav-a:hover { color: #94a3b8; }
        .btn-p { display: inline-flex; align-items: center; gap: 6px; background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 8px; font-size: 15px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; font-family: inherit; white-space: nowrap; transition: background 0.15s; }
        .btn-p:hover { background: #1d4ed8; }
        .btn-g { display: inline-flex; align-items: center; gap: 6px; background: transparent; color: #94a3b8; padding: 12px 24px; border-radius: 8px; font-size: 15px; font-weight: 500; text-decoration: none; border: 1px solid #1e293b; cursor: pointer; font-family: inherit; white-space: nowrap; transition: all 0.15s; }
        .btn-g:hover { border-color: #334155; color: #cbd5e1; }
        .feat-card { background: #0a0e1a; border: 1px solid #141c2e; border-radius: 12px; padding: 24px; }
        .step-row { background: #0a0e1a; border: 1px solid #141c2e; border-radius: 12px; padding: 22px; display: flex; gap: 16px; align-items: flex-start; }
        .review-demo { background: #070b14; border: 1px solid #141c2e; border-radius: 10px; padding: 16px; margin-bottom: 10px; }
        .pricing-box { background: #0a0e1a; border: 1px solid #1e293b; border-radius: 16px; padding: 36px; }
        @media (max-width: 1024px) { .feat-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 640px) {
          .hero-h1 { font-size: 34px !important; letter-spacing: -1px !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .hero-btns { flex-direction: column !important; align-items: stretch !important; }
          .hero-btns a { justify-content: center !important; text-align: center !important; }
          .nav-links { display: none !important; }
          .foot-r { flex-direction: column !important; gap: 16px !important; }
          .s { padding: 48px 20px !important; }
          .hero-s { padding: 100px 20px 56px !important; }
          nav { padding: 0 20px !important; }
        }
      `}</style>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%', background: 'rgba(5,8,16,0.9)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid #0d1220' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, background: '#2563eb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>⭐</div>
          <span style={{ fontWeight: 700, fontSize: '16px', color: 'white' }}>TrustDrop</span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: 28 }}>
          <a href="#features" className="nav-a">Features</a><a href="#how" className="nav-a">How it works</a><a href="#pricing" className="nav-a">Pricing</a>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {loggedIn ? <a href="/dashboard" className="btn-p" style={{ padding: '8px 18px', fontSize: '14px' }}>Go to dashboard</a> : <><a href="/auth" className="btn-g" style={{ padding: '8px 16px', fontSize: '14px' }}>Log in</a><a href="/auth?mode=signup" className="btn-p" style={{ padding: '8px 16px', fontSize: '14px' }}>Sign up</a></>}
        </div>
      </nav>
      <section className="hero-s" style={{ padding: '120px 5% 64px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', color: '#93c5fd', padding: '5px 13px', borderRadius: 100, fontSize: 13, fontWeight: 500, marginBottom: 20 }}>Just launched — be one of our first users</div>
          <h1 className="hero-h1" style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-1.5px', color: 'white', marginBottom: 18 }}>Collect customer reviews without the hassle</h1>
          <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.65, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>Send customers a link. They leave a review in under a minute. You pick which ones to show, and embed them on your site with one line of code.</p>
          <div className="hero-btns" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}><a href="/auth?mode=signup" className="btn-p" style={{ padding: '13px 26px', fontSize: '16px' }}>Try it free</a><a href="#how" className="btn-g" style={{ padding: '13px 26px', fontSize: '16px' }}>See how it works</a></div>
          <p style={{ color: '#334155', fontSize: 13, marginTop: 20 }}>No credit card needed · 14-day free trial</p>
        </div>
      </section>
      <section className="s" style={{ padding: '56px 5%' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#334155', fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Example of what your widget looks like</p>
          <div style={{ background: '#0a0e1a', border: '1px solid #141c2e', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ background: '#070b14', borderBottom: '1px solid #0e1420', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} /><div style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e' }} /><div style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} /><span style={{ color: '#1e293b', fontSize: 12, marginLeft: 8 }}>yourbusiness.com</span></div>
            <div style={{ padding: 24 }}>
              <p style={{ color: '#60a5fa', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>What customers say</p>
              {[{ n: 'Sample review', r: 5, t: 'This is placeholder text so you can see the layout. Real reviews from your customers will appear here once you start collecting them.' }, { n: 'Another example', r: 4, t: 'The widget pulls only the reviews you approve — nothing shows up without you choosing it first.' }].map((item, i) => <div key={i} className="review-demo"><div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}><div style={{ width: 30, height: 30, background: 'rgba(37,99,235,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#60a5fa', fontSize: 12 }}>{item.n[0]}</div><div><p style={{ fontWeight: 600, fontSize: 13, color: '#cbd5e1' }}>{item.n}</p><span style={{ color: '#f59e0b', fontSize: 11 }}>{'★'.repeat(item.r)}{'☆'.repeat(5 - item.r)}</span></div></div><p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{item.t}</p></div>)}
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="s" style={{ padding: '56px 5%' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}><h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 36, color: 'white', textAlign: 'center' }}>What it does</h2>
          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[{ t: 'A link you can send anywhere', d: 'Every business gets a unique link — paste it in a WhatsApp message, an email, or your Instagram bio. No app for your customers to download.' }, { t: 'You approve every review', d: 'Nothing goes live automatically. Reviews sit in your dashboard until you choose to publish them.' }, { t: 'One line of code for your site', d: 'Copy an embed snippet into your website and the widget shows your approved reviews. Updates automatically when you approve new ones.' }, { t: 'Star ratings plus written reviews', d: 'Customers leave a 1–5 star rating alongside their comment, so you get both a quick score and real feedback.' }, { t: 'A plain dashboard', d: 'See every review in one place, filter by approved or pending, and manage everything without digging through settings.' }, { t: 'Works on any website', d: 'No specific platform needed — if you can paste HTML into your site, the widget will work there.' }].map((f, i) => <div key={i} className="feat-card"><h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#e2e8f0' }}>{f.t}</h3><p style={{ color: '#64748b', lineHeight: 1.6, fontSize: 14 }}>{f.d}</p></div>)}
          </div>
        </div>
      </section>
      <section id="how" className="s" style={{ padding: '56px 5%' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}><h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: 'white', textAlign: 'center', marginBottom: 36 }}>How it works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[{ n: '1', t: 'Sign up', d: 'Create an account and you get a collection link right away — no setup needed first.' }, { n: '2', t: 'Share your link', d: 'Send it to customers after a purchase, a call, or a project wraps up.' }, { n: '3', t: 'Approve and embed', d: 'Review what comes in, approve the ones you want public, and paste the widget code on your site.' }].map((s, i) => <div key={i} className="step-row"><div style={{ width: 30, height: 30, minWidth: 30, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: 700, fontSize: 13 }}>{s.n}</div><div><h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: '#e2e8f0' }}>{s.t}</h3><p style={{ color: '#64748b', lineHeight: 1.6, fontSize: 14 }}>{s.d}</p></div></div>)}
          </div>
        </div>
      </section>
      <section id="pricing" className="s" style={{ padding: '56px 5%' }}>
        <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}><h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 8, color: 'white' }}>Pricing</h2><p style={{ color: '#64748b', fontSize: 15, marginBottom: 28 }}>One plan. Nothing hidden.</p>
          <div className="pricing-box"><div style={{ marginBottom: 20 }}><span style={{ fontSize: 44, fontWeight: 700, color: 'white', letterSpacing: '-1px' }}>$19</span><span style={{ color: '#64748b', fontSize: 15 }}>/month</span></div>
            {['Unlimited reviews', 'Embeddable widget', 'Approval dashboard', 'Your own collection link', 'Cancel anytime'].map((f, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', borderBottom: '1px solid #0e1420', fontSize: 14, color: '#94a3b8' }}><span style={{ color: '#2563eb' }}>✓</span> {f}</div>)}
            <a href={loggedIn ? '/dashboard' : '/auth?mode=signup'} className="btn-p" style={{ display: 'block', marginTop: 24, textAlign: 'center', padding: '13px 0', fontSize: '15px' }}>{loggedIn ? 'Go to dashboard' : 'Start free trial'}</a><p style={{ color: '#334155', fontSize: 13, marginTop: 12 }}>14 days free, then $19/month</p>
          </div>
        </div>
      </section>
      <section className="s" style={{ padding: '56px 5%', textAlign: 'center' }}><div style={{ maxWidth: 480, margin: '0 auto' }}><h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-1px', marginBottom: 14, color: 'white' }}>Try TrustDrop free for 14 days</h2><p style={{ color: '#64748b', fontSize: 15, marginBottom: 24 }}>No credit card required to start.</p><a href="/auth?mode=signup" className="btn-p" style={{ padding: '13px 28px', fontSize: '15px' }}>Create an account</a></div></section>
      <footer style={{ borderTop: '1px solid #0d1220', padding: '26px 5%' }}><div style={{ maxWidth: 1000, margin: '0 auto' }}><div className="foot-r" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 20, height: 20, background: '#2563eb', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>⭐</div><span style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>TrustDrop</span></div><div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>{[['Features', '#features'], ['Pricing', '#pricing'], ['Log in', '/auth']].map(([l, h]) => <a key={l} href={h} style={{ color: '#334155', fontSize: '13px', textDecoration: 'none' }}>{l}</a>)}</div><p style={{ color: '#1e293b', fontSize: 13 }}>Built by Abrham Tekuam, from Ethiopia</p></div></div></footer>
    </main>
  )
}
