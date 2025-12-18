// DeckDetailClient - Client component for deck detail page
'use client'

import { Deck } from '@/types/deck'
import Breadcrumb from '@/components/ui/Breadcrumb'
import LogoutButton from '@/components/auth/LogoutButton'

interface DeckDetailClientProps {
  deck: Deck
  cards: any[] // Will be properly typed in Module 003
}

export default function DeckDetailClient({ deck, cards }: DeckDetailClientProps) {
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
              onClick={() => {
                // TODO: Open add card modal (Module 003)
                alert('Add card functionality will be implemented in Module 003')
              }}
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
              onClick={() => {
                // TODO: Open add card modal (Module 003)
                alert('Add card functionality will be implemented in Module 003')
              }}
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
          // Cards List (will be implemented in Module 003)
          <div
            style={{
              padding: '2rem',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <p style={{ color: '#666', textAlign: 'center' }}>
              Card list will be implemented in Module 003 (Study Mode)
            </p>
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
              // TODO: Start study mode (Module 003)
              alert('Study mode will be implemented in Module 003')
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
    </main>
  )
}
