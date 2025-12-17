# Implementation Plan: Study Mode with Spaced Repetition

**Branch**: `003-study-mode` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)

## Summary

Implement spaced repetition study mode using SM-2 algorithm with Next.js App Router, PostgreSQL for card storage and scheduling data, and markdown rendering via marked.js. Study flow: display card front → user flips → display card back → user rates difficulty (Again/Hard/Good/Easy) → update schedule and show next card. Mobile-first with animations and keyboard shortcuts. Real-time progress tracking and session statistics.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+, Next.js 14 (App Router)  
**Primary Dependencies**:
- `marked` or `markdown-it` (markdown parsing)
- `highlight.js` or `prism-react-renderer` (code syntax highlighting)
- `@vercel/postgres` (database)
- `zod` (validation)
- `framer-motion` (card flip animation)
- `date-fns` (date calculations for SM-2)

**Storage**: PostgreSQL (Vercel Postgres) - `cards` table with front, back, ease_factor, interval, repetitions, last_reviewed, next_review  
**Testing**: Jest (unit tests for SM-2 algorithm), React Testing Library (component tests), Playwright (E2E)  
**Target Platform**: Vercel, responsive web (mobile 320px+)  
**Project Type**: Web application (Next.js full-stack)  
**Performance Goals**:
- Card flip animation: 300ms smooth
- Rating button response: < 100ms
- Markdown rendering: < 50ms per card
- Study session start: < 1s

**Constraints**:
- Card content: markdown format, max 10KB per side
- SM-2 interval range: 0 (same session) to 365 days
- Ease factor range: 1.3 to 3.0
- Minimum 44px touch targets for rating buttons on mobile
- Card flip animation must be hardware-accelerated

**Scale/Scope**:
- 10-50 cards per study session typical
- 100-1000 cards per deck
- Study sessions 5-30 minutes

## Constitution Check

✅ **Mobile-First Responsive Design**: Study interface optimized for 320px+ width, large rating buttons (44px+), swipe to flip  
✅ **Markdown Fidelity**: Full CommonMark support with code highlighting, tables, task lists  
✅ **Performance & User Experience**: <300ms flip animation, instant rating feedback, optimistic updates  
✅ **Accessibility First**: Keyboard shortcuts (spacebar=flip, 1/2/3/4=ratings), ARIA labels, screen reader support  
✅ **Progressive Enhancement**: Core study flow works without JS (server-side rendering), enhanced with animations and shortcuts  
✅ **Simplicity**: Standard SM-2 implementation, no complex state machines, direct server actions

**Gates**: ✅ All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/003-study-mode/
├── plan.md              # This file
├── spec.md              # Feature specification
└── tasks.md             # Implementation tasks (to be created)
```

### Source Code

```text
app/
├── decks/
│   └── [deckId]/
│       ├── page.tsx                 # Deck detail page with "Study" button
│       └── study/
│           └── page.tsx             # Study mode page
└── actions/
    ├── cards.ts                     # Card CRUD actions
    └── study.ts                     # Study session actions (rate card, get next)

lib/
├── study/
│   ├── sm2.ts                       # SM-2 algorithm implementation
│   ├── session.ts                   # Study session management
│   └── queue.ts                     # Card queueing logic
├── markdown/
│   ├── parser.ts                    # Markdown to HTML conversion
│   └── sanitize.ts                  # HTML sanitization for security
├── db/
│   ├── schema.sql                   # Cards table with scheduling fields
│   └── queries/
│       ├── cards.ts                 # Card CRUD queries
│       └── study.ts                 # Study-specific queries (due cards, etc.)
└── validations/
    └── card.ts                      # Zod schema for card validation

components/
├── study/
│   ├── StudyCard.tsx                # Flashcard with front/back and flip
│   ├── CardFront.tsx                # Front side with markdown
│   ├── CardBack.tsx                 # Back side with markdown + rating buttons
│   ├── RatingButtons.tsx            # Again/Hard/Good/Easy buttons
│   ├── ProgressBar.tsx              # Session progress indicator
│   ├── SessionSummary.tsx           # Post-session statistics
│   └── EmptyStudyState.tsx          # "No cards due" message
├── markdown/
│   └── MarkdownRenderer.tsx         # Reusable markdown renderer
└── ui/
    └── Button.tsx                   # Material Design button

types/
├── card.ts                          # Card type with scheduling fields
└── study.ts                         # StudySession, Rating types

