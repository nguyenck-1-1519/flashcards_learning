// Dashboard page - protected route for authenticated users
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getUserById } from '@/lib/db/queries'
import { getAllDecks } from '@/lib/db/queries/decks'
import { Metadata } from 'next'
import DashboardClient from '@/components/dashboard/DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard - Flashcards Learning',
  description: 'Manage your flashcard decks',
}

export default async function DashboardPage() {
  // Check authentication
  const sessionCookie = cookies().get('session')
  const session = await getSession(sessionCookie?.value)

  if (!session) {
    redirect('/login')
  }

  // Get user details
  const user = await getUserById(session.userId)

  if (!user) {
    redirect('/login')
  }

  // Get all decks for the user
  const decks = await getAllDecks(session.userId)

  return <DashboardClient user={user} initialDecks={decks} />
}
