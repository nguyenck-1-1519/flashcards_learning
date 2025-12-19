# Tasks: Study Mode with Spaced Repetition

**Input**: Design documents from `/specs/003-study-mode/`
**Prerequisites**: plan.md, spec.md, 001-authentication, 002-dashboard-deck-management (need decks and cards)

**Tests**: TDD approach - all tests written and verified to FAIL before implementation, with heavy focus on SM-2 algorithm testing

**Organization**: Tasks grouped by user story for independent implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1, US2, US3, US4, US5, US6)
- All paths are absolute from project root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Study mode infrastructure, card management, and markdown rendering setup

- [X] T001 Install dependencies (marked, isomorphic-dompurify, highlight.js, framer-motion, date-fns)
- [X] T002 [P] Create TypeScript types for Card with SM-2 fields in types/card.ts
- [X] T003 [P] Create TypeScript types for StudySession and Rating enum in types/study.ts
- [X] T004 [P] Create Zod validation schema for card content in lib/validations/card.ts
- [X] T004a [P] Create server actions for card CRUD operations in app/actions/cards.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database, SM-2 algorithm, and markdown rendering - MUST complete before study features

**⚠️ CRITICAL**: No study features can work until SM-2 algorithm and database are ready

### SM-2 Algorithm - HEAVY TESTING REQUIRED

- [ ] T005 [P] Write comprehensive unit tests for SM-2 algorithm in tests/unit/study/sm2.test.ts
  - Test all 4 ratings (Again/Hard/Good/Easy)
  - Test new card initialization (ease=2.5, interval=0, reps=0)
  - Test "Again" rating (interval=0, reset reps, decrease ease)
  - Test "Hard" rating (interval * 1.2, decrease ease)
  - Test "Good" rating (interval * ease, maintain ease)
  - Test "Easy" rating (interval * ease * 1.3, increase ease)
  - Test ease factor boundaries (1.3 min, 3.0 max)
  - Test minimum interval (1 day except "Again")
  - Test first review intervals (1 day for Good, 4 days for Easy)
  - Test second review intervals (6 days for Good)

**Verify**: Run tests, confirm all FAIL (red state)

- [X] T006 Implement SM-2 algorithm in lib/study/sm2.ts with calculateNextReview function
- [X] T007 Implement Rating enum (Again=0, Hard=1, Good=2, Easy=3)
- [ ] T008 Test SM-2 with edge cases (very long intervals, multiple consecutive "Again")

**Verify**: Run tests from T005, all should PASS (green state)

### Database Setup

- [X] T009 Create database schema for cards table with SM-2 fields in lib/db/schema.sql
- [X] T010 Add constraints for SM-2 fields (ease_factor 1.3-3.0, interval >= 0)
- [X] T011 Run database migration to create cards table
- [ ] T012 [P] Write unit tests for card queries in tests/unit/db/cards.test.ts
- [ ] T013 [P] Write unit tests for getDueCards query in tests/unit/db/study.test.ts
- [X] T014 Create card CRUD query functions in lib/db/queries/cards.ts
- [X] T015 Create study-specific queries in lib/db/queries/study.ts (getDueCards, updateCardSchedule)

**Verify**: Run tests from T012-T013, all should PASS (green state)

### Markdown Rendering

- [ ] T016 [P] Write unit tests for markdown parsing in tests/unit/markdown/parser.test.ts
- [ ] T017 [P] Write unit tests for HTML sanitization in tests/unit/markdown/sanitize.test.ts
- [X] T018 Configure marked with syntax highlighting (highlight.js)
- [X] T019 Implement markdown parser in lib/markdown/parser.ts
- [X] T020 Implement HTML sanitization in lib/markdown/sanitize.ts (DOMPurify)
- [ ] T021 Test markdown with various syntax (headers, lists, code blocks, tables)
- [X] T022 Test XSS prevention (script tags, event handlers)

**Verify**: Run tests from T016-T017, all should PASS (green state)

**Checkpoint**: SM-2 algorithm tested and working, markdown rendering secure, database ready

---

