// DeckCard component - individual deck card with actions
// Material Design style consistent with auth pages
'use client'

import { memo, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { motion } from 'framer-motion'
import { DeckWithStats } from '@/types/deck'
import DeckStats from './DeckStats'
import { formatDate } from '@/lib/utils/date'

interface DeckCardProps {
  deck: DeckWithStats
  onEdit?: (deck: DeckWithStats) => void
  onDelete?: (deck: DeckWithStats) => void
  onClick?: (deck: DeckWithStats) => void
}

function DeckCard({ deck, onEdit, onDelete, onClick }: DeckCardProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [swipeOffset, setSwipeOffset] = useState(0)

  // Swipe handlers: swipe left = delete, swipe right = edit
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (onDelete) {
        onDelete(deck)
      }
    },
    onSwipedRight: () => {
      if (onEdit) {
        onEdit(deck)
      }
    },
    onSwiping: (eventData) => {
      // Show visual feedback during swipe
      setSwipeOffset(eventData.deltaX)
    },
    onSwiped: () => {
      // Reset offset after swipe
      setSwipeOffset(0)
    },
    trackMouse: false, // Only for touch, not mouse
    delta: 50, // Minimum swipe distance
  })

  const handleCardClick = (e: React.MouseEvent) => {
    // Create ripple effect
    if (onClick) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()
      
      setRipples((prev) => [...prev, { x, y, id }])
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
      
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick(deck)
    }
  }

  return (
    <motion.div
      {...swipeHandlers}
      animate={{ x: swipeOffset }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${deck.name}, ${deck.card_count} card${deck.card_count !== 1 ? 's' : ''}`}
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
        position: 'relative',
        overflow: 'hidden', // For ripple effect
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
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#1976d2',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Swipe indicator */}
      {swipeOffset !== 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: swipeOffset > 0 ? 0 : 'auto',
            right: swipeOffset < 0 ? 0 : 'auto',
            bottom: 0,
            width: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: swipeOffset > 0 ? '#1976d2' : '#d32f2f',
            color: '#fff',
            fontSize: '24px',
            fontWeight: 700,
            opacity: Math.min(Math.abs(swipeOffset) / 100, 0.8),
            pointerEvents: 'none',
          }}
        >
          {swipeOffset > 0 ? '✏️' : '🗑️'}
        </div>
      )}
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
        Created {formatDate(deck.created_at)}
      </div>
    </motion.div>
  )
}

// Memoize to prevent unnecessary re-renders
export default memo(DeckCard, (prevProps, nextProps) => {
  return (
    prevProps.deck.id === nextProps.deck.id &&
    prevProps.deck.name === nextProps.deck.name &&
    prevProps.deck.card_count === nextProps.deck.card_count &&
    prevProps.deck.updated_at === nextProps.deck.updated_at
  )
})
