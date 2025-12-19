# Feature Specification: Study Mode with Spaced Repetition

**Feature Branch**: `003-study-mode`  
**Created**: 2025-12-17  
**Status**: Draft  
**Input**: Spaced Repetition SM-2 algorithm with card flip interaction and difficulty rating (Again/Hard/Good/Easy)

## User Scenarios & Testing

### User Story 1 - Start Study Session (Priority: P1)

A user opens a deck and starts a study session to review their flashcards. The system randomly selects up to 10 cards for the session to keep study sessions focused and manageable.

**Why this priority**: Starting a study session is the core purpose of the application. Without this, users cannot actually study their flashcards.

**Independent Test**: Can be fully tested by opening a deck with cards, clicking "Study", and verifying the first card's front side is displayed.

**Acceptance Scenarios**:

1. **Given** user opens a deck with 20 cards, **When** they click "Study" button, **Then** study mode begins with a randomly selected session of maximum 10 cards, showing the front side of the first card
2. **Given** deck has more than 10 cards, **When** study session starts, **Then** system randomly selects 10 cards from available cards
3. **Given** deck has 10 or fewer cards, **When** study session starts, **Then** system includes all available cards in the session
4. **Given** deck has no cards, **When** user tries to start study, **Then** system shows message "No cards available. Add cards to start studying." with "Add Card" button
5. **Given** study session starts, **When** first card appears, **Then** only the card front is visible and rating buttons are hidden

---

### User Story 2 - Flip Card to See Answer (Priority: P1)

While studying, a user views the front of a flashcard (question/prompt) and clicks on the card to flip it and reveal the back (answer) to test their memory.

**Why this priority**: Card flipping is the fundamental interaction in flashcard study. This must work reliably for any study to occur.

**Independent Test**: Can be tested by starting a study session, viewing the front of a card, clicking the card, and verifying the back of the card is displayed with rating buttons.

**Acceptance Scenarios**:

1. **Given** user sees card front, **When** they click anywhere on the card, **Then** card animates with flip effect to show back side and rating buttons (Again/Hard/Good/Easy) appear below
2. **Given** card is flipped to back, **When** animation completes, **Then** front side is hidden, back side is visible with answer content and markdown rendered correctly
3. **Given** user sees card back with rating buttons, **When** displayed, **Then** they can evaluate their memory and select appropriate rating
4. **Given** flip animation is in progress, **When** user tries to interact, **Then** system prevents additional clicks until animation completes

---

### User Story 3 - Rate Card and Navigate Session (Priority: P1)