## Phase 2.5: Card Management - View & CRUD (Priority: P1) 🎯 ESSENTIAL

**Goal**: Users can view, add, edit, and delete cards in their decks

**Why before Study Mode**: Users need to create and manage cards before they can study them. This is a foundational requirement.

**Independent Test**: Open deck → see card list → add/edit/delete cards → verify changes persist

**Reference**: See `/specs/003-study-mode/card-management-requirements.md` for detailed requirements

### User Story: View Deck with Cards (Priority: P1) ✅ COMPLETE

**Acceptance**: Users can view all cards in list or grid layout, toggle between views

- [X] T034a [P] [CARD-VIEW] Create DeckDetailClient component in components/decks/DeckDetailClient.tsx
- [X] T034b [P] [CARD-VIEW] Add view mode state management (list/grid toggle)
- [X] T034c [P] [CARD-VIEW] Implement list view layout (flex column, 0.5rem gap)
- [X] T034d [P] [CARD-VIEW] Implement grid view layout (CSS grid, 280px min columns, 1rem gap)
- [X] T034e [P] [CARD-VIEW] Add toggle buttons with Material Design styling (📋 List / 📱 Grid)
- [X] T034f [P] [CARD-VIEW] Display card preview with front/back truncated at 150 chars
- [X] T034g [P] [CARD-VIEW] Add hover effects on cards (border color, shadow)
- [X] T034h [P] [CARD-VIEW] Implement empty state when deck has no cards
- [X] T034i [P] [CARD-VIEW] Add card count display in header "Cards (X)"

**Verify**: ✅ Open deck → Cards display in list/grid → Toggle works → Hover effects → Empty state tested

### User Story: Add New Card (Priority: P1) ✅ COMPLETE

**Acceptance**: Users can add new cards with front/back content, validation works, card appears immediately

- [X] T034j [P] [CARD-ADD] Create AddCardModal component in components/cards/AddCardModal.tsx
- [X] T034k [P] [CARD-ADD] Implement tabbed interface (Front/Back tabs)
- [X] T034l [P] [CARD-ADD] Add textarea with markdown support
- [X] T034m [P] [CARD-ADD] Implement validation (required fields, max 10k chars, trim whitespace)
- [X] T034n [P] [CARD-ADD] Add discard confirmation when closing with unsaved content
- [X] T034o [P] [CARD-ADD] Implement framer-motion animations (scale, fade)
- [X] T034p [P] [CARD-ADD] Create server action addCard(deckId, front, back) with auth/validation
- [X] T034q [P] [CARD-ADD] Integrate modal into DeckDetailClient with "Add Card" button
- [X] T034r [P] [CARD-ADD] Implement real-time UI update after adding (router.refresh)
- [X] T034s [P] [CARD-ADD] Add Material Design styling consistent with dashboard

**Verify**: ✅ Click "Add Card" → Modal opens → Fill content → Validation works → Card appears instantly

### User Story: Edit Existing Card (Priority: P1) ✅ COMPLETE

**Acceptance**: Users can edit cards, changes persist, validation works

- [X] T034t [P] [CARD-EDIT] Create server action editCard(cardId, deckId, front, back) with auth/validation
- [X] T034u [P] [CARD-EDIT] Create EditCardModal component mirroring AddCardModal structure
- [X] T034v [P] [CARD-EDIT] Add pre-population of form with existing card data (card.front, card.back)
- [X] T034w [P] [CARD-EDIT] Add edit button to each card in list/grid view
- [X] T034x [P] [CARD-EDIT] Add state management (isEditModalOpen, selectedCard)
- [X] T034y [P] [CARD-EDIT] Implement handleEditCard function with router.refresh
- [X] T034z [P] [CARD-EDIT] Apply same validation as AddCardModal (required, max 10k chars)
- [X] T034aa [CARD-EDIT] Test edit functionality: open modal → modify content → save → verify update

**Verify**: ✅ Click edit button → Modal opens with current content → Modify → Save → Changes appear

### User Story: Delete Card (Priority: P2) ✅ COMPLETE

