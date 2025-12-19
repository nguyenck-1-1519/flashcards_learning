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

// Helper function to update stats based on rating
function getStatsUpdate(rating: Rating) {
  return {
    again: rating === Rating.Again ? 1 : 0,
    hard: rating === Rating.Hard ? 1 : 0,
    good: rating === Rating.Good ? 1 : 0,
    easy: rating === Rating.Easy ? 1 : 0,
  }
}

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
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [startTime] = useState(Date.now())
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    total: initialCards.length > 10 ? 10 : initialCards.length,
    reviewed: 0,
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  })

  const currentCard = cards[currentIndex]
  const hasCards = cards.length > 0
  const isLastCard = currentIndex === cards.length - 1

  // Reset states when card changes
  useEffect(() => {
    setIsFlipped(false)
    setSelectedRating(null)
  }, [currentIndex])

  // Handle rating selection
  const handleRatingSelect = (rating: Rating) => {
    if (!isFlipped) return
    setSelectedRating(rating)
  }

  // Handle Next button click
  const handleNext = async () => {
    if (!selectedRating || !currentCard || isProcessing) return

    setIsProcessing(true)
    const rating: Rating = selectedRating // Type assertion for safety

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
      const statsUpdate = getStatsUpdate(rating)
      setSessionStats((prev) => ({
        ...prev,
        reviewed: prev.reviewed + 1,
        again: prev.again + statsUpdate.again,
        hard: prev.hard + statsUpdate.hard,
        good: prev.good + statsUpdate.good,
        easy: prev.easy + statsUpdate.easy,
      }))

      // Move to next card
      setCurrentIndex((prev) => prev + 1)
      setIsFlipped(false)
      setSelectedRating(null)
    } catch (error) {
      console.error('Failed to save card:', error)
      alert('Failed to save rating. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle Complete button click
  const handleComplete = async () => {
    if (!selectedRating || !currentCard || isProcessing) return

    setIsProcessing(true)
    const rating: Rating = selectedRating

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

      // Calculate final session stats
      const statsUpdate = getStatsUpdate(rating)
      const finalStats = {
        totalCards: sessionStats.reviewed + 1,
        again: sessionStats.again + statsUpdate.again,
        hard: sessionStats.hard + statsUpdate.hard,
        good: sessionStats.good + statsUpdate.good,
        easy: sessionStats.easy + statsUpdate.easy,
      }

      // Calculate session duration in seconds
      const endTime = Date.now()
      const durationSeconds = Math.floor((endTime - startTime) / 1000)

      // Redirect to dashboard with session stats
      router.push(
        `/dashboard?completed=true&totalCards=${finalStats.totalCards}&again=${finalStats.again}&hard=${finalStats.hard}&good=${finalStats.good}&easy=${finalStats.easy}&duration=${durationSeconds}`
      )
    } catch (error) {
      console.error('Failed to save card:', error)
      alert('Không thể lưu kết quả. Vui lòng thử lại.')
      setIsProcessing(false)
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
                  Card {currentIndex + 1} of {cards.length}
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

            {/* Rating Buttons - Only show when card is flipped */}
            {isFlipped && (
              <>
                <RatingButtons 
                  onRatingSelect={handleRatingSelect} 
                  selectedRating={selectedRating}
                  disabled={isProcessing} 
                />

                {/* Next/Complete Button */}
                <div style={{ maxWidth: '800px', margin: '2rem auto 0', padding: '0 1rem' }}>
                  {isLastCard ? (
                    <button
                      onClick={handleComplete}
                      disabled={!selectedRating || isProcessing}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#fff',
                        backgroundColor: selectedRating && !isProcessing ? '#4caf50' : '#ccc',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: selectedRating && !isProcessing ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        opacity: selectedRating && !isProcessing ? 1 : 0.6,
                      }}
                      onMouseEnter={(e) => {
                        if (selectedRating && !isProcessing) {
                          e.currentTarget.style.backgroundColor = '#43a047'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedRating && !isProcessing) {
                          e.currentTarget.style.backgroundColor = '#4caf50'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      {isProcessing ? 'Saving...' : '✓ Complete Session'}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={!selectedRating || isProcessing}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#fff',
                        backgroundColor: selectedRating && !isProcessing ? '#1976d2' : '#ccc',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: selectedRating && !isProcessing ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        opacity: selectedRating && !isProcessing ? 1 : 0.6,
                      }}
                      onMouseEnter={(e) => {
                        if (selectedRating && !isProcessing) {
                          e.currentTarget.style.backgroundColor = '#1565c0'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedRating && !isProcessing) {
                          e.currentTarget.style.backgroundColor = '#1976d2'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      {isProcessing ? 'Saving...' : '→ Next Card'}
                    </button>
                  )}
                </div>
              </>
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
