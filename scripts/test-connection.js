// Quick test script for database connection
const { Pool } = require('pg')

async function testConnection() {
  // Load .env
  require('dotenv').config()
  
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL not set')
    process.exit(1)
  }

  console.log('🔍 Testing database connection...')
  
  // Set NODE_TLS_REJECT_UNAUTHORIZED for development
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    // Test basic query
    const timeResult = await pool.query('SELECT NOW() as current_time')
    console.log('✅ Connection successful!')
    console.log('   Server time:', timeResult.rows[0].current_time)

    // Test users table
    const userResult = await pool.query('SELECT COUNT(*) as count FROM users')
    console.log('✅ Users table accessible')
    console.log('   User count:', userResult.rows[0].count)

    // Test decks table
    const deckResult = await pool.query('SELECT COUNT(*) as count FROM decks')
    console.log('✅ Decks table accessible')
    console.log('   Deck count:', deckResult.rows[0].count)

    console.log('\n🎉 All database tests passed!\n')
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testConnection()
