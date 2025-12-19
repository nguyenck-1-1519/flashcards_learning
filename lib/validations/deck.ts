// Zod validation schemas for deck operations

import { z } from 'zod'

// Deck name validation
export const deckNameSchema = z
  .string()
  .min(1, 'Deck name is required')
  .max(100, 'Deck name must be less than 100 characters')
  .trim()

// Create deck validation
export const createDeckSchema = z.object({
  name: deckNameSchema,
})

// Update deck validation
export const updateDeckSchema = z.object({
  name: deckNameSchema,
})

// Types derived from schemas
export type CreateDeckInput = z.infer<typeof createDeckSchema>
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>
