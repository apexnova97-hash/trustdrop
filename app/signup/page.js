import AuthScreen from '../components/AuthScreen'
import getOrigin from '../components/getOrigin'

export default async function SignupPage() {
  const origin = await getOrigin()
  return <AuthScreen initialMode="signup" origin={origin} />
}
