// Markdown parser with syntax highlighting
// Uses marked and highlight.js for code blocks

import { marked } from 'marked'
import hljs from 'highlight.js'

// Configure marked with highlight.js
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.error('Highlight error:', err)
      }
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
})

// Parse markdown to HTML
export function parseMarkdown(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return ''
  }

  try {
    return marked.parse(markdown) as string
  } catch (error) {
    console.error('Markdown parse error:', error)
    return markdown // Return original text if parsing fails
  }
}
