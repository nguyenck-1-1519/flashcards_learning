// Loading skeleton for deck grid
// Shows animated placeholders while decks are loading
'use client'

interface DeckSkeletonProps {
  count?: number
}

export default function DeckSkeleton({ count = 6 }: DeckSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            minHeight: '140px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          {/* Deck name skeleton */}
          <div
            style={{
              height: '24px',
              width: '80%',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
            }}
          />

          {/* Card count skeleton */}
          <div
            style={{
              height: '20px',
              width: '40%',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
            }}
          />

          {/* Actions skeleton */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: 'auto',
              paddingTop: '0.5rem',
              borderTop: '1px solid #f5f5f5',
            }}
          >
            <div
              style={{
                height: '36px',
                flex: 1,
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
              }}
            />
            <div
              style={{
                height: '36px',
                flex: 1,
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
              }}
            />
          </div>

          {/* Date skeleton */}
          <div
            style={{
              height: '12px',
              width: '30%',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              marginTop: 'auto',
            }}
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  )
}
