#!/bin/bash

# Database Migration Script for Flashcards Learning
# Simple bash script to run SQL migrations

set -e  # Exit on error

echo "🗄️  Flashcards Learning - Database Migration"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL environment variable is not set!"
  echo "💡 Add DATABASE_URL to your .env file"
  echo ""
  echo "Example:"
  echo "  DATABASE_URL='postgres://user:pass@host:5432/dbname?sslmode=require'"
  exit 1
fi

# Load .env file if it exists
if [ -f .env ]; then
  echo "📂 Loading environment variables from .env"
  export $(cat .env | grep -v '^#' | xargs)
fi

echo "🔍 Verifying database connection..."
psql "$DATABASE_URL" -c "SELECT NOW() as current_time;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Database connected successfully!"
else
  echo "❌ Database connection failed!"
  echo "💡 Check your DATABASE_URL in .env file"
  exit 1
fi

echo ""
echo "🚀 Running migrations..."
echo ""

# Run main schema migration
echo "📂 Migrating: lib/db/schema.sql"
psql "$DATABASE_URL" -f lib/db/schema.sql

if [ $? -eq 0 ]; then
  echo "✅ Migration completed successfully!"
else
  echo "❌ Migration failed!"
  exit 1
fi

echo ""
echo "🔍 Verifying tables..."
echo ""

# Check users table
echo "Checking users table..."
psql "$DATABASE_URL" -c "SELECT COUNT(*) as user_count FROM users;" 2>/dev/null

# Check decks table
echo "Checking decks table..."
psql "$DATABASE_URL" -c "SELECT COUNT(*) as deck_count FROM decks;" 2>/dev/null

echo ""
echo "🎉 Migration complete!"
echo ""
