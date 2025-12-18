# Tasks: Dashboard & Deck Management

**Input**: Design documents from `/specs/002-dashboard-deck-management/`
**Prerequisites**: plan.md, spec.md, 001-authentication (users must be logged in)

**Tests**: TDD approach - all tests written and verified to FAIL before implementation

**Organization**: Tasks grouped by user story for independent implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1, US2, US3, US4, US5)
- All paths are absolute from project root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Deck management infrastructure setup

- [X] T001 Install dependencies (framer-motion for animations, react-swipeable for gestures)
- [X] T002 [P] Create TypeScript types for Deck in types/deck.ts
- [X] T003 [P] Create Zod validation schema for deck names in lib/validations/deck.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database and core deck utilities - MUST complete before deck features

**⚠️ CRITICAL**: No deck management features can work until this phase is complete

- [X] T004 Create database schema for decks table in lib/db/schema.sql
- [ ] T005 Run database migration to create decks table
- [ ] T006 [P] Write unit tests for deck validation in tests/unit/validations/deck.test.ts
- [ ] T007 [P] Write unit tests for deck queries in tests/unit/db/decks.test.ts
- [X] T008 Create deck CRUD query functions in lib/db/queries/decks.ts (getAllDecks with card count, createDeck, updateDeck, deleteDeck)
- [ ] T009 [P] Test getAllDecks query returns correct card count per deck
- [ ] T010 [P] Test createDeck query with user_id foreign key

**Checkpoint**: Foundation ready - deck database and queries working

---

## Phase 3: User Story 1 - View All Decks (Priority: P1) 🎯 MVP

**Goal**: Users see all their decks in responsive grid with card counts

**Independent Test**: Log in → see decks in grid → verify card counts accurate → test on mobile/tablet/desktop

### Tests for User Story 1 - Write FIRST, verify they FAIL

- [ ] T011 [P] [US1] Write component test for DeckGrid rendering with multiple decks in tests/unit/components/DeckGrid.test.tsx
- [ ] T012 [P] [US1] Write component test for DeckCard showing name and card count in tests/unit/components/DeckCard.test.tsx
- [ ] T013 [P] [US1] Write component test for EmptyState when no decks in tests/unit/components/EmptyState.test.tsx
- [ ] T014 [P] [US1] Write responsive test for grid: 1 column (mobile), 2 (tablet), 3 (desktop) in tests/unit/components/DeckGrid.test.tsx
- [ ] T015 [P] [US1] Write integration test for dashboard loading decks in tests/integration/decks/view-decks.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 1

- [X] T016 [US1] Create DeckStats component (card count badge) in components/dashboard/DeckStats.tsx
- [X] T017 [US1] Create DeckCard component with name, stats, and action placeholders in components/dashboard/DeckCard.tsx
- [X] T018 [US1] Create responsive DeckGrid with CSS Grid in components/dashboard/DeckGrid.tsx
- [X] T019 [US1] Add responsive CSS: 1 col (mobile), 2 col (tablet), 3 col (desktop)
- [X] T020 [US1] Create EmptyState component with "Create your first deck!" CTA in components/dashboard/EmptyState.tsx
- [X] T021 [US1] Create dashboard page at app/(dashboard)/dashboard/page.tsx
- [X] T022 [US1] Fetch decks with card counts in dashboard page (server component)
- [ ] T023 [US1] Add loading skeleton for deck grid
- [X] T024 [US1] Apply Material Design elevation and hover effects to DeckCard
- [ ] T025 [US1] Test responsive grid at 320px, 768px, 1024px widths

**Verify**: Run tests from T011-T015, all should PASS (green state)

**Checkpoint**: Users can view all their decks in responsive grid

---

## Phase 4: User Story 2 - Create New Deck (Priority: P1) 🎯 MVP

**Goal**: Users can create new decks with validated names

**Independent Test**: Click "Create Deck" → enter name → submit → new deck appears in grid with 0 cards

### Tests for User Story 2 - Write FIRST, verify they FAIL

