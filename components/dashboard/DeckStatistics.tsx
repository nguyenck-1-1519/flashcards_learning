// DeckStatistics component - Overview statistics for all decks
'use client'

import { DeckWithStats } from '@/types/deck'

interface DeckStatisticsProps {
  decks: DeckWithStats[]
}

export default function DeckStatistics({ decks }: DeckStatisticsProps) {
  const totalDecks = decks.length
  const totalCards = decks.reduce((sum, deck) => sum + deck.card_count, 0)
  const averageCards = totalDecks > 0 ? Math.round(totalCards / totalDecks) : 0
  const largestDeck = decks.reduce((max, deck) => 
    deck.card_count > max.card_count ? deck : max,
    decks[0] || { card_count: 0, name: 'None' }
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      {/* Total Decks */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1976d2',
            marginBottom: '0.5rem',
          }}
        >
          {totalDecks}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Total Decks
        </div>
      </div>

      {/* Total Cards */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#4caf50',
            marginBottom: '0.5rem',
          }}
        >
          {totalCards}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Total Cards
        </div>
      </div>

      {/* Average Cards per Deck */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#ff9800',
            marginBottom: '0.5rem',
          }}
        >
          {averageCards}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Avg Cards/Deck
        </div>
      </div>

      {/* Largest Deck */}
      {totalDecks > 0 && (
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#9c27b0',
              marginBottom: '0.5rem',
            }}
          >
            {largestDeck.card_count}
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: '#666',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={`Largest: ${largestDeck.name}`}
          >
            Largest: {largestDeck.name}
          </div>
        </div>
      )}
    </div>
  )
}
