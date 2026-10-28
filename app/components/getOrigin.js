import { headers } from 'next/headers'

// The real origin of the request, so the sign-up screen can show the visitor
// the review link they will actually get instead of a placeholder domain.
export default async function getOrigin() {
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host') || ''
  const proto = h.get('x-forwarded-proto') || (/^(localhost|127\.)/.test(host) ? 'http' : 'https')
  return host ? proto + '://' + host : ''
}
