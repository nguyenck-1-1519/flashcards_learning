// DashboardClient - Client component for interactive deck management
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types/auth'
import { DeckWithStats } from '@/types/deck'
import LogoutButton from '@/components/auth/LogoutButton'
import DeckGrid from '@/components/dashboard/DeckGrid'
import EmptyState from '@/components/dashboard/EmptyState'
import CreateDeckModal from '@/components/decks/CreateDeckModal'
import EditDeckModal from '@/components/decks/EditDeckModal'
import DeleteDeckDialog from '@/components/decks/DeleteDeckDialog'
import {
  createDeckAction,
  updateDeckAction,
  deleteDeckAction,
} from '@/app/actions/decks'

interface DashboardClientProps {
  user: User
  initialDecks: DeckWithStats[]
}

export default function DashboardClient({ user, initialDecks }: DashboardClientProps) {
  const router = useRouter()
  const [decks, setDecks] = useState(initialDecks)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDeck, setSelectedDeck] = useState<DeckWithStats | null>(null)
  const [isPending, startTransition] = useTransition()

  // Navigate to deck detail
  const handleDeckClick = (deck: DeckWithStats) => {
    router.push(`/decks/${deck.id}`)
  }

  // Create deck handler
  const handleCreateDeck = async (name: string) => {
    const result = await createDeckAction(name)
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to create deck')
    }

    // Optimistic update
    if (result.deck) {
      setDecks((prev) => [{ ...result.deck!, card_count: 0 }, ...prev])
    }

    // Force refresh from server
    startTransition(() => {
      window.location.reload()
    })
  }

  // Edit deck handler
  const handleEditDeck = async (deckId: string, name: string) => {
    const result = await updateDeckAction(deckId, name)
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to update deck')
    }

    // Optimistic update - use result from server or current timestamp as string
    if (result.deck) {
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id === deckId ? { ...result.deck!, card_count: deck.card_count } : deck
        )
      )
    }

    // Force refresh from server
    startTransition(() => {
      window.location.reload()
    })
  }

  // Delete deck handler
  const handleDeleteDeck = async (deckId: string) => {
    const result = await deleteDeckAction(deckId)
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to delete deck')
    }

    // Optimistic update
    setDecks((prev) => prev.filter((deck) => deck.id !== deckId))

    // Force refresh from server
    startTransition(() => {
      window.location.reload()
    })
  }

  // Open edit modal
  const openEditModal = (deck: DeckWithStats) => {
    setSelectedDeck(deck)
    setIsEditModalOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (deck: DeckWithStats) => {
    setSelectedDeck(deck)
    setIsDeleteDialogOpen(true)
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212121' }}>
          Flashcards Learning
        </h1>
        <LogoutButton />
      </header>

      {/* Main Content */}
      <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* User Info Card */}
        <div
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Welcome, {user.email}!
          </h2>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>
            You have {decks.length} deck{decks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Decks Section Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#212121', margin: 0 }}>
            Your Decks
          </h2>
          {decks.length > 0 && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                minHeight: '44px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#fff',
                backgroundColor: '#1976d2',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1565c0'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1976d2'
              }}
            >
              + Create Deck
            </button>
          )}
        </div>

        {/* Decks Grid or Empty State */}
        {decks.length === 0 ? (
          <EmptyState onCreateClick={() => setIsCreateModalOpen(true)} />
        ) : (
          <DeckGrid
            decks={decks}
            onEdit={openEditModal}
            onDelete={openDeleteDialog}
            onClick={handleDeckClick}
          />
        )}
      </div>

      {/* Modals */}
      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateDeck={handleCreateDeck}
      />

      <EditDeckModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedDeck(null)
        }}
        deck={selectedDeck}
        onUpdateDeck={handleEditDeck}
      />

      <DeleteDeckDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setSelectedDeck(null)
        }}
        deck={selectedDeck}
        onDeleteDeck={handleDeleteDeck}
      />
    </main>
  )
}
