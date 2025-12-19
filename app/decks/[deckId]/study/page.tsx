// Study session page
// Displays cards for spaced repetition study

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth/session'
import { getDeckById } from '@/lib/db/queries/decks'
import { getAllCards } from '@/lib/db/queries/cards'
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

  // Get deck (with user authorization check built-in)
  const deck = await getDeckById(params.deckId, session.userId)
  if (!deck) {
    redirect('/dashboard')
  }

  // Get all cards from deck (will be randomly selected in StudySessionClient)
  const allCards = await getAllCards(params.deckId)

  return <StudySessionClient deck={deck} initialCards={allCards} />
}
