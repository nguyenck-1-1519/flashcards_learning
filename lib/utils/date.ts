// Date formatting utilities for consistent server/client rendering

/**
 * Format date to a simple string format that's consistent across server and client
 * Avoids hydration errors by not using locale-specific formatting
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "Dec 18, 2025")
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(d.getTime())) {
    return 'Invalid date'
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[d.getMonth()]
  const day = d.getDate()
  const year = d.getFullYear()
  
  return `${month} ${day}, ${year}`
}

/**
 * Format date with time
 * @param date - Date object or ISO string
 * @returns Formatted datetime string (e.g., "Dec 18, 2025 3:45 PM")
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(d.getTime())) {
    return 'Invalid date'
  }

  const dateStr = formatDate(d)
  let hours = d.getHours()
  const minutes = d.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  
  hours = hours % 12
  hours = hours ? hours : 12 // 0 should be 12
  
  return `${dateStr} ${hours}:${minutes} ${ampm}`
}

/**
 * Format relative time (e.g., "2 days ago", "just now")
 * @param date - Date object or ISO string
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(d.getTime())) {
    return 'Invalid date'
  }

  const now = Date.now()
  const diff = now - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`
  return `${years} year${years !== 1 ? 's' : ''} ago`
}