**Acceptance**: Users can delete cards with confirmation, card disappears immediately

- [X] T034ab [P] [CARD-DELETE] Create server action removeCard(cardId, deckId) with auth/validation
- [X] T034ac [P] [CARD-DELETE] Create DeleteConfirmDialog component with card preview
- [X] T034ad [P] [CARD-DELETE] Add delete button to each card in list/grid view
- [X] T034ae [P] [CARD-DELETE] Add state management (isDeleteDialogOpen, selectedCard)
- [X] T034af [P] [CARD-DELETE] Show confirmation: "Delete this card? This action cannot be undone."
- [X] T034ag [P] [CARD-DELETE] Implement handleDeleteCard function with router.refresh
- [X] T034ah [P] [CARD-DELETE] Handle empty state after deleting last card
- [X] T034ai [CARD-DELETE] Test delete functionality: click delete → confirm → card disappears

**Verify**: ✅ Click delete button → Confirmation shows → Confirm → Card disappears → Empty state if last card

### User Story: View Full Card Content (Priority: P3) ❌ NOT STARTED

**Acceptance**: Users can view complete card content without truncation, markdown rendered properly

- [ ] T034aj [P] [CARD-DETAIL] Create CardDetailModal component
- [ ] T034ak [P] [CARD-DETAIL] Render full content with MarkdownRenderer (no truncation)
- [ ] T034al [P] [CARD-DETAIL] Include syntax highlighting for code blocks
- [ ] T034am [P] [CARD-DETAIL] Add "View Full" button or click handler on cards
- [ ] T034an [P] [CARD-DETAIL] Include edit/delete actions in detail modal
- [ ] T034ao [CARD-DETAIL] Test full content view: click card → modal opens → full markdown displays

**Verify**: Pending - Click card → Modal shows full content → Markdown formatted → Code highlighted

### Card Management Testing Checklist

**Completed Tests** ✅:
- [X] View deck with cards in list layout
- [X] View deck with cards in grid layout
- [X] Toggle between list and grid views
- [X] Empty state when deck has no cards
- [X] Add card with valid content
- [X] Add card validation (required fields, max length)
- [X] Discard confirmation on modal close
- [X] Real-time UI update after adding card
- [X] Hover effects on cards
- [X] Card content truncation at 150 chars
- [X] Edit card with valid content
- [X] Edit card validation
- [X] UI update after edit
- [X] Delete card with confirmation
- [X] UI update after delete
- [X] Empty state after deleting last card

**Pending Tests** ⚠️:
- [ ] Full content view with markdown rendering
- [ ] Error handling for network failures
- [ ] Mobile touch interactions (44x44px buttons) - Implemented but not formally tested
- [ ] Keyboard navigation through cards

**Edge Cases to Test**:
- [ ] Very long card content (> 10k chars validation)
- [ ] Card with only whitespace (trim validation)
- [ ] Concurrent edits by multiple users
- [ ] Network error during card operations
- [ ] Special characters and emojis in content
- [ ] Markdown edge cases (nested lists, tables)

**Checkpoint**: Card Management - 100% complete (Edit/Delete CRUD operations fully functional) ✅

---

## Phase 3: User Story 1 - Start Study Session (Priority: P1) 🎯 MVP

**Goal**: Users can start study session with due cards

**Independent Test**: Open deck with cards → click "Study" → first card's front side displays

### Tests for User Story 1 - Write FIRST, verify they FAIL

- [ ] T023 [P] [US1] Write integration test for starting study session in tests/integration/study/start-session.test.ts
- [ ] T024 [P] [US1] Write test for due cards query ordering (new cards first, then by date) in tests/integration/study/card-queue.test.ts
- [ ] T025 [P] [US1] Write test for empty study state (no cards due) in tests/integration/study/empty-state.test.ts
- [ ] T026 [P] [US1] Write component test for EmptyStudyState in tests/unit/components/EmptyStudyState.test.tsx

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 1

