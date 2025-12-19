// Database query functions for deck operations
// Uses pg library for PostgreSQL connections

import { getPool } from '../connection'
import { Deck, DeckWithStats } from '@/types/deck'

/**
 * Get all decks for a user with card counts
 * @param userId - User's UUID
 * @returns Promise resolving to array of decks with card counts
 */
export async function getAllDecks(userId: string): Promise<DeckWithStats[]> {
  const pool = getPool()
  
  try {
    // Note: cards table doesn't exist yet, so card_count will be 0
    // This query will be updated when cards table is created
    const result = await pool.query<DeckWithStats>(
      `SELECT 
        d.id,
        d.name,
        d.user_id,
        d.created_at,
        d.updated_at,
        COALESCE(COUNT(c.id), 0)::int as card_count
      FROM decks d
      LEFT JOIN cards c ON c.deck_id = d.id
      WHERE d.user_id = $1
      GROUP BY d.id, d.name, d.user_id, d.created_at, d.updated_at
      ORDER BY d.updated_at DESC, d.created_at DESC`,
      [userId]
    )

    return result.rows
  } catch (error) {
    console.error('Get all decks error:', error)
    // If cards table doesn't exist yet, fallback to simple query
    try {
      const result = await pool.query<Deck>(
        `SELECT id, name, user_id, created_at, updated_at
        FROM decks
        WHERE user_id = $1
        ORDER BY updated_at DESC, created_at DESC`,
        [userId]
      )
      
      return result.rows.map(deck => ({
        ...deck,
        card_count: 0
      }))
    } catch (fallbackError) {
      console.error('Fallback query error:', fallbackError)
      return []
    }
  }
}

/**
 * Get a single deck by ID
 * @param deckId - Deck's UUID
 * @param userId - User's UUID (for authorization)
 * @returns Promise resolving to Deck or null
 */
export async function getDeckById(
  deckId: string,
  userId: string
): Promise<Deck | null> {
  const pool = getPool()
  
  try {
    const result = await pool.query<Deck>(
      'SELECT id, name, user_id, created_at, updated_at FROM decks WHERE id = $1 AND user_id = $2 LIMIT 1',
      [deckId, userId]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error('Get deck by ID error:', error)
    return null
  }
}

/**
 * Create a new deck
 * @param name - Deck name
 * @param userId - User's UUID
 * @returns Promise resolving to created Deck
 */
export async function createDeck(
  name: string,
  userId: string
): Promise<Deck> {
  const pool = getPool()
  
  try {
    const result = await pool.query<Deck>(
      'INSERT INTO decks (name, user_id) VALUES ($1, $2) RETURNING id, name, user_id, created_at, updated_at',
      [name.trim(), userId]
    )

    if (result.rows.length === 0) {
      throw new Error('Failed to create deck')
    }

    return result.rows[0]
  } catch (error: any) {
    console.error('Create deck error:', error)
    throw new Error(error.message || 'Failed to create deck')
  }
}

/**
 * Update a deck's name
 * @param deckId - Deck's UUID
 * @param name - New deck name
 * @param userId - User's UUID (for authorization)
 * @returns Promise resolving to updated Deck
 */
export async function updateDeck(
  deckId: string,
  name: string,
  userId: string
): Promise<Deck> {
  const pool = getPool()
  
  try {
    const result = await pool.query<Deck>(
      'UPDATE decks SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING id, name, user_id, created_at, updated_at',
      [name.trim(), deckId, userId]
    )

    if (result.rows.length === 0) {
      throw new Error('Deck not found or unauthorized')
    }

    return result.rows[0]
  } catch (error: any) {
    console.error('Update deck error:', error)
    throw new Error(error.message || 'Failed to update deck')
  }
}

/**
 * Delete a deck and all its cards
 * @param deckId - Deck's UUID
 * @param userId - User's UUID (for authorization)
 * @returns Promise resolving to void
 */
export async function deleteDeck(
  deckId: string,
  userId: string
): Promise<void> {
  const pool = getPool()
  
  try {
    const result = await pool.query(
      'DELETE FROM decks WHERE id = $1 AND user_id = $2 RETURNING id',
      [deckId, userId]
    )

    if (result.rows.length === 0) {
      throw new Error('Deck not found or unauthorized')
    }
  } catch (error: any) {
    console.error('Delete deck error:', error)
    throw new Error(error.message || 'Failed to delete deck')
  }
}

/**
 * Get deck count for a user
 * @param userId - User's UUID
 * @returns Promise resolving to deck count
 */
export async function getDeckCount(userId: string): Promise<number> {
  const pool = getPool()
  
  try {
    const result = await pool.query<{ count: string }>(
      'SELECT COUNT(*) as count FROM decks WHERE user_id = $1',
      [userId]
    )

    return parseInt(result.rows[0]?.count || '0', 10)
  } catch (error) {
    console.error('Get deck count error:', error)
    return 0
  }
}
