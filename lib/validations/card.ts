// Card validation schemas with Zod
// Validates card content (front/back) for flashcards

import { z } from 'zod'

// Card content validation
export const cardContentSchema = z.object({
  front: z
    .string()
    .min(1, 'Front content is required')
    .max(10000, 'Front content must be less than 10,000 characters'),
  back: z
    .string()
    .min(1, 'Back content is required')
    .max(10000, 'Back content must be less than 10,000 characters'),
})

// Full card creation schema
export const createCardSchema = z.object({
  deck_id: z.string().uuid('Invalid deck ID'),
  front: z
    .string()
    .min(1, 'Front content is required')
    .max(10000, 'Front content must be less than 10,000 characters'),
  back: z
    .string()
    .min(1, 'Back content is required')
    .max(10000, 'Back content must be less than 10,000 characters'),
})

// Card update schema (partial)
export const updateCardSchema = z.object({
  front: z
    .string()
    .min(1, 'Front content is required')
    .max(10000, 'Front content must be less than 10,000 characters')
    .optional(),
  back: z
    .string()
    .min(1, 'Back content is required')
    .max(10000, 'Back content must be less than 10,000 characters')
    .optional(),
}).refine((data) => data.front || data.back, {
  message: 'At least one field must be provided',
})

// Type exports
export type CardContent = z.infer<typeof cardContentSchema>
export type CreateCardInput = z.infer<typeof createCardSchema>
export type UpdateCardInput = z.infer<typeof updateCardSchema>
