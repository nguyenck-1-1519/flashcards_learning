// RegisterForm component - client-side validation and form handling
'use client'

import { useState, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { registerAction } from '@/app/actions/auth'
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
      {pending ? 'Creating account...' : 'Create Account'}
    </button>
  )
}

export default function RegisterForm() {
  const [formState, formAction] = useFormState(registerAction, {
    success: false,
  })
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})
  const [passwordStrength, setPasswordStrength] = useState<string>('')

  // Calculate password strength
  useEffect(() => {
    const password = formData.password
    if (password.length === 0) {
      setPasswordStrength('')
      return
    }

    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    const strengthIndex = Math.min(Math.floor(strength / 1.5), 4)
    setPasswordStrength(strengthLabels[strengthIndex])
  }, [formData.password])

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
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match"
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
          autoComplete="new-password"
          error={clientErrors.password || (formState.error?.field === 'password' ? formState.error.message : '')}
        />
        {formData.password && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
            Strength: <strong>{passwordStrength}</strong>
          </div>
        )}
        <FormError message={clientErrors.password || (formState.error?.field === 'password' ? formState.error.message : '')} />
      </div>

      {/* Confirm Password Field */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="confirmPassword"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#424242',
          }}
        >
          Confirm Password
        </label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          autoComplete="new-password"
          error={clientErrors.confirmPassword || (formState.error?.field === 'confirmPassword' ? formState.error.message : '')}
        />
        <FormError message={clientErrors.confirmPassword || (formState.error?.field === 'confirmPassword' ? formState.error.message : '')} />
      </div>

      {/* General Error */}
      {formState.error && !formState.error.field && (
        <div style={{ marginBottom: '1rem' }}>
          <FormError message={formState.error.message} />
        </div>
      )}

      {/* Success Message */}
      {formState.success && (
        <div
          role="status"
          aria-live="polite"
          style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
        >
          ✓ Account created successfully! Redirecting to login...
        </div>
      )}

      {/* Submit Button */}
      <SubmitButton />

      {/* Login Link */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
        Already have an account?{' '}
        <a
          href="/login"
          style={{
            color: '#1976d2',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Log in
        </a>
      </div>
    </form>
  )
}
