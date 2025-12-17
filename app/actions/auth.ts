// Server actions for authentication
'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { registerSchema, loginSchema } from '@/lib/auth/validation'
import { hashPassword, comparePassword } from '@/lib/auth/password'
import { createSession } from '@/lib/auth/session'
import { createUser, findUserByEmail, updateLastLogin } from '@/lib/db/queries'
import { AuthResponse } from '@/types/auth'

/**
 * Register a new user
 * Server action for registration form
 */
export async function registerAction(
  prevState: any,
  formData: FormData
): Promise<AuthResponse> {
  try {
    // Extract form data
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    // Validate with Zod schema
    const validation = registerSchema.safeParse(rawData)
    
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return {
        success: false,
        error: {
          field: firstError.path[0] as string,
          message: firstError.message,
        },
      }
    }

    const { email, password } = validation.data

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return {
        success: false,
        error: {
          field: 'email',
          message: 'Email already exists',
        },
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user in database
    const user = await createUser(email, passwordHash)

    // Registration successful - redirect to login
    redirect('/login?registered=true')
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle redirect (not an error)
    if (error?.message?.includes('NEXT_REDIRECT')) {
      throw error
    }

    return {
      success: false,
      error: {
        message: error.message || 'Failed to create account. Please try again.',
      },
    }
  }
}

/**
 * Login existing user
 * Server action for login form
 */
export async function loginAction(
  prevState: any,
  formData: FormData
): Promise<AuthResponse> {
  try {
    // Extract form data
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    // Validate with Zod schema
    const validation = loginSchema.safeParse(rawData)
    
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return {
        success: false,
        error: {
          field: firstError.path[0] as string,
          message: firstError.message,
        },
      }
    }

    const { email, password } = validation.data

    // Find user by email
    const user = await findUserByEmail(email)
    if (!user) {
      return {
        success: false,
        error: {
          field: 'email',
          message: 'Invalid email or password',
        },
      }
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash)
    if (!isValidPassword) {
      return {
        success: false,
        error: {
          field: 'password',
          message: 'Invalid email or password',
        },
      }
    }

    // Create JWT session
    const token = await createSession(user.id, user.email)

    // Set httpOnly cookie
    cookies().set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    // Update last login timestamp
    await updateLastLogin(user.id)

    // Login successful - redirect to dashboard
    redirect('/dashboard')
  } catch (error: any) {
    console.error('Login error:', error)
    
    // Handle redirect (not an error)
    if (error?.message?.includes('NEXT_REDIRECT')) {
      throw error
    }

    return {
      success: false,
      error: {
        message: error.message || 'Failed to log in. Please try again.',
      },
    }
  }
}

/**
 * Logout user
 * Clears session cookie
 */
export async function logoutAction(): Promise<void> {
  cookies().delete('session')
  redirect('/login')
}
