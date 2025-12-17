# Tasks: Unified UI Theme & Material Design

**Input**: Design documents from `/specs/004-ui-theme/`
**Prerequisites**: plan.md, spec.md

**Tests**: TDD approach - visual regression tests, accessibility tests, responsive tests all written FIRST

**Organization**: Tasks grouped by component type and design system elements

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- No user story labels (this is foundational infrastructure used by all features)
- All paths are absolute from project root

## Phase 1: Setup (Design System Foundation)

**Purpose**: Establish design tokens and tooling

- [ ] T001 Install dependencies (Storybook, Chromatic for visual regression, axe-core for accessibility testing)
- [ ] T002 Setup Storybook configuration for Next.js
- [ ] T003 [P] Create design tokens documentation structure
- [ ] T004 [P] Setup visual regression testing with Chromatic

---

## Phase 2: Design Tokens (Blocking Prerequisites)

**Purpose**: Define all design tokens - MUST complete before any component work

**⚠️ CRITICAL**: All components depend on these design tokens

### Tests - Write FIRST, verify they FAIL

- [ ] T005 [P] Write test for color contrast meeting WCAG AA (4.5:1) in tests/accessibility/wcag.test.ts
- [ ] T006 [P] Write test for CSS variables being defined in tests/unit/theme/variables.test.ts
- [ ] T007 [P] Write test for typography scale consistency in tests/unit/theme/typography.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T008 Define color palette in styles/theme/variables.css (primary, secondary, semantic, neutral)
- [ ] T009 Verify all color combinations meet WCAG AA contrast (4.5:1 normal, 3:1 large text)
- [ ] T010 Define typography scale in styles/theme/typography.css (H1-H4, body, small, caption)
- [ ] T011 Set system font stack (no custom fonts for performance)
- [ ] T012 Define spacing scale in variables.css (4px base, multiples up to 64px)
- [ ] T013 Define elevation levels (shadows) for 0dp, 2dp, 4dp, 8dp, 16dp, 24dp
- [ ] T014 Define border radius tokens (4px, 8px, 16px, full)
- [ ] T015 Define transition durations (fast: 150ms, medium: 300ms, slow: 500ms)
- [ ] T016 Define z-index layers (dropdown, modal, tooltip, toast)
- [ ] T017 Define responsive breakpoints (320px, 768px, 1024px, 1440px)
- [ ] T018 Document all design tokens in Storybook

**Verify**: Run tests from T005-T007, all should PASS (green state)

**Checkpoint**: Design tokens defined and verified

---

## Phase 3: Base Styles & CSS Reset

**Purpose**: Global styles and browser normalization

### Tests - Write FIRST, verify they FAIL

- [ ] T019 [P] Write test for focus indicators being visible in tests/accessibility/focus.test.ts
- [ ] T020 [P] Write test for box-sizing: border-box applied globally in tests/unit/styles/globals.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T021 Create CSS reset in styles/globals.css (normalize browser defaults)
- [ ] T022 Apply typography tokens to base HTML elements (h1-h6, p, etc.)
- [ ] T023 Set up rem-based responsive font sizing
- [ ] T024 Define visible focus outline styles (2px solid primary color, 2px offset)
- [ ] T025 Apply box-sizing: border-box globally
- [ ] T026 Set up smooth scrolling behavior
- [ ] T027 Apply theme CSS variables globally
- [ ] T028 Test rendering consistency across browsers (Chrome, Firefox, Safari, Edge)

**Verify**: Run tests from T019-T020, all should PASS (green state)

**Checkpoint**: Base styles applied and consistent

---

## Phase 4: Button Component (Material Design)

**Purpose**: Foundational interactive component

### Tests - Write FIRST, verify they FAIL

