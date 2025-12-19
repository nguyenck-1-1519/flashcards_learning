// Test if cards are being loaded for a deck
const { Pool } = require('pg')

async function testDeckCards() {
  require('dotenv').config()
  
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    // Get all decks
    const decks = await pool.query(`
      SELECT id, name FROM decks ORDER BY created_at DESC LIMIT 1
    `)
    
    if (decks.rows.length === 0) {
      console.log('❌ No decks found')
      return
    }
    
    const deck = decks.rows[0]
    console.log(`\n📦 Testing deck: ${deck.name} (${deck.id})`)
    
    // Test getAllDecks with card count
    console.log('\n1️⃣ Testing getAllDecks with card count:')
    const decksWithCount = await pool.query(`
      SELECT 
        d.id,
        d.name,
        COALESCE(COUNT(c.id), 0)::int as card_count
      FROM decks d
      LEFT JOIN cards c ON c.deck_id = d.id
      WHERE d.id = $1
      GROUP BY d.id, d.name
    `, [deck.id])
    
    console.log('   Result:', decksWithCount.rows[0])
    
    // Test getAllCards
    console.log('\n2️⃣ Testing getAllCards:')
    const cards = await pool.query(`
      SELECT 
        id, deck_id, front, back,
        created_at
      FROM cards
      WHERE deck_id = $1
      ORDER BY created_at DESC
    `, [deck.id])
    
    console.log(`   Found ${cards.rows.length} cards`)
    if (cards.rows.length > 0) {
      console.log('   First card:')
      const card = cards.rows[0]
      console.log(`     - Front: ${card.front.substring(0, 50)}...`)
      console.log(`     - Back: ${card.back.substring(0, 50)}...`)
    }
    
    // Summary
    console.log('\n✅ Summary:')
    console.log(`   - Deck has ${decksWithCount.rows[0].card_count} cards`)
    console.log(`   - Query returned ${cards.rows.length} cards`)
    console.log(`   - ${decksWithCount.rows[0].card_count === cards.rows.length ? '✓' : '✗'} Counts match!`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

testDeckCards()
