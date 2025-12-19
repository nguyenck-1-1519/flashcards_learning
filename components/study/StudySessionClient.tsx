// StudySessionClient - Main study session component
// Manages card queue, flip state, and rating
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Deck } from '@/types/deck'
import { Card } from '@/types/card'
import { Rating } from '@/types/study'
import { calculateNextReview } from '@/lib/study/sm2'
import { updateCardWithReview } from '@/app/actions/study'
import { createStudyQueue } from '@/lib/study/queue'
import Breadcrumb from '@/components/ui/Breadcrumb'
import LogoutButton from '@/components/auth/LogoutButton'
import StudyCard from '@/components/study/StudyCard'
import RatingButtons from '@/components/study/RatingButtons'
import EmptyStudyState from '@/components/study/EmptyStudyState'
import SessionSummary from '@/components/study/SessionSummary'

interface StudySessionClientProps {
  deck: Deck
  initialCards: Card[]
}

export default function StudySessionClient({
  deck,
  initialCards,
}: StudySessionClientProps) {
  const router = useRouter()
  const [cards, setCards] = useState<Card[]>(createStudyQueue(initialCards))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isRating, setIsRating] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [startTime] = useState(Date.now())
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showAgainFeedback, setShowAgainFeedback] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    total: initialCards.length,
    reviewed: 0,
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  })

  const currentCard = cards[currentIndex]
  const hasCards = cards.length > 0
  const isLastCard = currentIndex === cards.length - 1

  // Handle card rating
  const handleRate = async (rating: Rating) => {
    if (!currentCard || !isFlipped || isRating) return

    setIsRating(true)

    try {
      // Calculate next review using SM-2 algorithm
      const result = calculateNextReview(
        rating,
        currentCard.ease_factor,
        currentCard.interval,
        currentCard.repetitions
      )

      // Update card in database
      await updateCardWithReview(
        currentCard.id,
        result.ease_factor,
        result.interval,
        result.repetitions,
        result.next_review
      )

      // Update session stats
      setSessionStats((prev) => ({
        ...prev,
        reviewed: prev.reviewed + 1,
        again: prev.again + (rating === Rating.Again ? 1 : 0),
        hard: prev.hard + (rating === Rating.Hard ? 1 : 0),
        good: prev.good + (rating === Rating.Good ? 1 : 0),
        easy: prev.easy + (rating === Rating.Easy ? 1 : 0),
      }))

      // If "Again" rating, add card back to queue
      if (rating === Rating.Again && !isLastCard) {
        const updatedCard = { ...currentCard, ...result }
        setCards((prev) => {
          const newCards = [...prev]
          // Add card 3-5 cards ahead (or at end if not enough cards)
          const insertPosition = Math.min(
            currentIndex + 3 + Math.floor(Math.random() * 3),
            newCards.length
          )
          newCards.splice(insertPosition, 0, updatedCard)
          return newCards
        })
        
        // Show "Again" feedback
        setShowAgainFeedback(true)
        setTimeout(() => setShowAgainFeedback(false), 2000)
      }

      // Move to next card
      if (isLastCard) {
        // Session complete - show summary
        setSessionComplete(true)
      } else {
        setCurrentIndex((prev) => prev + 1)
        setIsFlipped(false)
      }
    } catch (error) {
      console.error('Failed to rate card:', error)
      alert('Failed to save rating. Please try again.')
    } finally {
      setIsRating(false)
    }
  }

  // Handle exit session
  const handleExit = () => {
    setShowExitDialog(true)
  }

  const confirmExit = () => {
    router.push(`/decks/${deck.id}`)
  }

  const cancelExit = () => {
    setShowExitDialog(false)
  }

  // If session is complete, show summary
  if (sessionComplete) {
    const duration = Math.floor((Date.now() - startTime) / 1000) // duration in seconds
    return (
      <SessionSummary
        deckId={deck.id}
        deckName={deck.name}
        stats={{
          ...sessionStats,
          duration,
        }}
      />
    )
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212121' }}>
          Flashcards Learning
        </h1>
        <LogoutButton />
      </header>

      {/* Main Content */}
      <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: deck.name, href: `/decks/${deck.id}` },
              { label: 'Study' },
            ]}
          />
          <button
            onClick={handleExit}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#fff',
              color: '#d32f2f',
              border: '1px solid #d32f2f',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d32f2f'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff'
              e.currentTarget.style.color = '#d32f2f'
            }}
          >
            Exit Session
          </button>
        </div>

        {!hasCards ? (
          <EmptyStudyState
            totalCards={0}
            onStudyAll={() => router.push(`/decks/${deck.id}`)}
          />
        ) : (
          <>
            {/* Progress Bar */}
            <div
              style={{
                marginBottom: '2rem',
                padding: '1rem 1.5rem',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <span style={{ fontSize: '0.875rem', color: '#666' }}>
                  Progress
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#212121' }}>
                  {currentIndex + 1} / {cards.length}
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${((currentIndex + 1) / cards.length) * 100}%`,
                    height: '100%',
                    backgroundColor: '#4caf50',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* Study Card with transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                style={{ marginBottom: '2rem' }}
              >
                <StudyCard card={currentCard} onFlip={setIsFlipped} />
              </motion.div>
            </AnimatePresence>

            {/* "Again" Feedback */}
            <AnimatePresence>
              {showAgainFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'fixed',
                    top: '5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#ff9800',
                    color: '#fff',
                    padding: '1rem 1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    zIndex: 999,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>🔄</span>
                  <span>Card added back to queue</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rating Buttons - Only show when card is flipped */}
            {isFlipped && (
              <RatingButtons onRate={handleRate} disabled={isRating} />
            )}

            {/* Session Stats */}
            <div
              style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  fontSize: '0.875rem',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600, color: '#d32f2f' }}>
                    {sessionStats.again}
                  </div>
                  <div style={{ color: '#999' }}>Again</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600, color: '#ff9800' }}>
                    {sessionStats.hard}
                  </div>
                  <div style={{ color: '#999' }}>Hard</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600, color: '#4caf50' }}>
                    {sessionStats.good}
                  </div>
                  <div style={{ color: '#999' }}>Good</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600, color: '#1976d2' }}>
                    {sessionStats.easy}
                  </div>
                  <div style={{ color: '#999' }}>Easy</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={cancelExit}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#212121', marginBottom: '1rem' }}>
              Exit Study Session?
            </h2>
            <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.5' }}>
              Your progress has been saved. Unreviewed cards will remain due for study.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelExit}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#fff',
                  color: '#666',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff'
                }}
              >
                Continue Studying
              </button>
              <button
                onClick={confirmExit}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#d32f2f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#c62828'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#d32f2f'
                }}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
