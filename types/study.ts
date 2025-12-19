// Study session types and rating enum
// Used for spaced repetition study flow

import { Card } from './card'

// SM-2 Rating enum
export enum Rating {
  Again = 0, // Forgot/Wrong - Review immediately
  Hard = 1,  // Difficult - Review sooner
  Good = 2,  // Correct - Normal interval
  Easy = 3,  // Very easy - Longer interval
}

// Study session state
export interface StudySession {
  deck_id: string
  cards: Card[] // Queue of cards to study
  current_index: number
  is_flipped: boolean
  
  // Session statistics
  total_cards: number
  reviewed_cards: number
  again_count: number
  hard_count: number
  good_count: number
  easy_count: number
  
  started_at: Date
  completed_at?: Date
}

// Study session summary
export interface SessionSummary {
  deck_id: string
  deck_name: string
  total_cards: number
  reviewed_cards: number
  duration_minutes: number
  
  again_count: number
  hard_count: number
  good_count: number
  easy_count: number
  
  accuracy_rate: number // Percentage of Good+Easy
  completion_rate: number // Percentage completed
}