After viewing the answer, a user rates how well they remembered the card by selecting Again (didn't remember), Hard (barely remembered), Good (remembered), or Easy (remembered easily). They then use the Next button to proceed to the next card.

**Why this priority**: Difficulty rating is essential for the spaced repetition algorithm to work. Without ratings, the app cannot schedule cards effectively.

**Independent Test**: Can be tested by flipping a card, selecting a rating, clicking Next, and verifying the card is scheduled according to SM-2 algorithm and next card appears.

**Acceptance Scenarios**:

1. **Given** user sees card back with rating buttons, **When** they click any rating (Again/Hard/Good/Easy), **Then** the rating is recorded and "Next" button becomes enabled at the bottom
2. **Given** user has selected a rating, **When** they click "Next" button, **Then** card's review schedule is updated using SM-2 algorithm and next card front is displayed
3. **Given** user is on first card, **When** they rate and click Next, **Then** second card appears showing its front side (not flipped)
4. **Given** user rates a card, **When** Next is clicked, **Then** card's last_reviewed timestamp is updated and next_review date is calculated
5. **Given** user is on mobile, **When** rating buttons appear, **Then** they are large enough (44x44px minimum) and clearly labeled with colors (Again=red, Hard=orange, Good=green, Easy=blue)
6. **Given** user has not selected a rating yet, **When** viewing card back, **Then** Next button is disabled (grayed out)

---

### User Story 4 - Complete Study Session (Priority: P2)

After reviewing all cards in the session (up to 10 cards), the user clicks a "Complete" button on the last card to finish the session and see their performance summary.

**Why this priority**: Session completion provides closure and feedback but is less critical than the core study flow. Users can still learn without detailed statistics.

**Independent Test**: Can be tested by completing a full study session of cards, clicking Complete on the last card, and verifying the summary screen appears with correct statistics.

**Acceptance Scenarios**:

1. **Given** user is on the last card of the session, **When** they select a rating, **Then** "Complete" button appears instead of "Next" button
2. **Given** user clicks "Complete" button, **When** clicked, **Then** all rated cards are saved with their SM-2 schedules and session summary screen appears
3. **Given** session summary appears, **When** displayed, **Then** it shows total cards studied (max 10), breakdown by rating (X Again, Y Hard, Z Good, W Easy), and total study time
4. **Given** session is complete, **When** user views summary, **Then** they see "Return to Deck" button to navigate back to deck detail page
5. **Given** session is complete, **When** summary shows, **Then** congratulatory message appears "Great work! You've reviewed [X] cards."

---

### User Story 5 - Progress Tracking During Session (Priority: P2)
10") to know how many cards remain.

**Why this priority**: Progress indicators help with motivation and time management but aren't essential for the learning itself.

**Independent Test**: Can be tested by starting a session and verifying the progress indicator updates correctly as cards are reviewed.

**Acceptance Scenarios**:

1. **Given** user is in a study session with 10 cards, **When** viewing any card, **Then** progress indicator shows "Card [current] of 10" at the top
2. **Given** user clicks Next to advance, **When** next card appears, **Then** progress counter increments (e.g., from "Card 5 of 10" to "Card 6 of 10")
3. **Given** user is viewing first card, **When** display updates, **Then** progress shows "Card 1 of [total]"
4. **Given** session has fewer than 10 cards (e.g., 7 cards), **When** progress displays, **Then** it shows accurate total (e.g., "Card 3 of 7")
5. **Given** user is viewing first card, **When** display updates, **Then** progress shows "Card 1 of [total]"
4. **Given** progress indicator is displayed, **When** on mobile, **Then** it's clearly visible but doesn't obstruct card content

---

### User Story 6 - Exit Study Session Early (Priority: P3) in the current session, preserving their progress so far.

**Why this priority**: Useful for flexibility but not critical. Users can complete their session in one go most of the time.

**Independent Test**: Can be tested by starting a session, reviewing some cards, clicking exit, and verifying progress is saved and user returns to deck detail.

**Acceptance Scenarios**:

1. **Given** user is in a study session, **When** they click "Exit" button in the header, **Then** confirmation dialog appears "Exit study? Your progress will be saved."
2. **Given** user confirms exit, **When** they leave study mode, **Then** reviewed cards (those that were rated) are updated with new SM-2 schedules and user returns to deck detail page
3. **Given** user exits after reviewing 5 of 10 cards, **When** they start a new study session later, **Then** system randomly selects a new set of up to 10 cards (may include some previously unreviewed cards)ved."
2. **Given** user confirms exit, **When** they leave study mode, **Then** reviewed cards are updated with new schedules and unreviewed cards remain due
3. **Given** user exits mid-session, **When** they start a new session later, **Then** they begin with remaining due cards, not cards already reviewed

---

### Edge Cases
clicks card multiple times rapidly during flip? (Prevent double-flip with animation lock)
- What happens when user tries to select rating before card is flipped? (Rating buttons only appear after flip animation completes)
- What happens when card content is very long and doesn't fit on screen? (Make card area scrollable while keeping rating buttons and Next/Complete button visible)
- What happens when user accidentally clicks wrong rating button? (No undo in v1, rating is recorded and user must click Next to proceed)
- What happens when user clicks Next before selecting a rating? (Next button remains disabled until a rating is selected)
- What happens when markdown on card fails to render? (Show error message "Error rendering card content" with raw text fallback)
- What happens on very small screens when rating buttons don't fit? (Stack buttons vertically maintaining 44px minimum height)
- What happens when deck has only 1 card? (Session proceeds normally with "Card 1 of 1", Complete button appears after rating)
- What happens when user starts multiple study sessions in quick succession? (Each session is independent with random card selection up to 10 cards)
- What happens when user navigates away during study session without clicking Exit? (Progress autosaves for rated cards when page unloadsck)
- What happens on very small screens when rating buttons don't fit? (Stack buttons vertically maintaining 44px minimum height)

## Requirements

### Functional Requirements
randomly select maximum 10 cards when user starts study session
- **FR-002**: System MUST select all available cards if deck has 10 or fewer cards
- **FR-003**: System MUST display card front side when study session begins
- **FR-004**: System MUST hide card back side until user clicks on the card
- **FR-005**: System MUST flip card to show back side when user clicks anywhere on card area
- **FR-006**: System MUST animate card flip transition (180-degree rotation, 300ms duration)
- **FR-007**: System MUST render markdown content on both card front and back
- **FR-008**: System MUST display rating buttons (Again/Hard/Good/Easy) only after card is flipped to back side
- **FR-009**: System MUST display "Next" button below rating buttons after user selects a rating
- **FR-010**: System MUST keep Next button disabled (grayed out) until user selects a rating
- **FR-011**: System MUST display "Complete" button instead of "Next" button on the last card of session
- **FR-015**: System MUST implement SM-2 algorithm for scheduling card reviews based on user ratings
- **FR-016**: System MUST initialize new cards with: ease factor = 2.5, interval = 0, repetitions = 0
- **FR-017**: System MUST calculate next review date based on rating and current card state
- **FR-018**: System MUST use following intervals for "Again" rating: interval = 0, repetitions = 0, ease factor reduced by 0.2 (minimum 1.3)
- **FR-019**: System MUST use following formula for "Hard" rating: interval = previous interval * 1.2, ease factor reduced by 0.15
- **FR-020**: System MUST use following formula for "Good" rating: interval = previous interval * ease factor, ease factor unchanged
- **FR-021**: System MUST use following formula for "Easy" rating: interval = previous interval * ease factor * 1.3, ease factor increased by 0.15
- **FR-022**: System MUST set minimum interval to 1 day for all ratings
- **FR-023**: System MUST update card's last_reviewed timestamp when Next or Complete button is clicked
- **FR-024**: System MUST update card's next_review date based on calculated interval when card is saved
- **FR-025**: System MUST store ease factor with each card (range: 1.3 to 3.0)
- **FR-026**: System MUST store repetition count with each card (increments on successful reviews)
- **FR-027**: System MUST apply SM-2 algorithm calculations when user clicks Next or Complete (not immediately on rating selection
- **FR-011**: System MUST use following intervals for "Again" rating: interval = 0, repetitions = 0, ease factor reduced by 0.2 (minimum 1.3)
- **FR-012**: System MUST use following formula for "Hard" rating: interval = previous interval * 1.2, ease factor reduced by 0.15
- **FR-018**: System MUST limit study session to maximum 10 randomly selected cards
- **FR-029**: System MUST randomize card selection for each new study session
- **FR-030**: System MUST track progress: current card number and total cards in session (e.g., "Card 5 of 10")
- **FR-031**: System MUST update progress indicator when user advances to next card
- **FR-032**: System MUST display session summary when user clicks Complete button on last card
- **FR-033**: System MUST calculate and display session statistics: total cards studied, rating breakdown (Again/Hard/Good/Easy counts), study duration
- **FR-034**: System MUST provide "Return to Deck" button in session summary to navigate back to deck detail
- **FR-035**: System MUST allow user to exit session early via Exit button in header with confirmation dialog
- **FR-036**: System MUST save progress for all rated cards when user exits early (cards with ratings applied)
- **FR-037**: System MUST handle empty deck state: display "No cards available" message with "Add Card" button
- **FR-038**: System MUST autosave rated cards if user navigates away without proper exit (page unload event)
#### Ses39**: System MUST ensure rating buttons are minimum 44x44px touch targets on mobile
- **FR-040**: System MUST use color coding for rating buttons: Again (red), Hard (orange), Good (green), Easy (blue)
- **FR-041**: System MUST ensure Next and Complete buttons are clearly visible and accessible (44x44px minimum)
- **FR-042**: System MUST prevent card interaction during flip animation (lock click handlers)
- **FR-043**: System MUST make card content scrollable if it exceeds viewport height
- **FR-044**: System MUST maintain rating buttons and Next/Complete button visible at bottom even when scrolling card content
- **FR-045**: System MUST provide visual feedback when rating is selected (highlight selected rating)
- **FR-046**: System MUST provide visual distinction between enabled and disabled Next button state
- **FR-024**: System MUST calculate and display session statistics: total cards, rating breakdown, study duration
- **FR-025**: System MUST allow user to exit session early with confirmation
- **FR-026**: System MUST save progress when user exits early (reviewed cards scheduled, unreviewed cards remain due)
- **FR-027**: System MUST handle empty deck state: "No cards to study" message

#### Mobile & Accessibility

- **FR-028**: System MUST ensure rating buttons are minimum 44x44px touch targets on mobile
- **FR-029**: System MUST use color coding for rating buttons: Again (red), Hard (orange), Good (green), Easy (blue)
- **FR-030**: System MUST support keyboard shortcuts: spacebar to flip, 1/2/3/4 for ratings
- **FR-031**: System MUST prevent interaction during flip animation (disable buttons)
- **FR-032**: System MUST make card content scrollable if it exceeds viewport height
- **FR-033**: System MUST maintain rating buttons visible at bottom even when scrolling card content

### Key Entities

- **Card**: Contains front text (markdown), back text (markdown), deck ID reference, ease factor (float, default 2.5), interval (integer, days), repetitions (integer, default 0), last_reviewed (timestamp), next_review (timestamp)
- **StudySession**: Temporary session state containing card queue, current card index, session start time, ratings given (Again/Hard/Good/Easy counts)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can complete a flip-and-rate cycle in under 5 seconds per card
- **SC-002**: Card flip animation completes smoothly within 300ms without lag on mobile devices
- **SC-003**: Spaced repetition algorithm schedules 90% of cards appropriately (users don't see same cards too frequently)
- **SC-004**: Users can study on screens from 320px to 1920px width with fully functional interface
- **SC-005**: Rating buttons are accessible and responsive with <100ms tap response time on mobile
- **SC-006**: Markdown rendering displays correctly for 95% of common markdown syntax (headers, lists, code blocks, bold, italic, links)
- **SC-007**: Study sessions work offline with sync happening when connection is restored
- **SC-008**: Progress indicator updates instantly (within 50ms) after each card rating
- **SC-009**: Session summary accurately reflects all ratings given during session
- **SC-010**: Users can navigate entire study flow using only keyboard (accessibility)
- **SC-011**: 85% of users can understand and use difficulty ratings without additional instructions

## Assumptions

- Users understand basic flashcard study methodology (see question, try to remember, check answer)
- SM-2 algorithm default parameters (ease factor 2.5, etc.) are appropriate for most learning content
- Study sessions are typically 5-30 minutes (10-50 cards)
- Users will rate cards honestly based on their actual recall
- Card content is primarily text-based markdown (images may be added in future)
- Users study one deck at a time (no multi-deck sessions in v1)

## Out of Scope

- Custom algorithm parameters or alternative spaced repetition algorithms (future version)
- Undo rating functionality (future version)
- Study session pause/resume (future version)
- Audio playback for cards (future version)
- Image occlusion or cloze deletion (future version)
- Study statistics and analytics dashboard (future version)
- Multi-deck study sessions (future version)
- Study reminders or notifications (future version)
- Gamification elements (streaks, points, achievements) (future version)

## Technical References

### SM-2 Algorithm Implementation

**Formula for interval calculation:**
- If rating = Again: interval = 0, repetitions = 0
- If rating = Hard: interval = previous_interval * 1.2
- If rating = Good: interval = previous_interval * ease_factor
- If rating = Easy: interval = previous_interval * ease_factor * 1.3

**Ease factor adjustment:**
- Again: ease_factor = max(1.3, ease_factor - 0.2)
- Hard: ease_factor = max(1.3, ease_factor - 0.15)
- Good: ease_factor unchanged
- Easy: ease_factor = min(3.0, ease_factor + 0.15)

**Initial values for new cards:**
- ease_factor = 2.5
- interval = 0 days
- repetitions = 0
- next_review = immediately available

**After first successful review (Good/Easy):**
- interval = 1 day minimum
- After second successful review: interval = 6 days (approximately)
- Subsequent intervals grow based on ease factor

## UI/UX Requirements

### Material Design Implementation

- Use Material Design card component for flashcard display
- Implement Material Design flip animation (rotate on Y-axis)
- Use Material Design buttons for rating actions with appropriate colors
- Progress indicator follows Material Design linear progress component
- Session summary uses Material Design dialog/sheet component
- Implement Material Design elevation for card (8dp when focused)

### Mobile-First Considerations

- Card content must be legible on smallest supported screen (320px)
- Flip action must work with single tap anywhere on card area
- Rating buttons must be positioned at bottom (thumb-reachable zone)
- Swipe gestures: swipe up to flip, swipe left for "Again", swipe right for "Good" (optional enhancement)
- Haptic feedback on button press and card flip (if device supports)
- Prevent accidental exits with confirmation dialog
- Large, clear typography for card content (minimum 16px font size)
- High contrast between card content and background for readability

### Markdown Rendering Specifications

- Support CommonMark standard markdown syntax
- Syntax highlighting for code blocks (using Prism.js or Highlight.js)
- Responsive images (max-width: 100%)
- Properly styled tables with horizontal scroll on mobile if needed
- Support for LaTeX/mathematical notation (using KaTeX, future enhancement)
- Links should be clearly distinguishable and tappable (44px touch target)