tests/
├── unit/
│   ├── study/
│   │   ├── sm2.test.ts             # SM-2 algorithm tests
│   │   ├── queue.test.ts           # Card queueing tests
│   │   └── session.test.ts         # Session management tests
│   ├── markdown/
│   │   ├── parser.test.ts          # Markdown parsing tests
│   │   └── sanitize.test.ts        # HTML sanitization tests
│   └── db/
│       └── study.test.ts           # Study query tests
├── integration/
│   └── study/
│       ├── rate-card.test.ts       # Card rating integration test
│       └── session-flow.test.ts    # Complete session flow test
└── e2e/
    └── study-mode.spec.ts          # Full study session E2E test
```

**Structure Decision**: Using Next.js App Router with study mode at `/decks/[deckId]/study`. SM-2 algorithm and session management in `lib/study/`. Markdown rendering isolated in `lib/markdown/` for reusability. Server actions handle rating and scheduling updates. Study component manages card state and animations client-side. This structure separates business logic (SM-2) from presentation (React components).

## Implementation Phases

### Phase 0: SM-2 Algorithm & Database

**Goal**: Implement SM-2 algorithm and card scheduling database schema

**Tasks**:
1. Create cards table schema with scheduling fields (ease_factor, interval, repetitions, last_reviewed, next_review)
2. Implement SM-2 algorithm in `lib/study/sm2.ts`
3. Write comprehensive unit tests for SM-2 calculations
4. Create card CRUD queries with scheduling data
5. Implement query to get due cards for a deck
6. Create TypeScript types for Card with scheduling

**Deliverables**:
- `lib/db/schema.sql` with cards table including SM-2 fields
- `lib/study/sm2.ts` with calculateNextReview function
- `lib/db/queries/study.ts` with getDueCards, updateCardSchedule
- `types/card.ts` and `types/study.ts`
- Comprehensive unit tests for SM-2 algorithm (all rating scenarios)

**Validation**:
- SM-2 algorithm correctly calculates intervals for all ratings
- New cards initialize with correct defaults (ease=2.5, interval=0, reps=0)
- Due cards query returns cards where next_review <= now
- Unit tests cover edge cases (min/max ease factor, interval boundaries)

---

### Phase 1: Markdown Rendering

**Goal**: Implement secure markdown rendering with code highlighting

**Tasks**:
1. Set up markdown parser (marked or markdown-it)
2. Configure syntax highlighting (highlight.js or Prism)
3. Implement HTML sanitization for security
4. Create MarkdownRenderer component
5. Style markdown output (headings, lists, code blocks, tables)
6. Test with various markdown syntax
7. Optimize rendering performance

**Deliverables**:
- `lib/markdown/parser.ts` with markdown to HTML conversion
- `lib/markdown/sanitize.ts` with DOMPurify or similar
- `components/markdown/MarkdownRenderer.tsx`
- CSS for markdown styling (mobile-responsive)
- Unit tests for markdown parsing and sanitization

**Validation**:
- All CommonMark syntax renders correctly
- Code blocks have syntax highlighting
- Tables are responsive (horizontal scroll on mobile)
- HTML is sanitized (no XSS vulnerabilities)
- Markdown renders in < 50ms for typical card content

---

### Phase 2: Study Card Component & Flip Animation

**Goal**: Create flashcard component with smooth flip animation

**Tasks**:
1. Create StudyCard component with front/back states
2. Implement 3D flip animation (CSS or framer-motion)
3. Create CardFront and CardBack components with markdown rendering
4. Add flip triggers: button click, card tap, spacebar key
5. Ensure flip animation is hardware-accelerated (60fps)
6. Disable interactions during animation
7. Test on mobile devices for smooth performance

**Deliverables**:
- `components/study/StudyCard.tsx` with flip logic
- `components/study/CardFront.tsx` and `CardBack.tsx`
- Flip animation (300ms, ease-in-out)
- Keyboard shortcut (spacebar) for flip
- Component tests

**Validation**:
- Card flips smoothly in 300ms on mobile
- Spacebar and tap trigger flip
- Front side hidden when back is showing
- Animation works on iOS Safari and Android Chrome
- No jank or frame drops during flip

---

### Phase 3: Rating System & SM-2 Integration

**Goal**: Implement difficulty rating buttons and schedule updates

**Tasks**:
1. Create RatingButtons component (Again/Hard/Good/Easy)
2. Style buttons with Material Design and color coding (red/orange/green/blue)
3. Implement rateCard server action
4. Calculate next review date using SM-2 on rating
5. Update card schedule in database
6. Show next card after rating
7. Re-queue "Again" cards in current session
8. Add keyboard shortcuts (1/2/3/4 for ratings)

**Deliverables**:
- `components/study/RatingButtons.tsx`
- `app/actions/study.ts` with rateCard action
- SM-2 integration with database updates
- Keyboard shortcuts for ratings
- Integration tests for rating flow

**Validation**:
- Rating buttons are 44px+ on mobile
- Clicking rating updates card schedule correctly
- "Again" cards reappear later in session
- Keyboard shortcuts (1/2/3/4) work
- Next card appears immediately after rating (optimistic update)

---

### Phase 4: Study Session Management

**Goal**: Manage study session flow from start to completion

**Tasks**:
1. Create study page at `/decks/[deckId]/study`
2. Implement session initialization (get due cards)
3. Create card queue with new cards first, then due cards by date
4. Add ProgressBar component showing "Card X of Y"
5. Handle "Again" ratings (add card back to queue, update total count)
6. Create SessionSummary component with statistics
7. Show summary when all cards are reviewed
8. Add "Return to Deck" navigation

**Deliverables**:
- `app/decks/[deckId]/study/page.tsx`
- `lib/study/session.ts` with session management logic
- `lib/study/queue.ts` with card queueing
- `components/study/ProgressBar.tsx`
- `components/study/SessionSummary.tsx`
- Session flow integration tests

**Validation**:
- Study session starts with correct cards (new + due)
- Progress indicator updates correctly ("Card 5 of 20")
- "Again" cards increment total count
- Session summary shows at end with correct statistics
- Session duration tracked accurately

---

### Phase 5: Mobile Optimizations & Accessibility

**Goal**: Optimize for mobile and ensure full accessibility

**Tasks**:
1. Implement swipe gesture to flip card (optional enhancement)
2. Add haptic feedback on button press (mobile)
3. Ensure rating buttons are thumb-reachable (bottom of screen)
4. Make card content scrollable if exceeds viewport
5. Add ARIA labels for all buttons and card states
6. Test with screen reader
7. Test on real mobile devices (iOS, Android)
8. Add loading states for slow connections

**Deliverables**:
- Swipe to flip gesture handler
- Haptic feedback integration
- Scrollable card content area
- ARIA labels on all interactive elements
- Mobile device testing results
- Loading spinners/skeletons

**Validation**:
- Swipe up/down flips card on mobile
- Haptic feedback on button press (if supported)
- Card content scrollable without affecting rating buttons
- Screen reader announces card state changes
- Works smoothly on iOS Safari and Android Chrome
- Lighthouse accessibility score 90+

---

### Phase 6: Edge Cases & Empty States

**Goal**: Handle edge cases and provide clear empty states

**Tasks**:
1. Create EmptyStudyState for "No cards due"
2. Add "Study All Cards Anyway" option when no cards due
3. Handle deck with 0 cards (show "Add cards first" message)
4. Handle rapid button clicks (debouncing)
5. Handle network errors during rating
6. Add "Exit Study" button with confirmation
7. Handle browser back button during study
8. Save progress on early exit

**Deliverables**:
- `components/study/EmptyStudyState.tsx`
- "Study All Cards" option
- Error handling and retry logic
- Exit confirmation dialog
- Progress preservation on early exit

**Validation**:
- Empty state shows when no cards due
- Can study all cards regardless of schedule
- Rapid clicks don't break session
- Network errors show message and allow retry
- Can exit study with confirmation
- Progress saved on exit (reviewed cards scheduled)

---

### Phase 7: Testing & Performance

**Goal**: Comprehensive testing and performance optimization

**Tasks**:
1. Write E2E tests for complete study flow
2. Test SM-2 algorithm edge cases (very long intervals, min/max ease)
3. Performance testing (50-card session)
4. Test markdown rendering edge cases (very long content, special chars)
5. Test on slow network (3G simulation)
6. Optimize card preloading (load next card while current displayed)
7. Add performance monitoring

**Deliverables**:
- Complete E2E test suite
- Edge case tests for SM-2
- Performance benchmarks
- Card preloading implementation
- Performance monitoring setup

**Validation**:
- All E2E tests pass
- Study session with 50 cards completes smoothly
- Markdown rendering handles edge cases gracefully
- Session works on 3G connection (< 3s initial load)
- Next card loads instantly (preloaded)

## Database Schema

```sql
-- cards table with SM-2 scheduling fields
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  
  -- SM-2 scheduling fields
  ease_factor DECIMAL(3,2) DEFAULT 2.50 CHECK (ease_factor >= 1.30 AND ease_factor <= 3.00),
  interval INTEGER DEFAULT 0 CHECK (interval >= 0), -- days
  repetitions INTEGER DEFAULT 0 CHECK (repetitions >= 0),
  last_reviewed TIMESTAMP,
  next_review TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT card_content_length CHECK (LENGTH(front) <= 10000 AND LENGTH(back) <= 10000)
);

