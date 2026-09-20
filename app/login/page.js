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

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    window.location.href = '/dashboard'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .field { width: 100%; background: #0a0e1a; border: 1px solid #1a2030; border-radius: 12px; padding: 14px 18px; font-size: 15px; color: white; font-family: inherit; outline: none; transition: border-color 0.2s; }
        .field:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .field::placeholder { color: #333; }
        .submit-btn { width: 100%; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 16px; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; box-shadow: 0 0 30px rgba(37,99,235,0.3); }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 50px rgba(37,99,235,0.5); }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div style={{ position: 'absolute', width: 500, height: 500, background: '#1d4ed8', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.08, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

      <div style={{ background: '#0d1117', border: '1px solid #1a2030', borderRadius: 24, padding: '40px 36px', maxWidth: 460, width: '100%', boxShadow: '0 0 80px rgba(37,99,235,0.12)', position: 'relative' }}>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 20, boxShadow: '0 0 20px rgba(37,99,235,0.4)' }}>⭐</div>
          </a>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: '#555', fontSize: 15 }}>Log in to your TrustDrop account</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#ef4444', fontSize: 14 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="field" />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password *</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="field"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
        </div>

        <button className="submit-btn" onClick={handleLogin} disabled={!email || !password || loading}>
          {loading ? '⏳ Logging in...' : 'Log in →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#555', marginTop: 24 }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>Sign up free</a>
        </p>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#222', marginTop: 16 }}>
          Powered by <span style={{ color: '#2563eb', fontWeight: 600 }}>TrustDrop</span>
        </p>
      </div>
    </div>
  )
}
