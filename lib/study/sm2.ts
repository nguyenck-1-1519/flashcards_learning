// SM-2 Spaced Repetition Algorithm
// SuperMemo-2 algorithm for optimal card scheduling

import { Rating } from '@/types/study'

export interface SM2Result {
  ease_factor: number // 1.3 to 3.0
  interval: number // Days until next review (0 for "Again")
  repetitions: number // Number of successful reviews
  next_review: Date | null // Next review date (null for "Again" - review immediately)
}

/**
 * Calculate next review schedule using SM-2 algorithm
 * @param rating - User rating (0=Again, 1=Hard, 2=Good, 3=Easy)
 * @param currentEase - Current ease factor (default: 2.5)
 * @param currentInterval - Current interval in days (default: 0)
 * @param currentRepetitions - Current repetition count (default: 0)
 * @returns SM2Result with updated schedule
 */
export function calculateNextReview(
  rating: Rating,
  currentEase: number = 2.5,
  currentInterval: number = 0,
  currentRepetitions: number = 0
): SM2Result {
  let ease_factor = currentEase
  let interval = currentInterval
  let repetitions = currentRepetitions

  // Update ease factor based on rating
  if (rating === Rating.Again) {
    // Again: Reset progress, review immediately
    ease_factor = Math.max(1.3, ease_factor - 0.2)
    interval = 0
    repetitions = 0
  } else if (rating === Rating.Hard) {
    // Hard: Slightly increase interval, decrease ease
    ease_factor = Math.max(1.3, ease_factor - 0.15)
    interval = Math.round(interval * 1.2)
    repetitions += 1
  } else if (rating === Rating.Good) {
    // Good: Normal progression
    if (repetitions === 0) {
      interval = 1 // First review: 1 day
    } else if (repetitions === 1) {
      interval = 6 // Second review: 6 days
    } else {
      interval = Math.round(interval * ease_factor)
    }
    repetitions += 1
  } else if (rating === Rating.Easy) {
    // Easy: Faster progression, increase ease
    ease_factor = Math.min(3.0, ease_factor + 0.15)
    if (repetitions === 0) {
      interval = 4 // First review: 4 days
    } else if (repetitions === 1) {
      interval = 6 // Keep same as Good for second review
    } else {
      interval = Math.round(interval * ease_factor * 1.3)
    }
    repetitions += 1
  }

  // Ensure ease factor stays within bounds
  ease_factor = Math.max(1.3, Math.min(3.0, ease_factor))

  // Ensure minimum interval
  if (interval < 0) interval = 0
  if (interval > 0 && interval < 1) interval = 1

  // Calculate next review date
  const next_review = interval === 0 ? null : new Date(Date.now() + interval * 24 * 60 * 60 * 1000)

  return {
    ease_factor: Math.round(ease_factor * 100) / 100, // Round to 2 decimals
    interval,
    repetitions,
    next_review,
  }
}