- [ ] T029 [P] Write component test for Button variants in tests/unit/components/Button.test.tsx
- [ ] T030 [P] Write test for Button touch targets (44px minimum) in tests/unit/components/Button.test.tsx
- [ ] T031 [P] Write visual regression test for Button in tests/visual/button.spec.ts
- [ ] T032 [P] Write accessibility test for Button (keyboard, ARIA) in tests/accessibility/button.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T033 Create Button component in components/ui/Button/Button.tsx
- [ ] T034 Implement button variants (contained, outlined, text)
- [ ] T035 Implement button sizes (small, medium, large)
- [ ] T036 Implement color variants (primary, secondary, error)
- [ ] T037 Add hover, focus, active, disabled states
- [ ] T038 Ensure minimum 44x44px touch target on mobile
- [ ] T039 Add ripple effect on click/press
- [ ] T040 Style with Material Design elevation
- [ ] T041 Create Storybook stories for Button
- [ ] T042 Add ARIA attributes and keyboard support

**Verify**: Run tests from T029-T032, all should PASS (green state)

**Checkpoint**: Button component complete and tested

---

## Phase 5: Card Component (Material Design)

**Purpose**: Container component for content

### Tests - Write FIRST, verify they FAIL

- [ ] T043 [P] Write component test for Card rendering in tests/unit/components/Card.test.tsx
- [ ] T044 [P] Write visual regression test for Card in tests/visual/card.spec.ts
- [ ] T045 [P] Write test for Card elevation states in tests/unit/components/Card.test.tsx

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T046 Create Card component in components/ui/Card/Card.tsx
- [ ] T047 Apply Material Design elevation (2dp default)
- [ ] T048 Add hover state with elevation change (4dp on hover)
- [ ] T049 Apply border-radius (8px)
- [ ] T050 Add consistent padding (16px)
- [ ] T051 Support clickable variant (cursor pointer, hover effects)
- [ ] T052 Create Storybook stories for Card

**Verify**: Run tests from T043-T045, all should PASS (green state)

**Checkpoint**: Card component complete

---

## Phase 6: Input Component (Material Design)

**Purpose**: Form input component

### Tests - Write FIRST, verify they FAIL

- [ ] T053 [P] Write component test for Input validation states in tests/unit/components/Input.test.tsx
- [ ] T054 [P] Write test for Input touch target (48px height on mobile) in tests/unit/components/Input.test.tsx
- [ ] T055 [P] Write accessibility test for Input (labels, error messages) in tests/accessibility/input.test.ts
- [ ] T056 [P] Write visual regression test for Input in tests/visual/input.spec.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T057 Create Input component in components/ui/Input/Input.tsx
- [ ] T058 Implement text input variant
- [ ] T059 Implement textarea variant
- [ ] T060 Add validation states (default, error, success, disabled)
- [ ] T061 Ensure 48px height on mobile (44px + padding for touch target)
- [ ] T062 Style with Material Design outlined style
- [ ] T063 Add floating label support
- [ ] T064 Add clear focus indicator (2px border primary color)
- [ ] T065 Support type="email" with email keyboard on mobile
- [ ] T066 Create Storybook stories for Input
- [ ] T067 Add ARIA labels and error message association

**Verify**: Run tests from T053-T056, all should PASS (green state)

**Checkpoint**: Input component complete and accessible

---

## Phase 7: Modal Component (Material Design)

**Purpose**: Dialog/modal component

### Tests - Write FIRST, verify they FAIL

- [ ] T068 [P] Write component test for Modal open/close in tests/unit/components/Modal.test.tsx
- [ ] T069 [P] Write test for Modal focus trap in tests/accessibility/modal.test.ts
- [ ] T070 [P] Write test for Modal ESC key closing in tests/unit/components/Modal.test.tsx
- [ ] T071 [P] Write visual regression test for Modal in tests/visual/modal.spec.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T072 Create Modal component in components/ui/Modal/Modal.tsx
- [ ] T073 Implement backdrop overlay (semi-transparent black)
- [ ] T074 Add Material Design elevation (24dp)
- [ ] T075 Apply border-radius (8px)
- [ ] T076 Implement focus trap (Tab navigation stays within modal)
- [ ] T077 Support ESC key to close
- [ ] T078 Add open/close animations (fade + scale, 250ms)
- [ ] T079 Prevent body scroll when modal is open
- [ ] T080 Support responsive width (90% on mobile max 400px, 500px on desktop)
- [ ] T081 Create Storybook stories for Modal
- [ ] T082 Add ARIA attributes (role="dialog", aria-modal="true")

