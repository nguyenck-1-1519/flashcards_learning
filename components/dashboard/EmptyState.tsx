// EmptyState component - shown when user has no decks
// Consistent styling with auth pages

interface EmptyStateProps {
  onCreateClick: () => void
}

export default function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#212121',
          marginBottom: '0.5rem',
        }}
      >
        No decks yet
      </h2>
      <p
        style={{
          fontSize: '1rem',
          color: '#666',
          marginBottom: '2rem',
        }}
      >
        Create your first deck to start learning with flashcards
      </p>
      <button
        onClick={onCreateClick}
        style={{
          minHeight: '48px',
          padding: '0.75rem 2rem',
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
        + Create Your First Deck
      </button>
    </div>
  )
}
