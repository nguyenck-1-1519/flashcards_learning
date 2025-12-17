# Flashcards Learning 📚

A modern flashcard learning application with spaced repetition, built with Next.js 14 and PostgreSQL.

## Features

- 🧠 **Spaced Repetition**: SM-2 algorithm for optimal learning
- 📝 **Markdown Support**: Rich formatting with code syntax highlighting
- 📱 **Mobile First**: Responsive design that works on all devices
- 🔐 **Secure Authentication**: JWT-based auth with bcrypt password hashing
- ⚡ **Fast & Modern**: Built with Next.js 14 App Router

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router, Server Actions)
- **Database**: PostgreSQL (via Vercel Postgres)
- **Authentication**: JWT (jose) + bcrypt
- **Validation**: Zod
- **Styling**: CSS-in-JS (inline styles)
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Vercel Postgres)
- npm, yarn, or pnpm

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then fill in your values:

```env
# Database Connection (Vercel Postgres)
DATABASE_URL="postgres://user:password@host:port/database?sslmode=require"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your_jwt_secret_key_here"

# Node Environment
NODE_ENV="development"
```

### 3. Setup Database

Run the SQL schema to create the users table:

```bash
psql $DATABASE_URL -f lib/db/schema.sql
```

Or manually run the SQL from `lib/db/schema.sql` in your database.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
flashcards_learning/
├── app/
│   ├── (auth)/              # Auth route group
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   └── layout.tsx       # Auth layout (redirects if logged in)
│   ├── dashboard/           # Protected dashboard
│   ├── actions/
│   │   └── auth.ts          # Server actions (register, login, logout)
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   └── auth/                # Authentication components
│       ├── LoginForm.tsx
│       ├── RegisterForm.tsx
│       ├── PasswordInput.tsx
│       ├── FormError.tsx
│       └── LogoutButton.tsx
├── lib/
│   ├── auth/
│   │   ├── session.ts       # JWT utilities
│   │   ├── password.ts      # Password hashing
│   │   └── validation.ts    # Zod schemas
│   └── db/
│       ├── schema.sql       # Database schema
│       └── queries.ts       # Database queries
├── types/
│   └── auth.ts              # TypeScript types
├── middleware.ts            # Route protection
├── specs/                   # Feature specifications
└── .specify/                # Project documentation
```

## Authentication Flow

### Registration
1. User submits email + password via `/register`
2. Client-side validation with Zod
3. Password hashed with bcrypt (10 rounds)
4. User created in PostgreSQL
5. Redirect to login page

### Login
1. User submits credentials via `/login`
2. Email lookup in database
3. Password verification with bcrypt
4. JWT token created (24h expiration)
5. httpOnly cookie set
6. Redirect to dashboard

### Protected Routes
- Middleware checks session cookie
- Invalid/missing session → redirect to login
- Valid session → access granted

## Database Schema

### Users Table
```sql
id            UUID PRIMARY KEY
email         VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
created_at    TIMESTAMP WITH TIME ZONE
last_login    TIMESTAMP WITH TIME ZONE
```

## Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT tokens with secure httpOnly cookies
- ✅ Email validation (RFC 5322 compliant)
- ✅ Password complexity requirements
- ✅ SQL injection prevention (parameterized queries)
- ✅ CSRF protection (SameSite cookies)

## Next Steps

The authentication module is complete. Next features to implement:

1. **Dashboard/Deck Management** (specs/002-dashboard-deck-management/)
   - CRUD operations for flashcard decks
   - Responsive grid layout
   - Material Design cards

2. **Study Mode** (specs/003-study-mode/)
   - SM-2 spaced repetition algorithm
   - Card flip animations
   - Progress tracking

3. **UI Theme** (specs/004-ui-theme/)
   - Material Design system
   - Dark mode support
   - Component library

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint

# Testing (when tests are added)
npm test
```

## Deployment

This project is designed for Vercel deployment:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables (DATABASE_URL, JWT_SECRET)
4. Deploy!

## Contributing

This is a personal learning project following the constitution in `.specify/memory/constitution.md`.

## License

MIT
