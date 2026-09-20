'use client'
import { useState } from 'react'

export default function LandingPage() {
  const [email, setEmail] = useState('')

  return (
    <main style={{ fontFamily: "'Inter', sans-serif", background: '#050810', minHeight: '100vh', color: 'white', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .glow-blue { 
          position: absolute; 
          border-radius: 50%; 
          filter: blur(120px); 
          pointer-events: none;
          z-index: 0;
        }

        .nav-link { color: #888; text-decoration: none; font-size: 15px; transition: color 0.2s; }
        .nav-link:hover { color: white; }

        .cta-btn {
          display: inline-block;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 14px 32px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          font-family: inherit;
          box-shadow: 0 0 30px rgba(37,99,235,0.4);
        }
        .cta-btn:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 0 50px rgba(37,99,235,0.6);
        }

        .ghost-btn {
          display: inline-block;
          background: transparent;
          color: #aaa;
          padding: 14px 32px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          border: 1px solid #222;
          transition: all 0.2s;
          font-family: inherit;
        }
        .ghost-btn:hover { border-color: #444; color: white; }

        .feature-card {
          background: #0d1117;
          border: 1px solid #1a2030;
          border-radius: 20px;
          padding: 32px;
          transition: border-color 0.2s, transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .feature-card:hover { 
          border-color: #2563eb; 
          transform: translateY(-4px);
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #2563eb, transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .feature-card:hover::before { opacity: 1; }

        .review-card {
          background: #0d1117;
          border: 1px solid #1a2030;
          border-radius: 16px;
          padding: 24px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(37,99,235,0.1);
          border: 1px solid rgba(37,99,235,0.3);
          color: #60a5fa;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
        }

        .step-line {
          position: absolute;
          left: 20px;
          top: 48px;
          bottom: -32px;
          width: 1px;
          background: linear-gradient(180deg, #2563eb, transparent);
        }

        .pricing-card {
          background: #0d1117;
          border: 1px solid #1e3a5f;
          border-radius: 24px;
          padding: 48px;
          position: relative;
          overflow: hidden;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 0 80px rgba(37,99,235,0.15);
        }

        .input-field {
          background: #0d1117;
          border: 1px solid #222;
          border-radius: 10px;
          padding: 14px 18px;
          font-size: 15px;
          color: white;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .input-field:focus { border-color: #2563eb; }
        .input-field::placeholder { color: #555; }

        @media (max-width: 768px) {
          .hero-title { font-size: 38px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .hero-btns { flex-direction: column !important; }
          .nav-links { display: none !important; }
          .steps-grid { gap: 40px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 5%', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,8,16,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #111' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 0 12px rgba(37,99,235,0.5)' }}>⭐</div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>TrustDrop</span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: 32 }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how" className="nav-link">How it works</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/dashboard" className="ghost-btn" style={{ padding: '8px 18px', fontSize: 14 }}>Dashboard</a>
          <a href="/collect/testbiz" className="cta-btn" style={{ padding: '8px 18px', fontSize: 14 }}>Try free →</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 160, paddingBottom: 120, textAlign: 'center', padding: '160px 5% 120px', position: 'relative' }}>
        {/* Glow effects */}
        <div className="glow-blue" style={{ width: 600, height: 600, background: '#1d4ed8', top: -200, left: '50%', transform: 'translateX(-50%)', opacity: 0.12 }} />
        <div className="glow-blue" style={{ width: 300, height: 300, background: '#2563eb', top: 100, left: '20%', opacity: 0.07 }} />
        <div className="glow-blue" style={{ width: 300, height: 300, background: '#2563eb', top: 100, right: '20%', opacity: 0.07 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto' }}>
          <div className="badge" style={{ marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, background: '#60a5fa', borderRadius: '50%', display: 'inline-block' }} />
            AI-powered testimonial collection
          </div>

          <h1 className="hero-title" style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.08, marginBottom: 28, letterSpacing: '-2px' }}>
            Turn customers into
            <br />
            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              your best salespeople
            </span>
          </h1>

          <p style={{ fontSize: 19, color: '#888', lineHeight: 1.7, marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
            Share a link. Customers leave a review in 30 seconds. 
            Embed stunning testimonials on your website automatically.
          </p>

          <div className="hero-btns" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <a href="/collect/testbiz" className="cta-btn" style={{ fontSize: 17, padding: '16px 40px' }}>
              See it in action →
            </a>
            <a href="#how" className="ghost-btn" style={{ fontSize: 17, padding: '16px 40px' }}>
              How it works
            </a>
          </div>

          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['No credit card needed', 'Free 14-day trial', 'Cancel anytime'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#555', fontSize: 14 }}>
                <span style={{ color: '#2563eb', fontSize: 16 }}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WIDGET DEMO */}
      <section style={{ padding: '0 5% 120px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ background: '#0d1117', border: '1px solid #1a2030', borderRadius: 24, padding: 32, boxShadow: '0 0 80px rgba(37,99,235,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              <span style={{ color: '#555', fontSize: 13, marginLeft: 8 }}>trustdrop.vercel.app/widget/your-business</span>
            </div>
            <h3 style={{ color: '#60a5fa', marginBottom: 20, fontSize: 16, fontWeight: 600 }}>What people say about Your Business</h3>
            {[
              { name: 'Sarah K.', rating: 5, text: 'Amazing service! The team was super helpful and delivery was incredibly fast.' },
              { name: 'Michael T.', rating: 5, text: 'Best purchase this year. Quality is outstanding and support is incredible.' },
              { name: 'Amina H.', rating: 4, text: 'Great product, really happy with everything. Will definitely come back.' },
            ].map((t, i) => (
              <div key={i} className="review-card" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#60a5fa', fontSize: 14 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: '#f59e0b' }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</p>
                  </div>
                </div>
                <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6 }}>{t.text}</p>
              </div>
            ))}
            <p style={{ fontSize: 11, color: '#333', textAlign: 'right', marginTop: 8 }}>Powered by TrustDrop</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 5% 120px', position: 'relative' }}>
        <div className="glow-blue" style={{ width: 500, height: 500, background: '#1d4ed8', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.05 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge" style={{ marginBottom: 20 }}>Features</div>
            <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
              Everything you need to<br />build social proof
            </h2>
            <p style={{ color: '#666', fontSize: 17 }}>Built for businesses that want more customers through trust.</p>
          </div>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { icon: '🔗', title: 'One-click collection', desc: 'Share a unique link anywhere — WhatsApp, email, Instagram bio. Customers review in 30 seconds with zero friction.' },
              { icon: '🤖', title: 'AI-powered insights', desc: 'Automatically summarize feedback trends, spot patterns, and understand what customers love most about your business.' },
              { icon: '🧩', title: 'Embed anywhere', desc: 'Paste one line of code on any website. Your widget auto-updates with new approved reviews in real time.' },
              { icon: '✅', title: 'Smart moderation', desc: 'Review dashboard lets you approve, reject, or reply to testimonials before they go live on your site.' },
              { icon: '⭐', title: 'Star ratings', desc: 'Collect 1-5 star ratings alongside written reviews. Display your average score to build instant credibility.' },
              { icon: '📊', title: 'Analytics dashboard', desc: 'Track how many reviews you collect, your average rating, and which products or services get the most praise.' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ fontSize: 32, marginBottom: 20 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.7, fontSize: 14 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '80px 5% 120px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge" style={{ marginBottom: 20 }}>How it works</div>
            <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-1px' }}>Live in under 5 minutes</h2>
          </div>
          <div className="steps-grid" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              { step: '01', title: 'Sign up and get your link', desc: 'Create your account and instantly get a unique collection link like trustdrop.app/collect/your-business.' },
              { step: '02', title: 'Share with customers', desc: 'Drop the link in your WhatsApp messages, email footer, or Instagram bio. Takes 10 seconds to set up.' },
              { step: '03', title: 'Approve and display', desc: 'Reviews appear in your dashboard. One click to approve. Your website widget updates automatically.' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 24, position: 'relative' }}>
                {i < 2 && <div className="step-line" />}
                <div style={{ width: 44, height: 44, minWidth: 44, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.4)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: 700, fontSize: 13, position: 'relative', zIndex: 1 }}>
                  {s.step}
                </div>
                <div style={{ background: '#0d1117', border: '1px solid #1a2030', borderRadius: 16, padding: 24, flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ color: '#666', lineHeight: 1.7, fontSize: 15 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '80px 5% 120px', position: 'relative' }}>
        <div className="glow-blue" style={{ width: 600, height: 600, background: '#1d4ed8', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.08 }} />
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="badge" style={{ marginBottom: 20 }}>Pricing</div>
          <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>One simple plan</h2>
          <p style={{ color: '#666', fontSize: 17, marginBottom: 48 }}>Everything included. No hidden fees.</p>

          <div className="pricing-card" style={{ margin: '0 auto' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 250, height: 250, background: '#1d4ed8', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15 }} />
            <div style={{ position: 'relative' }}>
              <div style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)', display: 'inline-block', padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#60a5fa', marginBottom: 28 }}>
                ✦ MOST POPULAR
              </div>
              <div style={{ marginBottom: 32 }}>
                <span style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-2px' }}>$19</span>
                <span style={{ color: '#555', fontSize: 16, marginLeft: 4 }}>/month</span>
              </div>
              {[
                '✓ Unlimited review collection',
                '✓ Beautiful embeddable widget',
                '✓ Review approval dashboard',
                '✓ AI-powered insights',
                '✓ Custom collection page',
                '✓ Email notifications',
                '✓ Cancel anytime',
              ].map((f, i) => (
                <div key={i} style={{ textAlign: 'left', padding: '12px 0', borderBottom: '1px solid #131a28', fontSize: 15, color: '#aaa', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#2563eb', flexShrink: 0 }}>✓</span>
                  <span>{f.replace('✓ ', '')}</span>
                </div>
              ))}
              <a href="/collect/testbiz" className="cta-btn" style={{ display: 'block', marginTop: 32, textAlign: 'center', fontSize: 17, padding: '16px 0' }}>
                Start free trial →
              </a>
              <p style={{ color: '#444', fontSize: 13, marginTop: 16 }}>14 days free · No credit card needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 5% 120px', textAlign: 'center', position: 'relative' }}>
        <div className="glow-blue" style={{ width: 500, height: 500, background: '#1d4ed8', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.1 }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-2px', marginBottom: 20, lineHeight: 1.1 }}>
            Ready to collect your<br />
            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              first review?
            </span>
          </h2>
          <p style={{ color: '#666', fontSize: 18, marginBottom: 48, lineHeight: 1.7 }}>
            Join businesses using TrustDrop to turn happy customers into powerful social proof.
          </p>
          <a href="/collect/testbiz" className="cta-btn" style={{ fontSize: 18, padding: '18px 52px' }}>
            Get started free →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #111', padding: '40px 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>⭐</div>
          <span style={{ fontWeight: 700 }}>TrustDrop</span>
        </div>
        <p style={{ color: '#444', fontSize: 13 }}>© 2026 TrustDrop · Built with ❤️ from Ethiopia</p>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="#" style={{ color: '#444', fontSize: 13, textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: '#444', fontSize: 13, textDecoration: 'none' }}>Terms</a>
        </div>
      </footer>

    </main>
  )
}
