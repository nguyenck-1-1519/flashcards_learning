// CongratulationsModal - Shows celebration message after completing study session
'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface CongratulationsModalProps {
  isOpen: boolean
  onClose: () => void
  totalCards: number
  again: number
  hard: number
  good: number
  easy: number
  duration: number // in seconds
}

export default function CongratulationsModal({
  isOpen,
  onClose,
  totalCards,
  again,
  hard,
  good,
  easy,
  duration,
}: CongratulationsModalProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs} giây`
    return `${mins} phút ${secs} giây`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              padding: '2rem',
              maxWidth: '90%',
              width: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
              zIndex: 1001,
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              aria-label="Đóng"
            >
              ×
            </button>

            {/* Content */}
            <div style={{ textAlign: 'center' }}>
              {/* Celebration icon */}
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>

              {/* Congratulations message */}
              <h2
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: '#2c3e50',
                  marginBottom: '0.5rem',
                }}
              >
                Chúc mừng!
              </h2>
              <p
                style={{
                  fontSize: '1.125rem',
                  color: '#555',
                  marginBottom: '2rem',
                }}
              >
                Bạn đã hoàn thành {totalCards} thẻ!
              </p>

              {/* Statistics */}
              <div
                style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left',
                }}
              >
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#2c3e50',
                    marginBottom: '1rem',
                  }}
                >
                  Kết quả học tập
                </h3>

                {/* Rating breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#f44336',
                          borderRadius: '50%',
                        }}
                      />
                      <span style={{ color: '#555' }}>Cần ôn lại (Again)</span>
                    </span>
                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>{again}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#ff9800',
                          borderRadius: '50%',
                        }}
                      />
                      <span style={{ color: '#555' }}>Khó (Hard)</span>
                    </span>
                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>{hard}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#4caf50',
                          borderRadius: '50%',
                        }}
                      />
                      <span style={{ color: '#555' }}>Tốt (Good)</span>
                    </span>
                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>{good}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#2196f3',
                          borderRadius: '50%',
                        }}
                      />
                      <span style={{ color: '#555' }}>Dễ (Easy)</span>
                    </span>
                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>{easy}</span>
                  </div>
                </div>

                {/* Duration */}
                <div
                  style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: '#555' }}>Thời gian học</span>
                  <span style={{ fontWeight: 600, color: '#2c3e50' }}>
                    {formatDuration(duration)}
                  </span>
                </div>
              </div>

              {/* OK button */}
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  minHeight: '48px',
                  padding: '0.875rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#fff',
                  backgroundColor: '#4caf50',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#45a049'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(76, 175, 80, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4caf50'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                OK
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
