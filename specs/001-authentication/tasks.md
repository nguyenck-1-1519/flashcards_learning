# Tasks: User Authentication

**Input**: Design documents from `/specs/001-authentication/`
**Prerequisites**: plan.md, spec.md

**Tests**: TDD approach - all tests written and verified to FAIL before implementation

**Organization**: Tasks grouped by user story for independent implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1, US2, US3, US4)
- All paths are absolute from project root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and authentication infrastructure

- [ ] T001 Install authentication dependencies (bcryptjs, jose, zod, @vercel/postgres)
- [ ] T002 [P] Create environment variables template (.env.example) with DATABASE_URL and JWT_SECRET
- [ ] T003 [P] Setup TypeScript types for auth in types/auth.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database and core auth utilities - MUST complete before user story work

**⚠️ CRITICAL**: No authentication features can work until this phase is complete

- [ ] T004 Create database schema for users table in lib/db/schema.sql
- [ ] T005 Run database migration to create users table
- [ ] T006 [P] Create Zod validation schemas in lib/auth/validation.ts (email, password rules)
- [ ] T007 [P] Write unit tests for validation schemas in tests/unit/auth/validation.test.ts
- [ ] T008 [P] Write unit tests for password hashing in tests/unit/auth/password.test.ts
- [ ] T009 [P] Write unit tests for JWT creation/verification in tests/unit/auth/session.test.ts
- [ ] T010 Implement password hashing utilities in lib/auth/password.ts (hash, compare with bcrypt)
- [ ] T011 Implement JWT session utilities in lib/auth/session.ts (createSession, verifySession with jose)
- [ ] T012 [P] Create database query functions in lib/db/queries.ts (createUser, findUserByEmail)
- [ ] T013 [P] Write unit tests for database queries in tests/unit/db/queries.test.ts

**Checkpoint**: Foundation ready - all utilities tested and working

---

## Phase 3: User Story 1 - New User Registration (Priority: P1) 🎯 MVP

**Goal**: Users can create accounts with email and password validation

**Independent Test**: Submit registration form → verify account created → can immediately log in

### Tests for User Story 1 - Write FIRST, verify they FAIL

- [ ] T014 [P] [US1] Write integration test for successful registration in tests/integration/auth/register.test.ts
- [ ] T015 [P] [US1] Write integration test for duplicate email error in tests/integration/auth/register.test.ts
- [ ] T016 [P] [US1] Write integration test for invalid email validation in tests/integration/auth/register.test.ts
- [ ] T017 [P] [US1] Write integration test for password validation errors in tests/integration/auth/register.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 1

- [ ] T018 [US1] Create PasswordInput component with show/hide toggle in components/auth/PasswordInput.tsx
- [ ] T019 [US1] Create FormError component for error display in components/auth/FormError.tsx
- [ ] T020 [US1] Create RegisterForm component with client-side validation in components/auth/RegisterForm.tsx
- [ ] T021 [US1] Implement register server action in app/actions/auth.ts
- [ ] T022 [US1] Add duplicate email check in register action
- [ ] T023 [US1] Create registration page at app/(auth)/register/page.tsx
- [ ] T024 [US1] Add password strength indicator to RegisterForm
- [ ] T025 [US1] Ensure registration form uses email keyboard on mobile
- [ ] T026 [US1] Test registration on mobile viewport (320px, 768px)

**Verify**: Run tests from T014-T017, all should PASS (green state)

**Checkpoint**: Users can successfully register with validation

---

## Phase 4: User Story 2 - Existing User Login (Priority: P1) 🎯 MVP

**Goal**: Registered users can log in and receive JWT session

**Independent Test**: Log in with valid credentials → JWT cookie set → can access dashboard

### Tests for User Story 2 - Write FIRST, verify they FAIL

- [ ] T027 [P] [US2] Write integration test for successful login in tests/integration/auth/login.test.ts
- [ ] T028 [P] [US2] Write integration test for incorrect password in tests/integration/auth/login.test.ts
- [ ] T029 [P] [US2] Write integration test for non-existent email in tests/integration/auth/login.test.ts
- [ ] T030 [P] [US2] Write integration test for JWT cookie being set in tests/integration/auth/login.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 2

