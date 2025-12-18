// Toast notification component for success/error messages
// Material Design style
'use client'

import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4caf50'
      case 'error':
        return '#d32f2f'
      case 'info':
        return '#1976d2'
      default:
        return '#212121'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'info':
        return 'ℹ'
      default:
        return ''
    }
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: `translateX(-50%) ${isVisible ? 'translateY(0)' : 'translateY(100px)'}`,
        backgroundColor: getBackgroundColor(),
        color: '#fff',
        padding: '1rem 1.5rem',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        minWidth: '200px',
        maxWidth: '500px',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.3s, opacity 0.3s',
      }}
    >
      <span
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
        }}
        aria-hidden="true"
      >
        {getIcon()}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {message}
      </span>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        aria-label="Close notification"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '1.25rem',
          padding: '0',
          minWidth: '24px',
          minHeight: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.8,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.8'
        }}
      >
        ×
      </button>
    </div>
  )
}