CREATE INDEX idx_cards_deck_id ON cards(deck_id);
CREATE INDEX idx_cards_next_review ON cards(next_review);
CREATE INDEX idx_cards_deck_next_review ON cards(deck_id, next_review);

-- Function to get due cards for a deck
CREATE OR REPLACE FUNCTION get_due_cards(p_deck_id INTEGER)
RETURNS TABLE (
  id INTEGER,
  front TEXT,
  back TEXT,
  ease_factor DECIMAL,
  interval INTEGER,
  repetitions INTEGER,
  last_reviewed TIMESTAMP,
  next_review TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id, c.front, c.back, c.ease_factor, c.interval, 
    c.repetitions, c.last_reviewed, c.next_review
  FROM cards c
  WHERE c.deck_id = p_deck_id 
    AND c.next_review <= CURRENT_TIMESTAMP
  ORDER BY 
    CASE WHEN c.repetitions = 0 THEN 0 ELSE 1 END, -- new cards first
    c.next_review ASC; -- then by due date
END;
$$ LANGUAGE plpgsql;
```

## SM-2 Algorithm Implementation

```typescript
// lib/study/sm2.ts

export enum Rating {
  Again = 0, // Complete fail
  Hard = 1,  // Barely remembered
  Good = 2,  // Remembered with effort
  Easy = 3,  // Remembered easily
}

export interface CardSchedule {
  easeFactor: number
  interval: number // days
  repetitions: number
  nextReview: Date
}

export interface Card {
  id: number
  easeFactor: number
  interval: number
  repetitions: number
  lastReviewed: Date | null
}

/**
 * Calculate next review schedule based on SM-2 algorithm
 * @param card Current card state
 * @param rating User's rating (0-3)
 * @returns Updated schedule
 */
export function calculateNextReview(
  card: Card,
  rating: Rating
): CardSchedule {
  let easeFactor = card.easeFactor
  let interval = card.interval
  let repetitions = card.repetitions

  // Adjust ease factor based on rating
  if (rating === Rating.Again) {
    // Failed - reset interval and reps
    easeFactor = Math.max(1.3, easeFactor - 0.2)
    interval = 0 // Re-study in same session
    repetitions = 0
  } else if (rating === Rating.Hard) {
    // Hard - slight increase
    easeFactor = Math.max(1.3, easeFactor - 0.15)
    interval = Math.round(interval * 1.2)
    repetitions += 1
  } else if (rating === Rating.Good) {
    // Good - normal progression
    if (repetitions === 0) {
      interval = 1 // First review: 1 day
    } else if (repetitions === 1) {
      interval = 6 // Second review: 6 days
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  } else if (rating === Rating.Easy) {
    // Easy - accelerated progression
    easeFactor = Math.min(3.0, easeFactor + 0.15)
    if (repetitions === 0) {
      interval = 4 // First review: 4 days
    } else {
      interval = Math.round(interval * easeFactor * 1.3)
    }
    repetitions += 1
  }

  // Ensure minimum interval of 1 day for successful reviews
  if (rating !== Rating.Again && interval < 1) {
    interval = 1
  }

  // Calculate next review date
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  return {
    easeFactor,
    interval,
    repetitions,
    nextReview,
  }
}
```

## API Contracts

### Get Due Cards

```typescript
// Server Component or Server Action
async function getDueCards(deckId: number): Promise<Card[]>
// Returns: Array of cards where next_review <= now, ordered by new cards first then by due date
```

---

### Rate Card Action

```typescript
// app/actions/study.ts
export async function rateCard(
  cardId: number,
  rating: Rating
): Promise<ActionResult> {
  // Input: cardId, rating (0-3)
  // Returns: { success: true, nextCard: Card | null } | { success: false, error: string }
  // Side effects: Updates card's SM-2 fields, returns next card in queue
}
```

**Logic**:
1. Get current card state
2. Calculate new schedule using SM-2
3. Update database (ease_factor, interval, repetitions, last_reviewed, next_review)
4. If rating = Again, add card back to session queue
5. Get next card from queue
6. Return next card or null if session complete

---

### Start Study Session

```typescript
// Server Component (app/decks/[deckId]/study/page.tsx)
async function getStudySession(deckId: number): Promise<StudySession>
// Returns: { cards: Card[], sessionId: string, startedAt: Date }
```

## Component Hierarchy

```
StudyPage
├── ProgressBar (current / total)
├── StudyCard
│   ├── CardFront (if !flipped)
│   │   └── MarkdownRenderer
│   ├── CardBack (if flipped)
│   │   ├── MarkdownRenderer
│   │   └── RatingButtons
│   │       ├── Button (Again) - red
│   │       ├── Button (Hard) - orange
│   │       ├── Button (Good) - green
│   │       └── Button (Easy) - blue
│   └── FlipButton (if !flipped)
├── ExitButton
└── SessionSummary (if complete)
    ├── Statistics (total cards, rating breakdown, time)
    └── ReturnToDeckButton
```

## Markdown Rendering Security

```typescript
// lib/markdown/parser.ts
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import hljs from 'highlight.js'

// Configure marked for syntax highlighting
marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
})

