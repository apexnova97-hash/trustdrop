'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

const STAR_PATH =
  'M20 9.9 22.7 16.8 30.1 17.2 24.4 22 26.3 29.1 20 25.2 13.7 29.1 15.6 22 9.9 17.2 17.3 16.8Z'

const EXAMPLES = ['Bloom & Co.', 'Flour & Salt', 'Marlow Bikes']

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function Logo() {
  return (
    <span className="ta-brand">
      <svg width="26" height="26" viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="#006BFF" />
        <path d={STAR_PATH} fill="#FFC62E" />
      </svg>
      <span className="ta-brand-name">TrustDrop</span>
    </span>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3.02h3.87c2.27-2.09 3.55-5.17 3.55-8.89z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.12A11.99 11.99 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.61H1.29a11.99 11.99 0 0 0 0 10.78l3.98-3.12z" />
      <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.61l3.98 3.12C6.22 6.88 8.87 4.77 12 4.77z" />
    </svg>
  )
}

function Eye({ off }) {
  return off ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function strengthOf(pw) {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 6) score += 1
  if (pw.length >= 10) score += 1
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score += 1
  return Math.min(score, 4)
}

const STRENGTH_LABEL = ['Too short', 'Weak', 'Okay', 'Good', 'Strong']

export default function AuthScreen({ initialMode = 'login', origin = '' }) {
  const [mode, setMode] = useState(initialMode)
  const [dir, setDir] = useState(1)
  const [done, setDone] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [business, setBusiness] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [error, setError] = useState('')
  // Kept in a ref as well as in state: consuming the URL is one-shot, so a
  // remount (React strict mode in development) must not lose the message.
  const returnedError = useRef('')

  const isSignup = mode === 'signup'
  const slug = slugify(business)
  const strength = strengthOf(password)
  const linkBase = origin ? origin.replace(/\/$/, '') + '/collect/' : '/collect/'

  // Google sends the visitor back either with a session in the URL or with an
  // error (a cancelled consent screen, for example). Read that error, then
  // strip it from the address bar so a refresh does not replay it.
  function consumeProviderError() {
    if (returnedError.current) return returnedError.current

    const hash = window.location.hash.replace(/^#/, '')
    const returned = new URLSearchParams(hash || window.location.search.replace(/^\?/, ''))
    const description = returned.get('error_description') || returned.get('error')
    if (!description) return ''

    const url = new URL(window.location.href)
    url.hash = ''
    ;['error', 'error_description', 'error_code'].forEach((key) => url.searchParams.delete(key))
    window.history.replaceState(null, '', url.pathname + url.search)
    returnedError.current = description.replace(/\+/g, ' ')
    return returnedError.current
  }

  useEffect(() => {
    let alive = true

    async function boot() {
      const providerError = consumeProviderError()
      const { data: { session } } = await supabase.auth.getSession()
      if (!alive) return
      // A returning Google visitor with a session goes straight to the app.
      if (session) {
        window.location.href = '/dashboard'
        return
      }
      if (providerError) setError((current) => current || providerError)
    }
    boot()

    // A Google sign-in returns as a full page load, so listen for the session
    // being established rather than relying only on the initial getSession().
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) window.location.href = '/dashboard'
    })
    return () => {
      alive = false
      data.subscription.unsubscribe()
    }
  }, [])

  // Mode changes stay on this page: no navigation, form values kept. /* v2-anims x */
  const switchMode = useCallback((next) => {
    setDir(next === 'signup' ? 1 : -1)
    setMode(next)
    setError('')
    setShowPass(false)
  }, [])

  async function submit(e) {
    e.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)

    if (isSignup) {
      // The database trigger creates the businesses row from this metadata.
      // Never insert into businesses from the browser: an email-confirmation
      // signup has no authenticated session yet, so RLS would block it.
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { business_name: business.trim() } },
      })

      if (signupError) {
        setError(signupError.message)
        setLoading(false)
        return
      }
      if (!data.user) {
        setError('Account could not be created. Please try again.')
        setLoading(false)
        return
      }
      if (data.session) window.location.href = '/dashboard'
      else setDone(true)
      setLoading(false)
      return
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }
    window.location.href = '/dashboard'
  }

  async function signInWithGoogle() {
    if (oauthLoading || loading) return
    setError('')
    setOauthLoading(true)

    const base = origin ? origin.replace(/\/$/, '') : window.location.origin
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: base + '/auth' },
    })

    if (oauthError) {
      setError(oauthError.message)
      setOauthLoading(false)
      return
    }
    // On success the browser is already leaving for Google, so the button
    // stays in its loading state until the page unloads.
  }

  const canSubmit = email.trim() && password && (!isSignup || business.trim())

  return (
    <div className="ta">
      <style>{`
        .ta {
          --paper:#F5F9FF; --ink:#0B3558; --ink-soft:#24486B; --muted:#6C7F94;
          --lime:#006BFF; --lime-hi:#0052CC; --blue:#006BFF; --line:#DCE7F5;
          --pad:clamp(22px,3.2vw,44px);
          --ease:cubic-bezier(.16,1,.3,1);
          display:grid; grid-template-columns:minmax(0,1fr); align-content:start;
          position:relative;
          min-height:100svh; background:var(--paper); color:var(--ink);
          font-family:var(--font-body),-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          font-size:17px; line-height:1.55; -webkit-font-smoothing:antialiased;
          -webkit-tap-highlight-color:transparent; overflow-x:clip;
        }
        .ta *, .ta *::before, .ta *::after { box-sizing:border-box; }
        .ta::before { content:''; position:absolute; left:-26%; top:-28%; width:min(760px,82vw); height:min(760px,82vw);
          border-radius:50%; pointer-events:none; z-index:0;
          background:radial-gradient(circle at 34% 32%, rgba(0,107,255,.16), rgba(0,107,255,0) 68%);
          animation:taDrift 26s var(--ease) infinite alternate; }
        .ta-arg, .ta-panel, .ta-masthead, .ta-copy, .ta-steps, .ta-note { position:relative; z-index:1; }
        @keyframes taDrift { from { transform:translate3d(0,0,0) scale(1); }
          to { transform:translate3d(52px,38px,0) scale(1.09); } }
        .ta :where(h1,h2,p,ol,li) { margin:0; padding:0; }
        .ta h1, .ta h2 { font-family:var(--font-display),var(--font-body),sans-serif; font-weight:700; }
        .ta ::selection { background:var(--lime); color:#fff; }
        .ta button { font-family:inherit; }

        /* ---------- the argument (paper) ---------- */
        .ta-arg { display:flex; flex-direction:column; gap:clamp(22px,3vh,30px); padding:var(--pad); }
        .ta-copy { margin-top:auto; }
        .ta-note { margin-top:auto; }
        .ta-masthead { display:flex; animation:taIn .5s var(--ease) both; }
        .ta-home { color:inherit; text-decoration:none; display:inline-flex; }
        .ta-brand { display:inline-flex; align-items:center; gap:9px; }
        .ta-brand svg { width:26px; height:26px; flex-shrink:0; }
        .ta-brand-name { font-family:var(--font-brand),cursive; font-weight:400;
          font-size:19px; letter-spacing:0; }
        .ta-h1 .ta-script { font-family:var(--font-script),cursive; font-style:normal;
          font-weight:600; letter-spacing:0; color:var(--blue); padding-right:.04em; }
        .ta-acc { font-family:var(--font-script),cursive; font-style:normal; font-weight:600;
          color:#8CC2FF; letter-spacing:0; font-size:1.1em; padding-right:.03em; }
        .ta-quote { font-family:var(--font-quote),cursive; font-style:normal; font-weight:400;
          font-size:1.55em; letter-spacing:0; color:#8CC2FF; line-height:0; }

        .ta-h1 { font-size:clamp(34px,6.5vw,98px); line-height:.9; letter-spacing:-.035em;
          font-weight:700; color:var(--ink); }
        .ta-line { display:block; overflow:hidden; padding-bottom:.16em; margin-bottom:-.08em; }
        .ta-line > span { display:block; transform:translateY(104%);
          animation:taRise .95s var(--ease) forwards; }
        .ta-line:nth-child(2) > span { animation-delay:.09s; }

        .ta-lead { margin-top:clamp(18px,2.4vw,26px); max-width:34ch;
          font-size:clamp(16px,1.5vw,19px); line-height:1.55; color:var(--ink-soft);
          animation:taIn .7s var(--ease) .26s both; }
        .ta-lead strong { color:var(--ink); font-weight:600; }

        .ta-steps { list-style:none; display:grid;
          gap:clamp(9px,1.2vw,13px); max-width:38ch; }
        .ta-steps li { font-size:17px; color:var(--ink); padding-left:22px; position:relative;
          animation:taIn .6s var(--ease) both; }
        .ta-steps li:nth-child(1) { animation-delay:.32s; }
        .ta-steps li:nth-child(2) { animation-delay:.4s; }
        .ta-steps li:nth-child(3) { animation-delay:.48s; }
        .ta-steps li::before { content:''; position:absolute; left:2px; top:.62em;
          width:8px; height:8px; border-radius:50%; background:var(--blue); }

        .ta-note { font-family:var(--font-hand),cursive; font-size:22px; line-height:1.35;
          color:var(--ink-soft); animation:taIn .6s var(--ease) .56s both;
          padding-top:clamp(4px,1vh,10px); }
        .ta-note b { color:var(--ink); font-weight:600; }

        /* ---------- the form (ink field) ---------- */
        .ta-panel { position:relative; background:var(--ink); color:var(--paper);
          display:flex; flex-direction:column; min-height:min(100svh,860px);
          padding:var(--pad); animation:taIn .8s var(--ease) .12s both;
          border-top:4px solid var(--blue); }
        .ta-toprow { display:flex; align-items:center; justify-content:space-between; gap:16px; }
        .ta-tabs { display:flex; gap:clamp(18px,2vw,26px); }
        .ta-tab { background:none; border:0; padding:6px 0; cursor:pointer; font-size:16px;
          font-weight:600; color:rgba(252,251,248,.55); position:relative;
          transition:color .2s, transform .18s var(--ease);
          &:focus-visible { outline:2px solid #8CC2FF; outline-offset:3px; }
          &:hover { color:rgba(252,251,248,.85); }
          &:active { transform:translateY(1px); }
        }
        .ta-tab::after { content:''; position:absolute; left:0; right:0; bottom:0; height:2px;
          background:var(--lime); transform:scaleX(0); transform-origin:left;
          transition:transform .4s var(--ease); }
        .ta-tab:hover { color:rgba(252,251,248,.85); }
        .ta-tab[aria-pressed="true"]::after { background:#7DB8FF; }
        .ta :focus-visible { outline-color:#8CC2FF; }
        .ta-tab[aria-pressed="true"] { color:var(--paper); }
        .ta-tab[aria-pressed="true"]::after { transform:scaleX(1); }
        .ta-tab:focus-visible { outline:2px solid #8CC2FF; outline-offset:3px; }

        .ta-back { display:inline-flex; align-items:center; gap:7px; color:rgba(252,251,248,.6);
          font-size:14px; text-decoration:none; transition:color .2s, gap .3s var(--ease); }
        .ta-back:hover { color:var(--paper); gap:10px; }
        .ta-back:focus-visible { outline:2px solid #8CC2FF; outline-offset:3px; }

        .ta-formwrap { margin:auto 0; padding:clamp(26px,6vh,54px) 0 clamp(20px,4vh,34px); width:100%; }
        .ta-panel h2 { font-size:clamp(23px,2.2vw,29px); letter-spacing:-.035em; line-height:1.15;
          font-weight:700; animation:taIn .6s var(--ease) .2s both; }
        .ta-sub { margin-top:7px; font-size:15.5px; color:rgba(252,251,248,.66);
          animation:taIn .6s var(--ease) .26s both; }

        /* Google sign-in: one action above the email form, same navy field */
        .ta-oauth { margin-top:clamp(20px,3vw,28px); animation:taIn .5s var(--ease) .14s both; }
        .ta-google { width:100%; min-height:53px; display:inline-flex; align-items:center; justify-content:center;
          gap:11px; border-radius:14px; border:1px solid rgba(252,251,248,.22);
          background:rgba(252,251,248,.06); color:var(--paper); font-family:inherit;
          font-size:16px; font-weight:600; letter-spacing:-.005em; cursor:pointer;
          transition:background .2s, border-color .2s, transform .25s var(--ease), opacity .2s; }
        .ta-google svg { flex-shrink:0; }
        .ta-google:hover:not(:disabled) { background:rgba(252,251,248,.12);
          border-color:rgba(252,251,248,.36); transform:translateY(-1px); }
        .ta-google:active:not(:disabled) { transform:translateY(0) scale(.995); }
        .ta-google:disabled { opacity:.6; cursor:not-allowed; }
        .ta-google:focus-visible { outline:2px solid #8CC2FF; outline-offset:3px; }
        .ta-google .ta-spin { border-color:rgba(245,249,255,.32); border-top-color:#8CC2FF; }
        .ta-or { display:flex; align-items:center; gap:12px; margin-top:clamp(16px,2.4vw,20px);
          font-size:13.5px; line-height:1.4; color:rgba(252,251,248,.6); }
        .ta-or::before, .ta-or::after { content:''; flex:1; height:1px; background:rgba(252,251,248,.18); }

        /* the block that swaps when you change mode */
        .ta-swap { animation:taSwap .42s var(--ease) both; }

        .ta-form { margin-top:clamp(20px,3vw,28px); display:grid; gap:clamp(17px,2.4vw,22px); }
        .ta-form > * { animation:taIn .45s var(--ease) both; }
        .ta-form > *:nth-child(1) { animation-delay:.06s; }
        .ta-form > *:nth-child(2) { animation-delay:.11s; }
        .ta-form > *:nth-child(3) { animation-delay:.16s; }
        .ta-form > *:nth-child(4) { animation-delay:.21s; }
        .ta-form > *:nth-child(5) { animation-delay:.26s; }
        .ta-form > *:focus-visible { outline:2px solid var(--lime); outline-offset:3px; }

        .ta-label { display:block; font-size:13.5px; font-weight:500; color:rgba(252,251,248,.62);
          margin-bottom:2px; }
        .ta-row { display:flex; align-items:baseline; justify-content:space-between; gap:10px; }
        .ta-hint { font-size:13.5px; color:rgba(252,251,248,.45); }

        /* the ruled line is the field itself, not a divider */
        .ta-input { width:100%; background:transparent; border:0; border-radius:0;
          border-bottom:1px solid rgba(252,251,248,.24); /* taste-skill-ignore */ color:var(--paper);
          font-family:inherit; font-size:17px; padding:9px 0 10px; outline:none;
          transition:border-color .2s, box-shadow .2s; }
        .ta-input:focus { border-bottom-color:#8CC2FF; box-shadow:0 1px 0 0 #8CC2FF; }
        .ta-input::placeholder { color:rgba(252,251,248,.42); }
        .ta-input:hover { border-bottom-color:rgba(252,251,248,.4); }
        .ta-input:focus { border-bottom-color:#8CC2FF; }
        .ta-input:-webkit-autofill, .ta-input:-webkit-autofill:focus {
          -webkit-text-fill-color:var(--paper); -webkit-box-shadow:0 0 0 60px var(--ink) inset; /* taste-skill-ignore */ }
        .ta-passwrap { position:relative; }
        .ta-input.ta-haspass { padding-right:34px; }
        .ta-eye { position:absolute; right:0; top:50%; transform:translateY(-50%);
          background:none; border:0; padding:6px 0 6px 8px; cursor:pointer;
          color:rgba(252,251,248,.45); display:flex; align-items:center; }
        .ta-eye:hover { color:var(--paper); }
        .ta-eye:active { transform:translateY(-50%) scale(.9); }
        .ta-eye:focus-visible { outline:2px solid var(--lime); outline-offset:2px; }

        /* the live link */
        .ta-link { margin-top:10px; }
        .ta-link-label { display:block; font-size:13.5px; color:rgba(252,251,248,.45); }
        .ta-link-value { display:block; margin-top:3px; font-size:15.5px; color:#8CC2FF;
          overflow-wrap:anywhere; animation:taFlash .5s var(--ease); }
        .ta-link-value i { font-style:normal; color:rgba(217,242,122,.55); }
        .ta-examples { display:flex; flex-wrap:wrap; align-items:baseline; gap:12px; margin-top:12px; }
        .ta-try { font-family:var(--font-hand),cursive; font-size:19px; line-height:1;
          color:rgba(252,251,248,.5); }
        .ta-example { background:none; border:0; padding:0; cursor:pointer; font-size:13.5px;
          color:rgba(252,251,248,.55); text-decoration:underline; text-underline-offset:3px;
          text-decoration-color:rgba(252,251,248,.25); transition:color .2s, text-decoration-color .2s; }
        .ta-example:hover { color:var(--paper); text-decoration-color:rgba(252,251,248,.6); }
        .ta-example:focus-visible { outline:2px solid var(--lime); outline-offset:3px; }

        .ta-meter { display:flex; align-items:center; gap:10px; margin-top:9px; }
        .ta-meter-track { display:grid; grid-template-columns:repeat(4,1fr); gap:4px; flex:1; }
        .ta-meter-track b { height:3px; background:rgba(252,251,248,.18); transition:background .3s; }
        .ta-meter-track b.on { background:var(--lime); }
        .ta-meter-track b.warn { background:#F0C46A; }
        .ta-meter-txt { font-size:13px; color:rgba(252,251,248,.6); min-width:54px; text-align:right; }

        .ta-error { display:flex; gap:9px; align-items:flex-start; border-radius:12px;
          background:rgba(255,120,120,.13); border:1px solid rgba(255,120,120,.32);
          padding:12px 14px; color:#FFD3CC; font-size:15px; line-height:1.5; }
        .ta-error { animation:taIn .4s var(--ease) both, taShake .4s .05s var(--ease); }
        .ta-form > *:focus-within .ta-label { color:var(--paper); }
        .ta-label { transition:color .2s; }
        @keyframes taShake { 0%,100% { transform:none; } 25% { transform:translateX(-3px); } 50% { transform:translateX(3px); } 75% { transform:translateX(-2px); } }
        @media (prefers-reduced-motion: reduce) { .ta-error { animation:taIn .01s both; } }
        .ta-error svg { flex-shrink:0; margin-top:2px; }

        .ta-submit { width:100%; border:0; border-radius:999px; min-height:54px;
          display:inline-flex; align-items:center; justify-content:center; gap:10px;
          background:var(--lime); color:#fff; font-size:16.5px; font-weight:700;
          letter-spacing:-.005em; cursor:pointer;
          transition:background .2s, transform .25s var(--ease), opacity .2s;
          &:focus-visible { outline:2px solid var(--paper); outline-offset:3px; }
        }
        .ta-submit svg { transition:transform .3s var(--ease); }
        .ta-submit:hover:not(:disabled) { background:var(--lime-hi); transform:translateY(-1px); }
        .ta-submit:hover:not(:disabled) svg { transform:translateX(3px); }
        .ta-submit:active:not(:disabled) { transform:scale(.99); }
        .ta-submit:disabled { opacity:.34; cursor:not-allowed; }
        .ta-submit:focus-visible { outline:2px solid var(--paper); outline-offset:3px; }
        .ta-spin { width:15px; height:15px; border:2px solid rgba(255,255,255,.4);
          border-top-color:#fff; border-radius:50%; animation:taSpin .7s linear infinite; }

        .ta-switch { margin-top:clamp(16px,2.4vw,20px); font-size:15px;
          color:rgba(252,251,248,.6); }
        .ta-switch button { background:none; border:0; padding:0; cursor:pointer;
          color:var(--paper); font-size:15px; font-weight:600;
          text-decoration:underline; text-underline-offset:3px;
          text-decoration-color:rgba(252,251,248,.3); transition:text-decoration-color .2s; }
        .ta-switch button:hover { text-decoration-color:var(--paper); }
        .ta-switch button:focus-visible { outline:2px solid var(--lime); outline-offset:3px; }

        .ta-terms { margin-top:clamp(20px,4vh,32px); font-size:13px;
          color:rgba(252,251,248,.45); animation:taIn .6s var(--ease) .6s both; }
        .ta-terms a { color:rgba(252,251,248,.7); text-decoration:none;
          text-decoration:underline; text-underline-offset:3px;
          text-decoration-color:rgba(252,251,248,.28); }
        .ta-terms a:hover { color:var(--paper); text-decoration-color:var(--paper); }

        /* sent state */
        .ta-sent { padding:6px 0; animation:taIn .6s var(--ease) both; }
        .ta-sent h2 { font-size:clamp(25px,2.6vw,33px); line-height:1.12; letter-spacing:-.035em; }
        .ta-sent p { margin-top:12px; font-size:16px; color:rgba(252,251,248,.66); line-height:1.6; }
        .ta-sent b { color:#8CC2FF; font-weight:600; overflow-wrap:anywhere; }
        .ta-sent .ta-submit { margin-top:26px; }

        @keyframes taRise { to { transform:none; } }
        @keyframes taIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
        @keyframes taSwap { from { opacity:0; transform:translate3d(var(--swap-x,14px),0,0) scale(.97); }
          to { opacity:1; transform:none; } }
        @keyframes taFlash { from { opacity:.25; } to { opacity:1; } }
        @keyframes taSpin { to { transform:rotate(360deg); } }

        .ta-input::placeholder { color:rgba(252,251,248,.42); transition:opacity .3s; }
        .ta-input:-webkit-autofill, .ta-input:-webkit-autofill:focus {
          -webkit-text-fill-color:var(--paper); -webkit-box-shadow:0 0 0 60px var(--ink) inset; /* taste-skill-ignore */
          placeholder-opacity:1;
        }

        @media (min-width: 900px) {
          .ta { grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr); min-height:100svh; }
          .ta-arg { min-height:100svh; }
        }
        /* the phone is its own composition: statement, then the form, then the steps */
        @media (max-width: 899px) {
          .ta-h1 { font-size:min(11.2vw,58px); }
          .ta-arg { display:contents; }
          /* one measured column, centred, so the page keeps a single pair of margins */
          .ta-masthead, .ta-copy, .ta-steps, .ta-note {
            width:100%; max-width:560px; justify-self:center; }
          .ta-masthead { order:1; padding:var(--pad) var(--pad) 0; }
          .ta-copy { order:2; margin:clamp(20px,3.4vw,28px) 0 0; padding:0 var(--pad); }
          .ta-panel { order:3; min-height:0; margin-top:clamp(26px,4.4vw,38px); }
          .ta-steps { order:4; margin:0; padding:clamp(26px,4.4vw,34px) var(--pad) 0; }
          .ta-note { order:5; margin:0; padding:clamp(16px,2.6vw,22px) var(--pad) var(--pad); }
          .ta-panel > * { width:100%; max-width:calc(560px - var(--pad) * 2); margin-inline:auto; }
          .ta-formwrap { margin-top:0; margin-bottom:0;
            padding:clamp(22px,4vh,32px) 0 clamp(4px,1vh,10px); }
        }
        @media (max-width: 420px) {
          .ta-steps { margin-top:clamp(18px,2.6vw,24px); gap:8px; }
          .ta-steps li { font-size:16px; }
          .ta-examples { gap:12px; }
        }
        @media (hover: none) {
          .ta-submit:hover:not(:disabled) { transform:none; }
          .ta-submit:hover:not(:disabled) svg { transform:none; }
          .ta-google:hover:not(:disabled) { background:rgba(252,251,248,.06);
            border-color:rgba(252,251,248,.22); transform:none; }
          .ta-back:hover { gap:7px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ta::before { animation:none; }
          .ta *, .ta *::before, .ta *::after {
            animation-duration:.001ms !important; animation-iteration-count:1 !important;
            animation-delay:0s !important; transition-duration:.001ms !important;
          }
          .ta-line > span { transform:none !important; }
        }
      `}</style>

      <section className="ta-arg">
        <header className="ta-masthead">
          <Link href="/" aria-label="TrustDrop home" className="ta-home">
            <Logo />
          </Link>
        </header>

        <div className="ta-copy">
          <h1 className="ta-h1">
            <span className="ta-line"><span>Collect <span className="ta-script">reviews</span></span></span>
            <span className="ta-line"><span>with one link.</span></span>
          </h1>
          <p className="ta-lead">
            Share it after a sale. Approve what goes live. Then put it on your site.
          </p>
        </div>

        <ol className="ta-steps">
          <li>Send one link to a happy customer.</li>
          <li>Approve each review before it shows.</li>
          <li>Embed the wall on any site or store.</li>
        </ol>

        <p className="ta-note">
          <b>Free for 14 days.</b> No card, no lock-in.
        </p>
      </section>

      <main className="ta-panel">
        <div className="ta-toprow">
          <div className="ta-tabs" role="group" aria-label="Log in or sign up">
            <button
              type="button"
              aria-pressed={!isSignup}
              className="ta-tab"
              onClick={() => switchMode('login')}
            >
              Log in
            </button>
            <button
              type="button"
              aria-pressed={isSignup}
              className="ta-tab"
              onClick={() => switchMode('signup')}
            >
              Sign up
            </button>
          </div>
          <Link className="ta-back" href="/" aria-label="Back to site">
            Back to site
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="ta-formwrap">
          {done ? (
            <div className="ta-sent">
              <h2>Check your <span className="ta-quote">email</span>.</h2>
              <p>
                We sent a confirmation link to <b>{email}</b>. Open it, then log in.
              </p>
              <button
                type="button"
                className="ta-submit"
                onClick={() => {
                  setDone(false)
                  switchMode('login')
                }}
              >
                Back to log in
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              className="ta-swap"
              key={mode}
              style={{ '--swap-x': dir > 0 ? '10px' : '-10px' }}
            >
              <h2>
                {isSignup ? <>Create your <span className="ta-acc">account</span></> : <>Welcome <span className="ta-acc">back</span></>}
              </h2>
              <p className="ta-sub">
                {isSignup ? 'Your review link is ready the moment you sign up.' : 'Log in to your workspace.'}
              </p>

              <div className="ta-oauth">
                <button
                  type="button"
                  className="ta-google"
                  onClick={signInWithGoogle}
                  disabled={oauthLoading || loading}
                  aria-busy={oauthLoading || undefined}
                >
                  {oauthLoading ? (
                    <>
                      <span className="ta-spin" aria-hidden="true" />
                      Opening Google…
                    </>
                  ) : (
                    <>
                      <GoogleMark />
                      Continue with Google
                    </>
                  )}
                </button>
                <p className="ta-or">or continue with email</p>
              </div>

              <form className="ta-form" onSubmit={submit} noValidate>
                {error ? (
                  <div className="ta-error" role="alert">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7.5v5M12 16.2v.3" />
                    </svg>
                    <span>{error}</span>
                  </div>
                ) : null}

                {isSignup ? (
                  <div>
                    <label className="ta-label" htmlFor="ta-biz">Business name</label>
                    <input
                      id="ta-biz"
                      className="ta-input"
                      type="text"
                      autoComplete="organization"
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      placeholder="Bloom & Co."
                    />
                    <div className="ta-link">
                      <span className="ta-link-label">Your review link</span>
                      <span className="ta-link-value" key={slug} aria-live="polite">
                        <i>{linkBase.replace(/^https?:\/\//, '')}</i>
                        {slug || 'your-business'}
                      </span>
                    </div>
                    <div className="ta-examples">
                      <span className="ta-try">Try</span>
                      {EXAMPLES.map((ex) => (
                        <button
                          key={ex}
                          type="button"
                          className="ta-example"
                          onClick={() => setBusiness(ex)}
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div>
                  <label className="ta-label" htmlFor="ta-email">Email</label>
                  <input
                    id="ta-email"
                    className="ta-input"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <div className="ta-row">
                    <label className="ta-label" htmlFor="ta-pass">Password</label>
                    {isSignup ? <span className="ta-hint">6+ characters</span> : null}
                  </div>
                  <div className="ta-passwrap">
                    <input
                      id="ta-pass"
                      className="ta-input ta-haspass"
                      type={showPass ? 'text' : 'password'}
                      autoComplete={isSignup ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isSignup ? 'Create a password' : 'Your password'}
                    />
                    <button
                      type="button"
                      className="ta-eye"
                      onClick={() => setShowPass((v) => !v)}
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      <Eye off={showPass} />
                    </button>
                  </div>
                  {isSignup && password ? (
                    <div className="ta-meter">
                      <div className="ta-meter-track" aria-hidden="true">
                        {[1, 2, 3, 4].map((n) => (
                          <b key={n} className={n > strength ? '' : strength <= 1 ? 'warn on' : strength === 2 ? 'warn' : 'on'} />
                        ))}
                      </div>
                      <span className="ta-meter-txt">{STRENGTH_LABEL[strength]}</span>
                    </div>
                  ) : null}
                </div>

                <button type="submit" className="ta-submit" disabled={!canSubmit || loading || oauthLoading}>
                  {loading ? (
                    <>
                      <span className="ta-spin" aria-hidden="true" />
                      {isSignup ? 'Creating account…' : 'Logging in…'}
                    </>
                  ) : (
                    <>
                      {isSignup ? 'Create account' : 'Log in'}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="ta-switch">
                  {isSignup ? 'Already have an account?' : 'New to TrustDrop?'}{' '}
                  <button type="button" onClick={() => switchMode(isSignup ? 'login' : 'signup')}>
                    {isSignup ? 'Log in' : 'Create one'}
                  </button>
                </p>
              </form>
            </div>
          )}
        </div>

        <p className="ta-terms">
          <a href="#">Terms</a> and <a href="#">Privacy</a>
        </p>
      </main>
    </div>
  )
}
