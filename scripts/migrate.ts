#!/usr/bin/env node

/**
 * Database migration script for Flashcards Learning
 * Runs SQL schema files to initialize/update database
 * 
 * Usage:
 *   npm run migrate           - Run all migrations
 *   npm run migrate:auth      - Run auth migrations only
 *   npm run migrate:decks     - Run decks migrations only
 */

import { Pool } from 'pg'
import * as fs from 'fs'
import * as path from 'path'

const MIGRATIONS = {
  auth: 'lib/db/schema.sql',
  // Add more migration files as needed
}

async function runMigration(filePath: string, pool: Pool) {
  try {
    console.log(`\n📂 Reading migration file: ${filePath}`)
    const sqlContent = fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8')
    
    console.log('🚀 Running migration...')
    await pool.query(sqlContent)
    
    console.log('✅ Migration completed successfully!')
    return true
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    return false
  }
}

async function verifyConnection(pool: Pool) {
  try {
    console.log('🔍 Verifying database connection...')
    const result = await pool.query('SELECT NOW() as current_time')
    console.log('✅ Database connected successfully!')
    console.log('⏰ Server time:', result.rows[0].current_time)
    return true
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message)
    console.error('\n💡 Make sure DATABASE_URL is set in .env file')
    return false
  }
}

async function verifyTables(pool: Pool) {
  try {
    console.log('\n🔍 Verifying tables...')
    
    // Check users table
    const usersResult = await pool.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      ) as exists`
    )
    
    if (usersResult.rows[0].exists) {
      console.log('✅ users table exists')
      const countResult = await pool.query('SELECT COUNT(*) as count FROM users')
      console.log(`   → ${countResult.rows[0].count} users in database`)
    } else {
      console.log('⚠️  users table does not exist')
    }
    
    // Check decks table
    const decksResult = await pool.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'decks'
      ) as exists`
    )
    
    if (decksResult.rows[0].exists) {
      console.log('✅ decks table exists')
      const countResult = await pool.query('SELECT COUNT(*) as count FROM decks')
      console.log(`   → ${countResult.rows[0].count} decks in database`)
    } else {
      console.log('⚠️  decks table does not exist')
    }
    
  } catch (error: any) {
    console.error('❌ Verification failed:', error.message)
  }
}

async function main() {
  console.log('🗄️  Flashcards Learning - Database Migration\n')
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!')
    console.error('💡 Add DATABASE_URL to your .env file\n')
    process.exit(1)
  }
  
  // Create connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
  
  try {
    // Verify connection
    const connected = await verifyConnection(pool)
    if (!connected) {
      process.exit(1)
    }
    
    // Get migration target from command line
    const target = process.argv[2] || 'all'
    
    console.log(`\n📋 Migration target: ${target}\n`)
    
    // Run migrations
    let success = true
    
    if (target === 'all' || target === 'auth') {
      success = await runMigration(MIGRATIONS.auth, pool) && success
    }
    
    // Verify tables were created
    await verifyTables(pool)
    
    if (success) {
      console.log('\n🎉 All migrations completed successfully!\n')
      process.exit(0)
    } else {
      console.log('\n⚠️  Some migrations failed. Please check the errors above.\n')
      process.exit(1)
    }
  } finally {
    await pool.end()
  }
}

main()
