// CreateDeckModal component
// Modal for creating new decks
'use client'

import { useState } from 'react'
import Modal from '../ui/Modal'
import DeckForm from './DeckForm'

interface CreateDeckModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateDeck: (name: string) => Promise<void>
}

export default function CreateDeckModal({
  isOpen,
  onClose,
  onCreateDeck,
}: CreateDeckModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (name: string) => {
    setIsSubmitting(true)
    try {
      await onCreateDeck(name)
      onClose()
    } catch (error) {
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Deck">
      <DeckForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel="Create Deck"
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