**Verify**: Run tests from T068-T071, all should PASS (green state)

**Checkpoint**: Modal component complete with accessibility

---

## Phase 8: FAB Component (Mobile-Specific)

**Purpose**: Floating Action Button for mobile

### Tests - Write FIRST, verify they FAIL

- [ ] T083 [P] Write component test for FAB visibility on mobile only in tests/unit/components/FAB.test.tsx
- [ ] T084 [P] Write test for FAB positioning (bottom-right) in tests/unit/components/FAB.test.tsx
- [ ] T085 [P] Write visual regression test for FAB in tests/visual/fab.spec.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T086 Create FAB component in components/ui/FAB/FAB.tsx
- [ ] T087 Size: 56x56px (Material Design spec)
- [ ] T088 Position: fixed bottom-right, 16px from edges
- [ ] T089 Apply elevation 6dp (default), 12dp (on press)
- [ ] T090 Add primary color background
- [ ] T091 Add + icon or custom icon support
- [ ] T092 Show only on mobile (<768px), hide on desktop
- [ ] T093 Add ripple effect on press
- [ ] T094 Position in thumb-reachable zone
- [ ] T095 Create Storybook stories for FAB

**Verify**: Run tests from T083-T085, all should PASS (green state)

**Checkpoint**: FAB component complete

---

## Phase 9: Progress Components

**Purpose**: Loading and progress indicators

### Tests - Write FIRST, verify they FAIL

- [ ] T096 [P] Write component test for LinearProgress in tests/unit/components/LinearProgress.test.tsx
- [ ] T097 [P] Write component test for CircularProgress in tests/unit/components/CircularProgress.test.tsx
- [ ] T098 [P] Write visual regression test for Progress components in tests/visual/progress.spec.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T099 Create LinearProgress component in components/ui/Progress/LinearProgress.tsx
- [ ] T100 Add determinate variant (with percentage)
- [ ] T101 Add indeterminate variant (loading animation)
- [ ] T102 Style with Material Design linear progress specs
- [ ] T103 Create CircularProgress component in components/ui/Progress/CircularProgress.tsx
- [ ] T104 Implement spinner animation (rotate 360deg, 1.4s infinite)
- [ ] T105 Create Storybook stories for Progress components

**Verify**: Run tests from T096-T098, all should PASS (green state)

**Checkpoint**: Progress components complete

---

## Phase 10: Typography Components

**Purpose**: Heading and text components

### Tests - Write FIRST, verify they FAIL

- [ ] T106 [P] Write component test for typography scale in tests/unit/components/Typography.test.tsx
- [ ] T107 [P] Write visual regression test for Typography in tests/visual/typography.spec.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T108 Create Heading component in components/ui/Typography/Heading.tsx
- [ ] T109 Support levels (h1, h2, h3, h4, h5, h6)
- [ ] T110 Apply typography scale from design tokens
- [ ] T111 Create Text component in components/ui/Typography/Text.tsx
- [ ] T112 Support variants (body, small, caption)
- [ ] T113 Support color variants (primary, secondary, disabled)
- [ ] T114 Create Storybook stories for Typography components

**Verify**: Run tests from T106-T107, all should PASS (green state)

**Checkpoint**: Typography components complete

---

## Phase 11: Responsive Layout System

**Purpose**: Grid and container utilities

### Tests - Write FIRST, verify they FAIL

