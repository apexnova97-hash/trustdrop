'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [step, setStep] = useState(1)

  const [lEmail, setLEmail] = useState('')
  const [lPass, setLPass] = useState('')
  const [lShowPass, setLShowPass] = useState(false)
  const [lLoading, setLLoading] = useState(false)
  const [lError, setLError] = useState('')

  const [sBiz, setSBiz] = useState('')
  const [sEmail, setSEmail] = useState('')
  const [sPass, setSPass] = useState('')
  const [sShowPass, setSShowPass] = useState(false)
  const [sLoading, setSLoading] = useState(false)
  const [sError, setSError] = useState('')

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [otpEmail, setOtpEmail] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [resendMsg, setResendMsg] = useState('')
  const otpRefs = useRef([])

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('mode') === 'signup') setIsSignup(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = '/dashboard'
    })
  }, [])

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])

  function handleOtpInput(i, val) {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    setOtpError('')
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
  }

  function handleOtpKey(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
    if (e.key === 'Enter' && otp.join('').length === 6) verifyOtp()
  }

  function handleOtpPaste(e) {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setOtp(text.split(''))
      otpRefs.current[5]?.focus()
    }
  }

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

    if (data.user && !data.session) {
      await supabase.from('businesses').insert({
        id: data.user.id, email: sEmail, business_name: sBiz, slug
      })
      setOtpEmail(sEmail)
      setResendTimer(60)
      setStep(2)
    } else if (data.session) {
      // Email confirmation disabled — user is already logged in
      await supabase.from('businesses').insert({
        id: data.user.id, email: sEmail, business_name: sBiz, slug
      })
      window.location.href = '/dashboard'
    }
    setSLoading(false)
  }

  async function verifyOtp() {
    const token = otp.join('')
    if (token.length !== 6) return
    setOtpLoading(true); setOtpError('')

    const { error } = await supabase.auth.verifyOtp({ email: otpEmail, token, type: 'signup' })

    if (error) {
      setOtpError(error.message || 'Invalid or expired code. Please try again.')
      setOtpLoading(false)
      return
    }

    window.location.href = '/dashboard'
  }

  async function resendCode() {
    if (resendTimer > 0) return
    setResendMsg('')
    const { error } = await supabase.auth.resend({ type: 'signup', email: otpEmail })
    if (error) {
      setResendMsg(error.message)
    } else {
      setResendMsg('New code sent!')
      setResendTimer(60)
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    }
  }

  const cardH = step === 2 ? 420 : isSignup ? 540 : 450

  return (
    <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', fontFamily: "'Inter', -apple-system, sans-serif", fontSize: '16px', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { font-size: 16px; overflow-x: hidden; -webkit-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; }

        @keyframes pulseRing { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(2.2);opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }

        .field-wrap { position: relative; }
        .field {
          width: 100%; background: #070b14; border: 1px solid #141c2e; border-radius: 10px;
          padding: 13px 16px; font-size: 16px; color: white; font-family: inherit; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field:focus { border-color: rgba(37,99,235,0.55); box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .field::placeholder { color: #1e293b; }
        .field.pass { padding-right: 46px; }

        .eye-btn {
          position: absolute; right: 4px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; padding: 8px;
          color: #334155; display: flex; align-items: center; justify-content: center;
          transition: color 0.15s;
        }
        .eye-btn:hover { color: #64748b; }

        .otp-box {
          width: 52px; height: 60px; background: #070b14; border: 1px solid #141c2e; border-radius: 12px;
          font-size: 24px; font-weight: 700; color: white; text-align: center; font-family: 'Space Grotesk', sans-serif;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s, background 0.15s; caret-color: #2563eb;
        }
        .otp-box:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); background: #0a1020; }
        .otp-box.filled { border-color: rgba(37,99,235,0.4); background: rgba(37,99,235,0.06); }
        .otp-box.error { border-color: rgba(239,68,68,0.5); animation: shake 0.4s ease; }

        .submit {
          width: 100%; background: #2563eb; color: white; border: none; padding: 14px; border-radius: 10px;
          font-size: 16px; font-weight: 600; cursor: pointer; font-family: inherit;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .submit:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(37,99,235,0.45); }
        .submit:disabled { opacity: 0.28; cursor: not-allowed; transform: none; box-shadow: none; }

        .flip-link { background: none; border: none; color: #60a5fa; cursor: pointer; font-family: inherit; font-size: 15px; font-weight: 500; transition: color 0.15s; padding: 0; }
        .flip-link:hover { color: #93c5fd; }

        .lbl { display: block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.7px; }

        .err-box { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); border-radius: 9px; padding: 11px 14px; color: #f87171; font-size: 14px; }
        .ok-box { background: rgba(52,211,153,0.06); border: 1px solid rgba(52,211,153,0.2); border-radius: 9px; padding: 9px 14px; color: #34d399; font-size: 13px; text-align: center; }

        .live-dot { width: 10px; height: 10px; border-radius: 50%; background: #22d3ee; flex-shrink: 0; position: relative; }
        .live-dot::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 1.5px solid #22d3ee; animation: pulseRing 1.6s ease-out infinite; }

        .face {
          position: absolute; inset: 0;
          backface-visibility: hidden; -webkit-backface-visibility: hidden;
          background: #0a0e1a; border: 1px solid #141c2e; border-radius: 20px;
          padding: 34px 30px; display: flex; flex-direction: column;
        }

        @media (max-width: 480px) {
          .face { padding: 26px 20px !important; }
          .otp-box { width: 44px !important; height: 52px !important; font-size: 20px !important; }
          .otp-row { gap: 8px !important; }
        }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, position: 'relative', zIndex: 1, animation: 'fadeIn 0.5s ease' }}>
        <div style={{ width: 28, height: 28, background: '#2563eb', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, boxShadow: '0 0 14px rgba(37,99,235,0.55)' }}>⭐</div>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '17px', color: 'white', letterSpacing: '-0.3px' }}>TrustDrop</span>
      </a>

      {step === 2 ? (
        <div style={{ width: '100%', maxWidth: 400, background: '#0a0e1a', border: '1px solid #141c2e', borderRadius: 20, padding: '34px 30px', position: 'relative', zIndex: 1, animation: 'fadeIn 0.4s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: '24px' }}>📧</div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: 8, letterSpacing: '-0.5px' }}>Check your email</h1>
            <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6 }}>
              We sent a 6-digit code to<br />
              <span style={{ color: '#60a5fa', fontWeight: 600 }}>{otpEmail}</span>
            </p>
          </div>

          {otpError && <div className="err-box" style={{ marginBottom: 16, textAlign: 'center' }}>{otpError}</div>}
          {resendMsg && !otpError && <div className="ok-box" style={{ marginBottom: 16 }}>{resendMsg}</div>}

          <div className="otp-row" style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }} onPaste={handleOtpPaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => otpRefs.current[i] = el}
                className={`otp-box${digit ? ' filled' : ''}${otpError ? ' error' : ''}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpInput(i, e.target.value)}
                onKeyDown={e => handleOtpKey(i, e)}
                autoFocus={i === 0}
              />
            ))}
          </div>

          <button className="submit" onClick={verifyOtp} disabled={otp.join('').length !== 6 || otpLoading}>
            {otpLoading ? 'Verifying...' : 'Verify & continue →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#475569', marginTop: 20 }}>
            Didn't get the code?{' '}
            <button
              onClick={resendCode}
              style={{ background: 'none', border: 'none', cursor: resendTimer > 0 ? 'default' : 'pointer', color: resendTimer > 0 ? '#293548' : '#60a5fa', fontSize: '14px', fontWeight: 500, fontFamily: 'inherit', padding: 0 }}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
            </button>
          </p>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#293548', marginTop: 10 }}>
            One-time verification — you won't need to do this again.
          </p>
        </div>
      ) : (
        <div style={{ perspective: '1200px', width: '100%', maxWidth: 400, position: 'relative', zIndex: 1, animation: 'fadeIn 0.6s ease 0.1s both' }}>
          <div style={{
            position: 'relative',
            height: cardH,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.65s cubic-bezier(0.4,0,0.2,1), height 0.35s ease',
            transform: isSignup ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}>

            <div className="face">
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: 6, letterSpacing: '-0.5px' }}>Welcome back</h1>
              <p style={{ color: '#475569', fontSize: '15px', marginBottom: 26 }}>Log in to your TrustDrop account</p>

              {lError && <div className="err-box" style={{ marginBottom: 18 }}>{lError}</div>}

              <div style={{ marginBottom: 16 }}>
                <label className="lbl">Email</label>
                <input type="email" value={lEmail} onChange={e => setLEmail(e.target.value)} placeholder="you@example.com" className="field" />
              </div>
              <div style={{ marginBottom: 26 }}>
                <label className="lbl">Password</label>
                <div className="field-wrap">
                  <input type={lShowPass ? 'text' : 'password'} value={lPass} onChange={e => setLPass(e.target.value)} placeholder="••••••••" className="field pass" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                  <button type="button" className="eye-btn" onClick={() => setLShowPass(!lShowPass)}>
                    {lShowPass ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <button className="submit" onClick={handleLogin} disabled={!lEmail || !lPass || lLoading}>
                {lLoading ? 'Logging in...' : 'Log in'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '15px', color: '#475569', marginTop: 22 }}>
                No account?{' '}
                <button className="flip-link" onClick={() => setIsSignup(true)}>Sign up free →</button>
              </p>
            </div>

            <div className="face" style={{ transform: 'rotateY(180deg)' }}>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: 6, letterSpacing: '-0.5px' }}>Create account</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <div className="live-dot" />
                <p style={{ color: '#475569', fontSize: '14px' }}>14 days free — no credit card needed</p>
              </div>

              {sError && <div className="err-box" style={{ marginBottom: 16 }}>{sError}</div>}

              <div style={{ marginBottom: 14 }}>
                <label className="lbl">Business name</label>
                <input type="text" value={sBiz} onChange={e => setSBiz(e.target.value)} placeholder="My Business" className="field" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="lbl">Email</label>
                <input type="email" value={sEmail} onChange={e => setSEmail(e.target.value)} placeholder="you@example.com" className="field" />
              </div>
              <div style={{ marginBottom: 22 }}>
                <label className="lbl">Password</label>
                <div className="field-wrap">
                  <input type={sShowPass ? 'text' : 'password'} value={sPass} onChange={e => setSPass(e.target.value)} placeholder="Min 6 characters" className="field pass" />
                  <button type="button" className="eye-btn" onClick={() => setSShowPass(!sShowPass)}>
                    {sShowPass ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <button className="submit" onClick={handleSignup} disabled={!sBiz || !sEmail || !sPass || sLoading}>
                {sLoading ? 'Creating account...' : 'Create account →'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '15px', color: '#475569', marginTop: 20 }}>
                Have an account?{' '}
                <button className="flip-link" onClick={() => setIsSignup(false)}>Log in</button>
              </p>
            </div>

          </div>
        </div>
      )}

      <p style={{ color: '#141c2e', fontSize: '13px', marginTop: 22, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        By continuing you agree to our{' '}
        <a href="#" style={{ color: '#1e293b', textDecoration: 'none' }}>Terms</a>
        {' '}and{' '}
        <a href="#" style={{ color: '#1e293b', textDecoration: 'none' }}>Privacy Policy</a>
      </p>
    </div>
  )
}