- [ ] T026 [P] [US2] Write component test for DeckForm validation in tests/unit/components/DeckForm.test.tsx
- [ ] T027 [P] [US2] Write component test for CreateDeckModal open/close in tests/unit/components/CreateDeckModal.test.tsx
- [ ] T028 [P] [US2] Write integration test for successful deck creation in tests/integration/decks/create-deck.test.ts
- [ ] T029 [P] [US2] Write integration test for validation errors (empty name, too long) in tests/integration/decks/create-deck.test.ts
- [ ] T030 [P] [US2] Write integration test for optimistic update in tests/integration/decks/create-deck.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 2

- [X] T031 [US2] Create reusable Card component (Material Design) in components/ui/Card.tsx
- [X] T032 [US2] Create reusable Modal component with backdrop in components/ui/Modal.tsx
- [X] T033 [US2] Create DeckForm component with name input and validation in components/decks/DeckForm.tsx
- [X] T034 [US2] Create CreateDeckModal using Modal and DeckForm in components/decks/CreateDeckModal.tsx
- [X] T035 [US2] Implement createDeck server action in app/actions/decks.ts
- [X] T036 [US2] Add deck name validation in server action (1-100 chars, not empty/whitespace)
- [ ] T037 [US2] Create FAB component (mobile only) in components/ui/FAB.tsx
- [X] T038 [US2] Add "Create Deck" button to dashboard (FAB on mobile <768px, regular button on desktop)
- [X] T039 [US2] Implement optimistic UI update (add deck to grid immediately)
- [X] T040 [US2] Handle validation errors from server
- [X] T041 [US2] Auto-focus deck name input when modal opens
- [X] T042 [US2] Close modal on successful creation
- [ ] T043 [US2] Test FAB displays only on mobile viewport
- [ ] T044 [US2] Test form submission on mobile with keyboard "Go" button

**Verify**: Run tests from T026-T030, all should PASS (green state)

**Checkpoint**: Users can create new decks with validation

---

## Phase 5: User Story 3 - Edit Deck Name (Priority: P2)

**Goal**: Users can rename existing decks

**Independent Test**: Click edit on deck → change name → save → deck updates in grid

### Tests for User Story 3 - Write FIRST, verify they FAIL

- [ ] T045 [P] [US3] Write component test for EditDeckModal pre-filling current name in tests/unit/components/EditDeckModal.test.tsx
- [ ] T046 [P] [US3] Write integration test for successful deck update in tests/integration/decks/update-deck.test.ts
- [ ] T047 [P] [US3] Write integration test for validation during edit in tests/integration/decks/update-deck.test.ts
- [ ] T048 [P] [US3] Write integration test for optimistic update on edit in tests/integration/decks/update-deck.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 3

- [X] T049 [US3] Create EditDeckModal reusing DeckForm in components/decks/EditDeckModal.tsx
- [X] T050 [US3] Add edit button/icon to DeckCard (stop event propagation)
- [X] T051 [US3] Implement updateDeck server action in app/actions/decks.ts
- [X] T052 [US3] Add authorization check (user owns deck) in update action
- [X] T053 [US3] Pre-fill form with current deck name
- [X] T054 [US3] Implement optimistic UI update for edit
- [ ] T055 [US3] Handle update errors (show error, revert optimistic update)
- [ ] T056 [US3] Test edit button doesn't trigger deck navigation
- [ ] T057 [US3] Test cancel closes modal without changes

**Verify**: Run tests from T045-T048, all should PASS (green state)

**Checkpoint**: Users can edit deck names successfully

---

## Phase 6: User Story 4 - Delete Deck (Priority: P2)

**Goal**: Users can delete decks with confirmation

**Independent Test**: Click delete → see confirmation with card count → confirm → deck removed from grid

### Tests for User Story 4 - Write FIRST, verify they FAIL

- [ ] T058 [P] [US4] Write component test for DeleteDeckDialog showing card count in tests/unit/components/DeleteDeckDialog.test.tsx
- [ ] T059 [P] [US4] Write integration test for successful deck deletion in tests/integration/decks/delete-deck.test.ts
- [ ] T060 [P] [US4] Write integration test for cascade delete of cards in tests/integration/decks/delete-deck.test.ts
- [ ] T061 [P] [US4] Write integration test for optimistic update on delete in tests/integration/decks/delete-deck.test.ts
- [ ] T062 [P] [US4] Write integration test for delete error handling in tests/integration/decks/delete-deck.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 4

