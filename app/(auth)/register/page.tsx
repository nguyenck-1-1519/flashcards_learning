// Registration page
import { Metadata } from 'next'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Register - Flashcards Learning',
  description: 'Create a new account to start learning with flashcards',
}

export default function RegisterPage() {
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
            Create Account
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Start your learning journey with flashcards
          </p>
        </div>

        <RegisterForm />
      </div>
    </main>
  )
}
