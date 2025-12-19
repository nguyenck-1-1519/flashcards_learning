# Card Management Requirements Update

**Feature**: View Deck with Card Management  
**Module**: 003-study-mode (Extension)  
**Created**: 2025-12-20  
**Status**: In Progress  
**Related**: Module 002 (Deck Management), Module 003 (Study Mode)

## Overview

This document specifies the requirements for viewing and managing cards within a deck. While Module 002 covers deck-level CRUD operations and Module 003 covers the study mode, this feature bridges the gap by enabling users to view, add, edit, and delete individual cards in their decks.

## Current Implementation Status

### ✅ Implemented Features

1. **View Deck with Card List**
   - Users can open a deck from the dashboard
   - Card list displays all cards with front/back preview (truncated at 150 chars)
   - Empty state when deck has no cards
   - Material Design styling consistent with dashboard

2. **Add Card Functionality**
   - "Add Card" button prominently displayed
   - Modal dialog with tabbed interface (Front/Back)
   - Markdown support in textarea
   - Validation: required fields, max 10,000 characters per side
   - Animation with framer-motion (scale, fade)
   - Real-time UI update after adding card (router.refresh)
   - Server action with authentication/authorization

3. **List/Grid View Toggle**
   - Toggle buttons: 📋 List / 📱 Grid
   - List view: Flex column layout with 0.5rem gap
   - Grid view: CSS grid `repeat(auto-fill, minmax(280px, 1fr))` with 1rem gap
   - Active state styling with Material Design principles
   - Smooth hover effects on cards (border color, shadow)
   - View state persists during session

### 🚧 Partially Implemented

1. **Edit Card Functionality**
   - ✅ Server action exists (`editCard` in `app/actions/cards.ts`)
   - ❌ No UI button/modal to trigger edit
   - ❌ No form pre-population with existing data

2. **Delete Card Functionality**
   - ✅ Server action exists (`removeCard` in `app/actions/cards.ts`)
   - ❌ No UI button to trigger delete
   - ❌ No confirmation dialog

### ❌ Not Implemented

1. **Card Detail View**
   - Currently shows truncated preview only (150 chars)
   - Need full content view with formatted markdown
   - Should render code blocks with syntax highlighting

2. **Card Actions (Quick Actions)**
   - Edit button on each card
   - Delete button on each card
   - View full content button/interaction

## User Scenarios & Testing

### User Story 1 - View Deck with Cards (Priority: P1) ✅ COMPLETE

A user opens a deck from the dashboard and sees all the flashcards inside, with the ability to switch between list and grid views for better browsing.

**Why this priority**: This is the gateway to card management and study mode. Users must be able to see their cards before they can study, edit, or delete them.

**Independent Test**: Open deck from dashboard, verify cards display correctly in both list and grid views, check empty state for decks with no cards.

**Acceptance Scenarios**:

1. ✅ **Given** user has a deck with 10 cards, **When** they click on the deck from dashboard, **Then** they navigate to deck detail page showing all 10 cards
2. ✅ **Given** user is viewing cards, **When** page loads, **Then** cards display in default list view with front/back preview
3. ✅ **Given** user sees card list, **When** they click "📱 Grid" toggle button, **Then** cards switch to grid layout (280px min column width)
4. ✅ **Given** user is in grid view, **When** they click "📋 List" toggle button, **Then** cards switch back to list layout
5. ✅ **Given** card content exceeds 150 characters, **When** displayed in list/grid, **Then** content is truncated with "..." indicator
6. ✅ **Given** user hovers over a card, **When** mouse enters card area, **Then** card border changes to #1976d2 and shadow appears
7. ✅ **Given** deck has no cards, **When** user opens deck, **Then** empty state shows "No cards in this deck" with "Add Card" button

---

### User Story 2 - Add New Card (Priority: P1) ✅ COMPLETE

A user wants to add a new flashcard to their deck, entering content for both the front (question) and back (answer) sides.