- [ ] T115 [P] Write test for responsive grid at all breakpoints in tests/unit/layout/grid.test.ts
- [ ] T116 [P] Write test for container max-width in tests/unit/layout/container.test.ts
- [ ] T117 [P] Write test for no horizontal scroll at any width in tests/e2e/responsive.spec.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T118 Create responsive grid styles (CSS Grid)
- [ ] T119 Implement grid: 1 col (mobile), 2 col (tablet), 3 col (desktop)
- [ ] T120 Create Container component with max-width 1440px, centered
- [ ] T121 Create spacing utility classes in styles/utilities/spacing.css
- [ ] T122 Create layout utility classes (flex, grid helpers)
- [ ] T123 Test responsive behavior at 320px, 768px, 1024px, 1920px
- [ ] T124 Ensure no horizontal scroll at any width
- [ ] T125 Test layout shift (CLS < 0.1)

**Verify**: Run tests from T115-T117, all should PASS (green state)

**Checkpoint**: Responsive layout system working

---

## Phase 12: Dark Theme Support (Optional)

**Purpose**: Dark mode implementation

### Tests - Write FIRST, verify they FAIL

- [ ] T126 [P] Write test for dark theme color contrast in tests/accessibility/dark-theme.test.ts
- [ ] T127 [P] Write test for theme switching without flash in tests/unit/theme/theme-switch.test.ts
- [ ] T128 [P] Write visual regression tests for all components in dark theme in tests/visual/dark-theme.spec.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T129 Define dark theme color palette in styles/theme/dark-theme.css
- [ ] T130 Verify dark theme colors meet WCAG AA contrast
- [ ] T131 Create ThemeProvider context in lib/theme/ThemeProvider.tsx
- [ ] T132 Implement theme switching logic (localStorage + data attribute)
- [ ] T133 Create useTheme hook in lib/theme/useTheme.ts
- [ ] T134 Detect system preference (prefers-color-scheme)
- [ ] T135 Update all components to work in dark theme
- [ ] T136 Test theme switching without flash of unstyled content
- [ ] T137 Create theme toggle component
- [ ] T138 Add to Storybook (theme switcher)

**Verify**: Run tests from T126-T128, all should PASS (green state)

**Checkpoint**: Dark theme working (if implemented)

---

## Phase 13: Animation System

**Purpose**: Consistent animations across app

### Tests - Write FIRST, verify they FAIL

- [ ] T139 [P] Write test for animations running at 60fps in tests/performance/animations.test.ts
- [ ] T140 [P] Write test for prefers-reduced-motion support in tests/accessibility/motion.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T141 Define animation keyframes in styles/utilities/animations.css
- [ ] T142 Create fade-in animation
- [ ] T143 Create slide-in animations (up, down, left, right)
- [ ] T144 Create scale animations
- [ ] T145 Implement ripple effect for touch interactions
- [ ] T146 Add page transition animations
- [ ] T147 Support prefers-reduced-motion (disable animations if set)
- [ ] T148 Ensure all animations are hardware-accelerated (transform, opacity only)
- [ ] T149 Test animations at 60fps on mobile
- [ ] T150 Document animation usage in Storybook

**Verify**: Run tests from T139-T140, all should PASS (green state)

**Checkpoint**: Animation system complete and performant

---

## Phase 14: Comprehensive Accessibility Audits

**Purpose**: Ensure WCAG AA compliance across all components

### Tests - Already written in previous phases, now COMPREHENSIVE testing

- [ ] T151 Run Lighthouse accessibility audit on all component examples (target: 90+)
- [ ] T152 Test keyboard navigation on all interactive components (Tab, Enter, ESC, Arrow keys)
- [ ] T153 Test with VoiceOver (macOS/iOS)
- [ ] T154 Test with NVDA (Windows)
- [ ] T155 Test with JAWS (Windows) if available
- [ ] T156 Verify all images/icons have appropriate alt text or aria-labels
- [ ] T157 Verify color contrast for all text (WCAG AA: 4.5:1 normal, 3:1 large)
- [ ] T158 Test with 200% browser zoom
- [ ] T159 Test with 400% browser zoom
- [ ] T160 Verify focus order is logical on all pages
- [ ] T161 Verify no color-only information (icons + text)
- [ ] T162 Add skip links for keyboard navigation
- [ ] T163 Create accessibility documentation

