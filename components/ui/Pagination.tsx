// Pagination component - Navigation controls for paginated lists
'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7 // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first, last, current, and nearby pages
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '2rem',
        padding: '1rem',
      }}
    >
      {/* Previous button */}
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label="Previous page"
        style={{
          minWidth: '44px',
          minHeight: '44px',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: canGoPrevious ? '#1976d2' : '#999',
          backgroundColor: 'transparent',
          border: '1px solid',
          borderColor: canGoPrevious ? '#1976d2' : '#ccc',
          borderRadius: '4px',
          cursor: canGoPrevious ? 'pointer' : 'not-allowed',
        }}
      >
        ←
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              style={{
                padding: '0.5rem',
                color: '#999',
              }}
            >
              ...
            </span>
          )
        }

        const pageNum = page as number
        const isCurrent = pageNum === currentPage

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            aria-label={`Page ${pageNum}`}
            aria-current={isCurrent ? 'page' : undefined}
            style={{
              minWidth: '44px',
              minHeight: '44px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isCurrent ? '#fff' : '#1976d2',
              backgroundColor: isCurrent ? '#1976d2' : 'transparent',
              border: '1px solid #1976d2',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {pageNum}
          </button>
        )
      })}

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next page"
        style={{
          minWidth: '44px',
          minHeight: '44px',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: canGoNext ? '#1976d2' : '#999',
          backgroundColor: 'transparent',
          border: '1px solid',
          borderColor: canGoNext ? '#1976d2' : '#ccc',
          borderRadius: '4px',
          cursor: canGoNext ? 'pointer' : 'not-allowed',
        }}
      >
        →
      </button>
    </div>
  )
}