export function parseMarkdown(content: string): string {
  // Parse markdown to HTML
  const html = marked(content)
  
  // Sanitize HTML to prevent XSS
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'strong', 'em', 'u', 'del',
      'ul', 'ol', 'li',
      'code', 'pre',
      'blockquote',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a', 'img',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class'],
  })
  
  return clean
}
```

## Keyboard Shortcuts

```typescript
// In StudyCard component
useEffect(() => {
  function handleKeyPress(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return // Don't trigger shortcuts in input fields
    }
    
    switch (e.key) {
      case ' ': // Spacebar
        e.preventDefault()
        handleFlip()
        break
      case '1':
        if (isFlipped) handleRating(Rating.Again)
        break
      case '2':
        if (isFlipped) handleRating(Rating.Hard)
        break
      case '3':
        if (isFlipped) handleRating(Rating.Good)
        break
      case '4':
        if (isFlipped) handleRating(Rating.Easy)
        break
    }
  }
  
  window.addEventListener('keydown', handleKeyPress)
  return () => window.removeEventListener('keydown', handleKeyPress)
}, [isFlipped])
```

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "marked": "^11.0.0",
    "isomorphic-dompurify": "^2.9.0",
    "highlight.js": "^11.9.0",
    "@vercel/postgres": "^0.5.0",
    "date-fns": "^3.0.0",
    "framer-motion": "^10.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/marked": "^6.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "playwright": "^1.40.0"
  }
}
```

