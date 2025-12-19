// DeckForm component - reusable form for create/edit
// Consistent styling with auth forms
'use client'

import { useState } from 'react'
import FormError from '../auth/FormError'

interface DeckFormProps {
  initialName?: string
  onSubmit: (name: string) => Promise<void>
  onCancel: () => void
  submitLabel?: string
  isSubmitting?: boolean
}

export default function DeckForm({
  initialName = '',
  onSubmit,
  onCancel,
  submitLabel = 'Create',
  isSubmitting = false,
}: DeckFormProps) {
  const [name, setName] = useState(initialName)
  const [error, setError] = useState('')

  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setError('Deck name is required')
      return false
    }
    if (value.length > 100) {
      setError('Deck name must be less than 100 characters')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateName(name)) {
      return
    }

    try {
      await onSubmit(name.trim())
    } catch (err: any) {
      setError(err.message || 'Failed to save deck')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Deck Name Field */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="deck-name"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#424242',
          }}
        >
          Deck Name
        </label>
        <input
          type="text"
          id="deck-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (error) setError('')
          }}
          onBlur={(e) => validateName(e.target.value)}
          placeholder="e.g., Spanish Vocabulary, React Hooks"
          required
          autoFocus
          maxLength={100}
          disabled={isSubmitting}
          aria-invalid={!!error}
          aria-describedby={error ? 'deck-name-error' : undefined}
          style={{
            width: '100%',
            minHeight: '48px',
            padding: '0.75rem',
            fontSize: '1rem',
            border: error ? '2px solid #d32f2f' : '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: isSubmitting ? '#f5f5f5' : '#fff',
          }}
        />
        <FormError message={error} />
        <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#999' }}>
          {name.length}/100 characters
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#666',
            backgroundColor: 'transparent',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#fff',
            backgroundColor: isSubmitting || !name.trim() ? '#90caf9' : '#1976d2',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting || !name.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
