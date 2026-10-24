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
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect width=%2240%22 height=%2240%22 rx=%2211%22 fill=%22%23135BF5%22/><path d=%22M20 9.9 22.7 16.8 30.1 17.2 24.4 22 26.3 29.1 20 25.2 13.7 29.1 15.6 22 9.9 17.2 17.3 16.8Z%22 fill=%22%23FFC62E%22/></svg>',
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
