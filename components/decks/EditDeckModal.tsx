// EditDeckModal component
// Modal for editing deck names
'use client'

import { useState } from 'react'
import Modal from '../ui/Modal'
import DeckForm from './DeckForm'
import { DeckWithStats } from '@/types/deck'

interface EditDeckModalProps {
  isOpen: boolean
  onClose: () => void
  deck: DeckWithStats | null
  onUpdateDeck: (deckId: string, name: string) => Promise<void>
}

export default function EditDeckModal({
  isOpen,
  onClose,
  deck,
  onUpdateDeck,
}: EditDeckModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (name: string) => {
    if (!deck) return

    setIsSubmitting(true)
    try {
      await onUpdateDeck(deck.id, name)
      onClose()
    } catch (error) {
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!deck) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Deck">
      <DeckForm
        initialName={deck.name}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel="Save Changes"
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
