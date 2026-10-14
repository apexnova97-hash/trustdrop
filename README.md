# TrustDrop

TrustDrop is a SaaS tool that helps businesses collect, manage, and showcase customer testimonials. Businesses get a shareable link where customers can submit reviews, which the business can then curate and display.

🔗 **Live app:** https://trustdrop-lac.vercel.app

## Features

- User authentication and account management
- Testimonial collection via shareable public link
- Dashboard to view, manage, and curate submitted testimonials
- Email verification (OTP) on signup
- Clean, responsive UI

## Tech Stack

- **Frontend:** Next.js 16, React
- **Backend / Database:** Supabase (PostgreSQL + Auth)
- **Hosting:** Vercel
- **Styling:** Custom theme (dark blue, Space Grotesk + Inter fonts)

## Getting Started (local development)

1. Clone the repo
2. Install dependencies:

```bash
npm install
```

3. Add your environment variables (Supabase project URL and keys) in a `.env.local` file
4. Run the development server:

```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## About this project

Built end-to-end by [Your Name] — database schema, authentication flow, UI, and deployment — as a real, live SaaS product.
