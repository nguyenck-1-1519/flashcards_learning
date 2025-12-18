// Reusable Modal component
// Consistent with auth pages styling
'use client'

import { useEffect, useRef } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: string
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '500px',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Save the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement

      // Focus the first focusable element in the modal
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen])

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen) return

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusableElements || focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          animation: 'fadeIn 0.2s',
        }}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth,
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <h2
            id="modal-title"
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#212121',
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              minHeight: '44px',
              minWidth: '44px',
              padding: '0.5rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
