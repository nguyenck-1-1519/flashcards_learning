// LoginForm component - client-side validation and form handling
'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import { loginAction } from '@/app/actions/auth'
import PasswordInput from './PasswordInput'
import FormError from './FormError'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: '100%',
        minHeight: '48px',
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        fontWeight: 600,
        color: '#fff',
        backgroundColor: pending ? '#90caf9' : '#1976d2',
        border: 'none',
        borderRadius: '4px',
        cursor: pending ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s',
      }}
    >
      {pending ? 'Logging in...' : 'Log In'}
    </button>
  )
}

export default function LoginForm() {
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')

  const [formState, formAction] = useFormState(loginAction, {
    success: false,
  })
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear client-side error when user starts typing
    if (clientErrors[name]) {
      setClientErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format'
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required'
    }

    setClientErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    // Client-side validation runs before server action
    if (!validateForm()) {
      e.preventDefault()
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate>
      {/* Registration Success Message */}
      {registered && (
        <div
          role="status"
          aria-live="polite"
          style={{
            marginBottom: '1.5rem',
            padding: '0.75rem',
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
        >
          ✓ Account created successfully! You can now log in.
        </div>
      )}

      {/* Email Field */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#424242',
          }}
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          autoComplete="email"
          inputMode="email"
          aria-invalid={!!(clientErrors.email || formState.error?.field === 'email')}
          aria-describedby={clientErrors.email ? 'email-error' : undefined}
          style={{
            width: '100%',
            minHeight: '48px',
            padding: '0.75rem',
            fontSize: '1rem',
            border: (clientErrors.email || formState.error?.field === 'email')
              ? '2px solid #d32f2f'
              : '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff',
          }}
        />
        <FormError message={clientErrors.email || (formState.error?.field === 'email' ? formState.error.message : '')} />
      </div>

      {/* Password Field */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="password"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#424242',
          }}
        >
          Password
        </label>
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          autoComplete="current-password"
          error={clientErrors.password || (formState.error?.field === 'password' ? formState.error.message : '')}
        />
        <FormError message={clientErrors.password || (formState.error?.field === 'password' ? formState.error.message : '')} />
      </div>

      {/* General Error */}
      {formState.error && !formState.error.field && (
        <div style={{ marginBottom: '1rem' }}>
          <FormError message={formState.error.message} />
        </div>
      )}

      {/* Submit Button */}
      <SubmitButton />

      {/* Register Link */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
        Don't have an account?{' '}
        <a
          href="/register"
          style={{
            color: '#1976d2',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Create one
        </a>
      </div>
    </form>
  )
}
