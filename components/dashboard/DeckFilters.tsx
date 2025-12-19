// DeckFilters component - Search and sort controls
'use client'

import { DeckWithStats } from '@/types/deck'

export type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'cards-asc' | 'cards-desc'

interface DeckFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  totalDecks: number
  filteredCount: number
}

export default function DeckFilters({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  totalDecks,
  filteredCount,
}: DeckFiltersProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Search bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <input
            type="search"
            placeholder="Search decks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search decks"
            style={{
              width: '100%',
              minHeight: '44px',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
            }}
          />
        </div>

        {/* Sort dropdown */}
        <div style={{ flex: '0 1 auto' }}>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            aria-label="Sort decks"
            style={{
              minHeight: '44px',
              padding: '0.75rem 2rem 0.75rem 0.75rem',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="cards-desc">Most Cards</option>
            <option value="cards-asc">Fewest Cards</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Showing {filteredCount} of {totalDecks} decks
        </div>
      )}
    </div>
  )
}

// Helper function to sort decks
export function sortDecks(decks: DeckWithStats[], sortOption: SortOption): DeckWithStats[] {
  const sorted = [...decks]
  
  switch (sortOption) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    case 'cards-asc':
      return sorted.sort((a, b) => a.card_count - b.card_count)
    case 'cards-desc':
      return sorted.sort((a, b) => b.card_count - a.card_count)
    default:
      return sorted
  }
}

// Helper function to filter decks by search query
export function filterDecks(decks: DeckWithStats[], searchQuery: string): DeckWithStats[] {
  if (!searchQuery.trim()) return decks
  
  const query = searchQuery.toLowerCase()
  return decks.filter((deck) => deck.name.toLowerCase().includes(query))
}
