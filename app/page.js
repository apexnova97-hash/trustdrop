'use client'

export default function LandingPage() {
  return (
    <main style={{ fontFamily: "'Inter', sans-serif", background: '#f8f7ff', minHeight: '100vh', color: '#1a1a2e' }}>
      
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8f7ff; }
        .hero-btn {
          display: inline-block;
          background: #6c3ef4;
          color: white;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }
        .hero-btn:hover { background: #5a2fd9; }
        .secondary-btn {
          display: inline-block;
          background: transparent;
          color: #6c3ef4;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          border: 2px solid #6c3ef4;
          transition: all 0.2s;
        }
        .secondary-btn:hover { background: #6c3ef4; color: white; }
        .feature-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          flex: 1;
          min-width: 240px;
          box-shadow: 0 2px 12px rgba(108,62,244,0.07);
        }
        .step-number {
          width: 40px;
          height: 40px;
          background: #6c3ef4;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 16px;
        }
        @media (max-width: 768px) {
          .hero-buttons { flex-direction: column; align-items: flex-start; }
          .features-grid { flex-direction: column; }
          .steps-grid { flex-direction: column; }
          .pricing-grid { flex-direction: column; align-items: center; }
          .hero-title { font-size: 36px !important; }
          .nav-links { display: none; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ background: 'white', borderBottom: '1px solid #ede9fe', padding: '0 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: '#6c3ef4', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: 16 }}>⭐</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#1a1a2e' }}>TrustDrop</span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: 32 }}>
          <a href="#how" style={{ color: '#555', textDecoration: 'none', fontSize: 15 }}>How it works</a>
          <a href="#pricing" style={{ color: '#555', textDecoration: 'none', fontSize: 15 }}>Pricing</a>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/dashboard" className="secondary-btn" style={{ padding: '8px 20px', fontSize: 14 }}>Dashboard</a>
          <a href="/collect/testbiz" className="hero-btn" style={{ padding: '8px 20px', fontSize: 14 }}>Try it free</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 5% 80px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#ede9fe', color: '#6c3ef4', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
          ✨ The simplest way to collect reviews
        </div>
        <h1 className="hero-title" style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.15, color: '#1a1a2e', marginBottom: 24 }}>
          Turn happy customers into{' '}
          <span style={{ color: '#6c3ef4' }}>social proof</span>
        </h1>
        <p style={{ fontSize: 18, color: '#555', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
          Share a link. Customers leave a review in 30 seconds. 
          Embed beautiful testimonials on your website automatically.
        </p>
        <div className="hero-buttons" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/collect/testbiz" className="hero-btn" style={{ fontSize: 17, padding: '16px 36px' }}>
            See it in action →
          </a>
          <a href="#how" className="secondary-btn" style={{ fontSize: 17, padding: '16px 36px' }}>
            How it works
          </a>
        </div>
        <p style={{ marginTop: 20, color: '#999', fontSize: 14 }}>No credit card needed · Free to start</p>
      </section>

      {/* Demo Widget Preview */}
      <section style={{ padding: '0 5% 80px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 32, boxShadow: '0 8px 40px rgba(108,62,244,0.12)', border: '1px solid #ede9fe' }}>
          <p style={{ fontSize: 13, color: '#999', marginBottom: 20, fontWeight: 500 }}>LIVE WIDGET PREVIEW</p>
          <h3 style={{ color: '#6c3ef4', marginBottom: 20, fontSize: 18, fontWeight: 600 }}>What people say about Test Business</h3>
          {[
            { name: 'Sarah K.', rating: 5, text: 'Amazing service! The team was super helpful and delivery was fast. Highly recommend.' },
            { name: 'Michael T.', rating: 5, text: 'Best purchase I have made this year. Quality is outstanding and the support team is incredible.' },
            { name: 'Amina H.', rating: 4, text: 'Great product, really happy with everything. Will definitely be coming back.' },
          ].map((t, i) => (
            <div key={i} style={{ background: '#f8f7ff', borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, background: '#ede9fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6c3ef4', fontSize: 14 }}>
                  {t.name[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 14 }}>{t.name}</p>
                  <p style={{ fontSize: 12 }}>{'⭐'.repeat(t.rating)}</p>
                </div>
              </div>
              <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6 }}>{t.text}</p>
            </div>
          ))}
          <p style={{ fontSize: 11, color: '#ccc', textAlign: 'right', marginTop: 8 }}>Powered by TrustDrop</p>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'white', padding: '80px 5%' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, textAlign: 'center', marginBottom: 48, color: '#1a1a2e' }}>
            Everything you need to build trust
          </h2>
          <div className="features-grid" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { icon: '🔗', title: 'Share a link', desc: 'Get a unique collection link. Share it via WhatsApp, email, or Instagram. Customers click and review in 30 seconds.' },
              { icon: '⭐', title: 'Collect reviews', desc: 'Star ratings, written reviews, photos. All stored safely in your dashboard ready to approve.' },
              { icon: '🧩', title: 'Embed anywhere', desc: 'One line of code embeds a beautiful widget on any website. Auto-updates when new reviews come in.' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#1a1a2e' }}>{f.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.7, fontSize: 15 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '80px 5%', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, textAlign: 'center', marginBottom: 48, color: '#1a1a2e' }}>
          Up and running in minutes
        </h2>
        <div className="steps-grid" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {[
            { step: 1, title: 'Sign up and get your link', desc: 'Create your account and instantly get a unique review collection link for your business.' },
            { step: 2, title: 'Share with your customers', desc: 'Send the link via WhatsApp, email, or post it on your social media. Takes 10 seconds.' },
            { step: 3, title: 'Approve and display', desc: 'Reviews land in your dashboard. Approve the ones you like. They instantly appear on your website.' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', background: 'white', padding: 28, borderRadius: 16, boxShadow: '0 2px 12px rgba(108,62,244,0.07)' }}>
              <div className="step-number">{s.step}</div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#1a1a2e' }}>{s.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.7, fontSize: 15 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ background: 'white', padding: '80px 5%' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12, color: '#1a1a2e' }}>Simple pricing</h2>
          <p style={{ color: '#666', marginBottom: 48, fontSize: 16 }}>One plan. Everything included. Cancel anytime.</p>
          <div style={{ background: '#1a1a2e', borderRadius: 24, padding: 48, color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: '#6c3ef4', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.3 }} />
            <div style={{ position: 'relative' }}>
              <div style={{ background: '#6c3ef4', display: 'inline-block', padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, marginBottom: 24 }}>
                MOST POPULAR
              </div>
              <div style={{ fontSize: 56, fontWeight: 800, marginBottom: 4 }}>$19</div>
              <div style={{ color: '#aaa', marginBottom: 36, fontSize: 15 }}>per month</div>
              {[
                '✓ Unlimited review collection',
                '✓ Beautiful embeddable widget',
                '✓ Review approval dashboard',
                '✓ Custom collection page',
                '✓ Email notifications',
                '✓ Cancel anytime',
              ].map((f, i) => (
                <div key={i} style={{ textAlign: 'left', padding: '10px 0', borderBottom: '1px solid #333', fontSize: 15, color: '#ddd' }}>
                  {f}
                </div>
              ))}
              <a href="/collect/testbiz" className="hero-btn" style={{ display: 'block', marginTop: 36, textAlign: 'center', fontSize: 17, padding: '16px 0' }}>
                Start free trial →
              </a>
              <p style={{ color: '#888', fontSize: 13, marginTop: 16 }}>14 days free · No credit card needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 5%', textAlign: 'center', background: '#f8f7ff' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, color: '#1a1a2e' }}>
            Ready to collect your first review?
          </h2>
          <p style={{ color: '#666', fontSize: 17, marginBottom: 36, lineHeight: 1.7 }}>
            Join businesses using TrustDrop to build trust and get more customers.
          </p>
          <a href="/collect/testbiz" className="hero-btn" style={{ fontSize: 18, padding: '18px 48px' }}>
            Get started free →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a2e', color: '#aaa', padding: '32px 5%', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 24, height: 24, background: '#6c3ef4', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: 12 }}>⭐</span>
          </div>
          <span style={{ color: 'white', fontWeight: 700 }}>TrustDrop</span>
        </div>
        <p style={{ fontSize: 13 }}>© 2026 TrustDrop. Built with ❤️ from Ethiopia.</p>
      </footer>

    </main>
  )
}
