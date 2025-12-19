// Study-specific queries
// Queries for spaced repetition study sessions

import pool from '../connection'
import { Card } from '@/types/card'

// Get due cards for study (cards where next_review <= now OR new cards)
export async function getDueCards(deckId: string): Promise<Card[]> {
  const result = await pool.query(
    `SELECT 
      id, deck_id, front, back,
      ease_factor, interval, repetitions,
      last_reviewed, next_review,
      created_at, updated_at
    FROM cards
    WHERE deck_id = $1 
      AND (next_review IS NULL OR next_review <= NOW())
    ORDER BY 
      CASE WHEN next_review IS NULL THEN 0 ELSE 1 END,
      next_review ASC
    `,
    [deckId]
  )
  return result.rows
}

// Get count of due cards
export async function getDueCardCount(deckId: string): Promise<number> {
  const result = await pool.query(
    `SELECT COUNT(*) as count 
    FROM cards
    WHERE deck_id = $1 
      AND (next_review IS NULL OR next_review <= NOW())`,
    [deckId]
  )
  return parseInt(result.rows[0].count, 10)
}

// Update card SM-2 schedule after review
export async function updateCardSchedule(
  cardId: string,
  ease_factor: number,
  interval: number,
  repetitions: number,
  next_review: Date | null
): Promise<Card> {
  const result = await pool.query(
    `UPDATE cards
    SET 
      ease_factor = $1,
      interval = $2,
      repetitions = $3,
      last_reviewed = NOW(),
      next_review = $4,
      updated_at = NOW()
    WHERE id = $5
    RETURNING 
      id, deck_id, front, back,
      ease_factor, interval, repetitions,
      last_reviewed, next_review,
      created_at, updated_at`,
    [ease_factor, interval, repetitions, next_review, cardId]
  )

  if (result.rows.length === 0) {
    throw new Error('Card not found')
  }

  return result.rows[0]
}

// Get study statistics for a deck
export async function getDeckStatistics(deckId: string) {
  const result = await pool.query(
    `SELECT 
      COUNT(*) as total_cards,
      COUNT(CASE WHEN next_review IS NULL THEN 1 END) as new_cards,
      COUNT(CASE WHEN next_review IS NOT NULL AND next_review <= NOW() THEN 1 END) as due_cards,
      COUNT(CASE WHEN next_review IS NOT NULL AND next_review > NOW() THEN 1 END) as learned_cards,
      ROUND(AVG(ease_factor), 2) as avg_ease_factor,
      ROUND(AVG(interval), 1) as avg_interval
    FROM cards
    WHERE deck_id = $1`,
    [deckId]
  )
  return result.rows[0]
}
