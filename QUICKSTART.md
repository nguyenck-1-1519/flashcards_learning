# 🚀 Quick Start Guide

## Prerequisites Installation

### 1. Install Node.js (Required)

You need Node.js 18 or higher to run this project.

**On macOS:**
```bash
# Using Homebrew (recommended)
brew install node@20

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show v10.x.x
```

**On Windows:**
- Download from [nodejs.org](https://nodejs.org/)
- Run the installer
- Restart your terminal

**On Linux:**
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

---

## Project Setup

### 2. Install Dependencies

```bash
cd /Users/nguyenck/Coding/SDD/flashcards_learning
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- bcryptjs (password hashing)
- jose (JWT tokens)
- zod (validation)
- @vercel/postgres (database)

---

## Database Setup

### 3. Setup PostgreSQL Database

**Option A: Vercel Postgres (Recommended for Beginners)**

1. Go to [vercel.com/postgres](https://vercel.com/postgres)
2. Create a new database
3. Copy the connection string

**Option B: Local PostgreSQL**

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb flashcards_learning

# Your connection string will be:
# postgres://localhost/flashcards_learning
```

### 4. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Generate JWT secret
openssl rand -base64 32
```

Edit `.env` file:
```env
# Your PostgreSQL connection string
DATABASE_URL="postgres://user:password@host:port/database?sslmode=require"

# The JWT secret you generated above
JWT_SECRET="paste_your_generated_secret_here"

NODE_ENV="development"
```

### 5. Run Database Migration

```bash
# If using local PostgreSQL
psql flashcards_learning -f lib/db/schema.sql

# If using Vercel Postgres
psql "your_connection_string_here" -f lib/db/schema.sql
```

This creates the `users` table with proper schema.

---

## Run the Application

### 6. Start Development Server

```bash
npm run dev
```

Open your browser to [http://localhost:3000](http://localhost:3000)

You should see the home page with "Get Started" and "Log In" buttons.

---

## Test the Authentication

### 7. Try Registration

1. Click "Get Started" or go to [http://localhost:3000/register](http://localhost:3000/register)
2. Enter an email (e.g., `test@example.com`)
3. Enter a password (must be 8+ chars with uppercase, lowercase, and number)
4. Click "Create Account"
5. You should be redirected to the login page with a success message

### 8. Try Login

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter the email and password you just registered
3. Click "Log In"
4. You should be redirected to the dashboard

### 9. Test Protected Routes

- Try accessing [http://localhost:3000/dashboard](http://localhost:3000/dashboard) without logging in → redirects to login
- Log in and access dashboard → you can see your user info
- Try accessing [http://localhost:3000/register](http://localhost:3000/register) while logged in → redirects to dashboard

### 10. Test Logout

1. On the dashboard, click "Logout" button
2. You should be redirected to the login page
3. Try accessing the dashboard again → redirected to login

---

## Troubleshooting

### "command not found: npm"
- Node.js is not installed. Go back to Step 1.

### "Cannot connect to database"
- Check your DATABASE_URL in `.env` file
- Make sure PostgreSQL is running
- Test connection: `psql "your_connection_string"`

### "JWT_SECRET is not defined"
- Check your `.env` file has JWT_SECRET
- Make sure `.env` is in the project root (same folder as package.json)

### "relation 'users' does not exist"
- You haven't run the database migration
- Run: `psql $DATABASE_URL -f lib/db/schema.sql`

### Port 3000 already in use
- Stop other processes using port 3000
- Or run with different port: `PORT=3001 npm run dev`

---

## Mobile Testing

Test on different screen sizes:

```bash
# Open these URLs on your phone (same WiFi network)
# Find your local IP: ifconfig | grep "inet "

# Example: http://192.168.1.100:3000
```

Or use browser DevTools:
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Test at: 320px (mobile), 768px (tablet), 1024px (desktop)

---

## Next Steps

Once the authentication is working:

1. **Write Tests** - Follow TDD approach in `specs/001-authentication/tasks.md`
2. **Complete Authentication** - Finish remaining tasks (rate limiting, security)
3. **Build Deck Management** - Next module in `specs/002-dashboard-deck-management/`
4. **Implement Study Mode** - Core feature in `specs/003-study-mode/`
5. **Add UI Theme** - Design system in `specs/004-ui-theme/`

See `IMPLEMENTATION_PROGRESS.md` for detailed status and roadmap.

---

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Run ESLint

# Database
psql $DATABASE_URL                    # Connect to database
psql $DATABASE_URL -c "SELECT * FROM users;"  # View users

# Generate secrets
openssl rand -base64 32               # Generate JWT secret
openssl rand -hex 32                  # Alternative format
```

---

## Support

If you encounter issues:

1. Check `IMPLEMENTATION_PROGRESS.md` for known issues
2. Review `README.md` for detailed setup instructions
3. Check the task files in `specs/001-authentication/tasks.md`
4. Review the plan in `specs/001-authentication/plan.md`

---

**Happy Coding!** 🎉
