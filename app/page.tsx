export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#fafafa',
      }}
    >
      <div style={{ maxWidth: '600px' }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 700,
            color: '#212121',
            marginBottom: '1rem',
          }}
        >
          📚 Flashcards Learning
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: '#666',
            marginBottom: '3rem',
            lineHeight: 1.6,
          }}
        >
          Master any subject with spaced repetition. Create decks, study smart,
          and retain knowledge effectively.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <a
            href="/register"
            style={{
              minHeight: '48px',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#fff',
              backgroundColor: '#1976d2',
              border: 'none',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Get Started
          </a>
          <a
            href="/login"
            style={{
              minHeight: '48px',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1976d2',
              backgroundColor: 'transparent',
              border: '2px solid #1976d2',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Log In
          </a>
        </div>

        <div
          style={{
            marginTop: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left',
          }}
        >
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧠</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Spaced Repetition
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              SM-2 algorithm optimizes your study sessions
            </p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Markdown Support
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Rich formatting with code syntax highlighting
            </p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Mobile First
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Study anywhere on any device
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
