// PasswordInput component - password field with show/hide toggle
'use client'

import { useState } from 'react'

interface PasswordInputProps {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
  error?: string
}

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = 'Password',
  required = true,
  autoComplete = 'current-password',
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        style={{
          width: '100%',
          minHeight: '48px',
          padding: '0.75rem',
          paddingRight: '3rem',
          fontSize: '1rem',
          border: error ? '2px solid #d32f2f' : '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#fff',
        }}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute',
          right: '0.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          minHeight: '44px',
          minWidth: '44px',
          padding: '0.5rem',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '1.25rem',
        }}
      >
        {showPassword ? '👁️' : '👁️‍🗨️'}
      </button>
    </div>
  )
}
