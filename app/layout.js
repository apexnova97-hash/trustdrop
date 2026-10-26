import './globals.css'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
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
        className={`${displayFont.variable} ${bodyFont.variable}`}
        style={{ margin: 0, padding: 0, background: '#050810', overflowX: 'clip' }}
      >
        {children}
      </body>
    </html>
  )
}
