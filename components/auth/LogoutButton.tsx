// LogoutButton component
'use client'

import { logoutAction } from '@/app/actions/auth'
import { useFormStatus } from 'react-dom'

function LogoutButtonInner() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        minHeight: '44px',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: pending ? '#999' : '#d32f2f',
        backgroundColor: 'transparent',
        border: '1px solid',
        borderColor: pending ? '#ccc' : '#d32f2f',
        borderRadius: '4px',
        cursor: pending ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {pending ? 'Logging out...' : 'Logout'}
    </button>
  )
}

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <LogoutButtonInner />
    </form>
  )
}
