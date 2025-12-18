// TypeScript types for Deck Management

export interface Deck {
  id: string
  name: string
  user_id: string
  created_at: Date | string // Can be Date object or ISO string from DB
  updated_at: Date | string // Can be Date object or ISO string from DB
  card_count?: number // Populated by JOIN with cards table
}

export interface DeckInput {
  name: string
}

export interface DeckWithStats extends Deck {
  card_count: number
  last_studied?: Date | string
}

export interface DeckError {
  field?: string
  message: string
}

export interface DeckResponse {
  success: boolean
  error?: DeckError
  deck?: Deck
}
