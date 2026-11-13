import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — TrustDrop',
  description: 'What TrustDrop collects, why, and how to have it deleted.',
}

const UPDATED = '13 November 2026'
const CONTACT = 'atunity9@gmail.com'

export default function PrivacyPage() {
  return (
    <main className="legal">
      <style>{`
        .legal {
          --paper:#FFFFFF; --ink:#0B3558; --body:#476788; --muted:#5F7285;
          --blue:#006BFF; --line:#DCE7F5;
          min-height:100vh; min-height:100dvh; margin:0; background:var(--paper); color:var(--ink);
          font-family:var(--font-body),'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          padding:clamp(24px,6vw,72px) clamp(20px,6vw,32px) 96px;
          box-sizing:border-box;
        }
        .legal-wrap { max-width:68ch; margin:0 auto; }
        .legal-top { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:56px; }
        .legal-brand { display:flex; align-items:center; gap:11px; text-decoration:none; color:var(--ink); }
        .legal-brand img { width:32px; height:32px; border-radius:9px; display:block; }
        .legal-brand span { font-family:var(--font-display),'Plus Jakarta Sans',sans-serif; font-weight:800; font-size:19px; letter-spacing:-.03em; }
        .legal-back { color:var(--muted); text-decoration:none; font-size:14px; border-bottom:1px solid var(--line); padding-bottom:2px; }
        .legal-back:hover { color:var(--blue); border-color:var(--blue); }
        .legal h1 {
          margin:0 0 12px; font-family:var(--font-display),'Plus Jakarta Sans',sans-serif;
          font-size:clamp(32px,6vw,50px); line-height:1.02; letter-spacing:-.045em; font-weight:800;
        }
        .legal .stamp { margin:0 0 40px; color:var(--muted); font-size:14px; }
        .legal h2 {
          margin:40px 0 10px; font-family:var(--font-display),'Plus Jakarta Sans',sans-serif;
          font-size:17px; letter-spacing:-.01em; font-weight:700;
        }
        .legal p, .legal li { margin:0 0 12px; color:var(--body); font-size:16.5px; line-height:1.65; }
        .legal ul { margin:0 0 12px; padding-left:20px; }
        .legal a { color:var(--blue); text-decoration:underline; text-underline-offset:3px; text-decoration-color:var(--line); }
        .legal a:hover { text-decoration-color:var(--blue); }
        .legal .rule { height:1px; background:var(--line); margin:40px 0 0; border:0; }
        .legal .end { margin-top:16px; color:var(--muted); font-size:14px; }
      `}</style>

      <div className="legal-wrap">
        <div className="legal-top">
          <Link className="legal-brand" href="/">
            <img src="/icons/icon-192.png" alt="" width="32" height="32" />
            <span>TrustDrop</span>
          </Link>
          <Link className="legal-back" href="/">Back to site</Link>
        </div>

        <h1>Privacy Policy</h1>
        <p className="stamp">Last updated {UPDATED}</p>

        <p>
          TrustDrop is a review collection service operated by Abrham Tekuam. This policy covers the
          TrustDrop Android app and the website at trustdrop-lac.vercel.app.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>When you create an account: your email address and, if you sign in with Google, your name and profile picture from Google.</li>
          <li>When you use the dashboard: the business name, review link and settings you enter.</li>
          <li>When a customer leaves a review through your link: the name, rating and text they submit.</li>
        </ul>

        <h2>Why we collect it</h2>
        <p>
          To run your account, display your reviews in your dashboard and on your website widget, and
          send the sign-in and account emails the service requires. We do not sell personal data and we
          do not use it for advertising.
        </p>

        <h2>Who processes it</h2>
        <p>
          Supabase (database and authentication), Vercel (hosting), and our payment provider for
          subscription billing. Each processes data on our behalf.
        </p>

        <h2>Storage on your device</h2>
        <p>
          The app keeps your session on your device so you stay signed in. Reviews are not stored on
          the device for offline use.
        </p>

        <h2>Retention and deletion</h2>
        <p>
          Account data is kept while your account is open. Email{' '}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a> to request a copy or deletion of your data, and
          we will action it within 30 days.
        </p>

        <h2>Children</h2>
        <p>TrustDrop is not intended for anyone under 16.</p>

        <h2>Changes</h2>
        <p>Any change will be posted on this page with a new date above.</p>

        <hr className="rule" />

        <h2>Contact</h2>
        <p>
          Abrham Tekuam — <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
        </p>
        <p className="end">TrustDrop</p>
      </div>
    </main>
  )
}