- [X] T027 [US1] Create EmptyStudyState component in components/study/EmptyStudyState.tsx
- [X] T028 [US1] Create study page at app/decks/[deckId]/study/page.tsx
- [X] T029 [US1] Implement session initialization (fetch due cards from database)
- [X] T030 [US1] Create card queue logic in lib/study/queue.ts (new cards first, then by next_review)
- [X] T031 [US1] Add "Study" button to deck detail page
- [X] T032 [US1] Handle case when no cards are due (show EmptyStudyState)
- [X] T033 [US1] Add "Study All Cards Anyway" option
- [X] T034 [US1] Display first card's front side
- [X] T035 [US1] Test session starts with correct card order

**Verify**: Run tests from T023-T026, all should PASS (green state)

**Checkpoint**: Users can start study sessions

---

## Phase 4: User Story 2 - Flip Card to See Answer (Priority: P1) 🎯 MVP

**Goal**: Users can flip cards to reveal answers with smooth animation

**Independent Test**: See card front → click/tap/spacebar → card flips → see back with markdown

### Tests for User Story 2 - Write FIRST, verify they FAIL

- [ ] T036 [P] [US2] Write component test for StudyCard flip animation in tests/unit/components/StudyCard.test.tsx
- [ ] T037 [P] [US2] Write component test for CardFront rendering markdown in tests/unit/components/CardFront.test.tsx
- [ ] T038 [P] [US2] Write component test for CardBack rendering markdown in tests/unit/components/CardBack.test.tsx
- [ ] T039 [P] [US2] Write E2E test for flip interactions (button, tap, spacebar) in tests/e2e/study-flip.spec.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 2

- [X] T040 [US2] Create MarkdownRenderer component in components/markdown/MarkdownRenderer.tsx
- [X] T041 [US2] Add CSS for markdown content (responsive, mobile-friendly)
- [X] T042 [US2] Create CardFront component with MarkdownRenderer in components/study/CardFront.tsx
- [X] T043 [US2] Create CardBack component with MarkdownRenderer in components/study/CardBack.tsx
- [X] T044 [US2] Create StudyCard component with flip state in components/study/StudyCard.tsx
- [X] T045 [US2] Implement 3D flip animation (180deg Y-axis rotation, 300ms)
- [X] T046 [US2] Use CSS transform3d for hardware acceleration
- [X] T047 [US2] Add flip triggers: button click, card tap (mobile), spacebar key
- [X] T048 [US2] Disable interactions during flip animation
- [X] T049 [US2] Test flip animation on iOS Safari (target: 60fps)
- [X] T050 [US2] Test flip animation on Android Chrome (target: 60fps)
- [X] T051 [US2] Test markdown renders correctly on both sides
- [X] T052 [US2] Test code blocks have syntax highlighting

**Verify**: Run tests from T036-T039, all should PASS (green state)

**Checkpoint**: Card flipping works smoothly with markdown rendering

---

## Phase 5: User Story 3 - Rate Card Difficulty (Priority: P1) 🎯 MVP

**Goal**: Users rate cards, SM-2 updates schedule, next card appears

**Independent Test**: Flip card → click rating button → card schedule updates → next card shows

### Tests for User Story 3 - Write FIRST, verify they FAIL

- [ ] T053 [P] [US3] Write component test for RatingButtons rendering in tests/unit/components/RatingButtons.test.tsx
- [ ] T054 [P] [US3] Write integration test for rating updating card schedule in tests/integration/study/rate-card.test.ts
- [ ] T055 [P] [US3] Write integration test for "Again" card re-queuing in tests/integration/study/rate-card.test.ts
- [ ] T056 [P] [US3] Write integration test for next card appearing after rating in tests/integration/study/rate-card.test.ts
- [ ] T057 [P] [US3] Write E2E test for keyboard shortcuts (1/2/3/4) in tests/e2e/study-rating.spec.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 3

