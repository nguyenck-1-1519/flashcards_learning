// Password hashing utilities using bcryptjs
// 10 salt rounds for balance between security and performance (~200ms)

import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Promise resolving to hashed password
 * @throws Error if hashing fails
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    return hash
  } catch (error) {
    console.error('Password hashing error:', error)
    throw new Error('Failed to hash password')
  }
}

/**
 * Compare plain text password with hash
 * @param password - Plain text password
 * @param hash - Bcrypt hashed password
 * @returns Promise resolving to true if match, false otherwise
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hash)
    return isMatch
  } catch (error) {
    console.error('Password comparison error:', error)
    return false
  }
}
