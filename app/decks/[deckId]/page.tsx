// Deck detail page - view and manage cards in a deck
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getDeckById } from '@/lib/db/queries/decks'
import { Metadata } from 'next'
import DeckDetailClient from '@/components/decks/DeckDetailClient'

interface DeckDetailPageProps {
  params: {
    deckId: string
  }
}

export async function generateMetadata({ params }: DeckDetailPageProps): Promise<Metadata> {
  const sessionCookie = cookies().get('session')
  const session = await getSession(sessionCookie?.value)

  if (!session) {
    return {
      title: 'Deck - Flashcards Learning',
    }
  }

  const deck = await getDeckById(params.deckId, session.userId)

  if (!deck) {
    return {
      title: 'Deck Not Found - Flashcards Learning',
    }
  }

  return {
    title: `${deck.name} - Flashcards Learning`,
    description: `Study flashcards in ${deck.name}`,
  }
}

export default async function DeckDetailPage({ params }: DeckDetailPageProps) {
  // Check authentication
  const sessionCookie = cookies().get('session')
  const session = await getSession(sessionCookie?.value)

  if (!session) {
    redirect('/login')
  }

  // Get deck details
  const deck = await getDeckById(params.deckId, session.userId)

  if (!deck) {
    redirect('/dashboard')
  }

  // TODO: Get cards for this deck (will be implemented in Module 003)
  const cards: any[] = []

  return <DeckDetailClient deck={deck} cards={cards} />
}
