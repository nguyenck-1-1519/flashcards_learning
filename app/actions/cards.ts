'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createCard, updateCard, deleteCard } from '@/lib/db/queries/cards';
import { getSession } from '@/lib/auth/session';
import { getDeckById } from '@/lib/db/queries/decks';

interface CardActionResult {
  success: boolean;
  error?: string;
  cardId?: string;
}

/**
 * Add a new card to a deck
 */
export async function addCard(
  deckId: string,
  front: string,
  back: string
): Promise<CardActionResult> {
  try {
    // Verify user is authenticated
    const sessionCookie = cookies().get('session');
    const session = await getSession(sessionCookie?.value);
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify deck exists and user owns it
    const deck = await getDeckById(deckId, session.userId);
    if (!deck) {
      return { success: false, error: 'Deck not found' };
    }
    if (deck.user_id !== session.userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate input
    if (!front.trim() || !back.trim()) {
      return { success: false, error: 'Front and back content are required' };
    }

    if (front.length > 10000 || back.length > 10000) {
      return { success: false, error: 'Content is too long (max 10,000 characters)' };
    }

    // Create card
    const card = await createCard({
      deck_id: deckId,
      front: front.trim(),
      back: back.trim(),
    });

    // Revalidate deck page to show new card
    revalidatePath(`/decks/${deckId}`);

    return { success: true, cardId: card.id };
  } catch (error) {
    console.error('Error adding card:', error);
    return { success: false, error: 'Failed to add card' };
  }
}

/**
 * Update an existing card
 */
export async function editCard(
  cardId: string,
  deckId: string,
  front: string,
  back: string
): Promise<CardActionResult> {
  try {
    // Verify user is authenticated
    const sessionCookie = cookies().get('session');
    const session = await getSession(sessionCookie?.value);
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify deck exists and user owns it
    const deck = await getDeckById(deckId, session.userId);
    if (!deck) {
      return { success: false, error: 'Deck not found' };
    }
    if (deck.user_id !== session.userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate input
    if (!front.trim() || !back.trim()) {
      return { success: false, error: 'Front and back content are required' };
    }

    if (front.length > 10000 || back.length > 10000) {
      return { success: false, error: 'Content is too long (max 10,000 characters)' };
    }

    // Update card
    await updateCard(cardId, {
      front: front.trim(),
      back: back.trim(),
    });

    // Revalidate deck page
    revalidatePath(`/decks/${deckId}`);

    return { success: true, cardId };
  } catch (error) {
    console.error('Error updating card:', error);
    return { success: false, error: 'Failed to update card' };
  }
}

/**
 * Delete a card
 */
export async function removeCard(
  cardId: string,
  deckId: string
): Promise<CardActionResult> {
  try {
    // Verify user is authenticated
    const sessionCookie = cookies().get('session');
    const session = await getSession(sessionCookie?.value);
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify deck exists and user owns it
    const deck = await getDeckById(deckId, session.userId);
    if (!deck) {
      return { success: false, error: 'Deck not found' };
    }
    if (deck.user_id !== session.userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Delete card
    await deleteCard(cardId);

    // Revalidate deck page
    revalidatePath(`/decks/${deckId}`);

    return { success: true, cardId };
  } catch (error) {
    console.error('Error deleting card:', error);
    return { success: false, error: 'Failed to delete card' };
  }
}
