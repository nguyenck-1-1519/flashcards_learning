// Check if cards table exists
const { Pool } = require('pg')

async function checkTables() {
  require('dotenv').config()
  
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    // Check all tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    
    console.log('📋 Tables in database:')
    tables.rows.forEach(row => console.log('  ✓', row.table_name))
    
    // Try to check cards table specifically
    try {
      const cardCount = await pool.query('SELECT COUNT(*) as count FROM cards')
      console.log('\n✅ Cards table exists')
      console.log('   Card count:', cardCount.rows[0].count)
    } catch (error) {
      console.log('\n❌ Cards table does NOT exist')
      console.log('   Error:', error.message)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

checkTables()
