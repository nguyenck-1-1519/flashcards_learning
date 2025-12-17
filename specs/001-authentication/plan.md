# Implementation Plan: User Authentication

**Branch**: `001-authentication` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)

## Summary

Implement JWT-based authentication system for flashcards learning application using Next.js App Router with server actions, PostgreSQL for user storage, and bcrypt for password hashing. Authentication flow includes registration, login, and session persistence with httpOnly cookies. All validation rules (email RFC 5322, password 8+ chars with complexity) enforced on both client and server.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+, Next.js 14 (App Router)  
**Primary Dependencies**: 
- `bcryptjs` (password hashing)
- `jsonwebtoken` (JWT token generation/verification)
- `zod` (validation schema)
- `@vercel/postgres` (database client)
- `jose` (JWT verification optimized for Edge Runtime)

**Storage**: PostgreSQL (Vercel Postgres) - `users` table with id, email, password_hash, created_at, last_login  
**Testing**: Jest + React Testing Library (unit), Playwright (E2E)  
**Target Platform**: Vercel Edge/Node.js runtime, responsive web (mobile-first)  
**Project Type**: Web application (Next.js full-stack)  
**Performance Goals**: 
- Registration/login API response < 500ms
- Client-side validation feedback < 100ms
- Page load (auth forms) < 2s on 3G

**Constraints**: 
- JWT token size < 1KB
- Password hash computation < 200ms (10 salt rounds)
- httpOnly cookies for security (no localStorage for tokens)
- Mobile-first forms with 44px minimum touch targets

**Scale/Scope**: 
- 1-10k users initially
- 5 failed login attempts per email per 15-min window (rate limiting)
- 24-hour session expiration

## Constitution Check

✅ **Mobile-First Responsive Design**: Auth forms designed for 320px+ width with touch-friendly inputs (48px height), appropriate mobile keyboard types  
✅ **Performance & User Experience**: JWT generation/verification optimized, password validation provides instant feedback  
✅ **Accessibility First**: Forms use semantic HTML, proper ARIA labels, keyboard navigable, WCAG AA contrast  
✅ **Progressive Enhancement**: Forms work without JS for basic submission, enhanced with client-side validation  
✅ **Simplicity**: Direct server actions, no unnecessary abstraction layers, standard JWT implementation

**Gates**: ✅ All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-authentication/
├── plan.md              # This file
├── spec.md              # Feature specification
└── tasks.md             # Implementation tasks (to be created)
```

### Source Code

```text
app/
├── (auth)/                          # Auth route group
│   ├── login/
│   │   └── page.tsx                 # Login page with form
│   ├── register/
│   │   └── page.tsx                 # Registration page with form
│   └── layout.tsx                   # Auth layout (redirect if logged in)
├── api/
│   └── auth/
│       └── logout/
│           └── route.ts             # Logout API endpoint (clear cookie)
└── actions/
    └── auth.ts                      # Server actions: login, register

lib/
├── auth/
│   ├── session.ts                   # JWT creation, verification, getSession
│   ├── password.ts                  # bcrypt hash, compare
│   └── validation.ts                # Zod schemas for email, password
├── db/
│   ├── schema.sql                   # User table schema
│   └── queries.ts                   # User CRUD operations
└── middleware/
    └── auth.ts                      # Auth middleware utilities

middleware.ts                         # Next.js middleware (protect routes)

components/
└── auth/
    ├── LoginForm.tsx                # Client component with validation
    ├── RegisterForm.tsx             # Client component with validation
    ├── PasswordInput.tsx            # Reusable password input with show/hide
    └── FormError.tsx                # Error message display

types/
└── auth.ts                          # TypeScript types for User, Session

tests/
├── unit/
│   ├── auth/
│   │   ├── password.test.ts        # Password hashing tests
│   │   ├── session.test.ts         # JWT creation/verification tests
│   │   └── validation.test.ts      # Validation schema tests
│   └── db/
│       └── queries.test.ts         # Database query tests
├── integration/
│   └── auth/
│       ├── login.test.ts           # Login flow integration test
│       └── register.test.ts        # Registration flow integration test
└── e2e/
    └── auth.spec.ts                # Full auth flow E2E test
