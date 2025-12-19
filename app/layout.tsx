import type { Metadata } from 'next'
import './globals.css'
import './markdown.css'
import 'highlight.js/styles/github.css'

export const metadata: Metadata = {
  title: 'Flashcards Learning',
  description: 'Learn with spaced repetition flashcards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