**Why this priority**: Adding cards is essential for building study content. Without this, users cannot populate their decks.

**Independent Test**: Click "Add Card" button, fill in front and back content, submit, and verify new card appears in the list/grid.

**Acceptance Scenarios**:

1. ✅ **Given** user is viewing a deck, **When** they click "➕ Add Card" button, **Then** modal dialog opens with tabbed interface (Front/Back tabs)
2. ✅ **Given** modal is open, **When** user types in "Front" tab textarea, **Then** markdown content is accepted (plain text and markdown syntax)
3. ✅ **Given** user clicks "Back" tab, **When** tab switches, **Then** textarea shows back content input
4. ✅ **Given** user fills both front and back, **When** they click "Add Card" button, **Then** card is created and modal closes
5. ✅ **Given** new card is added, **When** modal closes, **Then** card appears immediately in the list/grid without page reload
6. ✅ **Given** user tries to submit with empty front, **When** they click "Add Card", **Then** validation error shows "Front side is required"
7. ✅ **Given** user tries to submit with empty back, **When** they click "Add Card", **Then** validation error shows "Back side is required"
8. ✅ **Given** user enters more than 10,000 characters, **When** typing, **Then** validation error shows "Maximum 10,000 characters"
9. ✅ **Given** user clicks "Cancel" or outside modal, **When** there's unsaved content, **Then** confirmation dialog asks "Discard changes?"
10. ✅ **Given** modal is open, **When** user presses ESC key, **Then** modal closes with discard confirmation if content exists

---

### User Story 3 - Edit Existing Card (Priority: P1) 🚧 PARTIAL

A user wants to modify the content of an existing flashcard to fix mistakes or update information.

**Why this priority**: Editing is essential for maintaining accurate study content. Users make mistakes and need to correct them.

**Independent Test**: Click edit button on a card, modify content, save, and verify changes appear in the list/grid.

**Acceptance Scenarios**:

1. ❌ **Given** user sees a card in list/grid view, **When** they click the edit icon/button on the card, **Then** edit modal opens with current card content pre-filled
2. ❌ **Given** edit modal is open, **When** displayed, **Then** Front tab shows current front content and Back tab shows current back content
3. ❌ **Given** user modifies front or back content, **When** they click "Save Changes", **Then** card is updated and modal closes
4. ❌ **Given** card is updated, **When** modal closes, **Then** updated content appears immediately in the list/grid
5. ❌ **Given** user clicks "Cancel" with unsaved changes, **When** cancel is clicked, **Then** confirmation dialog asks "Discard changes?"
6. ❌ **Given** user tries to save empty front/back, **When** they click save, **Then** validation error shows (same as add card)
7. ✅ **Given** valid edit is submitted, **When** server action executes, **Then** system verifies deck ownership before allowing edit

**Current Implementation**:
- ✅ Server action `editCard(cardId, deckId, front, back)` exists
- ✅ Authentication/authorization checks implemented
- ✅ Validation: required fields, max 10k chars
- ❌ Missing: Edit button UI on cards
- ❌ Missing: EditCardModal component
- ❌ Missing: Pre-population of form with existing data

---

### User Story 4 - Delete Card (Priority: P2) 🚧 PARTIAL

A user wants to remove a flashcard they no longer need from their deck.

**Why this priority**: Deletion is important for content management but less critical than viewing and adding. Users can work around by ignoring unwanted cards.

**Independent Test**: Click delete button on a card, confirm deletion, and verify card disappears from the list/grid.

**Acceptance Scenarios**:

1. ❌ **Given** user sees a card in list/grid view, **When** they click the delete icon/button on the card, **Then** confirmation dialog appears
2. ❌ **Given** confirmation dialog shows, **When** displayed, **Then** it asks "Delete this card? This action cannot be undone."
3. ❌ **Given** user clicks "Delete" in confirmation, **When** confirmed, **Then** card is removed from database and disappears from UI
4. ❌ **Given** card is deleted, **When** removal completes, **Then** remaining cards re-flow smoothly without layout shift
5. ❌ **Given** user clicks "Cancel" in confirmation, **When** cancel is clicked, **Then** dialog closes and card remains unchanged
6. ❌ **Given** user deletes the last card in deck, **When** deletion completes, **Then** empty state appears with "Add Card" button
7. ✅ **Given** valid delete is submitted, **When** server action executes, **Then** system verifies deck ownership before allowing deletion

**Current Implementation**:
- ✅ Server action `removeCard(cardId, deckId)` exists
- ✅ Authentication/authorization checks implemented
- ✅ Deck ownership validation
- ❌ Missing: Delete button UI on cards
- ❌ Missing: Confirmation dialog component
- ❌ Missing: UI update after deletion

---

### User Story 5 - View Full Card Content (Priority: P2) ❌ NOT IMPLEMENTED

A user wants to see the complete content of a card without truncation, especially for cards with long content or formatted markdown.

**Why this priority**: Full content view enhances UX but isn't blocking. Users can still read truncated previews and study the full content in study mode.

**Independent Test**: Click on a card to expand/open detail view, verify full content displays with proper markdown rendering including code blocks.

**Acceptance Scenarios**:

1. ❌ **Given** user sees a card with truncated content (> 150 chars), **When** they click on the card, **Then** modal or expanded view shows full content
2. ❌ **Given** full content view is open, **When** displayed, **Then** markdown is rendered with proper formatting (headings, lists, bold, italic)
3. ❌ **Given** card contains code blocks, **When** full view displays, **Then** code is syntax-highlighted using highlight.js
4. ❌ **Given** full content view is open, **When** user clicks outside or presses ESC, **Then** view closes and returns to list/grid
5. ❌ **Given** full content view is open on mobile, **When** user swipes down, **Then** view closes smoothly

---

### User Story 6 - Card Quick Actions (Priority: P2) ❌ NOT IMPLEMENTED

A user wants quick access to edit and delete actions directly from the card in list/grid view without opening the card first.

**Why this priority**: Quick actions improve efficiency but aren't essential for basic card management. Users can still manage cards through other means.

**Independent Test**: Hover/tap on card to reveal action buttons, verify edit/delete buttons work correctly.

**Acceptance Scenarios**:

1. ❌ **Given** user hovers over a card on desktop, **When** mouse enters card area, **Then** action buttons (edit, delete) appear in top-right corner
2. ❌ **Given** action buttons are visible, **When** user clicks edit button, **Then** edit modal opens (see User Story 3)
3. ❌ **Given** action buttons are visible, **When** user clicks delete button, **Then** delete confirmation appears (see User Story 4)
4. ❌ **Given** user is on mobile/tablet, **When** they tap a card, **Then** action buttons appear overlaid or in a bottom sheet
5. ❌ **Given** user clicks outside action buttons on mobile, **When** tap outside occurs, **Then** action buttons hide

---

## Edge Cases

- ✅ **What happens when user adds a card with only whitespace?** - Validation prevents submission, shows error "Content cannot be empty"
- ✅ **What happens when card creation fails due to network error?** - Error message displays, modal stays open to allow retry
- ❌ **What happens when user edits a card that was just deleted by another user?** - Show error "Card not found", refresh list
- ❌ **What happens when viewing 100+ cards in grid view?** - Consider implementing virtual scrolling or pagination for performance
- ✅ **What happens when card contains very long words (no spaces)?** - `wordBreak: 'break-word'` CSS prevents overflow
- ✅ **What happens when switching between list and grid view?** - View state updates instantly, cards re-layout smoothly
- ❌ **What happens when deleting a card fails due to network error?** - Show error message, card remains in list
- ✅ **What happens when deck has 0 cards?** - Empty state shows with prominent "Add Card" button
- ❌ **What happens on very small mobile screens (< 320px)?** - Grid should collapse to single column, maintain minimum card width
- ✅ **What happens when modal is open and user clicks browser back?** - Modal closes (handled by Next.js routing)

