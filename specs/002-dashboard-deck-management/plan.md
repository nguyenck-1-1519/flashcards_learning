# Implementation Plan: Dashboard & Deck Management

**Branch**: `002-dashboard-deck-management` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)

## Summary

Implement CRUD operations for flashcard decks using Next.js App Router with server actions and PostgreSQL. Dashboard displays decks in responsive Material Design grid (1/2/3 columns based on viewport). Each deck card shows name and card count with edit/delete actions. Real-time UI updates using React optimistic updates. Mobile-first design with swipe gestures and FAB for creation.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+, Next.js 14 (App Router)  
**Primary Dependencies**:
- `@vercel/postgres` (database client)
- `zod` (validation)
- `framer-motion` (animations, optional)
- `react-swipeable` (swipe gestures on mobile)

**Storage**: PostgreSQL (Vercel Postgres) - `decks` table with id, name, user_id, created_at, updated_at  
**Testing**: Jest + React Testing Library (component tests), Playwright (E2E)  
**Target Platform**: Vercel, responsive web (mobile 320px+, tablet 768px+, desktop 1024px+)  
**Project Type**: Web application (Next.js full-stack)  
**Performance Goals**:
- Dashboard load with decks < 1s
- CRUD operations complete < 500ms
- Grid reflow smooth (60fps) on resize
- Optimistic UI updates (instant feedback)

**Constraints**:
- Deck name: 1-100 characters
- Minimum 44px touch targets on mobile
- Grid responsive: 1 column (mobile), 2 (tablet), 3 (desktop)
- Material Design elevation and animations

**Scale/Scope**:
- 5-100 decks per user typical
- Card count aggregation for each deck
- Pagination/infinite scroll for 100+ decks

## Constitution Check

✅ **Mobile-First Responsive Design**: Grid layout designed for 320px+ width, FAB for mobile, touch-friendly deck cards  
✅ **Performance & User Experience**: Optimistic updates, < 1s load time, smooth animations  
✅ **Accessibility First**: Semantic HTML, keyboard navigation, screen reader support, focus management  
✅ **Progressive Enhancement**: Works with JS disabled (forms submit via POST), enhanced with client-side features  
✅ **Simplicity**: Direct server actions, no complex state management, standard CRUD patterns

**Gates**: ✅ All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/002-dashboard-deck-management/
├── plan.md              # This file
├── spec.md              # Feature specification
└── tasks.md             # Implementation tasks (to be created)
```

### Source Code

```text
app/
├── (dashboard)/                     # Dashboard route group (requires auth)
│   ├── dashboard/
│   │   └── page.tsx                 # Dashboard page with deck grid
│   └── layout.tsx                   # Dashboard layout with auth check
├── decks/
│   └── [deckId]/
│       └── page.tsx                 # Individual deck view (cards list)
└── actions/
    └── decks.ts                     # Server actions: createDeck, updateDeck, deleteDeck

lib/
├── db/
│   ├── schema.sql                   # Decks table schema
│   └── queries/
│       └── decks.ts                 # Deck CRUD queries with card count
└── validations/
    └── deck.ts                      # Zod schema for deck validation

components/
├── dashboard/
│   ├── DeckGrid.tsx                 # Responsive grid container
│   ├── DeckCard.tsx                 # Individual deck card with actions
│   ├── EmptyState.tsx               # "No decks" state with CTA
│   └── DeckStats.tsx                # Card count badge
├── decks/
│   ├── CreateDeckModal.tsx          # Modal/dialog for creating deck
│   ├── EditDeckModal.tsx            # Modal for editing deck name
│   ├── DeleteDeckDialog.tsx         # Confirmation dialog for delete
│   └── DeckForm.tsx                 # Reusable form for create/edit
└── ui/
    ├── Card.tsx                     # Material Design card component
    ├── Modal.tsx                    # Reusable modal/dialog
    └── FAB.tsx                      # Floating action button (mobile)

types/
└── deck.ts                          # TypeScript types for Deck

tests/
├── unit/
│   ├── components/
│   │   ├── DeckCard.test.tsx       # Deck card rendering tests
│   │   └── DeckGrid.test.tsx       # Grid layout tests
│   └── db/
│       └── decks.test.ts           # Deck query tests
├── integration/
│   └── decks/
│       ├── create.test.ts          # Create deck integration test
│       ├── update.test.ts          # Update deck integration test
│       └── delete.test.ts          # Delete deck integration test
└── e2e/
    └── deck-management.spec.ts     # Full CRUD flow E2E test
