// Card types with SM-2 spaced repetition fields
// Represents a flashcard with question (front) and answer (back)

export interface Card {
  id: string
  deck_id: string
  front: string // Question/Front side (markdown)
  back: string // Answer/Back side (markdown)
  
  // SM-2 Algorithm fields
  ease_factor: number // 1.3 to 3.0, default 2.5
  interval: number // Days until next review
  repetitions: number // Number of successful reviews
  last_reviewed: Date | string | null // Last review timestamp
  next_review: Date | string | null // Next scheduled review
  
  created_at: Date | string
  updated_at: Date | string
}

// Input for creating/updating cards
export interface CardInput {
  deck_id: string
  front: string
  back: string
}

// Card with deck information
export interface CardWithDeck extends Card {
  deck_name: string
}

// Card error response
export interface CardError {
  message: string
  field?: string
}

// Card action response
export interface CardResponse {
  success: boolean
  card?: Card
  error?: CardError
}
