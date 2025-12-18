// Database query functions for user operations
// Uses pg library for PostgreSQL connections

import { getPool } from './connection'
import { User, UserWithPassword } from '@/types/auth'

/**
 * Create a new user in the database
 * @param email - User's email (must be unique)
 * @param passwordHash - Bcrypt hashed password
 * @returns Promise resolving to created User object
 * @throws Error if user already exists or database error
 */
export async function createUser(
  email: string,
  passwordHash: string
): Promise<User> {
  const pool = getPool()
  
  try {
    const result = await pool.query<User>(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at, last_login',
      [email, passwordHash]
    )
    
    if (result.rows.length === 0) {
      throw new Error('Failed to create user')
    }

    return result.rows[0]
  } catch (error: any) {
    // Check for unique constraint violation (duplicate email)
    if (error?.code === '23505') {
      throw new Error('Email already exists')
    }
    console.error('Create user error:', error)
    throw new Error('Failed to create user')
  }
}

/**
 * Find a user by email address
 * @param email - User's email to search for
 * @returns Promise resolving to User or null if not found
 */
export async function findUserByEmail(
  email: string
): Promise<UserWithPassword | null> {
  const pool = getPool()
  
  try {
    const result = await pool.query<UserWithPassword>(
      'SELECT id, email, password_hash, created_at, last_login FROM users WHERE email = $1 LIMIT 1',
      [email]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error('Find user error:', error)
    return null
  }
}

/**
 * Update user's last login timestamp
 * @param userId - User's ID
 * @returns Promise resolving to void
 */
export async function updateLastLogin(userId: string): Promise<void> {
  const pool = getPool()
  
  try {
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    )
  } catch (error) {
    console.error('Update last login error:', error)
    // Don't throw - non-critical operation
  }
}

/**
 * Get user by ID (without password)
 * @param userId - User's ID
 * @returns Promise resolving to User or null
 */
export async function getUserById(userId: string): Promise<User | null> {
  const pool = getPool()
  
  try {
    const result = await pool.query<User>(
      'SELECT id, email, created_at, last_login FROM users WHERE id = $1 LIMIT 1',
      [userId]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error('Get user by ID error:', error)
    return null
  }
}
