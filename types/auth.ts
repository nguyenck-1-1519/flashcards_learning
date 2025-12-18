// TypeScript types for authentication

export interface User {
  id: string
  email: string
  created_at: Date | string // Can be Date object or ISO string from DB
  last_login?: Date | string | null // Can be Date object or ISO string from DB
}

export interface UserWithPassword extends User {
  password_hash: string
}

export interface Session {
  userId: string
  email: string
  iat: number // issued at
  exp: number // expiration
}

export interface AuthError {
  field?: string
  message: string
}

export interface AuthResponse {
  success: boolean
  error?: AuthError
  user?: User
}
