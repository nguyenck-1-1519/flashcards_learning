// DeckStats component - displays card count badge
// Consistent styling with auth pages

interface DeckStatsProps {
  cardCount: number
}

export default function DeckStats({ cardCount }: DeckStatsProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#666',
        fontSize: '0.875rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}
      >
        <span aria-hidden="true">📇</span>
        <span>
          {cardCount} {cardCount === 1 ? 'card' : 'cards'}
        </span>
      </div>
    </div>
  )
}