```

**Structure Decision**: Using Next.js App Router with `(dashboard)` route group for authenticated deck views. Server actions in `app/actions/decks.ts` handle all CRUD operations. Components separated by feature (dashboard, decks, ui). Material Design components in `components/ui/` for reusability. This structure keeps deck management centralized while allowing easy navigation to individual deck views.

## Implementation Phases

### Phase 0: Database Setup

**Goal**: Create database schema and query functions for decks

**Tasks**:
1. Create `decks` table schema with foreign key to users
2. Implement deck CRUD queries with card count aggregation
3. Create Zod validation schema for deck names
4. Set up TypeScript types for Deck entity
5. Write unit tests for database queries

**Deliverables**:
- `lib/db/schema.sql` with decks table
- `lib/db/queries/decks.ts` with getAllDecks, createDeck, updateDeck, deleteDeck
- `lib/validations/deck.ts` with deckNameSchema
- `types/deck.ts` with Deck interface
- Unit tests for queries

**Validation**: Can query decks with card counts, create/update/delete decks in database

---

### Phase 1: View Decks (Grid Display)

**Goal**: Display user's decks in responsive Material Design grid

**Tasks**:
1. Create DeckGrid component with responsive CSS Grid
2. Create DeckCard component with name, card count, and action buttons
3. Create EmptyState component for users with no decks
4. Implement dashboard page that fetches and displays decks
5. Add loading states (skeleton cards)
6. Style with Material Design elevation and hover effects

**Deliverables**:
- `app/(dashboard)/dashboard/page.tsx`
- `components/dashboard/DeckGrid.tsx`
- `components/dashboard/DeckCard.tsx`
- `components/dashboard/EmptyState.tsx`
- Responsive CSS with breakpoints (320px, 768px, 1024px)
- Component tests

**Validation**:
- Decks display in 1/2/3 column grid based on viewport
- Empty state shows when no decks exist
- Card count displays correctly for each deck
- Grid reflows smoothly on window resize

---

### Phase 2: Create Deck

**Goal**: Allow users to create new decks with name validation

**Tasks**:
1. Create DeckForm component with name input and validation
2. Create CreateDeckModal component
3. Implement createDeck server action
4. Add FAB (Floating Action Button) on mobile for "Create Deck"
5. Add regular button on desktop
6. Implement optimistic UI update (add deck to grid immediately)
7. Handle validation errors and display to user

**Deliverables**:
- `components/decks/DeckForm.tsx`
- `components/decks/CreateDeckModal.tsx`
- `components/ui/FAB.tsx`
- `app/actions/decks.ts` with createDeck action
- Optimistic update logic in dashboard page
- Integration tests

**Validation**:
- User can create deck with valid name (1-100 chars)
- Validation errors show for empty/too long names
- New deck appears in grid immediately (optimistic)
- FAB displays on mobile, button on desktop
- Modal closes after successful creation

---

### Phase 3: Edit Deck

**Goal**: Allow users to rename existing decks

**Tasks**:
1. Create EditDeckModal component reusing DeckForm
2. Add edit button/icon to DeckCard
3. Implement updateDeck server action
4. Pre-fill form with current deck name
5. Implement optimistic UI update
6. Handle validation errors

**Deliverables**:
- `components/decks/EditDeckModal.tsx`
- Edit button in DeckCard with icon
- `app/actions/decks.ts` with updateDeck action
- Optimistic update logic
- Integration tests

**Validation**:
- Edit modal opens with current deck name pre-filled
- Deck name updates immediately in grid (optimistic)
- Validation enforced same as create
- Cancel closes modal without changes

---

### Phase 4: Delete Deck

**Goal**: Allow users to delete decks with confirmation

**Tasks**:
1. Create DeleteDeckDialog component with warning message
2. Add delete button/icon to DeckCard
3. Implement deleteDeck server action (cascade delete cards)
4. Show card count in confirmation message
5. Implement optimistic UI update (remove from grid)
6. Handle delete errors (show error message, restore deck in grid)

**Deliverables**:
- `components/decks/DeleteDeckDialog.tsx`
- Delete button in DeckCard with icon (red color)
- `app/actions/decks.ts` with deleteDeck action
- Cascade delete cards in database
- Optimistic update with error handling
- Integration tests

**Validation**:
- Confirmation dialog shows with deck name and card count
- Deck removed from grid immediately (optimistic)
- All cards deleted with deck (cascade)
- Cancel closes dialog without deleting
- Error message if delete fails

---

### Phase 5: Mobile Optimizations

**Goal**: Enhance mobile UX with swipe gestures and touch interactions

**Tasks**:
1. Implement swipe gestures on DeckCard (swipe left for delete, right for edit)
2. Add ripple effect on card press
3. Ensure all touch targets are 44px minimum
4. Test on real mobile devices (iOS, Android)
5. Add pull-to-refresh on dashboard
6. Optimize touch response times (<100ms feedback)

**Deliverables**:
- Swipe gesture handlers on DeckCard
- Ripple/press effects using CSS or framer-motion
- Mobile device testing results
- Pull-to-refresh implementation
- E2E tests on mobile viewport

**Validation**:
- Swipe gestures work smoothly on mobile
- All buttons/cards are touch-friendly (44px+)
- Press feedback appears within 100ms
- Works on iOS Safari and Android Chrome

---

### Phase 6: Navigation to Deck View

**Goal**: Allow users to click deck to view its cards

**Tasks**:
1. Create deck detail page at `/decks/[deckId]`
2. Add click handler to DeckCard (excluding edit/delete buttons)
3. Implement navigation with deck ID
4. Add breadcrumb navigation back to dashboard
5. Show deck name in header
6. Display "No cards" empty state if deck is empty

**Deliverables**:
- `app/decks/[deckId]/page.tsx`
- Click handler in DeckCard
- Breadcrumb component
- Empty state for decks without cards

**Validation**:
- Clicking deck card navigates to deck detail page
- Clicking edit/delete does NOT navigate (event.stopPropagation)
- Back button returns to dashboard
- Deck name displays in header
- Empty state shows for decks with 0 cards

---

### Phase 7: Accessibility & Testing

**Goal**: Ensure full accessibility and comprehensive testing

**Tasks**:
1. Add ARIA labels to all buttons and cards
2. Implement keyboard navigation (Tab, Enter, ESC)
3. Add focus management (focus first input in modals)
4. Test with screen reader
5. Write E2E tests for complete CRUD flow
6. Test edge cases (concurrent updates, network errors)
7. Performance testing (dashboard with 100+ decks)

**Deliverables**:
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management in modals
- Complete E2E test suite
- Performance benchmarks
- Lighthouse accessibility score 90+

**Validation**:
- All CRUD operations accessible via keyboard
- Screen reader announces changes correctly
- Focus moves appropriately in modals
- All E2E tests pass
- Dashboard loads in < 1s with 100 decks

## Database Schema

```sql
-- decks table
CREATE TABLE decks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT deck_name_length CHECK (LENGTH(TRIM(name)) >= 1 AND LENGTH(name) <= 100)
);

