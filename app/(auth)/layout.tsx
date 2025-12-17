// Auth layout - redirects logged-in users
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is already logged in
  const sessionCookie = cookies().get('session')
  const session = await getSession(sessionCookie?.value)

  // Redirect to dashboard if already authenticated
  if (session) {
    redirect('/dashboard')
  }

  return <>{children}</>
}
