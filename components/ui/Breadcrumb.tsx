// Breadcrumb navigation component
// Material Design style consistent with dashboard
'use client'

import Link from 'next/link'

interface BreadcrumbProps {
  items: Array<{
    label: string
    href?: string
  }>
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        color: '#666',
        marginBottom: '1rem',
      }}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {index > 0 && (
            <span style={{ color: '#999' }} aria-hidden="true">
              /
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              style={{
                color: '#1976d2',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1565c0'
                e.currentTarget.style.textDecoration = 'underline'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#1976d2'
                e.currentTarget.style.textDecoration = 'none'
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: '#212121', fontWeight: 500 }} aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