CREATE INDEX idx_decks_user_id ON decks(user_id);
CREATE INDEX idx_decks_created_at ON decks(created_at DESC);

-- Function to get card count for each deck
-- This will be used in JOIN queries
CREATE OR REPLACE FUNCTION get_deck_card_count(deck_id INTEGER)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM cards WHERE deck_id = $1;
$$ LANGUAGE SQL STABLE;
```

## API Contracts

### Get All Decks

```typescript
// Server Component (app/(dashboard)/dashboard/page.tsx)
async function getDecks(userId: number): Promise<DeckWithCount[]>
// Returns: Array of { id, name, cardCount, createdAt, updatedAt }
```

---

### Create Deck Action

```typescript
// app/actions/decks.ts
export async function createDeck(formData: FormData): Promise<ActionResult> {
  // Input: name (string)
  // Returns: { success: true, deck: Deck } | { success: false, error: string }
}
```

**Validation Rules**:
- Name: 1-100 characters, cannot be only whitespace

**Error Responses**:
- `"Deck name cannot be empty"`
- `"Deck name must be 100 characters or less"`

---

### Update Deck Action

```typescript
// app/actions/decks.ts
export async function updateDeck(deckId: number, formData: FormData): Promise<ActionResult> {
  // Input: deckId, name
  // Returns: { success: true, deck: Deck } | { success: false, error: string }
}
```

**Validation Rules**: Same as create

**Error Responses**:
- Same as create
- `"Deck not found"`
- `"Unauthorized"` (if user doesn't own deck)

---

### Delete Deck Action

```typescript
// app/actions/decks.ts
export async function deleteDeck(deckId: number): Promise<ActionResult> {
  // Input: deckId
  // Returns: { success: true } | { success: false, error: string }
  // Side effect: Cascades delete to all cards in deck
}
```

**Error Responses**:
- `"Deck not found"`
- `"Unauthorized"`

## Component Hierarchy

```
DashboardPage
├── DeckGrid
│   ├── DeckCard (multiple)
│   │   ├── DeckStats (card count badge)
│   │   ├── Edit button → opens EditDeckModal
│   │   └── Delete button → opens DeleteDeckDialog
│   └── EmptyState (if no decks)
├── FAB (mobile only) → opens CreateDeckModal
└── Button (desktop) → opens CreateDeckModal