- [ ] T031 [US2] Create LoginForm component in components/auth/LoginForm.tsx
- [ ] T032 [US2] Implement login server action in app/actions/auth.ts
- [ ] T033 [US2] Add credential verification in login action (email + password)
- [ ] T034 [US2] Set httpOnly JWT cookie on successful login in lib/auth/session.ts
- [ ] T035 [US2] Create login page at app/(auth)/login/page.tsx
- [ ] T036 [US2] Add generic error message for failed login attempts
- [ ] T037 [US2] Update last_login timestamp in database on successful login
- [ ] T038 [US2] Test login form on mobile viewport

**Verify**: Run tests from T027-T030, all should PASS (green state)

**Checkpoint**: Users can log in and receive authenticated session

---

## Phase 5: User Story 3 - Session Persistence (Priority: P2)

**Goal**: Logged-in users stay authenticated across page refreshes and tabs

**Independent Test**: Log in → refresh page → still authenticated without re-login

### Tests for User Story 3 - Write FIRST, verify they FAIL

- [ ] T039 [P] [US3] Write integration test for session persisting on page refresh in tests/integration/auth/session.test.ts
- [ ] T040 [P] [US3] Write integration test for session working across browser tabs in tests/integration/auth/session.test.ts
- [ ] T041 [P] [US3] Write integration test for expired token redirect in tests/integration/auth/session.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 3

- [ ] T042 [US3] Create Next.js middleware in middleware.ts for route protection
- [ ] T043 [US3] Implement getSession utility to retrieve current user from JWT in lib/auth/session.ts
- [ ] T044 [US3] Add JWT verification middleware for protected routes
- [ ] T045 [US3] Create auth layout that redirects logged-in users away from auth pages in app/(auth)/layout.tsx
- [ ] T046 [US3] Handle expired token scenario (redirect to login with message)
- [ ] T047 [US3] Add session check on dashboard page load
- [ ] T048 [US3] Test session persistence across multiple tabs

**Verify**: Run tests from T039-T041, all should PASS (green state)

**Checkpoint**: Sessions persist correctly across page loads and tabs

---

## Phase 6: User Story 4 - Secure Logout (Priority: P2)

**Goal**: Users can securely log out, clearing their session

**Independent Test**: Log in → log out → verify JWT cleared → cannot access protected routes

### Tests for User Story 4 - Write FIRST, verify they FAIL

- [ ] T049 [P] [US4] Write integration test for logout clearing JWT cookie in tests/integration/auth/logout.test.ts
- [ ] T050 [P] [US4] Write integration test for post-logout redirect in tests/integration/auth/logout.test.ts
- [ ] T051 [P] [US4] Write integration test for protected route access after logout in tests/integration/auth/logout.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 4

- [ ] T052 [US4] Create logout API route at app/api/auth/logout/route.ts
- [ ] T053 [US4] Implement cookie clearing logic in logout route
- [ ] T054 [US4] Add logout button to dashboard/navigation
- [ ] T055 [US4] Redirect to login page after logout
- [ ] T056 [US4] Prevent back button access after logout
- [ ] T057 [US4] Test logout synchronization across tabs

**Verify**: Run tests from T049-T051, all should PASS (green state)

**Checkpoint**: Users can securely log out and session is properly cleared

---

## Phase 7: Rate Limiting & Security

**Purpose**: Add security measures and rate limiting

### Tests - Write FIRST, verify they FAIL

- [ ] T058 [P] Write test for rate limiting after 5 failed attempts in tests/integration/auth/rate-limit.test.ts
- [ ] T059 [P] Write test for SQL injection prevention in tests/integration/auth/security.test.ts
- [ ] T060 [P] Write test for XSS prevention in tests/integration/auth/security.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T061 Create rate limiting table/cache structure in lib/db/schema.sql
- [ ] T062 Implement rate limiting logic in login action (5 attempts per 15 min)
- [ ] T063 Add input sanitization to prevent SQL injection
- [ ] T064 Add XSS prevention in form inputs
- [ ] T065 Test rate limiting with multiple failed login attempts
- [ ] T066 Test security with injection attack attempts

**Verify**: Run tests from T058-T060, all should PASS (green state)

**Checkpoint**: Authentication system is secure and protected

---

## Phase 8: Mobile Optimization & Accessibility

