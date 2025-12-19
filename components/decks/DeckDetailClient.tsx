// DeckDetailClient - Client component for deck detail page
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Deck } from '@/types/deck'
import { Card } from '@/types/card'
import Breadcrumb from '@/components/ui/Breadcrumb'
import LogoutButton from '@/components/auth/LogoutButton'
import AddCardModal from '@/components/cards/AddCardModal'
import EditCardModal from '@/components/cards/EditCardModal'
import DeleteConfirmDialog from '@/components/cards/DeleteConfirmDialog'
import { addCard, editCard, removeCard } from '@/app/actions/cards'

interface DeckDetailClientProps {
  deck: Deck
  cards: Card[]
}

export default function DeckDetailClient({ deck, cards }: DeckDetailClientProps) {
  const router = useRouter()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const handleAddCard = async (front: string, back: string) => {
    const result = await addCard(deck.id, front, back)
    if (!result.success) {
      throw new Error(result.error || 'Failed to add card')
    }
    router.refresh()
  }

  const handleEditCard = async (cardId: string, front: string, back: string) => {
    const result = await editCard(cardId, deck.id, front, back)
    if (!result.success) {
      throw new Error(result.error || 'Failed to update card')
    }
    router.refresh()
  }

  const handleDeleteCard = async (cardId: string) => {
    const result = await removeCard(cardId, deck.id)
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete card')
    }
    router.refresh()
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
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: deck.name },
          ]}
        />

        {/* Deck Info Card */}
        <div
          style={{
            marginBottom: '2rem',
            padding: '2rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem', color: '#212121' }}>
                {deck.name}
              </h2>
              <p style={{ color: '#666', fontSize: '0.875rem' }}>
                {cards.length} card{cards.length !== 1 ? 's' : ''} in this deck
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
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
              + Add Card
            </button>
          </div>
        </div>

        {/* Cards Section */}
        {cards.length === 0 ? (
          // Empty State
          <div
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#212121' }}>
              No cards in this deck
            </h3>
            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Add your first card to start studying!
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                minHeight: '48px',
                padding: '0.875rem 2rem',
                fontSize: '1rem',
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
              Add First Card
            </button>
          </div>
        ) : (
          // Cards List/Grid
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {/* Header with View Toggle */}
            <div
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#212121', margin: 0 }}>
                Cards ({cards.length})
              </h3>
              
              {/* View Toggle Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  backgroundColor: '#f5f5f5',
                  padding: '0.25rem',
                  borderRadius: '6px',
                }}
              >
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: viewMode === 'list' ? '#fff' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: viewMode === 'list' ? '#1976d2' : '#666',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  📋 List
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: viewMode === 'grid' ? '#fff' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: viewMode === 'grid' ? '#1976d2' : '#666',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  📱 Grid
                </button>
              </div>
            </div>

            {/* Cards Display */}
            <div
              style={{
                padding: '1rem',
                display: viewMode === 'grid' ? 'grid' : 'flex',
                flexDirection: viewMode === 'list' ? 'column' : undefined,
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : undefined,
                gap: viewMode === 'grid' ? '1rem' : '0.5rem',
              }}
            >
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#fafafa',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1976d2'
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(25,118,210,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', marginBottom: '0.25rem' }}>
                      FRONT
                    </div>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: '#212121',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        lineHeight: '1.5',
                      }}
                    >
                      {card.front.length > 150 ? `${card.front.substring(0, 150)}...` : card.front}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666', marginBottom: '0.25rem' }}>
                      BACK
                    </div>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: '#212121',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        lineHeight: '1.5',
                      }}
                    >
                      {card.back.length > 150 ? `${card.back.substring(0, 150)}...` : card.back}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: '1rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #e0e0e0',
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCard(card)
                        setIsEditModalOpen(true)
                      }}
                      style={{
                        flex: 1,
                        minHeight: '44px',
                        padding: '0.625rem 1rem',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.375rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1565c0'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1976d2'
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCard(card)
                        setIsDeleteDialogOpen(true)
                      }}
                      style={{
                        flex: 1,
                        minHeight: '44px',
                        padding: '0.625rem 1rem',
                        backgroundColor: '#d32f2f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.375rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#c62828'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#d32f2f'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => {
              router.push(`/decks/${deck.id}/study`)
            }}
            disabled={cards.length === 0}
            style={{
              minHeight: '48px',
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#fff',
              backgroundColor: cards.length === 0 ? '#ccc' : '#4caf50',
              border: 'none',
              borderRadius: '4px',
              cursor: cards.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (cards.length > 0) {
                e.currentTarget.style.backgroundColor = '#45a049'
              }
            }}
            onMouseLeave={(e) => {
              if (cards.length > 0) {
                e.currentTarget.style.backgroundColor = '#4caf50'
              }
            }}
          >
            🎯 Start Studying
          </button>
        </div>
      </div>

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCard}
      />

      {/* Edit Card Modal */}
      {selectedCard && (
        <EditCardModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedCard(null)
          }}
          onSubmit={async (cardId, front, back) => {
            await handleEditCard(cardId, front, back)
            setIsEditModalOpen(false)
            setSelectedCard(null)
          }}
          card={selectedCard}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedCard && (
        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false)
            setSelectedCard(null)
          }}
          onConfirm={async () => {
            await handleDeleteCard(selectedCard.id)
            setIsDeleteDialogOpen(false)
            setSelectedCard(null)
          }}
          card={selectedCard}
        />
      )}
    </main>
  )
}