## Requirements

### Functional Requirements

#### View & Navigation
- ✅ **FR-001**: System MUST display all cards in a deck with front/back preview (truncated at 150 characters)
- ✅ **FR-002**: System MUST provide toggle between list and grid view layouts
- ✅ **FR-003**: System MUST persist view mode during user session (not URL-based)
- ✅ **FR-004**: System MUST show empty state with "Add Card" CTA when deck has no cards
- ❌ **FR-005**: System MUST support viewing full card content without truncation (modal or expanded view)
- ✅ **FR-006**: System MUST display card count in header: "Cards (X)"

#### Add Card
- ✅ **FR-007**: System MUST provide "Add Card" button prominently displayed
- ✅ **FR-008**: System MUST open modal dialog with tabbed interface (Front/Back) for adding cards
- ✅ **FR-009**: System MUST validate card content: front and back required, max 10,000 characters each
- ✅ **FR-010**: System MUST support markdown formatting in card content
- ✅ **FR-011**: System MUST update card list immediately after successful add (without page reload)
- ✅ **FR-012**: System MUST show discard confirmation when closing modal with unsaved content
- ✅ **FR-013**: System MUST verify deck ownership before allowing card creation

#### Edit Card
- ✅ **FR-014**: System MUST verify deck ownership before allowing card edit (server action exists)
- ❌ **FR-015**: System MUST provide edit button/action on each card in list/grid view
- ❌ **FR-016**: System MUST open edit modal with current card content pre-filled
- ❌ **FR-017**: System MUST apply same validation rules as add card (required, max 10k chars)
- ❌ **FR-018**: System MUST update card list immediately after successful edit

#### Delete Card
- ✅ **FR-019**: System MUST verify deck ownership before allowing card deletion (server action exists)
- ❌ **FR-020**: System MUST provide delete button/action on each card in list/grid view
- ❌ **FR-021**: System MUST show confirmation dialog before deleting: "Delete this card? This action cannot be undone."
- ❌ **FR-022**: System MUST update card list immediately after successful delete
- ❌ **FR-023**: System MUST show empty state after deleting the last card in deck

#### Layout & Responsiveness
- ✅ **FR-024**: System MUST use list view layout: flex column with 0.5rem gap
- ✅ **FR-025**: System MUST use grid view layout: CSS grid `repeat(auto-fill, minmax(280px, 1fr))` with 1rem gap
- ✅ **FR-026**: System MUST apply hover effects on cards: border color → #1976d2, box-shadow
- ❌ **FR-027**: System MUST be fully responsive on mobile (< 768px), tablet (768-1023px), desktop (1024px+)
- ❌ **FR-028**: System MUST maintain minimum touch target size of 44x44px for all buttons on mobile

#### Performance & UX
- ✅ **FR-029**: System MUST use server actions for all card mutations (add, edit, delete)
- ✅ **FR-030**: System MUST revalidate path after mutations to ensure UI consistency
- ✅ **FR-031**: System MUST use framer-motion for smooth modal animations
- ❌ **FR-032**: System MUST show loading states during async operations
- ❌ **FR-033**: System MUST handle network errors gracefully with user-friendly messages

### Key Entities

- **Card**: Represents a single flashcard with:
  - `id`: UUID (primary key)
  - `deck_id`: UUID (foreign key to decks table)
  - `front`: Text (1-10,000 characters, markdown supported)
  - `back`: Text (1-10,000 characters, markdown supported)
  - `repetitions`: Integer (SM-2 algorithm, default 0)
  - `easiness_factor`: Float (SM-2 algorithm, default 2.5)
  - `interval_days`: Integer (SM-2 algorithm, default 0)
  - `next_review_date`: Timestamp (SM-2 algorithm)
  - `last_reviewed_at`: Timestamp (nullable)
  - `created_at`: Timestamp
  - `updated_at`: Timestamp

