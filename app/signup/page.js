'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup() {
    setLoading(true)
    setError('')

    const slug = businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    const { error: businessError } = await supabase
      .from('businesses')
      .insert({
        id: data.user.id,
        email,
        business_name: businessName,
        slug,
      })

    if (businessError) {
      setError(businessError.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
        <div style={{ background: '#0d1117', border: '1px solid #1a2030', borderRadius: 24, padding: 48, maxWidth: 440, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>📧</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 12 }}>Check your email!</h2>
          <p style={{ color: '#666', fontSize: 15, lineHeight: 1.7 }}>We sent a confirmation link to <span style={{ color: '#60a5fa' }}>{email}</span>. Click it to activate your account.</p>
        </div>
      </div>
    )
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
          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 20, boxShadow: '0 0 20px rgba(37,99,235,0.4)' }}>⭐</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 8 }}>Create your account</h1>
          <p style={{ color: '#555', fontSize: 15 }}>Start collecting reviews in minutes</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#ef4444', fontSize: 14 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business name *</label>
          <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="My Awesome Business" className="field" />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="field" />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password *</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="field" />
        </div>

        <button className="submit-btn" onClick={handleSignup} disabled={!email || !password || !businessName || loading}>
          {loading ? '⏳ Creating account...' : 'Create account →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#555', marginTop: 24 }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>Log in</a>
        </p>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#222', marginTop: 16 }}>
          Powered by <span style={{ color: '#2563eb', fontWeight: 600 }}>TrustDrop</span>
        </p>
      </div>
    </div>
  )
}
