import AuthScreen from '../components/AuthScreen'
import getOrigin from '../components/getOrigin'

export default async function LoginPage() {
  const origin = await getOrigin()
  return <AuthScreen initialMode="login" origin={origin} />
}