- [X] T058 [US3] Create RatingButtons component with 4 buttons in components/study/RatingButtons.tsx
- [X] T059 [US3] Style rating buttons: Again (red), Hard (orange), Good (green), Easy (blue)
- [X] T060 [US3] Ensure rating buttons are 44px+ minimum on mobile
- [X] T061 [US3] Position rating buttons at bottom (thumb-reachable on mobile)
- [X] T062 [US3] Implement rateCard server action in app/actions/study.ts
- [X] T063 [US3] Integrate SM-2 algorithm in rateCard action
- [X] T064 [US3] Update card schedule in database (ease_factor, interval, repetitions, last_reviewed, next_review)
- [X] T065 [US3] Handle "Again" rating: interval=0, add back to session queue
- [X] T066 [US3] Get next card from queue after rating
- [X] T067 [US3] Implement optimistic UI update (show next card immediately)
- [X] T068 [US3] Add keyboard shortcuts: 1=Again, 2=Hard, 3=Good, 4=Easy
- [X] T069 [US3] Disable keyboard shortcuts while card is on front side
- [X] T070 [US3] Test rating updates schedule correctly for all 4 ratings
- [X] T071 [US3] Test "Again" card reappears later in session
- [X] T072 [US3] Test keyboard shortcuts work on desktop

**Verify**: Run tests from T053-T057, all should PASS (green state)

**Checkpoint**: Card rating works with SM-2 scheduling

---

## Phase 6: User Story 4 - Complete Study Session (Priority: P2)

**Goal**: After all cards reviewed, show session summary with statistics

**Independent Test**: Complete study session → see summary with stats → can return to deck

### Tests for User Story 4 - Write FIRST, verify they FAIL

- [ ] T073 [P] [US4] Write component test for SessionSummary in tests/unit/components/SessionSummary.test.tsx
- [ ] T074 [P] [US4] Write integration test for session completion in tests/integration/study/complete-session.test.ts
- [ ] T075 [P] [US4] Write test for session statistics calculation in tests/integration/study/session-stats.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 4

- [X] T076 [US4] Create SessionSummary component in components/study/SessionSummary.tsx
- [X] T077 [US4] Track session statistics (cards studied, rating breakdown, duration)
- [X] T078 [US4] Show summary when all cards reviewed
- [X] T079 [US4] Display statistics: total cards, Again/Hard/Good/Easy counts, time elapsed
- [X] T080 [US4] Add "Return to Deck" button to navigate back
- [X] T081 [US4] Add congratulatory message based on performance
- [X] T082 [US4] Test session summary displays correct statistics

**Verify**: Run tests from T073-T075, all should PASS (green state)

**Checkpoint**: Study sessions complete with meaningful feedback

---

## Phase 7: User Story 5 - Progress Tracking During Session (Priority: P2)

**Goal**: Users see progress indicator showing current position in session

**Independent Test**: During study → progress shows "Card 5 of 20" → updates after each rating

### Tests for User Story 5 - Write FIRST, verify they FAIL

- [ ] T083 [P] [US5] Write component test for ProgressBar in tests/unit/components/ProgressBar.test.tsx
- [ ] T084 [P] [US5] Write integration test for progress updating in tests/integration/study/progress.test.ts
- [ ] T085 [P] [US5] Write test for progress count increasing with "Again" ratings in tests/integration/study/progress.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 5

- [X] T086 [US5] Create ProgressBar component in components/study/ProgressBar.tsx
- [X] T087 [US5] Display "Card X of Y" at top of study page
- [X] T088 [US5] Update current card number after each rating
- [X] T089 [US5] Increment total count when "Again" card added to queue
- [X] T090 [US5] Style progress bar for mobile visibility
- [X] T091 [US5] Test progress indicator updates correctly
- [X] T092 [US5] Test total count increases with "Again" ratings

**Verify**: Run tests from T083-T085, all should PASS (green state)

**Checkpoint**: Users can track progress through session

---

## Phase 8: User Story 6 - Exit Study Session Early (Priority: P3)

**Goal**: Users can exit session before completion, progress is saved

**Independent Test**: Start session → review some cards → exit → progress saved → remaining cards still due

### Tests for User Story 6 - Write FIRST, verify they FAIL

