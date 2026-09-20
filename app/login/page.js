'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) { setError(loginError.message); setLoading(false); return }
    window.location.href = '/dashboard'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .field {
          width: 100%;
          background: #070b14;
          border: 1px solid #141c2e;
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 15px;
          color: white;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field:focus { border-color: rgba(37,99,235,0.5); box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .field::placeholder { color: #2a3550; }
        .submit {
          width: 100%;
          background: #2563eb;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, transform 0.15s;
        }
        .submit:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
        .submit:disabled { opacity: 0.3; cursor: not-allowed; }
        label { display: block; font-size: 12px; font-weight: 600; color: #3a4a6b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.6px; }
      `}</style>

      <div style={{ position: 'absolute', width: 400, height: 400, background: '#1d4ed8', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.07, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

      <div style={{ background: '#0a0e1a', border: '1px solid #141c2e', borderRadius: 20, padding: '40px 36px', maxWidth: 420, width: '100%', position: 'relative' }}>

        {/* Logo */}
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⭐</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>TrustDrop</span>
        </a>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 6 }}>Welcome back</h1>
        <p style={{ color: '#3a4a6b', fontSize: 14, marginBottom: 28 }}>Log in to your account</p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '11px 14px', marginBottom: 20, color: '#f87171', fontSize: 14 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="field" />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="field"
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        <button className="submit" onClick={handleLogin} disabled={!email || !password || loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#3a4a6b', marginTop: 24 }}>
          No account?{' '}
          <a href="/signup" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 500 }}>Sign up free</a>
        </p>
      </div>
    </div>
  )
}
