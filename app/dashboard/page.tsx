// Dashboard page - protected route for authenticated users
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getUserById } from '@/lib/db/queries'
import { Metadata } from 'next'
import LogoutButton from '@/components/auth/LogoutButton'

export const metadata: Metadata = {
  title: 'Dashboard - Flashcards Learning',
  description: 'Manage your flashcard decks',
}

export default async function DashboardPage() {
  // Check authentication
  const sessionCookie = cookies().get('session')
  const session = await getSession(sessionCookie?.value)

  if (!session) {
    redirect('/login')
  }

  // Get user details
  const user = await getUserById(session.userId)

  if (!user) {
    redirect('/login')
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
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#212121' }}>
          Flashcards Learning
        </h1>
        <LogoutButton />
      </header>

      {/* Main Content */}
      <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Welcome, {user.email}!
          </h2>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>
            Account created: {new Date(user.created_at).toLocaleDateString()}
          </p>
          {user.last_login && (
            <p style={{ color: '#666', fontSize: '0.875rem' }}>
              Last login: {new Date(user.last_login).toLocaleString()}
            </p>
          )}
        </div>

        <div
          style={{
            padding: '2rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
            Your Flashcard Decks
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            You don't have any decks yet. Create your first deck to start learning!
          </p>
          <button
            style={{
              minHeight: '48px',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#fff',
              backgroundColor: '#1976d2',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            + Create Deck
          </button>
        </div>
      </div>
    </main>
  )
}
