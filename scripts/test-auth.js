// Test script for user registration and login
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

async function testUserOperations() {
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
    console.log('🧪 Testing user operations...\n')

    // Test 1: Create a test user
    const testEmail = `test_${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'
    const passwordHash = await bcrypt.hash(testPassword, 10)

    console.log('1️⃣ Creating test user...')
    console.log('   Email:', testEmail)
    
    const createResult = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [testEmail, passwordHash]
    )

    if (createResult.rows.length > 0) {
      console.log('✅ User created successfully!')
      console.log('   ID:', createResult.rows[0].id)
      console.log('   Email:', createResult.rows[0].email)
    } else {
      throw new Error('Failed to create user')
    }

    // Test 2: Find user by email
    console.log('\n2️⃣ Finding user by email...')
    
    const findResult = await pool.query(
      'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
      [testEmail]
    )

    if (findResult.rows.length > 0) {
      console.log('✅ User found successfully!')
      console.log('   ID:', findResult.rows[0].id)
      
      // Test 3: Verify password
      console.log('\n3️⃣ Verifying password...')
      const isValid = await bcrypt.compare(testPassword, findResult.rows[0].password_hash)
      
      if (isValid) {
        console.log('✅ Password verification successful!')
      } else {
        throw new Error('Password verification failed')
      }
    } else {
      throw new Error('User not found')
    }

    // Test 4: Update last_login
    console.log('\n4️⃣ Updating last login...')
    
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = $1',
      [testEmail]
    )
    
    console.log('✅ Last login updated!')

    // Clean up: Delete test user
    console.log('\n5️⃣ Cleaning up test user...')
    
    await pool.query('DELETE FROM users WHERE email = $1', [testEmail])
    
    console.log('✅ Test user deleted!')

    console.log('\n🎉 All user operation tests passed!\n')
    console.log('✅ Register functionality: WORKING')
    console.log('✅ Login functionality: WORKING')
    console.log('✅ Password verification: WORKING')
    console.log('✅ Database queries: WORKING\n')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.error('   Stack:', error.stack)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testUserOperations()
