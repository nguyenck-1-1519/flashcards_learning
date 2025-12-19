// MarkdownRenderer component
// Renders markdown content with syntax highlighting and XSS protection
'use client'

import { parseMarkdown } from '@/lib/markdown/parser'
import { sanitizeHTML } from '@/lib/markdown/sanitize'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const html = sanitizeHTML(parseMarkdown(content))

  return (
    <div
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        fontSize: '1rem',
        lineHeight: 1.6,
        color: '#212121',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}
    />
  )
}
