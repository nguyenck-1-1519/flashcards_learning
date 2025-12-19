// RatingButtons component
// Four difficulty rating buttons for SM-2 algorithm
'use client'

import { useEffect } from 'react'
import { Rating } from '@/types/study'

interface RatingButtonsProps {
  onRate: (rating: Rating) => void
  disabled?: boolean
}

export default function RatingButtons({ onRate, disabled = false }: RatingButtonsProps) {
  // Keyboard shortcuts: 1=Again, 2=Hard, 3=Good, 4=Easy
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (disabled) return

      switch (e.key) {
        case '1':
          onRate(Rating.Again)
          break
        case '2':
          onRate(Rating.Hard)
          break
        case '3':
          onRate(Rating.Good)
          break
        case '4':
          onRate(Rating.Easy)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onRate, disabled])

  const buttons = [
    {
      label: 'Again',
      rating: Rating.Again,
      color: '#d32f2f',
      hoverColor: '#c62828',
      key: '1',
    },
    {
      label: 'Hard',
      rating: Rating.Hard,
      color: '#ff9800',
      hoverColor: '#f57c00',
      key: '2',
    },
    {
      label: 'Good',
      rating: Rating.Good,
      color: '#4caf50',
      hoverColor: '#43a047',
      key: '3',
    },
    {
      label: 'Easy',
      rating: Rating.Easy,
      color: '#1976d2',
      hoverColor: '#1565c0',
      key: '4',
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '1rem',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '1rem',
      }}
    >
      {buttons.map((btn) => (
        <button
          key={btn.rating}
          onClick={() => onRate(btn.rating)}
          disabled={disabled}
          style={{
            minHeight: '60px',
            padding: '1rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#fff',
            backgroundColor: disabled ? '#ccc' : btn.color,
            border: 'none',
            borderRadius: '8px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.backgroundColor = btn.hoverColor
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.currentTarget.style.backgroundColor = btn.color
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
            }
          }}
        >
          <span style={{ fontSize: '1rem' }}>{btn.label}</span>
          <span
            style={{
              fontSize: '0.75rem',
              opacity: 0.8,
              fontFamily: 'monospace',
            }}
          >
            [{btn.key}]
          </span>
        </button>
      ))}
    </div>
  )
}
