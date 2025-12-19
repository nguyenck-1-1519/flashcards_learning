// Server actions for study mode
'use server'

import { calculateNextReview } from '@/lib/study/sm2'
import { updateCardSchedule } from '@/lib/db/queries/study'
import { Rating } from '@/types/study'
import { Card } from '@/types/card'

export interface RateCardResult {
  success: boolean
  card?: Card
  error?: {
    message: string
    code?: string
  }
}

// Rate card and update schedule
export async function rateCard(
  cardId: string,
  rating: Rating
): Promise<RateCardResult> {
  try {
    // Get current card data (would need to fetch from DB in real implementation)
    // For now, we'll use the SM-2 algorithm to calculate next review
    
    // This is a simplified version - in production, you'd want to:
    // 1. Fetch current card from database
    // 2. Calculate next review using SM-2
    // 3. Update database with new schedule
    // 4. Return updated card

    // Note: The full implementation will be done when we have the complete study session flow
    
    return {
      success: false,
      error: {
        message: 'rateCard action needs card data from session',
        code: 'NOT_IMPLEMENTED',
      },
    }
  } catch (error: any) {
    console.error('Rate card error:', error)
    return {
      success: false,
      error: {
        message: error.message || 'Failed to rate card',
        code: 'INTERNAL_ERROR',
      },
    }
  }
}

// Update card schedule with SM-2 results
export async function updateCardWithReview(
  cardId: string,
  ease_factor: number,
  interval: number,
  repetitions: number,
  next_review: Date | null
): Promise<RateCardResult> {
  try {
    const updatedCard = await updateCardSchedule(
      cardId,
      ease_factor,
      interval,
      repetitions,
      next_review
    )

    return {
      success: true,
      card: updatedCard,
    }
  } catch (error: any) {
    console.error('Update card schedule error:', error)
    return {
      success: false,
      error: {
        message: error.message || 'Failed to update card schedule',
        code: 'DATABASE_ERROR',
      },
    }
  }
}
