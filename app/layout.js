import './globals.css'
import localFont from 'next/font/local'

/* The faces are vendored in app/fonts instead of fetched from Google at build
   time. Google Fonts intermittently answers with extensionless /l/font?kit=…
   URLs, which makes next/font throw "queries have exactly one entry" and fails
   an otherwise healthy Vercel build (vercel/next.js#99114). Local files keep
   the build deterministic and the fonts identical. */

const displayFont = localFont({
  src: './fonts/manrope-latin.woff2',
  weight: '400 800',
  variable: '--font-display',
  display: 'swap',
})

const bodyFont = localFont({
  src: './fonts/instrument-sans-latin.woff2',
  weight: '400 700',
  variable: '--font-body',
  display: 'swap',
})

/* Script faces are accents, not body copy: body text set in any of these
   falls apart below ~20px and fails contrast/legibility checks. */
const scriptPacfico = localFont({
  src: './fonts/pacifico-latin.woff2',
  weight: '400',
  variable: '--font-brand',
  display: 'swap',
})

const scriptDancing = localFont({
  src: './fonts/dancing-script-latin.woff2',
  weight: '400 700',
  variable: '--font-script',
  display: 'swap',
})

const scriptCaveat = localFont({
  src: './fonts/caveat-latin.woff2',
  weight: '400 700',
  variable: '--font-hand',
  display: 'swap',
})

const scriptVibes = localFont({
  src: './fonts/great-vibes-latin.woff2',
  weight: '400',
  variable: '--font-quote',
  display: 'swap',
})

export const metadata = {
  title: 'TrustDrop — Collect Customer Reviews',
  description: 'The simplest way to collect and display customer testimonials.',
  verification: {
    google: '-r8xi6sbKvpm2E5ttMz3Avm8dhab8aiyeoAzmT-ogyI',
  },
}
export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${scriptPacfico.variable} ${scriptDancing.variable} ${scriptCaveat.variable} ${scriptVibes.variable}`}
        style={{ margin: 0, padding: 0, background: '#FFFFFF', overflowX: 'clip' }}
      >
        {children}
      </body>
    </html>
  )
}
