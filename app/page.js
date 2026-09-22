'use client'

export default function LandingPage() {
  return (
    <main style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#050810', minHeight: '100vh', color: 'white', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { overflow-x: hidden; scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
        body { overflow-x: hidden; }

        :root {
          --bg: #050810;
          --surface: #0a0e1a;
          --border: #141c2e;
          --blue: #2563eb;
          --blue-l: #60a5fa;
          --blue-ll: #93c5fd;
          --text: #e2e8f0;
          --muted: #64748b;
          --faint: #1e293b;
        }

        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowBorder {
          0%,100% { box-shadow: 0 0 20px rgba(37,99,235,0.1); border-color: rgba(37,99,235,0.2); }
          50% { box-shadow: 0 0 40px rgba(37,99,235,0.22); border-color: rgba(37,99,235,0.5); }
        }
        @keyframes badgeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .d { font-family: 'Space Grotesk', sans-serif; }

        .grad-text {
          background: linear-gradient(135deg, #93c5fd 0%, #818cf8 30%, #60a5fa 60%, #c4b5fd 100%);
          background-size: 250% auto;
          animation: gradientShift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .float { animation: floatY 5s ease-in-out infinite; }

        .fu { animation: fadeUp 0.65s ease both; }
        .fu-1 { animation-delay: 0.05s; }
        .fu-2 { animation-delay: 0.15s; }
        .fu-3 { animation-delay: 0.25s; }
        .fu-4 { animation-delay: 0.35s; }
        .fu-5 { animation-delay: 0.45s; }

        .dot-grid {
          background-image: radial-gradient(rgba(37,99,235,0.22) 1px, transparent 1px);
          background-size: 38px 38px;
        }

        .nav-a { color: #475569; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.15s; }
        .nav-a:hover { color: #94a3b8; }

        .btn-p {
          display: inline-flex; align-items: center; gap: 5px;
          background: var(--blue); color: #fff;
          padding: 10px 22px; border-radius: 9px;
          font-size: 14px; font-weight: 600; letter-spacing: 0.1px;
          text-decoration: none; border: none; cursor: pointer;
          font-family: inherit; white-space: nowrap;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .btn-p:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 22px rgba(37,99,235,0.45); }

        .btn-g {
          display: inline-flex; align-items: center; gap: 5px;
          background: transparent; color: #64748b;
          padding: 10px 22px; border-radius: 9px;
          font-size: 14px; font-weight: 500;
          text-decoration: none; border: 1px solid #1e293b; cursor: pointer;
          font-family: inherit; white-space: nowrap;
          transition: all 0.15s;
        }
        .btn-g:hover { border-color: #334155; color: #94a3b8; }

        .feat-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 26px;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; cursor: default;
        }
        .feat-card:hover { border-color: rgba(37,99,235,0.38); transform: translateY(-4px); box-shadow: 0 14px 40px rgba(37,99,235,0.1); }

        .step-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px;
          display: flex; gap: 18px; align-items: flex-start; transition: border-color 0.2s;
        }
        .step-card:hover { border-color: rgba(37,99,235,0.25); }

        .review-demo {
          background: #070b14; border: 1px solid var(--border); border-radius: 12px; padding: 16px;
          transition: border-color 0.2s;
        }
        .review-demo:hover { border-color: #1e2a40; }

        .pricing-wrap {
          background: var(--surface); border: 1px solid rgba(37,99,235,0.25);
          border-radius: 20px; padding: 38px; position: relative; overflow: hidden;
          animation: glowBorder 3.5s ease infinite;
        }

        .trial-badge {
          display: inline-flex; align-items: center; gap: 12px;
          background: rgba(37,99,235,0.055); border: 1px solid rgba(37,99,235,0.15);
          border-radius: 12px; padding: 12px 18px;
          animation: badgeIn 0.7s ease 0.5s both;
        }

        .live-dot {
          width: 9px; height: 9px; border-radius: 50%; background: #22d3ee;
          flex-shrink: 0; position: relative;
        }
        .live-dot::after {
          content: ''; position: absolute; inset: -3px; border-radius: 50%;
          border: 1.5px solid #22d3ee;
          animation: pulseRing 1.6s ease-out infinite;
        }

        .badge-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(37,99,235,0.07); border: 1px solid rgba(37,99,235,0.17);
          color: #93c5fd; padding: 5px 12px; border-radius: 100px;
          font-size: 12px; font-weight: 500; letter-spacing: 0.3px;
        }

        .stat-n {
          font-family: 'Space Grotesk', sans-serif; font-size: 34px; font-weight: 700;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .feat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .hero-h1 { font-size: clamp(30px, 9vw, 48px) !important; letter-spacing: -1.5px !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .hero-btns { flex-direction: column !important; align-items: stretch !important; }
          .hero-btns a, .hero-btns button { text-align: center !important; justify-content: center !important; }
          .nav-links { display: none !important; }
          .stats-g { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
          .foot-r { flex-direction: column !important; gap: 14px !important; }
          .section { padding: 56px 20px !important; }
          .hero-sec { padding: 110px 20px 64px !important; }
          .trial-badge { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
          .demo-pad { padding: 20px !important; }
          .pricing-wrap { padding: 28px 22px !important; }
          .nav-pad { padding: 0 20px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav-pad" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%', background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid #0d1220' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, background: '#2563eb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, boxShadow: '0 0 14px rgba(37,99,235,0.55)', flexShrink: 0 }}>⭐</div>
          <span className="d" style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px', color: 'white' }}>TrustDrop</span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: 28 }}>
          <a href="#features" className="nav-a">Features</a>
          <a href="#how" className="nav-a">How it works</a>
          <a href="#pricing" className="nav-a">Pricing</a>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/auth" className="btn-g" style={{ padding: '7px 15px', fontSize: 13 }}>Log in</a>
          <a href="/auth?mode=signup" className="btn-p" style={{ padding: '7px 15px', fontSize: 13 }}>Get started</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="dot-grid hero-sec" style={{ padding: '128px 5% 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 280, height: 280, background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)', top: '20%', left: '8%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 280, height: 280, background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)', top: '20%', right: '8%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          <div className="badge-pill fu fu-1" style={{ marginBottom: 22 }}>
            <span style={{ width: 5, height: 5, background: '#60a5fa', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
            Trusted by 500+ businesses worldwide
          </div>

          <h1 className="d hero-h1 fu fu-2" style={{ fontSize: 'clamp(38px, 6.5vw, 66px)', fontWeight: 700, lineHeight: 1.06, letterSpacing: '-2.5px', color: 'white', marginBottom: 18 }}>
            The easiest way to collect<br />
            <span className="grad-text">customer reviews</span>
          </h1>

          <p className="fu fu-3" style={{ fontSize: 'clamp(15px, 2.2vw, 18px)', color: '#64748b', lineHeight: 1.65, marginBottom: 34, maxWidth: 500, margin: '0 auto 34px' }}>
            Share a link. Customers review in 30 seconds. Embed stunning testimonials on any website automatically.
          </p>

          <div className="hero-btns fu fu-4" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
            <a href="/auth?mode=signup" className="btn-p" style={{ padding: '13px 28px', fontSize: 15 }}>Start for free →</a>
            <a href="/auth" className="btn-g" style={{ padding: '13px 28px', fontSize: 15 }}>See how it works</a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }} className="fu fu-5">
            <div className="trial-badge">
              <div className="live-dot" />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>14 days free — no credit card needed</p>
                <p style={{ fontSize: 12, color: '#475569' }}>Then $19/month after your trial. Cancel anytime.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ borderTop: '1px solid #0d1220', borderBottom: '1px solid #0d1220', padding: '13px 0', overflow: 'hidden', background: '#07090f' }}>
        <div style={{ display: 'flex', animation: 'marqueeScroll 22s linear infinite', width: 'max-content', gap: 52 }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 52, alignItems: 'center' }}>
              {['Shopify', 'WordPress', 'Webflow', 'Wix', 'Squarespace', 'Framer', 'Custom sites', 'Any website'].map(t => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', color: '#293548', fontSize: 13, fontWeight: 500 }}>
                  <span style={{ width: 3, height: 3, background: '#1e293b', borderRadius: '50%', display: 'inline-block' }} />
                  Works with {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* DEMO WIDGET */}
      <section className="section" style={{ padding: '72px 5%' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div className="float" style={{ background: '#0a0e1a', border: '1px solid #141c2e', borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.55), 0 0 60px rgba(37,99,235,0.07)' }}>
            <div style={{ background: '#070b14', borderBottom: '1px solid #0e1420', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
              <div style={{ flex: 1, background: '#0a0e1a', border: '1px solid #0e1420', borderRadius: 6, padding: '4px 10px', marginLeft: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#1e293b', fontSize: 11 }}>🔒</span>
                <span style={{ color: '#1e293b', fontSize: 12 }}>trustdrop.app/widget/your-business</span>
              </div>
            </div>
            <div className="demo-pad" style={{ padding: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <p style={{ color: '#60a5fa', fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Customer reviews</p>
                  <p style={{ color: '#293548', fontSize: 12 }}>3 verified reviews</p>
                </div>
                <div style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.14)', borderRadius: 8, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#f59e0b', fontSize: 12 }}>★★★★★</span>
                  <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: 14 }}>4.9</span>
                </div>
              </div>
              {[
                { n: 'Sarah K.', r: 5, t: 'Amazing! Super helpful and delivery was incredibly fast. Will definitely be back.', d: '2d ago' },
                { n: 'Michael T.', r: 5, t: 'Best purchase this year. Quality is outstanding and support is top notch.', d: '1w ago' },
                { n: 'Amina H.', r: 4, t: 'Really happy with everything. Great product and fast shipping.', d: '2w ago' },
              ].map((item, i) => (
                <div key={i} className="review-demo" style={{ marginBottom: i < 2 ? 10 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                    <div style={{ width: 30, height: 30, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#60a5fa', fontSize: 12, flexShrink: 0 }}>
                      {item.n[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontWeight: 600, fontSize: 13, color: '#e2e8f0' }}>{item.n}</p>
                        <span style={{ color: '#1e293b', fontSize: 11 }}>{item.d}</span>
                      </div>
                      <span style={{ color: '#f59e0b', fontSize: 11 }}>{'★'.repeat(item.r)}{'☆'.repeat(5 - item.r)}</span>
                    </div>
                  </div>
                  <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.55 }}>{item.t}</p>
                </div>
              ))}
              <p style={{ fontSize: 10, color: '#141c2e', textAlign: 'right', marginTop: 10 }}>Powered by TrustDrop</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '0 5% 72px' }}>
        <div className="stats-g" style={{ maxWidth: 560, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[{ n: '500+', l: 'Businesses' }, { n: '10k+', l: 'Reviews' }, { n: '4.9★', l: 'Avg rating' }].map((s, i) => (
            <div key={i} style={{ background: '#0a0e1a', border: '1px solid #141c2e', borderRadius: 14, padding: '18px 14px', textAlign: 'center' }}>
              <div className="stat-n">{s.n}</div>
              <div style={{ color: '#293548', fontSize: 12, marginTop: 4, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section" style={{ padding: '72px 5%', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, background: 'radial-gradient(circle, rgba(37,99,235,0.055) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1040, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge-pill" style={{ marginBottom: 14 }}>Features</div>
            <h2 className="d" style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 10, color: 'white' }}>Built for results</h2>
            <p style={{ color: '#475569', fontSize: 15, maxWidth: 360, margin: '0 auto' }}>Everything you need to turn happy customers into your best marketing channel.</p>
          </div>
          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              { i: '🔗', t: 'Share a link', d: 'Get a unique link. Share it anywhere: WhatsApp, email, Instagram bio. Customers review in 30 seconds, zero friction.' },
              { i: '✅', t: 'Approve reviews', d: 'Reviews land in your dashboard. One click to approve. They go live on your website widget instantly.' },
              { i: '🧩', t: 'Embed anywhere', d: 'Paste one line of code on any website. Your widget auto-updates whenever new reviews are approved.' },
              { i: '⭐', t: 'Star ratings', d: 'Collect 1-5 star ratings alongside written reviews. Display your average score for instant credibility.' },
              { i: '📊', t: 'Clean dashboard', d: 'All reviews in one place. Filter by status, rating, and date. Your business at a glance.' },
              { i: '⚡', t: 'Instant setup', d: 'Sign up, get your link, collect your first review — all in under 5 minutes. No tech skills needed.' },
            ].map((f, i) => (
              <div key={i} className="feat-card">
                <div style={{ fontSize: 24, marginBottom: 16 }}>{f.i}</div>
                <h3 className="d" style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#e2e8f0', letterSpacing: '-0.2px' }}>{f.t}</h3>
                <p style={{ color: '#475569', lineHeight: 1.6, fontSize: 13 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="section" style={{ padding: '72px 5%' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge-pill" style={{ marginBottom: 14 }}>How it works</div>
            <h2 className="d" style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-1.5px', color: 'white' }}>Live in minutes</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { n: '01', t: 'Create your account', d: 'Sign up in seconds. Instantly get your own collection page at trustdrop.app/collect/your-name.' },
              { n: '02', t: 'Share with customers', d: 'Drop your link in WhatsApp messages, your email footer, or Instagram bio.' },
              { n: '03', t: 'Approve and display', d: 'Reviews appear in your dashboard. Approve them, and your website widget updates automatically.' },
            ].map((s, i) => (
              <div key={i} className="step-card">
                <div style={{ width: 34, height: 34, minWidth: 34, background: 'rgba(37,99,235,0.09)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: 700, fontSize: 11, letterSpacing: '0.5px', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {s.n}
                </div>
                <div>
                  <h3 className="d" style={{ fontSize: 15, fontWeight: 600, marginBottom: 5, color: '#e2e8f0', letterSpacing: '-0.2px' }}>{s.t}</h3>
                  <p style={{ color: '#475569', lineHeight: 1.6, fontSize: 13 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section" style={{ padding: '72px 5%', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="badge-pill" style={{ marginBottom: 14 }}>Pricing</div>
          <h2 className="d" style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 8, color: 'white' }}>Simple pricing</h2>
          <p style={{ color: '#475569', fontSize: 15, marginBottom: 32 }}>One plan. Everything included. No surprises.</p>

          <div className="pricing-wrap">
            <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ marginBottom: 22, display: 'flex', alignItems: 'flex-end', gap: 4, justifyContent: 'center' }}>
                <span className="d" style={{ fontSize: 54, fontWeight: 700, color: 'white', letterSpacing: '-2px', lineHeight: 1 }}>$19</span>
                <span style={{ color: '#475569', fontSize: 14, paddingBottom: 6 }}>/month</span>
              </div>

              <div style={{ background: 'rgba(34,211,238,0.055)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 10, padding: '12px 16px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                <div className="live-dot" style={{ background: '#22d3ee' }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#67e8f9', marginBottom: 2 }}>14-day free trial included</p>
                  <p style={{ fontSize: 12, color: '#475569' }}>No credit card until trial ends</p>
                </div>
              </div>

              {['Unlimited review collection', 'Embeddable website widget', 'Approval dashboard', 'Custom collection page', 'Email notifications', 'Cancel anytime'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #0e1420', fontSize: 14, color: '#94a3b8' }}>
                  <span style={{ color: '#2563eb', flexShrink: 0, fontSize: 13 }}>✓</span> {f}
                </div>
              ))}
              <a href="/auth?mode=signup" className="btn-p" style={{ display: 'block', marginTop: 26, textAlign: 'center', fontSize: 15, padding: '13px 0', borderRadius: 10 }}>
                Start free trial →
              </a>
              <p style={{ color: '#293548', fontSize: 12, marginTop: 12, textAlign: 'center' }}>14 days free — then $19/month</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section" style={{ padding: '72px 5%', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 520, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 className="d" style={{ fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 700, letterSpacing: '-2px', marginBottom: 14, lineHeight: 1.1, color: 'white' }}>
            Ready to get your<br />
            <span className="grad-text">first review?</span>
          </h2>
          <p style={{ color: '#475569', fontSize: 15, marginBottom: 30, lineHeight: 1.65 }}>
            Join businesses using TrustDrop to turn happy customers into powerful social proof.
          </p>
          <a href="/auth?mode=signup" className="btn-p" style={{ fontSize: 15, padding: '13px 32px' }}>
            Get started free →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #0d1220', padding: '28px 5%' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 22, background: '#2563eb', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>⭐</div>
              <span className="d" style={{ fontWeight: 700, fontSize: 14, color: 'white' }}>TrustDrop</span>
            </div>
            <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
              {[['Features', '#features'], ['Pricing', '#pricing'], ['Log in', '/auth'], ['Sign up', '/auth?mode=signup']].map(([l, h]) => (
                <a key={l} href={h} style={{ color: '#1e293b', fontSize: 13, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#334155'}
                  onMouseLeave={e => e.target.style.color = '#1e293b'}>{l}</a>
              ))}
            </div>
          </div>
          <div className="foot-r" style={{ borderTop: '1px solid #0d1220', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13, color: '#60a5fa' }}>A</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 13, color: '#e2e8f0' }}>Abrham Tekuam</p>
                <p style={{ color: '#293548', fontSize: 12 }}>Founder — Built from Ethiopia 🇪🇹</p>
              </div>
            </div>
            <p style={{ color: '#141c2e', fontSize: 12 }}>© 2026 TrustDrop</p>
          </div>
        </div>
      </footer>

    </main>
  )
}