**Checkpoint**: All components meet WCAG AA standards

---

## Phase 15: Storybook Documentation

**Purpose**: Comprehensive component documentation

- [ ] T164 [P] Document all components in Storybook
- [ ] T165 [P] Add interactive controls (args) for all component props
- [ ] T166 [P] Create design guidelines documentation
- [ ] T167 [P] Document when to use each component
- [ ] T168 Create design tokens reference page in Storybook
- [ ] T169 Add usage examples for common patterns
- [ ] T170 Document responsive behavior
- [ ] T171 Document accessibility features
- [ ] T172 Add Material Design link references
- [ ] T173 Create component API documentation

**Checkpoint**: Complete design system documentation

---

## Phase 16: Visual Regression Testing

**Purpose**: Prevent unintended visual changes

- [ ] T174 Setup Chromatic integration with GitHub
- [ ] T175 Create visual regression tests for all components in all states
- [ ] T176 Test components at multiple viewport sizes (mobile, tablet, desktop)
- [ ] T177 Establish baseline snapshots for all components
- [ ] T178 Test dark theme visual regression (if implemented)
- [ ] T179 Configure CI pipeline to run visual tests on PRs
- [ ] T180 Document visual regression testing workflow

**Checkpoint**: Visual regression testing in place

---

## Phase 17: Performance Optimization

**Purpose**: Ensure theme system is performant

### Tests - Write FIRST, verify they FAIL

- [ ] T181 [P] Write test for CSS bundle size (<30KB gzipped) in tests/performance/bundle.test.ts
- [ ] T182 [P] Write test for component render time (<16ms) in tests/performance/render.test.ts
- [ ] T183 [P] Write test for FCP with styled content (<1.5s) in tests/performance/fcp.test.ts

**Verify**: Run tests, confirm all FAIL (red state)

### Implementation

- [ ] T184 Measure CSS bundle size, ensure <30KB gzipped
- [ ] T185 Optimize CSS (remove unused styles, combine selectors)
- [ ] T186 Measure component render times (target: <16ms for 60fps)
- [ ] T187 Add React.memo to expensive components
- [ ] T188 Optimize animation performance (use transform, opacity only)
- [ ] T189 Test First Contentful Paint (target: <1.5s)
- [ ] T190 Test Largest Contentful Paint (target: <2.5s)
- [ ] T191 Test Cumulative Layout Shift (target: <0.1)
- [ ] T192 Run Lighthouse performance audit (target: 90+)

**Verify**: Run tests from T181-T183, all should PASS (green state)

**Checkpoint**: Theme system is performant

---

## Phase 18: Integration with Application

**Purpose**: Apply theme to all application pages

- [ ] T193 Apply theme to authentication pages (login, register)
- [ ] T194 Apply theme to dashboard page
- [ ] T195 Apply theme to deck management pages
- [ ] T196 Apply theme to study mode pages
- [ ] T197 Verify consistent styling across all pages
- [ ] T198 Test responsive behavior across all pages
- [ ] T199 Test accessibility across all pages
- [ ] T200 Fix any inconsistencies found

**Checkpoint**: Theme applied consistently across application

---

## Phase 19: Polish & Final Testing

**Purpose**: Final improvements and comprehensive testing

