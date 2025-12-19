// CardFront component
// Displays the front (question) side of a flashcard
'use client'

import MarkdownRenderer from '@/components/markdown/MarkdownRenderer'

interface CardFrontProps {
  content: string
}

export default function CardFront({ content }: CardFrontProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#1976d2',
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        Question
      </div>
      <MarkdownRenderer content={content} />
    </div>
  )
}