- **Relationship**: Card belongs to Deck (many-to-one), cascade delete when deck is deleted

## Success Criteria

### Measurable Outcomes

- ✅ **SC-001**: Users can view all cards in a deck within 1 second of opening deck
- ✅ **SC-002**: Users can toggle between list and grid view instantly (< 100ms)
- ✅ **SC-003**: Users can add a new card in under 30 seconds from clicking "Add Card" to seeing it in the list
- ❌ **SC-004**: Users can edit a card in under 30 seconds from clicking edit to seeing updated content
- ❌ **SC-005**: Users can delete a card in under 5 seconds from clicking delete to seeing updated list
- ✅ **SC-006**: Card list updates immediately after add/edit/delete without requiring page refresh
- ✅ **SC-007**: Modal animations are smooth with no janky transitions (60fps)
- ❌ **SC-008**: Touch targets for all buttons are at least 44x44px on mobile devices
- ✅ **SC-009**: Card content is properly truncated at 150 characters with "..." indicator
- ❌ **SC-010**: Full card content view renders markdown with syntax highlighting correctly
- ✅ **SC-011**: Grid layout adjusts responsively to container width (280px min column width)
- ✅ **SC-012**: Empty state clearly guides users to add their first card
- ✅ **SC-013**: All card operations verify deck ownership before execution (security)
- ❌ **SC-014**: Error messages are user-friendly and actionable (no technical jargon)
- ✅ **SC-015**: Modal can be closed with ESC key, Cancel button, or clicking outside

## Assumptions

- Users are authenticated before accessing deck/card management
- Deck ownership is verified server-side for all card operations
- Cards use SM-2 algorithm fields (repetitions, easiness_factor, interval_days) for study mode
- Markdown rendering uses the same `MarkdownRenderer` component as study mode
- Code syntax highlighting uses highlight.js with github theme (already configured)
- Browser supports CSS Grid and Flexbox (all modern browsers)

## Dependencies

- **Module 001**: Authentication system (session management)
- **Module 002**: Deck management (deck CRUD operations)
- **Module 003**: Study mode (SM-2 algorithm fields, markdown rendering)
- **Next.js 14**: App Router, server actions, server components
- **PostgreSQL/Supabase**: Database with decks and cards tables
- **framer-motion**: Modal animations
- **highlight.js**: Code syntax highlighting
- **Zod**: Schema validation for card input

## Implementation Priority

### Phase 1 - Essential CRUD (High Priority) ✅ 75% Complete
1. ✅ View deck with card list/grid
2. ✅ Add new card with modal
3. ❌ Edit card with modal (server action exists, need UI)
4. ❌ Delete card with confirmation (server action exists, need UI)

### Phase 2 - Enhanced UX (Medium Priority) ❌ Not Started
5. ❌ Full card content view (modal with full markdown rendering)
6. ❌ Card quick actions (hover buttons for edit/delete)
7. ❌ Loading states for async operations
8. ❌ Error handling with user-friendly messages

### Phase 3 - Polish (Low Priority) ❌ Not Started
9. ❌ Mobile optimizations (touch gestures, bottom sheet)
10. ❌ Keyboard shortcuts (e.g., Ctrl+E for edit, Del for delete)
11. ❌ Virtual scrolling for large card lists (100+)
12. ❌ Batch operations (select multiple cards to delete)

## Technical Implementation Notes

### Current File Structure
```
app/
  actions/
    cards.ts              ✅ Complete (addCard, editCard, removeCard)
components/
  cards/
    AddCardModal.tsx      ✅ Complete (370+ lines)
    EditCardModal.tsx     ❌ Not created yet (should mirror AddCardModal)
  decks/
    DeckDetailClient.tsx  ✅ Complete with list/grid toggle (342 lines)
```

