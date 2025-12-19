// Reusable Card component - Material Design style
// Consistent with auth pages styling

interface CardProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  elevation?: 1 | 2 | 3 | 4
  hover?: boolean
}

export default function Card({
  children,
  onClick,
  className = '',
  elevation = 1,
  hover = false,
}: CardProps) {
  const elevationStyles = {
    1: '0 2px 4px rgba(0,0,0,0.1)',
    2: '0 4px 8px rgba(0,0,0,0.12)',
    3: '0 6px 12px rgba(0,0,0,0.15)',
    4: '0 8px 16px rgba(0,0,0,0.18)',
  }

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: elevationStyles[elevation],
        padding: '1.5rem',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        ...(hover && {
          ':hover': {
            boxShadow: elevationStyles[Math.min(elevation + 1, 4) as 1 | 2 | 3 | 4],
            transform: 'translateY(-2px)',
          },
        }),
      }}
      onMouseEnter={(e) => {
        if (hover && onClick) {
          e.currentTarget.style.boxShadow = elevationStyles[Math.min(elevation + 1, 4) as 1 | 2 | 3 | 4]
          e.currentTarget.style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        if (hover && onClick) {
          e.currentTarget.style.boxShadow = elevationStyles[elevation]
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      {children}
    </div>
  )
}
