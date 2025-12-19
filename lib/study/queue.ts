// Card queue logic for study sessions
// Orders cards: new cards first, then by next_review date

import { Card } from '@/types/card'

export interface QueuedCard extends Card {
  // Additional queue-specific fields can be added here
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

// Create study queue from cards
export function createStudyQueue(cards: Card[]): QueuedCard[] {
  return sortCardsForStudy(cards)
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
