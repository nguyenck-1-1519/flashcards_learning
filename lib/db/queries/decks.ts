// Database query functions for deck operations
// Uses @vercel/postgres for PostgreSQL connections

import { sql } from '@vercel/postgres'
import { Deck, DeckWithStats } from '@/types/deck'

/**
 * Get all decks for a user with card counts
 * @param userId - User's UUID
 * @returns Promise resolving to array of decks with card counts
 */
export async function getAllDecks(userId: string): Promise<DeckWithStats[]> {
  try {
    // Note: cards table doesn't exist yet, so card_count will be 0
    // This query will be updated when cards table is created
    const result = await sql<DeckWithStats>`
      SELECT 
        d.id,
        d.name,
        d.user_id,
        d.created_at,
        d.updated_at,
        COALESCE(COUNT(c.id), 0)::int as card_count
      FROM decks d
      LEFT JOIN cards c ON c.deck_id = d.id
      WHERE d.user_id = ${userId}
      GROUP BY d.id, d.name, d.user_id, d.created_at, d.updated_at
      ORDER BY d.updated_at DESC, d.created_at DESC
    `

    return result.rows
  } catch (error) {
    console.error('Get all decks error:', error)
    // If cards table doesn't exist yet, fallback to simple query
    try {
      const result = await sql<Deck>`
        SELECT id, name, user_id, created_at, updated_at
        FROM decks
        WHERE user_id = ${userId}
        ORDER BY updated_at DESC, created_at DESC
      `
      
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
  try {
    const result = await sql<Deck>`
      SELECT id, name, user_id, created_at, updated_at
      FROM decks
      WHERE id = ${deckId} AND user_id = ${userId}
      LIMIT 1
    `

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
  try {
    const result = await sql<Deck>`
      INSERT INTO decks (name, user_id)
      VALUES (${name.trim()}, ${userId})
      RETURNING id, name, user_id, created_at, updated_at
    `

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
  try {
    const result = await sql<Deck>`
      UPDATE decks
      SET name = ${name.trim()}
      WHERE id = ${deckId} AND user_id = ${userId}
      RETURNING id, name, user_id, created_at, updated_at
    `

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
  try {
    const result = await sql`
      DELETE FROM decks
      WHERE id = ${deckId} AND user_id = ${userId}
      RETURNING id
    `

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
  try {
    const result = await sql<{ count: number }>`
      SELECT COUNT(*)::int as count
      FROM decks
      WHERE user_id = ${userId}
    `

    return result.rows[0]?.count || 0
  } catch (error) {
    console.error('Get deck count error:', error)
    return 0
  }
}