- [X] T063 [US4] Create DeleteDeckDialog component with warning message in components/decks/DeleteDeckDialog.tsx
- [X] T064 [US4] Add delete button/icon to DeckCard (red color, stop propagation)
- [X] T065 [US4] Show confirmation dialog with deck name and card count
- [X] T066 [US4] Implement deleteDeck server action in app/actions/decks.ts
- [X] T067 [US4] Add authorization check (user owns deck) in delete action
- [ ] T068 [US4] Ensure cascade delete removes all cards in deck (test in database)
- [X] T069 [US4] Implement optimistic UI update (remove from grid immediately)
- [X] T070 [US4] Handle delete errors (show error, restore deck in grid)
- [X] T071 [US4] Test cancel closes dialog without deleting
- [ ] T072 [US4] Test empty state shows after deleting last deck

**Verify**: Run tests from T058-T062, all should PASS (green state)

**Checkpoint**: Users can delete decks with proper confirmation

---

## Phase 7: User Story 5 - Open Deck to View Cards (Priority: P1) 🎯 MVP

**Goal**: Users can navigate to deck detail page to see cards

**Independent Test**: Click deck → navigate to deck detail → see deck name and cards (or empty state)

### Tests for User Story 5 - Write FIRST, verify they FAIL

- [ ] T073 [P] [US5] Write E2E test for deck navigation in tests/e2e/deck-navigation.spec.ts
- [ ] T074 [P] [US5] Write integration test for deck detail page loading in tests/integration/decks/deck-detail.test.ts
- [ ] T075 [P] [US5] Write integration test for breadcrumb navigation back to dashboard in tests/integration/decks/deck-detail.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 5

- [X] T076 [US5] Create deck detail page at app/decks/[deckId]/page.tsx
- [X] T077 [US5] Add click handler to DeckCard for navigation (exclude edit/delete buttons)
- [X] T078 [US5] Use event.stopPropagation on edit/delete buttons
- [X] T079 [US5] Add breadcrumb navigation component for back to dashboard
- [X] T080 [US5] Display deck name in header on deck detail page
- [X] T081 [US5] Show "No cards in this deck. Add your first card!" empty state
- [X] T082 [US5] Test clicking deck navigates correctly
- [X] T083 [US5] Test clicking edit/delete does NOT navigate
- [X] T084 [US5] Test back button returns to dashboard

**Verify**: Run tests from T073-T075, all should PASS (green state)

**Checkpoint**: Users can navigate between dashboard and deck detail pages

---

## Phase 8: Mobile Optimizations

**Purpose**: Enhance mobile UX with gestures and touch interactions

### Tests - Write FIRST, verify they FAIL

- [ ] T085 [P] Write E2E test for swipe gestures on mobile in tests/e2e/deck-gestures.spec.ts
- [ ] T086 [P] Write test for ripple effect on card press in tests/e2e/deck-interactions.spec.ts
- [ ] T087 [P] Write test for touch target sizes (44px minimum) in tests/e2e/deck-mobile.spec.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T088 Add swipe gesture handlers to DeckCard (swipe left = delete, swipe right = edit)
- [ ] T089 Implement ripple/press effect on DeckCard using CSS or framer-motion
- [ ] T090 [P] Verify all buttons and cards are minimum 44x44px on mobile
- [ ] T091 [P] Add pull-to-refresh on dashboard
- [ ] T092 Test swipe gestures on iOS Safari
- [ ] T093 Test swipe gestures on Android Chrome
- [ ] T094 Test touch response time (<100ms feedback)
- [ ] T095 Test FAB positioning in thumb-reachable zone

**Verify**: Run tests from T085-T087, all should PASS (green state)

**Checkpoint**: Mobile interactions are smooth and intuitive

---

## Phase 9: Accessibility & Performance

**Purpose**: Ensure accessibility and optimize performance

### Tests - Write FIRST, verify they FAIL

