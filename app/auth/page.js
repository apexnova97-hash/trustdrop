import AuthScreen from '../components/AuthScreen'

export default async function AuthPage({ searchParams }) {
  const params = await searchParams
  const initialMode = params?.mode === 'signup' ? 'signup' : 'login'

  return <AuthScreen initialMode={initialMode} />
}
