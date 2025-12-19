// FAB (Floating Action Button) component for mobile
// Material Design style
'use client'

interface FABProps {
  onClick: () => void
  icon?: React.ReactNode
  label?: string
  ariaLabel: string
}

export default function FAB({ onClick, icon, label, ariaLabel }: FABProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#1976d2',
        color: '#fff',
        border: 'none',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 700,
        transition: 'box-shadow 0.2s, transform 0.2s',
        zIndex: 1000,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)'
        e.currentTarget.style.transform = 'scale(1.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.95)'
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)'
      }}
    >
      {icon || '+'}
      {label && (
        <span style={{ marginLeft: '8px', fontSize: '14px' }}>{label}</span>
      )}
    </button>
  )
}