- [ ] T096 [P] Write test for keyboard navigation (Tab, Enter, ESC) in tests/e2e/deck-accessibility.spec.ts
- [ ] T097 [P] Write test for screen reader announcements in tests/e2e/deck-accessibility.spec.ts
- [ ] T098 [P] Write performance test for dashboard with 100 decks in tests/performance/deck-load.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [X] T099 [P] Add ARIA labels to all deck cards and buttons
- [X] T100 [P] Implement keyboard navigation for all modals (Tab, Enter, ESC)
- [X] T101 [P] Add focus management (focus first input in modals)
- [ ] T102 Test with screen reader (VoiceOver or NVDA)
- [ ] T103 Test keyboard-only navigation through entire CRUD flow
- [ ] T104 Verify focus order is logical
- [ ] T105 Implement pagination or infinite scroll for 100+ decks
- [X] T106 Add React.memo to DeckCard to prevent unnecessary re-renders
- [ ] T107 Optimize card count query (ensure it uses index)
- [ ] T108 Run Lighthouse accessibility audit (target: 90+ score)
- [ ] T109 Run Lighthouse performance audit (target: 90+ score)

**Verify**: Run tests from T096-T098, all should PASS (green state)

**Checkpoint**: Deck management is fully accessible and performant

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and edge cases

- [ ] T110 [P] Add loading states for all async operations (create, update, delete)
- [X] T111 [P] Add success notifications (toast/snackbar) for CRUD operations
- [ ] T112 [P] Add error recovery for network failures
- [ ] T113 Add deck sorting options (by name, by date created, by card count)
- [ ] T114 Add search/filter functionality for decks
- [ ] T115 Add deck statistics (total cards, cards due for review)
- [ ] T116 Test concurrent deck creation/updates
- [ ] T117 Test offline behavior with service worker
- [ ] T118 Add analytics events for deck CRUD operations
- [ ] T119 Create deck management documentation
- [ ] T120 Final E2E test for complete deck management flow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup + Authentication module - BLOCKS all deck features
- **User Stories (Phase 3-7)**: All depend on Foundational completion
  - US1 (View Decks) and US2 (Create) can start in parallel after Foundational
  - US3 (Edit) and US4 (Delete) depend on US1 (need deck cards to test)
  - US5 (Navigate) depends on US1 (need deck grid)
- **Mobile (Phase 8)**: Can start after US1 completes
- **Accessibility (Phase 9)**: Can start after any user story completes
- **Polish (Phase 10)**: Depends on all user stories

### Within Each User Story - TDD Flow

1. **RED**: Write tests first (verify they FAIL)
2. **GREEN**: Implement code to make tests PASS
3. **REFACTOR**: Clean up code while tests still PASS
4. Move to next story

### Parallel Opportunities

**Within Foundational Phase (Phase 2)**:
```bash
# Can run in parallel:
T006 (validation tests) + T007 (query tests)
```

**Within User Story 1 (View Decks)**:
```bash
# Tests can be written in parallel:
T011 + T012 + T013 + T014 + T015

# Components can be built in parallel:
T016 (DeckStats) + T017 (DeckCard) + T020 (EmptyState)
```

**Within User Story 2 (Create Deck)**:
```bash
# Tests in parallel:
T026 + T027 + T028 + T029 + T030

# UI components in parallel:
T031 (Card) + T032 (Modal) + T037 (FAB)
```

**Across User Stories** (with multiple developers):
- Developer A: US1 (View) → US5 (Navigate)
- Developer B: US2 (Create) → US3 (Edit) → US4 (Delete)

---

## Implementation Strategy

### MVP First (View + Create Decks Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational ✅ Foundation ready
3. Complete Phase 3: US1 (View Decks) ✅ Can see decks
4. Complete Phase 4: US2 (Create Deck) ✅ Can create decks
5. Complete Phase 7: US5 (Navigate) ✅ Can open decks
6. **STOP and VALIDATE**: Basic deck management works
7. Deploy MVP

### Incremental Delivery

1. Foundation → Test independently
2. Add View (US1) → Test independently → Deploy
3. Add Create (US2) → Test independently → Deploy (MVP!)
4. Add Edit (US3) → Test independently → Deploy
5. Add Delete (US4) → Test independently → Deploy
6. Add Navigation (US5) → Test independently → Deploy
7. Add Mobile optimizations → Deploy
8. Add Accessibility → Deploy
9. Each addition adds value without breaking previous work

---

## Notes

- **TDD is mandatory**: All tests written BEFORE implementation
- **Red-Green-Refactor**: Verify tests fail → make them pass → clean up
- **[P] tasks**: Different files, can run in parallel
- **[Story] labels**: Track which user story each task belongs to
- Each user story is independently testable
- Optimistic updates provide instant feedback
- Material Design components ensure consistency
- Commit after each task or logical group
- Run tests frequently during implementation
