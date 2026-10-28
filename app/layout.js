import './globals.css'
import {
  Manrope,
  Instrument_Sans,
  Pacifico,
  Dancing_Script,
  Caveat,
  Great_Vibes,
} from 'next/font/google'

const displayFont = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const bodyFont = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

/* Script faces are accents, not body copy: body text set in any of these
   falls apart below ~20px and fails contrast/legibility checks. */
const scriptPacfico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-brand',
  display: 'swap',
})

const scriptDancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-script',
  display: 'swap',
})

const scriptCaveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-hand',
  display: 'swap',
})

const scriptVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
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
