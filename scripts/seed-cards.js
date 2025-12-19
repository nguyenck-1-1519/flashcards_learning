// Seed sample cards for testing study mode
const { Pool } = require('pg')
require('dotenv').config()

// Disable SSL verification for development
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

const sampleCards = [
  {
    front: '# What is JavaScript?\nDefine the programming language.',
    back: 'JavaScript is a **high-level**, **interpreted** programming language.\n\n- Dynamic typing\n- Prototype-based\n- First-class functions\n- Runs on browser and server (Node.js)'
  },
  {
    front: 'What is the difference between `let`, `const`, and `var`?',
    back: '```javascript\n// var: function-scoped\nvar x = 1\n\n// let: block-scoped, can reassign\nlet y = 2\ny = 3\n\n// const: block-scoped, cannot reassign\nconst z = 4\n```'
  },
  {
    front: 'What is a **Promise** in JavaScript?',
    back: 'A Promise is an object representing the eventual completion or failure of an asynchronous operation.\n\n**States:**\n1. Pending\n2. Fulfilled\n3. Rejected\n\n```javascript\nfetch("/api/data")\n  .then(response => response.json())\n  .catch(error => console.error(error))\n```'
  },
  {
    front: 'What is the **DOM**?',
    back: '**DOM** = Document Object Model\n\nA programming interface for HTML documents. It represents the page structure as a tree of objects that can be manipulated with JavaScript.\n\nExample:\n```javascript\ndocument.getElementById("myDiv").textContent = "Hello!"\n```'
  },
  {
    front: 'What is **hoisting**?',
    back: 'Hoisting is JavaScript\'s behavior of moving declarations to the top of the scope.\n\n```javascript\nconsole.log(x) // undefined (not ReferenceError)\nvar x = 5\n\n// Equivalent to:\nvar x\nconsole.log(x)\nx = 5\n```\n\n⚠️ `let` and `const` are hoisted but not initialized.'
  }
]

async function seedCards() {
  try {
    console.log('🔍 Connecting to database...')
    await pool.query('SELECT NOW()')
    console.log('✅ Connected!')

    // Get first deck
    const deckResult = await pool.query(
      'SELECT id FROM decks ORDER BY created_at DESC LIMIT 1'
    )

    if (deckResult.rows.length === 0) {
      console.log('❌ No decks found. Please create a deck first.')
      process.exit(1)
    }

    const deckId = deckResult.rows[0].id
    console.log(`📦 Using deck ID: ${deckId}`)

    // Check if cards already exist
    const existingCards = await pool.query(
      'SELECT COUNT(*) as count FROM cards WHERE deck_id = $1',
      [deckId]
    )

    if (parseInt(existingCards.rows[0].count) > 0) {
      console.log(`\n⚠️  This deck already has ${existingCards.rows[0].count} cards.`)
      console.log('Do you want to add more cards anyway? (Ctrl+C to cancel)\n')
      // Wait 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000))
    }

    // Insert sample cards
    console.log(`\n📝 Creating ${sampleCards.length} sample cards...`)
    
    for (let i = 0; i < sampleCards.length; i++) {
      const card = sampleCards[i]
      await pool.query(
        'INSERT INTO cards (deck_id, front, back) VALUES ($1, $2, $3)',
        [deckId, card.front, card.back]
      )
      console.log(`   ✓ Card ${i + 1}/${sampleCards.length}`)
    }

    console.log(`\n🎉 Successfully created ${sampleCards.length} cards!`)
    console.log('\nYou can now:')
    console.log('1. Go to /dashboard')
    console.log('2. Click on your deck')
    console.log('3. Click "🎯 Start Studying"')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

seedCards()
