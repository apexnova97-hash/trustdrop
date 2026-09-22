'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false)

  // Login
  const [lEmail, setLEmail] = useState('')
  const [lPass, setLPass] = useState('')
  const [lLoading, setLLoading] = useState(false)
  const [lError, setLError] = useState('')

  // Signup
  const [sBiz, setSBiz] = useState('')
  const [sEmail, setSEmail] = useState('')
  const [sPass, setSPass] = useState('')
  const [sLoading, setSLoading] = useState(false)
  const [sError, setSError] = useState('')

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('mode') === 'signup') setIsSignup(true)
  }, [])

  async function handleLogin() {
    setLLoading(true); setLError('')
    const { error } = await supabase.auth.signInWithPassword({ email: lEmail, password: lPass })
    if (error) { setLError(error.message); setLLoading(false); return }
    window.location.href = '/dashboard'
  }

  async function handleSignup() {
    setSLoading(true); setSError('')
    const slug = sBiz.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const { data, error } = await supabase.auth.signUp({ email: sEmail, password: sPass })
    if (error) { setSError(error.message); setSLoading(false); return }
    const { error: bErr } = await supabase.from('businesses').insert({
      id: data.user.id, email: sEmail, business_name: sBiz, slug
    })
    if (bErr) { setSError(bErr.message); setSLoading(false); return }
    window.location.href = '/dashboard'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', fontFamily: "'Inter', -apple-system, sans-serif', position: 'relative', overflow: 'hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; -webkit-text-size-adjust: 100%; }

        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-field {
          width: 100%; background: #070b14; border: 1px solid #141c2e; border-radius: 10px;
          padding: 12px 15px; font-size: 14px; color: white; font-family: inherit; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .auth-field:focus { border-color: rgba(37,99,235,0.55); box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .auth-field::placeholder { color: #1e293b; }

        .auth-submit {
          width: 100%; background: #2563eb; color: white; border: none;
          padding: 13px; border-radius: 10px; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .auth-submit:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(37,99,235,0.45); }
        .auth-submit:disabled { opacity: 0.28; cursor: not-allowed; transform: none; box-shadow: none; }

        .flip-link { background: none; border: none; color: #60a5fa; cursor: pointer; font-family: inherit; font-size: 14px; font-weight: 500; transition: color 0.15s; padding: 0; }
        .flip-link:hover { color: #93c5fd; }

        .auth-label { display: block; font-size: 11px; font-weight: 600; color: #334155; margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.7px; }

        .err-box { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); border-radius: 9px; padding: 10px 14px; color: #f87171; font-size: 13px; }

        .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #22d3ee; flex-shrink: 0; position: relative; }
        .live-dot::after { content: ''; position: absolute; inset: -3px; border-radius: 50%; border: 1.5px solid #22d3ee; animation: pulseRing 1.6s ease-out infinite; }

        .face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; background: #0a0e1a; border: 1px solid #141c2e; border-radius: 20px; padding: 34px 30px; display: flex; flex-direction: column; }

        @media (max-width: 480px) {
          .face { padding: 28px 22px !important; }
          .auth-card-outer { padding: 0 4px !important; }
        }
      `}</style>

      {/* Background glow */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Logo */}
      <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, position: 'relative', zIndex: 1, animation: 'fadeIn 0.5s ease' }}>
        <div style={{ width: 26, height: 26, background: '#2563eb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, boxShadow: '0 0 14px rgba(37,99,235,0.55)' }}>⭐</div>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'white', letterSpacing: '-0.3px' }}>TrustDrop</span>
      </a>

      {/* Flip Card */}
      <div className="auth-card-outer" style={{ perspective: '1200px', width: '100%', maxWidth: 400, position: 'relative', zIndex: 1, animation: 'fadeIn 0.6s ease 0.1s both' }}>
        <div style={{
          position: 'relative',
          height: isSignup ? 518 : 432,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1), height 0.35s ease',
          transform: isSignup ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>

          {/* FRONT: LOGIN */}
          <div className="face">
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 6, letterSpacing: '-0.5px' }}>Welcome back</h1>
            <p style={{ color: '#475569', fontSize: 14, marginBottom: 24 }}>Log in to your TrustDrop account</p>

            {lError && <div className="err-box" style={{ marginBottom: 16 }}>{lError}</div>}

            <div style={{ marginBottom: 14 }}>
              <label className="auth-label">Email</label>
              <input type="email" value={lEmail} onChange={e => setLEmail(e.target.value)} placeholder="you@example.com" className="auth-field" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="auth-label">Password</label>
              <input type="password" value={lPass} onChange={e => setLPass(e.target.value)} placeholder="••••••••" className="auth-field" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>

            <button className="auth-submit" onClick={handleLogin} disabled={!lEmail || !lPass || lLoading}>
              {lLoading ? 'Logging in...' : 'Log in'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 14, color: '#475569', marginTop: 20 }}>
              No account?{' '}
              <button className="flip-link" onClick={() => setIsSignup(true)}>Sign up free →</button>
            </p>
          </div>

          {/* BACK: SIGNUP */}
          <div className="face" style={{ transform: 'rotateY(180deg)' }}>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 6, letterSpacing: '-0.5px' }}>Create account</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
              <div className="live-dot" />
              <p style={{ color: '#475569', fontSize: 13 }}>14 days free — no credit card needed</p>
            </div>

            {sError && <div className="err-box" style={{ marginBottom: 14 }}>{sError}</div>}

            <div style={{ marginBottom: 12 }}>
              <label className="auth-label">Business name</label>
              <input type="text" value={sBiz} onChange={e => setSBiz(e.target.value)} placeholder="My Business" className="auth-field" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="auth-label">Email</label>
              <input type="email" value={sEmail} onChange={e => setSEmail(e.target.value)} placeholder="you@example.com" className="auth-field" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="auth-label">Password</label>
              <input type="password" value={sPass} onChange={e => setSPass(e.target.value)} placeholder="Min 6 characters" className="auth-field" />
            </div>

            <button className="auth-submit" onClick={handleSignup} disabled={!sBiz || !sEmail || !sPass || sLoading}>
              {sLoading ? 'Creating account...' : 'Create account'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 14, color: '#475569', marginTop: 18 }}>
              Have an account?{' '}
              <button className="flip-link" onClick={() => setIsSignup(false)}>Log in</button>
            </p>
          </div>

        </div>
      </div>

      <p style={{ color: '#141c2e', fontSize: 12, marginTop: 22, textAlign: 'center', position: 'relative', zIndex: 1, animation: 'fadeIn 0.6s ease 0.3s both' }}>
        By continuing you agree to our{' '}
        <a href="#" style={{ color: '#1e293b', textDecoration: 'none' }}>Terms</a>{' '}
        and{' '}
        <a href="#" style={{ color: '#1e293b', textDecoration: 'none' }}>Privacy Policy</a>
      </p>
    </div>
  )
}
