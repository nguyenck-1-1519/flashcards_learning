// FormError component - displays validation and server errors
'use client'

interface FormErrorProps {
  message?: string
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className="form-error"
      style={{
        color: '#d32f2f',
        fontSize: '0.875rem',
        marginTop: '0.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <span aria-hidden="true">⚠️</span>
      <span>{message}</span>
    </div>
  )
}