- [ ] T201 [P] Test on real mobile devices (iOS Safari, Android Chrome)
- [ ] T202 [P] Test on various screen sizes (320px to 1920px+)
- [ ] T203 [P] Test with various browser zoom levels (100%, 150%, 200%)
- [ ] T204 Test with slow 3G connection
- [ ] T205 Test with reduced motion preference enabled
- [ ] T206 Test with high contrast mode (Windows)
- [ ] T207 Verify print styles (if needed)
- [ ] T208 Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] T209 Create theme customization guide
- [ ] T210 Create component contribution guide
- [ ] T211 Final comprehensive accessibility audit
- [ ] T212 Final performance benchmarking
- [ ] T213 Create theme system documentation
- [ ] T214 Create migration guide from default styles

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Design Tokens (Phase 2)**: Depends on Setup - BLOCKS all component work
- **Base Styles (Phase 3)**: Depends on Design Tokens
- **Components (Phase 4-10)**: All depend on Design Tokens + Base Styles
  - Components can be built in parallel (Button, Card, Input, etc.)
  - Modal depends on Card for structure
- **Layout System (Phase 11)**: Depends on Design Tokens
- **Dark Theme (Phase 12)**: Depends on all components being built
- **Animation (Phase 13)**: Can start after Design Tokens complete
- **Accessibility (Phase 14)**: Depends on all components complete
- **Storybook (Phase 15)**: Ongoing throughout component development
- **Visual Regression (Phase 16)**: Depends on all components complete
- **Performance (Phase 17)**: Depends on all components complete
- **Integration (Phase 18)**: Depends on all components complete
- **Polish (Phase 19)**: Depends on all previous phases

### Within Each Phase - TDD Flow

1. **RED**: Write tests first (verify they FAIL)
2. **GREEN**: Implement code to make tests PASS
3. **REFACTOR**: Clean up code while tests still PASS
4. Document in Storybook
5. Move to next component

### Parallel Opportunities

**Within Design Tokens Phase (Phase 2)**:
```bash
# Tests can be written in parallel:
T005 (contrast test) + T006 (variables test) + T007 (typography test)

# After tests pass, tokens can be defined in parallel:
T008-T009 (colors) + T010-T011 (typography) + T012 (spacing) + T013 (elevation)
```

**Component Building (Phases 4-10)**:
```bash
# All components can be built in parallel (by different developers):
Button + Card + Input + Modal + FAB + Progress + Typography

# Each component follows: Tests → Implementation → Storybook → Verify
```

**Testing Phases (14, 16, 17)**:
```bash
# After all components built, can run in parallel:
Accessibility audit + Visual regression + Performance testing
```

---

## Implementation Strategy

### Foundation First

1. Complete Phase 1: Setup
2. Complete Phase 2: Design Tokens ✅ Token system ready
3. Complete Phase 3: Base Styles ✅ Foundation ready
4. Now components can be built

### Component-by-Component (MVP)

1. Build Button (most common component)
2. Build Card (for deck cards)
3. Build Input (for forms)
4. Build Modal (for dialogs)
5. **STOP and VALIDATE**: Core UI components work
6. Apply to authentication pages
7. Deploy MVP with basic theme

### Parallel Component Development

With multiple developers:
1. Developer A: Button → Typography
2. Developer B: Card → Modal
3. Developer C: Input → FAB
4. Developer D: Progress indicators
5. All write tests first, implement, document in Storybook

### Complete System

1. Foundation → Components → Layout → Animations
2. Apply dark theme (optional)
3. Comprehensive accessibility testing
4. Visual regression setup
5. Performance optimization
6. Integrate with all application pages
7. Final polish

---

## Notes

- **TDD for visual components**: Use visual regression + accessibility tests
- **Design tokens MUST come first**: All components depend on them
- **WCAG AA is mandatory**: Every component must meet contrast and accessibility standards
- **Mobile-first always**: Design and test mobile first, enhance for desktop
- **[P] tasks**: Different files, can run in parallel
- Each component is independently testable
- Storybook documentation is ongoing throughout development
- Visual regression prevents unintended changes
- Performance monitoring ensures <30KB CSS bundle
- Material Design specs must be followed
- Commit after each component or logical group
- Run visual and accessibility tests frequently
- Target: Lighthouse 90+ (performance, accessibility, best practices)