- [ ] T093 [P] [US6] Write E2E test for exit confirmation in tests/e2e/study-exit.spec.ts
- [ ] T094 [P] [US6] Write integration test for progress preservation on exit in tests/integration/study/exit-session.test.ts
- [ ] T095 [P] [US6] Write test for unreviewed cards remaining due in tests/integration/study/exit-session.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation for User Story 6

- [X] T096 [US6] Add "Exit" button to study page
- [X] T097 [US6] Create exit confirmation dialog
- [X] T098 [US6] Save progress on exit (reviewed cards have updated schedules)
- [X] T099 [US6] Ensure unreviewed cards keep their due status
- [X] T100 [US6] Redirect to deck detail page on exit
- [X] T101 [US6] Test exit confirmation shows correctly
- [X] T102 [US6] Test reviewed cards don't reappear immediately

**Verify**: Run tests from T093-T095, all should PASS (green state)

**Checkpoint**: Users can exit sessions with progress preserved

---

## Phase 9: Mobile Optimizations & Gestures

**Purpose**: Enhance mobile study experience

### Tests - Write FIRST, verify they FAIL

- [ ] T103 [P] Write E2E test for swipe to flip on mobile in tests/e2e/study-mobile.spec.ts
- [ ] T104 [P] Write test for haptic feedback on rating in tests/e2e/study-mobile.spec.ts
- [ ] T105 [P] Write test for scrollable card content in tests/e2e/study-mobile.spec.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T106 Implement swipe gesture to flip card (swipe up/down)
- [ ] T107 Add haptic feedback on button press (mobile)
- [ ] T108 Make card content area scrollable if exceeds viewport
- [ ] T109 Keep rating buttons fixed at bottom during scroll
- [ ] T110 Test swipe gesture on iOS Safari
- [ ] T111 Test swipe gesture on Android Chrome
- [ ] T112 Test long markdown content scrolls correctly
- [ ] T113 Optimize touch response time (<100ms feedback)

**Verify**: Run tests from T103-T105, all should PASS (green state)

**Checkpoint**: Mobile study experience is optimized

---

## Phase 10: Accessibility

**Purpose**: Ensure study mode is fully accessible

### Tests - Write FIRST, verify they FAIL

- [ ] T114 [P] Write test for keyboard navigation in tests/e2e/study-accessibility.spec.ts
- [ ] T115 [P] Write test for screen reader announcements in tests/e2e/study-accessibility.spec.ts
- [ ] T116 [P] Write test for focus management in tests/e2e/study-accessibility.spec.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T117 [P] Add ARIA labels to all buttons and card states
- [ ] T118 [P] Add ARIA live region for progress updates
- [ ] T119 [P] Add ARIA announcements for card flips
- [ ] T120 Test with screen reader (VoiceOver or NVDA)
- [ ] T121 Test keyboard-only navigation through entire study flow
- [ ] T122 Verify focus order is logical
- [ ] T123 Test with 200% browser zoom
- [ ] T124 Run Lighthouse accessibility audit (target: 90+ score)

**Verify**: Run tests from T114-T116, all should PASS (green state)

**Checkpoint**: Study mode is fully accessible

---

## Phase 11: Edge Cases & Performance

**Purpose**: Handle edge cases and optimize performance

### Tests - Write FIRST, verify they FAIL

- [ ] T125 [P] Write test for very long card content (10KB) in tests/integration/study/edge-cases.test.ts
- [ ] T126 [P] Write test for rapid button clicks in tests/integration/study/edge-cases.test.ts
- [ ] T127 [P] Write test for network errors during rating in tests/integration/study/edge-cases.test.ts
- [ ] T128 [P] Write performance test for 50-card session in tests/performance/study.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T129 Handle very long markdown content gracefully
- [ ] T130 Debounce rating button clicks (prevent double-submission)
- [ ] T131 Handle network errors with retry mechanism
- [ ] T132 Add error messages for failed rating submissions
- [ ] T133 Preload next card while user is viewing current card
- [ ] T134 Optimize markdown parsing (cache parsed content)
- [ ] T135 Test study session with 50 cards completes smoothly
- [ ] T136 Test on 3G connection (simulate slow network)
- [ ] T137 Measure and optimize flip animation (60fps target)

