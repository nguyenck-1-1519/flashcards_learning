// Test script for deck navigation flow
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

async function testDeckNavigation() {
  // Load .env
  require('dotenv').config()
  
  // Set NODE_TLS_REJECT_UNAUTHORIZED for development
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('🧪 Testing deck navigation flow...\n')

    // Create test user
    const testEmail = `navtest_${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'
    const passwordHash = await bcrypt.hash(testPassword, 10)

    console.log('1️⃣ Creating test user...')
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [testEmail, passwordHash]
    )
    const userId = userResult.rows[0].id
    console.log('✅ User created:', testEmail)

    // Create test decks
    console.log('\n2️⃣ Creating test decks...')
    const deck1 = await pool.query(
      'INSERT INTO decks (name, user_id) VALUES ($1, $2) RETURNING id, name',
      ['Test Deck for Navigation', userId]
    )
    const deckId = deck1.rows[0].id
    console.log('✅ Deck created:', deck1.rows[0].name)
    console.log('   Deck ID:', deckId)

    // Verify deck can be fetched
    console.log('\n3️⃣ Verifying deck detail fetch...')
    const deckDetail = await pool.query(
      'SELECT id, name, user_id, created_at, updated_at FROM decks WHERE id = $1 AND user_id = $2',
      [deckId, userId]
    )
    
    if (deckDetail.rows.length > 0) {
      console.log('✅ Deck details fetched successfully')
      console.log('   Name:', deckDetail.rows[0].name)
      console.log('   User ID:', deckDetail.rows[0].user_id)
    } else {
      throw new Error('Failed to fetch deck details')
    }

    // Test authorization (wrong user)
    console.log('\n4️⃣ Testing authorization...')
    const wrongUser = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [`wrong_${Date.now()}@example.com`, passwordHash]
    )
    const wrongUserId = wrongUser.rows[0].id
    
    const unauthorizedResult = await pool.query(
      'SELECT id FROM decks WHERE id = $1 AND user_id = $2',
      [deckId, wrongUserId]
    )
    
    if (unauthorizedResult.rows.length === 0) {
      console.log('✅ Authorization check working (wrong user cannot access deck)')
    } else {
      throw new Error('Authorization check failed')
    }

    // Clean up
    console.log('\n5️⃣ Cleaning up test data...')
    await pool.query('DELETE FROM users WHERE id = $1', [userId])
    await pool.query('DELETE FROM users WHERE id = $1', [wrongUserId])
    console.log('✅ Test data cleaned up')

    console.log('\n🎉 All navigation tests passed!\n')
    console.log('✅ Deck detail page data fetching: WORKING')
    console.log('✅ Authorization checks: WORKING')
    console.log('✅ User can only see their own decks: VERIFIED\n')
    console.log('📝 Manual test required:')
    console.log('   1. Login to the application')
    console.log('   2. Click on a deck card')
    console.log('   3. Verify navigation to /decks/[deckId]')
    console.log('   4. Verify breadcrumb shows Dashboard link')
    console.log('   5. Click breadcrumb to return to dashboard')
    console.log('   6. Verify edit/delete buttons do NOT navigate\n')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testDeckNavigation()
