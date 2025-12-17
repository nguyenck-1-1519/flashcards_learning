// Login page
import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Login - Flashcards Learning',
  description: 'Log in to your flashcards learning account',
}

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: '#fafafa',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '2rem',
        }}
      >
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#212121',
              marginBottom: '0.5rem',
            }}
          >
            Welcome Back
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Log in to continue learning
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