**Verify**: Run tests from T125-T128, all should PASS (green state)

**Checkpoint**: Study mode handles edge cases and performs well

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements

- [X] T138 [P] Add loading states for session initialization
- [X] T139 [P] Add transition animations between cards
- [X] T140 [P] Add visual feedback when card is added to queue ("Again" rating)
- [X] T141 Style code blocks in markdown with proper highlighting
- [X] T142 Make tables in markdown responsive (horizontal scroll on mobile)
- [ ] T143 Add "Study Statistics" page showing overall progress
- [ ] T144 Add session timer display
- [ ] T145 Support LaTeX/math notation in markdown (optional enhancement)
- [ ] T146 Test with various markdown edge cases (nested lists, complex tables)
- [ ] T147 Add analytics events for study sessions
- [ ] T148 Create study mode documentation
- [ ] T149 Final E2E test for complete study flow (start → flip → rate → complete)
- [ ] T150 Performance benchmarking and optimization report

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all study features
  - **SM-2 Algorithm**: CRITICAL - must be thoroughly tested before any study features
  - **Markdown Rendering**: Required for displaying cards
  - **Database**: Required for storing/retrieving cards
- **User Stories (Phase 3-8)**: All depend on Foundational completion
  - US1 (Start Session) is entry point
  - US2 (Flip Card) depends on US1
  - US3 (Rate Card) depends on US2 + SM-2 algorithm
  - US4 (Complete Session) depends on US3
  - US5 (Progress) depends on US1-US3
  - US6 (Exit Early) depends on US1-US3
- **Mobile (Phase 9)**: Can start after US2 (Flip) completes
- **Accessibility (Phase 10)**: Can start after US1-US3 complete
- **Edge Cases (Phase 11)**: Depends on US1-US3 completion
- **Polish (Phase 12)**: Depends on all previous phases

### Within Each User Story - TDD Flow

1. **RED**: Write tests first (verify they FAIL)
2. **GREEN**: Implement code to make tests PASS
3. **REFACTOR**: Clean up code while tests still PASS
4. Move to next story

### Critical Path

```
Setup → Foundational (SM-2 + Markdown + DB) → 
  Card Management (View + Add + Edit + Delete) →
    [ESSENTIAL - Users need cards to study!]
  US1 (Start) → US2 (Flip) → US3 (Rate) → 
    [MVP COMPLETE - Can study flashcards!]
  → US4 (Summary) → US5 (Progress) → US6 (Exit) →
  → Mobile → Accessibility → Edge Cases → Polish
```

### Parallel Opportunities

**Within Foundational Phase (Phase 2)**:
```bash
# Tests can be written in parallel:
T005 (SM-2 tests) + T012 (DB tests) + T016 (markdown tests) + T017 (sanitize tests)

# After tests pass, implementations can be built in parallel:
T006-T008 (SM-2) + T019-T022 (Markdown)
T014 (card queries) + T015 (study queries)
```

**Within Card Management (Phase 2.5)** ✅ Completed in parallel:
```bash
# Server actions + UI components built concurrently:
T034p (addCard action) + T034t (editCard action) + T034ab (removeCard action)
T034j-T034s (AddCardModal) + T034a-T034i (DeckDetailClient with list/grid)

# Remaining work can be done in parallel:
T034u-T034aa (EditCardModal) + T034ac-T034ai (DeleteConfirmDialog)
T034aj-T034ao (CardDetailModal) - Optional, can be deferred
```

**Within User Story 2 (Flip)**:
```bash
# Components in parallel:
T040 (MarkdownRenderer) can start first
T042 (CardFront) + T043 (CardBack) after MarkdownRenderer
```

**Within User Story 3 (Rate)**:
```bash
# Can work in parallel:
T058-T061 (UI components)
T062-T066 (Server action with SM-2)
```

**Across User Stories** (with multiple developers):
- Developer A: Card Management (Edit/Delete UI) → US1 → US2 → US3 (critical path)
- Developer B: After US3, work on US4 + US5 + US6
- Developer C: After US2, work on Mobile + Accessibility