**Purpose**: Ensure auth works perfectly on mobile and meets accessibility standards

### Tests - Write FIRST, verify they FAIL

- [ ] T067 [P] Write E2E test for mobile registration flow in tests/e2e/auth-mobile.spec.ts
- [ ] T068 [P] Write E2E test for keyboard navigation in tests/e2e/auth-accessibility.spec.ts
- [ ] T069 [P] Write test for screen reader compatibility in tests/e2e/auth-accessibility.spec.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T070 [P] Add ARIA labels to all auth form fields
- [ ] T071 [P] Ensure all buttons are minimum 44x44px on mobile
- [ ] T072 [P] Test forms on iOS Safari with email keyboard
- [ ] T073 [P] Test forms on Android Chrome
- [ ] T074 Implement keyboard navigation (Tab, Enter) for all forms
- [ ] T075 Add loading states during form submission
- [ ] T076 Ensure validation errors visible above mobile keyboard
- [ ] T077 Run Lighthouse accessibility audit (target: 90+ score)

**Verify**: Run tests from T067-T069, all should PASS (green state)

**Checkpoint**: Auth is fully accessible and mobile-optimized

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and edge case handling

- [ ] T078 [P] Add form auto-complete attributes (email, password)
- [ ] T079 [P] Implement session expiry warning (before 24h expires)
- [ ] T080 [P] Add "Remember me" functionality (extend session)
- [ ] T081 Add error logging for failed authentication attempts
- [ ] T082 Add analytics events for registration and login
- [ ] T083 Create auth documentation in docs/authentication.md
- [ ] T084 Performance test with 100 concurrent registrations
- [ ] T085 Performance test with 1000 concurrent logins
- [ ] T086 Security audit with OWASP Top 10 checklist
- [ ] T087 Final E2E test for complete auth flow (register → login → dashboard → logout)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational completion
  - US1 (Registration) and US2 (Login) can be done in parallel
  - US3 (Session) depends on US2 (need login to test persistence)
  - US4 (Logout) depends on US2 (need login to test logout)
- **Security (Phase 7)**: Depends on US1-US2 completion
- **Mobile/A11y (Phase 8)**: Can start after any user story completes
- **Polish (Phase 9)**: Depends on all previous phases

### Within Each User Story - TDD Flow

1. **RED**: Write tests first (verify they FAIL)
2. **GREEN**: Implement code to make tests PASS
3. **REFACTOR**: Clean up code while tests still PASS
4. Move to next story

### Parallel Opportunities

**Within Foundational Phase (Phase 2)**:
```bash
# Can run in parallel:
T007 (validation tests) + T008 (password tests) + T009 (session tests)
T010 (password impl) + T011 (session impl) + T012 (db queries)
```

**Within User Story 1 (Registration)**:
```bash
# Tests can be written in parallel:
T014 + T015 + T016 + T017

# Components can be built in parallel:
T018 (PasswordInput) + T019 (FormError)
```

**Across User Stories** (with multiple developers):
- Developer A: US1 (Registration)
- Developer B: US2 (Login)
- After US2 completes: Developer B can do US3 (Session)

---

## Implementation Strategy

### MVP First (Just Registration + Login)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational ✅ Foundation ready
3. Complete Phase 3: US1 (Registration) ✅ Users can register
4. Complete Phase 4: US2 (Login) ✅ Users can log in
5. **STOP and VALIDATE**: Full auth flow works
6. Deploy MVP with just registration and login

### Incremental Delivery

1. Foundation → Test independently
2. Add Registration (US1) → Test independently → Deploy
3. Add Login (US2) → Test independently → Deploy
4. Add Session Persistence (US3) → Test independently → Deploy
5. Add Logout (US4) → Test independently → Deploy
6. Add Security features → Test → Deploy
7. Each addition adds value without breaking previous work

---

## Notes

- **TDD is mandatory**: All tests written BEFORE implementation
- **Red-Green-Refactor**: Verify tests fail → make them pass → clean up
- **[P] tasks**: Different files, can run in parallel
- **[Story] labels**: Track which user story each task belongs to
- Each user story is independently testable
- Commit after each task or logical group
- Run tests frequently during implementation
- Target: 100% test coverage for auth module (critical security component)