```

**Structure Decision**: Using Next.js 14 App Router with server actions for authentication logic. Auth forms are in `(auth)` route group for shared layout. Server actions in `app/actions/auth.ts` handle business logic, while `lib/auth/` contains reusable utilities. Middleware protects authenticated routes. This structure follows Next.js best practices and keeps auth logic centralized.

## Implementation Phases

### Phase 0: Database & Core Setup

**Goal**: Set up database schema and core authentication utilities

**Tasks**:
1. Create PostgreSQL schema for users table
2. Implement password hashing utilities (bcrypt)
3. Implement JWT token creation/verification with jose
4. Create Zod validation schemas for email and password
5. Set up database connection and user queries (create, findByEmail)

**Deliverables**:
- `lib/db/schema.sql` with users table
- `lib/auth/password.ts` with hash/compare functions
- `lib/auth/session.ts` with createSession/verifySession
- `lib/auth/validation.ts` with email/password schemas
- `lib/db/queries.ts` with user CRUD operations
- Unit tests for all utilities

**Validation**: Run unit tests, verify JWT can be created and verified, passwords hash correctly

---

### Phase 1: Registration Flow

**Goal**: Implement user registration with validation

**Tasks**:
1. Create RegisterForm component with client-side validation
2. Implement register server action
3. Add duplicate email check
4. Create registration page
5. Add password strength indicator
6. Implement show/hide password toggle
7. Add rate limiting for registration

**Deliverables**:
- `app/(auth)/register/page.tsx`
- `components/auth/RegisterForm.tsx`
- `components/auth/PasswordInput.tsx`
- `app/actions/auth.ts` with register action
- Integration tests for registration flow

**Validation**: 
- User can register with valid email and password
- Duplicate email shows error
- Invalid email/password shows validation errors
- Password strength indicator updates in real-time

---

### Phase 2: Login Flow

**Goal**: Implement user login with session creation

**Tasks**:
1. Create LoginForm component
2. Implement login server action with credential verification
3. Set httpOnly cookie with JWT token
4. Create login page
5. Add rate limiting (5 attempts per 15 min)
6. Handle incorrect credentials with generic error message

**Deliverables**:
- `app/(auth)/login/page.tsx`
- `components/auth/LoginForm.tsx`
- Login logic in `app/actions/auth.ts`
- Cookie setting in `lib/auth/session.ts`
- Integration tests for login flow

**Validation**:
- User can log in with correct credentials
- JWT token set in httpOnly cookie
- Incorrect credentials show error
- Rate limiting blocks after 5 failed attempts

---

### Phase 3: Session Management & Protected Routes

**Goal**: Implement session persistence and route protection

**Tasks**:
1. Create middleware to verify JWT on protected routes
2. Implement getSession utility to retrieve current user
3. Add automatic redirection (logged-in users away from auth pages)
4. Create logout functionality
5. Handle expired tokens with redirect to login

**Deliverables**:
- `middleware.ts` with route protection
- `lib/auth/session.ts` with getSession function
- `app/api/auth/logout/route.ts`
- `app/(auth)/layout.tsx` with redirect logic

**Validation**:
- Logged-in users cannot access login/register pages
- Unauthenticated users redirected to login for protected routes
- Session persists across page refreshes
- Logout clears cookie and redirects to login

---

### Phase 4: Mobile Optimization & Accessibility

**Goal**: Ensure auth forms work perfectly on mobile and meet accessibility standards

**Tasks**:
1. Add appropriate input types (email keyboard for email field)
2. Ensure minimum 44px touch targets for all buttons
3. Add ARIA labels for form fields
4. Implement keyboard navigation (Tab, Enter)
5. Test on mobile devices (iOS Safari, Android Chrome)
6. Add loading states during form submission
7. Ensure form validation visible above mobile keyboard

**Deliverables**:
- Mobile-optimized form styles
- ARIA labels on all form elements
- Loading spinners during submission
- E2E tests on mobile viewport

**Validation**:
- Forms work on 320px width screens
- All touch targets meet 44px minimum
- Keyboard navigation works for all interactions
- Lighthouse accessibility score 90+

---

### Phase 5: Testing & Edge Cases

**Goal**: Comprehensive testing and edge case handling

**Tasks**:
1. Write E2E tests for complete auth flows
2. Test edge cases (SQL injection attempts, XSS, long inputs)
3. Test concurrent login attempts
4. Test session expiration scenarios
5. Test browser back button behavior after logout
6. Performance testing (registration/login speed)

**Deliverables**:
- Complete E2E test suite
- Edge case handling code
- Performance benchmarks

**Validation**:
- All tests pass
- No security vulnerabilities
- Performance meets goals (<500ms API response)

## Database Schema

```sql
-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);

