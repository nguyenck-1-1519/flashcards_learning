// Study session page
// Displays cards for spaced repetition study

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth/session'
import { getDeckById } from '@/lib/db/queries/decks'
import { getDueCards } from '@/lib/db/queries/study'
import StudySessionClient from '@/components/study/StudySessionClient'

interface StudyPageProps {
  params: {
    deckId: string
  }
}

export default async function StudyPage({ params }: StudyPageProps) {
  // Check authentication
  const sessionCookie = cookies().get('session')
  const session = await getSession(sessionCookie?.value)
  if (!session) {
    redirect('/login')
  }

  // Get deck
  const deck = await getDeckById(params.deckId)
  if (!deck) {
    redirect('/dashboard')
  }

  // Check authorization
  if (deck.user_id !== session.userId) {
    redirect('/dashboard')
  }

  // Get due cards
  const dueCards = await getDueCards(params.deckId)

  return <StudySessionClient deck={deck} initialCards={dueCards} />
}
