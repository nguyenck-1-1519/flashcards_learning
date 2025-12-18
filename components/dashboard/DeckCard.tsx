// DeckCard component - individual deck card with actions
// Material Design style consistent with auth pages
'use client'

import { DeckWithStats } from '@/types/deck'
import DeckStats from './DeckStats'

interface DeckCardProps {
  deck: DeckWithStats
  onEdit?: (deck: DeckWithStats) => void
  onDelete?: (deck: DeckWithStats) => void
  onClick?: (deck: DeckWithStats) => void
}

export default function DeckCard({ deck, onEdit, onDelete, onClick }: DeckCardProps) {
  const handleCardClick = () => {
    if (onClick) {
      onClick(deck)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(deck)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(deck)
    }
  }

  return (
    <div
      onClick={handleCardClick}
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1.5rem',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minHeight: '140px',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      {/* Deck name */}
      <h3
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#212121',
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.4,
        }}
      >
        {deck.name}
      </h3>

      {/* Card count */}
      <DeckStats cardCount={deck.card_count} />

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: 'auto',
            paddingTop: '0.5rem',
            borderTop: '1px solid #f0f0f0',
          }}
        >
          {onEdit && (
            <button
              onClick={handleEdit}
              aria-label={`Edit ${deck.name}`}
              style={{
                minHeight: '36px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1976d2',
                backgroundColor: 'transparent',
                border: '1px solid #1976d2',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: 1,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e3f2fd'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              aria-label={`Delete ${deck.name}`}
              style={{
                minHeight: '36px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#d32f2f',
                backgroundColor: 'transparent',
                border: '1px solid #d32f2f',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: 1,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffebee'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}

      {/* Created date (small text) */}
      <div style={{ fontSize: '0.75rem', color: '#999', marginTop: 'auto' }}>
        Created {new Date(deck.created_at).toLocaleDateString()}
      </div>
    </div>
  )
}