-- Rate limiting table (optional, can use in-memory cache for MVP)
CREATE TABLE login_attempts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  successful BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_login_attempts_email_time ON login_attempts(email, attempted_at);
```

## API Contracts

### Register Action

```typescript
// app/actions/auth.ts
export async function register(formData: FormData): Promise<ActionResult> {
  // Input: email, password
  // Returns: { success: true, userId: number } | { success: false, error: string }
}
```

**Validation Rules**:
- Email: RFC 5322 format, max 255 chars
- Password: 8-128 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char

**Error Responses**:
- `"Email already registered"`
- `"Invalid email format"`
- `"Password does not meet requirements"`

---

### Login Action

```typescript
// app/actions/auth.ts
export async function login(formData: FormData): Promise<ActionResult> {
  // Input: email, password
  // Returns: { success: true } | { success: false, error: string }
  // Side effect: Sets httpOnly cookie with JWT
}
```

**Error Responses**:
- `"Invalid email or password"` (generic for security)
- `"Too many login attempts. Try again in 15 minutes"`

---

### Logout Route

```typescript
// app/api/auth/logout/route.ts
export async function POST(): Promise<Response> {
  // Clears JWT cookie
  // Returns: { success: true }
}
```

---

### Get Session Utility

```typescript
// lib/auth/session.ts
export async function getSession(): Promise<User | null> {
  // Reads JWT from cookie, verifies, returns user data
  // Returns: { id, email } | null
}
```

## Security Considerations

1. **Password Security**:
   - bcrypt with 10 salt rounds (balance security vs performance)
   - Never log or expose passwords
   - Password requirements enforced on both client and server

2. **JWT Security**:
   - httpOnly cookies (prevent XSS)
   - Secure flag in production (HTTPS only)
   - SameSite=Lax (CSRF protection)
   - 24-hour expiration (re-login required)
   - Signed with HS256 algorithm

3. **Input Validation**:
   - Zod schemas on server side (never trust client)
   - Sanitize inputs before database queries
   - Parameterized queries (prevent SQL injection)

4. **Rate Limiting**:
   - 5 login attempts per email per 15-minute window
   - Track attempts in database or Redis cache
   - Reset counter on successful login

5. **Error Messages**:
   - Generic messages for invalid credentials
   - Don't reveal if email exists or not
   - Log failed attempts for monitoring

## Environment Variables

```bash
# .env.local
DATABASE_URL="postgres://user:pass@host:5432/db"
JWT_SECRET="your-secret-key-min-32-chars"
NODE_ENV="development" # or "production"
```

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "bcryptjs": "^2.4.3",
    "jose": "^5.1.0",
    "zod": "^3.22.0",
    "@vercel/postgres": "^0.5.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "playwright": "^1.40.0"
  }
}
```

## Testing Strategy

1. **Unit Tests** (lib/auth/*, lib/db/queries.ts):
   - Password hashing and comparison
   - JWT creation and verification
   - Validation schemas (valid/invalid inputs)
   - Database queries with mocked DB

2. **Integration Tests** (server actions):
   - Registration flow (create user, handle duplicates)
   - Login flow (verify credentials, set cookie)
   - Session retrieval (valid/expired/missing token)

3. **E2E Tests** (Playwright):
   - Complete registration → login → dashboard flow
   - Login with invalid credentials
   - Session persistence across page refresh
   - Logout flow
   - Mobile viewport testing

## Performance Optimizations

1. **Password Hashing**: Use bcrypt with 10 rounds (200ms max)
2. **JWT Verification**: Use `jose` library optimized for Edge Runtime
3. **Database Queries**: Index on email for fast lookups
4. **Client Validation**: Instant feedback without server round-trip
5. **Rate Limiting**: Use in-memory cache (Vercel KV) for speed

## Deployment Checklist

- [ ] Set JWT_SECRET environment variable (strong random string)
- [ ] Set DATABASE_URL for Vercel Postgres
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set secure cookie flags in production
- [ ] Test registration and login on production
- [ ] Monitor failed login attempts for attacks
- [ ] Set up database backups
- [ ] Configure CORS if needed for API routes