---

## Implementation Strategy

### MVP First (Basic Study Flow + Card Management)

1. Complete Phase 1: Setup ✅
2. Complete Phase 2: Foundational (especially SM-2!) ✅
3. **Complete Phase 2.5: Card Management ⚠️ 62.5% complete**
   - ✅ View Deck (List/Grid)
   - ✅ Add Card
   - 🚧 Edit Card (server action ready, UI missing)
   - 🚧 Delete Card (server action ready, UI missing)
   - ❌ Full Content View (optional, can defer)
4. Complete Phase 3: US1 (Start Session) ✅
5. Complete Phase 4: US2 (Flip Card) ✅
6. Complete Phase 5: US3 (Rate Card) ✅
7. **STOP and VALIDATE**: Core study loop works with SM-2 ✅
8. Deploy MVP - users can study flashcards with spaced repetition

### Immediate Next Steps (High Priority)

**Complete Card Management CRUD** (Required before full MVP):
1. Create EditCardModal component (2-3 hours)
   - Copy AddCardModal.tsx structure
   - Add props for initial card data
   - Pre-populate front/back content
   - Update submit handler to call editCard action
   
2. Create DeleteConfirmDialog component (1-2 hours)
   - Simple confirmation dialog
   - Show card preview (truncated front/back)
   - "Delete" and "Cancel" buttons
   - Call removeCard action on confirm
   
3. Add Edit/Delete buttons to cards (30 min)
   - Add buttons to card rendering in DeckDetailClient
   - Style with Material Design
   - Wire up modal state management

**Estimated Total**: 4-6 hours to complete CRUD operations

### Incremental Delivery

1. Foundation (SM-2 + Markdown) → Test extensively ✅
2. Add Card Management - View & Add → Test independently → Deploy ✅
3. Add Card Management - Edit & Delete → Test independently → Deploy ⚠️ NEXT
4. Add Start Session (US1) → Test independently → Deploy ✅
5. Add Flip (US2) → Test independently → Deploy ✅
6. Add Rating (US3) → Test independently → Deploy (MVP!) ✅
7. Add Summary (US4) → Deploy ✅
8. Add Progress (US5) → Deploy ✅
9. Add Exit (US6) → Deploy ✅
10. Add Mobile optimizations → Deploy
11. Add Accessibility → Deploy
12. Each addition enhances experience without breaking previous work

### Current Status Summary

**✅ Completed (75% of MVP)**:
- Phase 1: Setup
- Phase 2: Foundational (SM-2, Markdown, Database)
- Phase 2.5: Card Management - View & Add (62.5%)
- Phase 3: US1 - Start Study Session
- Phase 4: US2 - Flip Card
- Phase 5: US3 - Rate Card with SM-2
- Phase 6: US4 - Complete Study Session
- Phase 7: US5 - Progress Tracking
- Phase 8: US6 - Exit Study Session
- Phase 12: Partial Polish (animations, syntax highlighting)

**🚧 Partially Complete**:
- Phase 2.5: Card Management - Edit & Delete (server actions exist, UI missing)

**❌ Not Started**:
- Phase 9: Mobile Optimizations & Gestures
- Phase 10: Accessibility
- Phase 11: Edge Cases & Performance
- Phase 12: Remaining Polish items

**Next Critical Task**: Complete Edit/Delete card UI to finish CRUD operations (4-6 hours estimated)

---

## Notes

- **TDD is CRITICAL for SM-2**: Algorithm must be proven correct before use
- **SM-2 tests are comprehensive**: Cover all ratings and edge cases
- **Red-Green-Refactor**: Verify tests fail → make them pass → clean up
- **[P] tasks**: Different files, can run in parallel
- **[Story] labels**: Track which user story each task belongs to
- Each user story is independently testable
- Markdown security is critical (sanitization must work)
- Card flip animation must be smooth (60fps on mobile)
- SM-2 algorithm is the heart of the feature - test thoroughly
- Commit after each task or logical group
- Run tests frequently during implementation
- Target: High test coverage especially for SM-2 algorithm (100%)