Modals (portals):
├── CreateDeckModal
│   └── DeckForm
├── EditDeckModal
│   └── DeckForm
└── DeleteDeckDialog
    └── Confirmation message with card count
```

## Responsive Grid Implementation

```css
/* Mobile-first grid */
.deck-grid {
  display: grid;
  grid-template-columns: 1fr; /* 1 column on mobile */
  gap: 16px;
  padding: 16px;
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .deck-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columns */
    gap: 24px;
    padding: 24px;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .deck-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 columns */
    gap: 32px;
    padding: 32px;
    max-width: 1440px;
    margin: 0 auto;
  }
}

/* Deck card */
.deck-card {
  min-height: 120px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 300ms ease-in-out;
}

.deck-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Touch targets: minimum 44x44px */
.deck-card button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}
```

## Material Design Specifications

### Deck Card Component

- **Elevation**: 2dp default, 4dp on hover/focus
- **Border Radius**: 8px
- **Padding**: 16px
- **Typography**:
  - Deck name: H3 (24px), medium weight
  - Card count: Body (16px), secondary color
- **Actions**: Icon buttons (edit, delete) at top-right corner

### FAB (Floating Action Button)

- **Size**: 56x56px
- **Position**: Fixed bottom-right, 16px from edges
- **Elevation**: 6dp default, 12dp on press
- **Icon**: + icon (add/create)
- **Color**: Primary color
- **Only visible on mobile** (<768px)

### Modals/Dialogs

- **Width**: 90% on mobile (max 400px), 500px on desktop
- **Backdrop**: Semi-transparent black (rgba(0,0,0,0.5))
- **Elevation**: 24dp
- **Border Radius**: 8px
- **Animation**: Fade in + scale up (250ms ease-out)

## Optimistic Updates Implementation

```typescript
// Example: Create deck with optimistic update
'use client'

export function DashboardPage() {
  const [decks, setDecks] = useState<Deck[]>(initialDecks)
  
  async function handleCreateDeck(formData: FormData) {
    const name = formData.get('name') as string
    const tempId = `temp-${Date.now()}`
    
    // Optimistic update
    const optimisticDeck = {
      id: tempId,
      name,
      cardCount: 0,
      createdAt: new Date(),
    }
    setDecks(prev => [optimisticDeck, ...prev])
    
    try {
      // Server action
      const result = await createDeck(formData)
      
      if (result.success) {
        // Replace temp deck with real deck from server
        setDecks(prev => prev.map(d => 
          d.id === tempId ? result.deck : d
        ))
      } else {
        // Revert optimistic update
        setDecks(prev => prev.filter(d => d.id !== tempId))
        showError(result.error)
      }
    } catch (error) {
      // Revert on error
      setDecks(prev => prev.filter(d => d.id !== tempId))
      showError('Failed to create deck')
    }
  }
  
  return <DeckGrid decks={decks} onCreateDeck={handleCreateDeck} />
}
```

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "zod": "^3.22.0",
    "@vercel/postgres": "^0.5.0",
    "framer-motion": "^10.0.0",
    "react-swipeable": "^7.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "jest": "^29.0.0",
    "playwright": "^1.40.0"
  }
}
```

## Performance Optimizations

1. **Database**: Index on user_id for fast deck queries, JOIN with card count
2. **Pagination**: Load 30 decks initially, infinite scroll for more
3. **Optimistic Updates**: Instant UI feedback without waiting for server
4. **CSS Grid**: Hardware-accelerated layout, smooth resizing
5. **Component Memoization**: React.memo for DeckCard to prevent unnecessary re-renders
6. **Image Optimization**: Use Next.js Image component if deck thumbnails added later

## Testing Strategy

1. **Unit Tests**:
   - DeckCard renders correctly with different props
   - DeckGrid calculates columns correctly for different widths
   - Validation schemas work correctly

2. **Integration Tests**:
   - Create deck action creates in database
   - Update deck action updates in database
   - Delete deck cascades to cards

3. **E2E Tests**:
   - Complete CRUD flow: create → edit → delete
   - Empty state → create first deck
   - Navigate to deck detail from grid
   - Mobile viewport testing

## Deployment Checklist

- [ ] Database migrations run (create decks table)
- [ ] Test deck creation/editing on production
- [ ] Verify cascade delete works (decks → cards)
- [ ] Test responsive grid on real mobile devices
- [ ] Verify swipe gestures work on mobile
- [ ] Check performance with 100+ decks
- [ ] Lighthouse score 90+ (performance, accessibility)