## Performance Optimizations

1. **Card Preloading**: Load next card while user is reviewing current card
2. **Markdown Caching**: Cache parsed markdown in memory during session
3. **Optimistic Updates**: Update UI immediately, sync with server in background
4. **Hardware-Accelerated Animation**: Use CSS transform3d for flip animation
5. **Debouncing**: Prevent rapid button clicks from queueing multiple actions
6. **Lazy Loading**: Load study page components only when needed

## Testing Strategy

1. **Unit Tests** (SM-2 algorithm critical):
   - All rating scenarios (Again/Hard/Good/Easy)
   - Edge cases (min/max ease factor, very long intervals)
   - New card initialization
   - Interval calculations

2. **Component Tests**:
   - StudyCard flip animation
   - RatingButtons click handling
   - MarkdownRenderer with various markdown syntax
   - ProgressBar updates

3. **Integration Tests**:
   - Complete study session flow
   - Rating updates database correctly
   - Card queue management ("Again" cards re-queued)

4. **E2E Tests**:
   - Start session → flip card → rate → repeat → see summary
   - Keyboard shortcuts work
   - Exit session early (progress saved)
   - Mobile viewport testing

## Deployment Checklist

- [ ] Database migrations run (create cards table with SM-2 fields)
- [ ] Test SM-2 algorithm calculations on production
- [ ] Verify markdown rendering with various content
- [ ] Test card flip animation on mobile devices
- [ ] Verify keyboard shortcuts work
- [ ] Check rating buttons are 44px+ on mobile
- [ ] Test on slow connection (3G simulation)
- [ ] Lighthouse performance score 90+
- [ ] Lighthouse accessibility score 90+
- [ ] Monitor card scheduling accuracy over time
