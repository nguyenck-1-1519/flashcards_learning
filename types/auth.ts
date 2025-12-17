// TypeScript types for authentication

export interface User {
  id: string
  email: string
  created_at: Date
  last_login?: Date
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
