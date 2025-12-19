// DeleteDeckDialog component
// Confirmation dialog for deleting decks
'use client'

import { useState } from 'react'
import Modal from '../ui/Modal'
import { DeckWithStats } from '@/types/deck'

interface DeleteDeckDialogProps {
  isOpen: boolean
  onClose: () => void
  deck: DeckWithStats | null
  onDeleteDeck: (deckId: string) => Promise<void>
}

export default function DeleteDeckDialog({
  isOpen,
  onClose,
  deck,
  onDeleteDeck,
}: DeleteDeckDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deck) return

    setIsDeleting(true)
    try {
      await onDeleteDeck(deck.id)
      onClose()
    } catch (error) {
      alert('Failed to delete deck. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!deck) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Deck" maxWidth="450px">
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: '#212121', marginBottom: '1rem' }}>
          Are you sure you want to delete <strong>"{deck.name}"</strong>?
        </p>
        <p style={{ color: '#d32f2f', fontSize: '0.875rem', marginBottom: '1rem' }}>
          ⚠️ This will permanently delete {deck.card_count} card{deck.card_count !== 1 ? 's' : ''} in this deck.
        </p>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          This action cannot be undone.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#666',
            backgroundColor: 'transparent',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#fff',
            backgroundColor: isDeleting ? '#ffcdd2' : '#d32f2f',
            border: 'none',
            borderRadius: '4px',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete Deck'}
        </button>
      </div>
    </Modal>
  )
}
