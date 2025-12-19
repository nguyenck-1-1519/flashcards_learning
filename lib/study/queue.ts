// Card queue logic for study sessions
// Randomly selects maximum 10 cards for study session

import { Card } from '@/types/card'

export interface QueuedCard extends Card {
  // Additional queue-specific fields can be added here
}

// Randomly select cards for study session (max 10)
export function selectRandomCards(cards: Card[], maxCards: number = 10): Card[] {
  if (cards.length <= maxCards) {
    // If deck has 10 or fewer cards, return all
    return [...cards]
  }
  
  // Shuffle and take first maxCards
  const shuffled = [...cards].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, maxCards)
}

// Sort cards for study queue
// Priority: new cards first (next_review = null), then by next_review date
export function sortCardsForStudy(cards: Card[]): QueuedCard[] {
  return [...cards].sort((a, b) => {
    // New cards (never reviewed) come first
    if (!a.next_review && b.next_review) return -1
    if (a.next_review && !b.next_review) return 1
    if (!a.next_review && !b.next_review) return 0

    // Both have next_review dates - sort by date (oldest due first)
    const dateA = new Date(a.next_review!).getTime()
    const dateB = new Date(b.next_review!).getTime()
    return dateA - dateB
  })
}

// Create study queue from cards (random selection, max 10)
export function createStudyQueue(cards: Card[]): QueuedCard[] {
  const selectedCards = selectRandomCards(cards, 10)
  return selectedCards as QueuedCard[]
}

// Check if card is new (never reviewed)
export function isNewCard(card: Card): boolean {
  return card.next_review === null || card.repetitions === 0
}

// Check if card is due for review
export function isCardDue(card: Card): boolean {
  if (!card.next_review) return true // New cards are always due
  return new Date(card.next_review) <= new Date()
}

// Filter only due cards
export function getDueCardsOnly(cards: Card[]): Card[] {
  return cards.filter(isCardDue)
}
