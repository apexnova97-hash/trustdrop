import './globals.css'

export const metadata = {
  title: 'TrustDrop — Collect Customer Reviews',
  description: 'The simplest way to collect and display customer testimonials. Share a link, get reviews, embed them anywhere.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#050810', overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
