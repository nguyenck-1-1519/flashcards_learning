// Server actions for deck management
'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createDeckSchema, updateDeckSchema } from '@/lib/validations/deck'
import { getSession } from '@/lib/auth/session'
import {
  createDeck as createDeckQuery,
  updateDeck as updateDeckQuery,
  deleteDeck as deleteDeckQuery,
} from '@/lib/db/queries/decks'
import { DeckResponse } from '@/types/deck'

/**
 * Create a new deck
 * Server action for create deck form
 */
export async function createDeckAction(
  name: string
): Promise<DeckResponse> {
  try {
    // Get current user session
    const sessionCookie = cookies().get('session')
    const session = await getSession(sessionCookie?.value)

    if (!session) {
      return {
        success: false,
        error: {
          message: 'You must be logged in to create a deck',
        },
      }
    }

    // Validate input
    const validation = createDeckSchema.safeParse({ name })
    
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return {
        success: false,
        error: {
          field: firstError.path[0] as string,
          message: firstError.message,
        },
      }
    }

    // Create deck in database
    const deck = await createDeckQuery(validation.data.name, session.userId)

    // Revalidate dashboard to show new deck
    revalidatePath('/dashboard')

    return {
      success: true,
      deck,
    }
  } catch (error: any) {
    console.error('Create deck action error:', error)
    return {
      success: false,
      error: {
        message: error.message || 'Failed to create deck. Please try again.',
      },
    }
  }
}

/**
 * Update deck name
 * Server action for edit deck form
 */
export async function updateDeckAction(
  deckId: string,
  name: string
): Promise<DeckResponse> {
  try {
    // Get current user session
    const sessionCookie = cookies().get('session')
    const session = await getSession(sessionCookie?.value)

    if (!session) {
      return {
        success: false,
        error: {
          message: 'You must be logged in to update a deck',
        },
      }
    }

    // Validate input
    const validation = updateDeckSchema.safeParse({ name })
    
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return {
        success: false,
        error: {
          field: firstError.path[0] as string,
          message: firstError.message,
        },
      }
    }

    // Update deck in database
    const deck = await updateDeckQuery(deckId, validation.data.name, session.userId)

    // Revalidate dashboard to show updated deck
    revalidatePath('/dashboard')

    return {
      success: true,
      deck,
    }
  } catch (error: any) {
    console.error('Update deck action error:', error)
    return {
      success: false,
      error: {
        message: error.message || 'Failed to update deck. Please try again.',
      },
    }
  }
}

/**
 * Delete a deck
 * Server action for delete confirmation
 */
export async function deleteDeckAction(
  deckId: string
): Promise<DeckResponse> {
  try {
    // Get current user session
    const sessionCookie = cookies().get('session')
    const session = await getSession(sessionCookie?.value)

    if (!session) {
      return {
        success: false,
        error: {
          message: 'You must be logged in to delete a deck',
        },
      }
    }

    // Delete deck from database
    await deleteDeckQuery(deckId, session.userId)

    // Revalidate dashboard to remove deleted deck
    revalidatePath('/dashboard')

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Delete deck action error:', error)
    return {
      success: false,
      error: {
        message: error.message || 'Failed to delete deck. Please try again.',
      },
    }
  }
}
