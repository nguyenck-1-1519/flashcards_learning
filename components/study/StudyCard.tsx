// StudyCard component
// Flashcard with 3D flip animation
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CardFront from './CardFront'
import CardBack from './CardBack'
import { Card } from '@/types/card'

interface StudyCardProps {
  card: Card
  onFlip?: (isFlipped: boolean) => void
}

export default function StudyCard({ card, onFlip }: StudyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false)
  }, [card.id])

  const handleFlip = () => {
    if (isAnimating) return

    const newFlipped = !isFlipped
    setIsFlipped(newFlipped)
    onFlip?.(newFlipped)
  }

  // Keyboard shortcut: Spacebar to flip
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isAnimating) {
        e.preventDefault()
        handleFlip()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFlipped, isAnimating])

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        perspective: '1000px',
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={() => setIsAnimating(false)}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '400px',
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
        }}
        onClick={handleFlip}
      >
        {/* Front Side */}
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <CardFront content={card.front} />
        </motion.div>

        {/* Back Side */}
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <CardBack content={card.back} />
        </motion.div>
      </motion.div>

      {/* Flip hint */}
      {!isFlipped && (
        <div
          style={{
            marginTop: '1rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#999',
          }}
        >
          Click card or press <kbd style={{ 
            padding: '0.2rem 0.5rem',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ccc',
            borderRadius: '3px',
            fontFamily: 'monospace',
          }}>Space</kbd> to reveal answer
        </div>
      )}
    </div>
  )
}
