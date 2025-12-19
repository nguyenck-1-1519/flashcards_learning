// JWT session utilities using jose (Edge Runtime compatible)
// Creates and verifies JWT tokens for user sessions

import { SignJWT, jwtVerify } from 'jose'
import { Session } from '@/types/auth'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
)

const JWT_EXPIRATION = '24h' // 24 hours

/**
 * Create a JWT session token
 * @param userId - User's unique ID
 * @param email - User's email
 * @returns Promise resolving to JWT token string
 */
export async function createSession(
  userId: string,
  email: string
): Promise<string> {
  try {
    const token = await new SignJWT({ userId, email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRATION)
      .sign(JWT_SECRET)

    return token
  } catch (error) {
    console.error('JWT creation error:', error)
    throw new Error('Failed to create session')
  }
}

/**
 * Verify and decode a JWT session token
 * @param token - JWT token string
 * @returns Promise resolving to Session object or null if invalid
 */
export async function verifySession(token: string): Promise<Session | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as unknown as Session
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}

/**
 * Get session from request cookies
 * @param cookieValue - Value from 'session' cookie
 * @returns Promise resolving to Session or null
 */
export async function getSession(
  cookieValue: string | undefined
): Promise<Session | null> {
  if (!cookieValue) return null
  return verifySession(cookieValue)
}
