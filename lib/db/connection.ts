// Database connection pool for PostgreSQL
// Uses pg library with connection pooling

import { Pool, PoolConfig } from 'pg'

// Create a singleton connection pool
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    // Parse connection string to check if it's using SSL
    const useSSL = connectionString.includes('sslmode=require') || 
                   connectionString.includes('supabase.com') ||
                   connectionString.includes('neon.tech') ||
                   connectionString.includes('vercel-storage.com')

    const poolConfig: PoolConfig = {
      connectionString,
      max: 20, // Maximum number of connections in pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 10000, // Increased timeout to 10 seconds
    }

    // Configure SSL for cloud databases
    if (useSSL) {
      // For development, disable SSL certificate verification
      // In production, you should use proper certificates
      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
      }
      
      poolConfig.ssl = {
        rejectUnauthorized: false
      }
    }

    pool = new Pool(poolConfig)

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })
  }

  return pool
}

// Close the pool (useful for cleanup in tests)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

// Default export for backwards compatibility
export default getPool()
