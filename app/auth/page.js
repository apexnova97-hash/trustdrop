import AuthScreen from '../components/AuthScreen'
import getOrigin from '../components/getOrigin'

export default async function AuthPage({ searchParams }) {
  const params = await searchParams
  const mode = params?.mode === 'signup' ? 'signup' : 'login'
  const origin = await getOrigin()
  return <AuthScreen initialMode={mode} origin={origin} />
}
