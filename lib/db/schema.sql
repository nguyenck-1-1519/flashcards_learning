-- Users table for authentication
-- PostgreSQL schema for flashcards learning application

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Indexes for performance
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts for authentication';
COMMENT ON COLUMN users.id IS 'Unique user identifier (UUID v4)';
COMMENT ON COLUMN users.email IS 'User email (unique, RFC 5322 compliant)';
COMMENT ON COLUMN users.password_hash IS 'bcrypt hashed password (10 rounds)';
COMMENT ON COLUMN users.created_at IS 'Account creation timestamp';
COMMENT ON COLUMN users.last_login IS 'Last successful login timestamp';

-- Decks table for flashcard organization
CREATE TABLE IF NOT EXISTS decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for performance
  CONSTRAINT deck_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_decks_user_id ON decks(user_id);
CREATE INDEX IF NOT EXISTS idx_decks_created_at ON decks(created_at);
CREATE INDEX IF NOT EXISTS idx_decks_updated_at ON decks(updated_at);

-- Comments for documentation
COMMENT ON TABLE decks IS 'Flashcard decks owned by users';
COMMENT ON COLUMN decks.id IS 'Unique deck identifier (UUID v4)';
COMMENT ON COLUMN decks.name IS 'Deck name (1-100 characters)';
COMMENT ON COLUMN decks.user_id IS 'Owner user ID (foreign key)';
COMMENT ON COLUMN decks.created_at IS 'Deck creation timestamp';
COMMENT ON COLUMN decks.updated_at IS 'Last update timestamp';

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_decks_updated_at
  BEFORE UPDATE ON decks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
