// Database query functions for user operations
// Uses @vercel/postgres for PostgreSQL connections

import { sql } from '@vercel/postgres'
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
  try {
    const result = await sql<User>`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${passwordHash})
      RETURNING id, email, created_at, last_login
    `
    
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
  try {
    const result = await sql<UserWithPassword>`
      SELECT id, email, password_hash, created_at, last_login
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `

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
  try {
    await sql`
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `
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
  try {
    const result = await sql<User>`
      SELECT id, email, created_at, last_login
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    `

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error('Get user by ID error:', error)
    return null
  }
}
