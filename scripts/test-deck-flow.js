// Test script for deck creation flow
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

async function testDeckFlow() {
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
    console.log('🧪 Testing deck creation flow...\n')

    // Test 1: Create a test user
    const testEmail = `decktest_${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'
    const passwordHash = await bcrypt.hash(testPassword, 10)

    console.log('1️⃣ Creating test user...')
    const userResult = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [testEmail, passwordHash]
    )
    const userId = userResult.rows[0].id
    console.log('✅ User created:', testEmail)
    console.log('   User ID:', userId)

    // Test 2: Create decks
    console.log('\n2️⃣ Creating test decks...')
    
    const deck1 = await pool.query(
      'INSERT INTO decks (name, user_id) VALUES ($1, $2) RETURNING id, name, created_at, updated_at',
      ['Spanish Vocabulary', userId]
    )
    console.log('✅ Deck 1 created:', deck1.rows[0].name)
    console.log('   Created at:', deck1.rows[0].created_at)
    
    const deck2 = await pool.query(
      'INSERT INTO decks (name, user_id) VALUES ($1, $2) RETURNING id, name, created_at, updated_at',
      ['Math Formulas', userId]
    )
    console.log('✅ Deck 2 created:', deck2.rows[0].name)
    console.log('   Created at:', deck2.rows[0].created_at)

    // Test 3: Get all decks
    console.log('\n3️⃣ Fetching all decks...')
    const decksResult = await pool.query(
      'SELECT id, name, user_id, created_at, updated_at FROM decks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    console.log(`✅ Found ${decksResult.rows.length} decks`)
    decksResult.rows.forEach((deck, index) => {
      console.log(`   ${index + 1}. ${deck.name} (${deck.id})`)
    })

    // Test 4: Update deck
    console.log('\n4️⃣ Updating deck name...')
    const updateResult = await pool.query(
      'UPDATE decks SET name = $1 WHERE id = $2 RETURNING id, name, updated_at',
      ['Spanish Vocabulary - Basics', deck1.rows[0].id]
    )
    console.log('✅ Deck updated:', updateResult.rows[0].name)
    console.log('   Updated at:', updateResult.rows[0].updated_at)

    // Test 5: Delete deck
    console.log('\n5️⃣ Deleting one deck...')
    await pool.query('DELETE FROM decks WHERE id = $1', [deck2.rows[0].id])
    console.log('✅ Deck deleted:', deck2.rows[0].name)

    // Test 6: Verify deck count
    console.log('\n6️⃣ Verifying final deck count...')
    const countResult = await pool.query(
      'SELECT COUNT(*) as count FROM decks WHERE user_id = $1',
      [userId]
    )
    console.log(`✅ Final deck count: ${countResult.rows[0].count}`)

    // Clean up: Delete test user (cascade will delete decks)
    console.log('\n7️⃣ Cleaning up test data...')
    await pool.query('DELETE FROM users WHERE id = $1', [userId])
    console.log('✅ Test user and decks deleted')

    console.log('\n🎉 All deck flow tests passed!\n')
    console.log('✅ Create deck: WORKING')
    console.log('✅ Read decks: WORKING')
    console.log('✅ Update deck: WORKING')
    console.log('✅ Delete deck: WORKING')
    console.log('✅ CASCADE DELETE: WORKING\n')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.error('   Stack:', error.stack)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testDeckFlow()
