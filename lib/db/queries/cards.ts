// Card CRUD queries
// Database operations for flashcard management with SM-2 fields

import pool from '../connection'
import { Card, CardInput } from '@/types/card'

// Get all cards for a deck
export async function getAllCards(deckId: string): Promise<Card[]> {
  const result = await pool.query(
    `SELECT 
      id, deck_id, front, back, 
      ease_factor, interval, repetitions,
      last_reviewed, next_review,
      created_at, updated_at
    FROM cards
    WHERE deck_id = $1
    ORDER BY created_at DESC`,
    [deckId]
  )
  return result.rows
}

// Get single card by ID
export async function getCardById(cardId: string): Promise<Card | null> {
  const result = await pool.query(
    `SELECT 
      id, deck_id, front, back,
      ease_factor, interval, repetitions,
      last_reviewed, next_review,
      created_at, updated_at
    FROM cards
    WHERE id = $1`,
    [cardId]
  )
  return result.rows[0] || null
}

// Create new card
export async function createCard(input: CardInput): Promise<Card> {
  const result = await pool.query(
    `INSERT INTO cards (deck_id, front, back)
    VALUES ($1, $2, $3)
    RETURNING 
      id, deck_id, front, back,
      ease_factor, interval, repetitions,
      last_reviewed, next_review,
      created_at, updated_at`,
    [input.deck_id, input.front, input.back]
  )
  return result.rows[0]
}

// Update card content
export async function updateCard(
  cardId: string,
  input: Partial<CardInput>
): Promise<Card> {
  const fields: string[] = []
  const values: any[] = []
  let paramIndex = 1

  if (input.front !== undefined) {
    fields.push(`front = $${paramIndex}`)
    values.push(input.front)
    paramIndex++
  }

  if (input.back !== undefined) {
    fields.push(`back = $${paramIndex}`)
    values.push(input.back)
    paramIndex++
  }

  if (fields.length === 0) {
    throw new Error('No fields to update')
  }

  fields.push(`updated_at = NOW()`)
  values.push(cardId)

  const result = await pool.query(
    `UPDATE cards
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING 
      id, deck_id, front, back,
      ease_factor, interval, repetitions,
      last_reviewed, next_review,
      created_at, updated_at`,
    values
  )

  if (result.rows.length === 0) {
    throw new Error('Card not found')
  }

  return result.rows[0]
}

// Delete card
export async function deleteCard(cardId: string): Promise<void> {
  const result = await pool.query(
    'DELETE FROM cards WHERE id = $1 RETURNING id',
    [cardId]
  )
  
  if (result.rows.length === 0) {
    throw new Error('Card not found')
  }
}

// Count cards in deck
export async function countCardsInDeck(deckId: string): Promise<number> {
  const result = await pool.query(
    'SELECT COUNT(*) as count FROM cards WHERE deck_id = $1',
    [deckId]
  )
  return parseInt(result.rows[0].count, 10)
}