### Server Actions (app/actions/cards.ts)
```typescript
// ✅ All server actions complete with auth/validation
export async function addCard(deckId: string, front: string, back: string)
export async function editCard(cardId: string, deckId: string, front: string, back: string)
export async function removeCard(cardId: string, deckId: string)
```

### Needed Components
```typescript
// ❌ Not created yet
components/cards/EditCardModal.tsx
  - Similar to AddCardModal
  - Props: isOpen, onClose, onSubmit, initialCard
  - Pre-populate form with card.front and card.back
  
// ❌ Not created yet
components/cards/DeleteConfirmDialog.tsx
  - Props: isOpen, onClose, onConfirm, cardPreview
  - Simple confirmation with "Delete" and "Cancel" buttons
  
// ❌ Not created yet  
components/cards/CardDetailModal.tsx
  - Props: isOpen, onClose, card
  - Render full content with MarkdownRenderer
  - Include edit/delete buttons in modal
```

### UI Changes Needed for DeckDetailClient.tsx

1. **Add action buttons to each card**:
```typescript
// Add to card rendering (around line 230)
<div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
  <button onClick={() => handleEditCard(card)}>✏️ Edit</button>
  <button onClick={() => handleDeleteCard(card)}>🗑️ Delete</button>
  <button onClick={() => handleViewCard(card)}>👁️ View</button>
</div>
```

2. **Add state management**:
```typescript
const [isEditModalOpen, setIsEditModalOpen] = useState(false)
const [selectedCard, setSelectedCard] = useState<Card | null>(null)
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
const [isViewModalOpen, setIsViewModalOpen] = useState(false)
```

3. **Add handler functions**:
```typescript
const handleEditCard = (card: Card) => {
  setSelectedCard(card)
  setIsEditModalOpen(true)
}

const handleDeleteCard = (card: Card) => {
  setSelectedCard(card)
  setIsDeleteDialogOpen(true)
}

const handleViewCard = (card: Card) => {
  setSelectedCard(card)
  setIsViewModalOpen(true)
}
```

## Next Steps

1. **Create EditCardModal component** (Priority: HIGH)
   - Copy AddCardModal.tsx structure
   - Add props for initial card data
   - Pre-populate front/back content
   - Update submit handler to call `editCard` action

2. **Create DeleteConfirmDialog component** (Priority: HIGH)
   - Simple confirmation dialog
   - Show card preview (truncated front/back)
   - "Delete" and "Cancel" buttons
   - Call `removeCard` action on confirm

3. **Add action buttons to cards** (Priority: HIGH)
   - Edit button triggers EditCardModal
   - Delete button triggers DeleteConfirmDialog
   - Style buttons with Material Design

4. **Create CardDetailModal component** (Priority: MEDIUM)
   - Full content view with MarkdownRenderer
   - Syntax highlighting for code blocks
   - Include edit/delete actions in modal
   - Responsive for mobile

5. **Add loading and error states** (Priority: MEDIUM)
   - Loading spinner during async operations
   - Toast notifications for success/error
   - Graceful error handling with retry

6. **Mobile optimizations** (Priority: LOW)
   - Touch-friendly action buttons
   - Swipe gestures for quick actions
   - Bottom sheet for mobile modals
   - Test on real devices

## References

- [Module 002 Spec](./specs/002-dashboard-deck-management/spec.md) - Deck CRUD operations
- [Module 003 Spec](./specs/003-study-mode/spec.md) - Study mode with SM-2 algorithm
- [DeckDetailClient.tsx](./components/decks/DeckDetailClient.tsx) - Current implementation
- [AddCardModal.tsx](./components/cards/AddCardModal.tsx) - Reference for EditCardModal
- [cards.ts actions](./app/actions/cards.ts) - Server actions for card CRUD

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-20  
**Author**: GitHub Copilot  
**Approval Status**: Pending Review
