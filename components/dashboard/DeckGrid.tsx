// DeckGrid component - responsive grid layout
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns
'use client'

import { DeckWithStats } from '@/types/deck'
import DeckCard from './DeckCard'

interface DeckGridProps {
  decks: DeckWithStats[]
  onEdit?: (deck: DeckWithStats) => void
  onDelete?: (deck: DeckWithStats) => void
  onClick?: (deck: DeckWithStats) => void
}

export default function DeckGrid({ decks, onEdit, onDelete, onClick }: DeckGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gap: '1.5rem',
      }}
      className="deck-grid"
    >
      {decks.map((deck) => (
        <DeckCard
          key={deck.id}
          deck={deck}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}

      <style jsx>{`
        @media (min-width: 768px) {
          .deck-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .deck-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  )
}
