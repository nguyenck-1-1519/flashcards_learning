// EmptyStudyState component
// Displayed when no cards are due for review
'use client'

interface EmptyStudyStateProps {
  totalCards: number
  nextReviewDate?: Date | string | null
  onStudyAll?: () => void
}

export default function EmptyStudyState({
  totalCards,
  nextReviewDate,
  onStudyAll,
}: EmptyStudyStateProps) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '4rem',
          marginBottom: '1rem',
        }}
      >
        🎉
      </div>

      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#212121',
          marginBottom: '0.5rem',
        }}
      >
        All caught up!
      </h2>

      <p
        style={{
          fontSize: '1rem',
          color: '#666',
          marginBottom: '1.5rem',
          maxWidth: '400px',
        }}
      >
        {totalCards === 0
          ? 'This deck has no cards yet. Add some cards to start studying!'
          : 'No cards are due for review right now. Come back later or study all cards anyway.'}
      </p>

      {nextReviewDate && (
        <p
          style={{
            fontSize: '0.875rem',
            color: '#999',
            marginBottom: '1.5rem',
          }}
        >
          Next review:{' '}
          {new Date(nextReviewDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}

      {totalCards > 0 && onStudyAll && (
        <button
          onClick={onStudyAll}
          style={{
            minHeight: '44px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#1976d2',
            backgroundColor: 'transparent',
            border: '2px solid #1976d2',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e3f2fd'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Study All {totalCards} Cards Anyway
        </button>
      )}
    </div>
  )
}
