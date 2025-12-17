# Implementation Plan: Unified UI Theme & Material Design

**Branch**: `004-ui-theme` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)

## Summary

Establish unified Material Design theme system for flashcards application using CSS custom properties, mobile-first responsive design, and reusable UI components. Implement comprehensive design system including color palette, typography scale, spacing system, elevation, and component patterns. Ensure WCAG AA accessibility standards and consistent experience across all screen sizes (320px to 1920px+). Light theme default with optional dark theme support.

## Technical Context

**Language/Version**: TypeScript 5.x, CSS3, Next.js 14  
**Primary Dependencies**:
- `tailwindcss` (optional, for utility classes)
- No additional UI framework (custom components)
- CSS Modules or CSS-in-JS (styled-components/emotion) - TBD based on preference

**Storage**: N/A (theme config in CSS variables, user preferences in localStorage/cookies)  
**Testing**: Storybook (component showcase), Chromatic (visual regression), Playwright (E2E accessibility)  
**Target Platform**: All modern browsers (Chrome, Firefox, Safari, Edge), mobile and desktop  
**Project Type**: Web application (Next.js)  
**Performance Goals**:
- CSS bundle < 30KB gzipped
- Component render time < 16ms (60fps)
- Layout reflow < 100ms on resize
- First Contentful Paint with styled content < 1.5s

**Constraints**:
- WCAG AA contrast: 4.5:1 (normal text), 3:1 (large text)
- Minimum touch target: 44x44px on mobile
- Support viewport widths: 320px to 1920px+
- No layout shift (CLS < 0.1)
- Responsive breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)

**Scale/Scope**:
- 20-30 reusable UI components
- 2 theme variants (light, dark optional)
- 3 responsive breakpoints
- 10+ color tokens
- 7 typography sizes

## Constitution Check

✅ **Mobile-First Responsive Design**: Entire theme system built mobile-first with progressive enhancement for larger screens  
✅ **Performance & User Experience**: Lightweight CSS, hardware-accelerated animations, optimized for 60fps  
✅ **Accessibility First**: WCAG AA contrast, focus indicators, semantic HTML, keyboard navigation, screen reader support  
✅ **Progressive Enhancement**: Core styling works without JS, enhanced with dynamic theme switching  
✅ **Simplicity**: CSS custom properties for easy customization, no complex CSS-in-JS runtime, standard Material Design patterns

**Gates**: ✅ All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/004-ui-theme/
├── plan.md              # This file
├── spec.md              # Feature specification
└── tasks.md             # Implementation tasks (to be created)
```

### Source Code

```text
styles/
├── globals.css                      # Global styles and CSS reset
├── theme/
│   ├── variables.css                # CSS custom properties (colors, spacing, etc.)
│   ├── typography.css               # Font styles and scale
│   ├── breakpoints.css              # Media query mixins/variables
│   └── dark-theme.css               # Dark theme overrides (optional)
├── components/
│   ├── button.css                   # Button component styles
│   ├── card.css                     # Card component styles
│   ├── input.css                    # Input field styles
│   └── modal.css                    # Modal/dialog styles
└── utilities/
    ├── spacing.css                  # Margin/padding utilities
    ├── elevation.css                # Shadow/elevation classes
    └── animations.css               # Reusable animations

components/
└── ui/
    ├── Button/
    │   ├── Button.tsx               # Button component
    │   ├── Button.module.css        # Button styles (if using CSS Modules)
    │   └── Button.stories.tsx       # Storybook stories
    ├── Card/
    │   ├── Card.tsx
    │   ├── Card.module.css
    │   └── Card.stories.tsx
    ├── Input/
    │   ├── Input.tsx
    │   ├── Input.module.css
    │   └── Input.stories.tsx
    ├── Modal/
    │   ├── Modal.tsx
    │   ├── Modal.module.css
    │   └── Modal.stories.tsx
    ├── FAB/
    │   ├── FAB.tsx                  # Floating Action Button
    │   ├── FAB.module.css
    │   └── FAB.stories.tsx
    ├── Progress/
    │   ├── LinearProgress.tsx
    │   └── CircularProgress.tsx
    └── Typography/
        ├── Heading.tsx
        ├── Text.tsx
        └── Typography.stories.tsx

lib/
└── theme/
    ├── ThemeProvider.tsx            # Theme context provider (if dynamic switching)
    └── useTheme.ts                  # Hook to access theme

app/
└── layout.tsx                       # Root layout with theme setup

tests/
├── accessibility/
│   └── wcag.test.ts                # Automated accessibility tests
└── visual/
    └── components.spec.ts          # Visual regression tests
```

**Structure Decision**: Using CSS custom properties (CSS variables) for theme tokens stored in `styles/theme/`. Components in `components/ui/` are reusable and styled with CSS Modules for scoping. Global theme variables allow easy theme switching without complex JS runtime. Storybook for component documentation and testing. This structure keeps styling maintainable and performant.

## Implementation Phases

### Phase 0: Design System Foundation

**Goal**: Define core design tokens (colors, typography, spacing)

**Tasks**:
1. Define color palette (primary, secondary, semantic, neutral)
2. Create typography scale (font sizes, weights, line heights)
3. Define spacing scale (4px base unit, multiples)
4. Define elevation levels (Material Design shadows)
5. Set up CSS custom properties in variables.css
6. Create breakpoint system
7. Document design tokens

**Deliverables**:
- `styles/theme/variables.css` with all design tokens
- `styles/theme/typography.css` with font definitions
- `styles/theme/breakpoints.css` with media query variables
- Design tokens documentation (README or Storybook)

**Validation**:
- All colors meet WCAG AA contrast requirements
- Typography scale is legible on mobile (minimum 16px body)
- Spacing scale follows 8px grid
- Design tokens are accessible via CSS variables

---

### Phase 1: Base Styles & Reset

**Goal**: Set up global styles, CSS reset, and base HTML elements

**Tasks**:
1. Create CSS reset (normalize styles across browsers)
2. Apply base typography to HTML elements
3. Set up responsive font sizing (rem units)
4. Define focus outline styles (keyboard navigation)
5. Set up smooth scrolling and box-sizing
6. Apply theme variables globally
7. Test on all target browsers

**Deliverables**:
- `styles/globals.css` with reset and base styles
- Focus indicator styles (visible, accessible)
- Browser compatibility testing results

**Validation**:
- Consistent rendering across browsers
- Text is readable on all devices
- Focus indicators visible and meet contrast requirements
- No layout shift on page load

---

### Phase 2: Core UI Components

**Goal**: Build foundational Material Design components

**Tasks**:
1. **Button component**: variants (contained, outlined, text), sizes, states
2. **Card component**: elevation, padding, border-radius
3. **Input component**: text input, textarea, validation states
4. **Modal/Dialog component**: overlay, focus trap, animations
5. Ensure 44px minimum touch targets on mobile
6. Add hover/focus/active states for all interactive components
7. Write Storybook stories for each component
8. Add accessibility attributes (ARIA labels, roles)

**Deliverables**:
- `components/ui/Button/Button.tsx` with variants and styles
- `components/ui/Card/Card.tsx` with elevation
- `components/ui/Input/Input.tsx` with validation
- `components/ui/Modal/Modal.tsx` with accessibility
- Storybook stories for all components
- Component unit tests

**Validation**:
- All components render correctly at all breakpoints
- Touch targets are 44px+ on mobile
- Keyboard navigation works for all components
- ARIA labels present and correct
- Storybook displays all component variants

---

### Phase 3: Specialized Components

**Goal**: Build application-specific UI components

**Tasks**:
1. **FAB (Floating Action Button)**: mobile-first, fixed positioning
2. **Progress indicators**: linear and circular
3. **Typography components**: Heading, Text with variants
4. **Snackbar/Toast**: notifications at bottom of screen
5. Ensure components follow Material Design specs
6. Add animations (fade, slide, scale)
7. Test responsive behavior

**Deliverables**:
- `components/ui/FAB/FAB.tsx` (mobile-only, bottom-right)
- `components/ui/Progress/` with LinearProgress and CircularProgress
- `components/ui/Typography/` with Heading and Text
- Storybook stories
- Animation styles in `styles/utilities/animations.css`

**Validation**:
- FAB displays only on mobile (<768px)
- Progress indicators animate smoothly
- Typography components follow scale correctly
- Animations run at 60fps

---

### Phase 4: Responsive Layout System

**Goal**: Implement responsive grid and layout utilities

**Tasks**:
1. Create responsive grid system (CSS Grid)
2. Create container components with max-width
3. Add spacing utilities (margin, padding)
4. Add layout utilities (flexbox helpers)
5. Test at all breakpoints (320px, 768px, 1024px, 1920px+)
6. Ensure no horizontal scroll at any width
7. Add print styles (optional)

**Deliverables**:
- Responsive grid styles
- Container components
- `styles/utilities/spacing.css` with margin/padding classes
- Layout utility classes
- Responsive testing report

**Validation**:
- Grid reflows smoothly at all breakpoints
- No horizontal scroll from 320px to 1920px+
- Content is centered on large screens (max-width 1440px)
- Layout shift (CLS) < 0.1

---

### Phase 5: Dark Theme Support (Optional)

**Goal**: Implement dark theme with proper contrast

**Tasks**:
1. Define dark theme color palette
2. Create dark theme CSS variable overrides
3. Implement theme switching mechanism (context + localStorage)
4. Update all components to work in dark theme
5. Ensure WCAG AA contrast in dark theme
6. Add system preference detection (prefers-color-scheme)
7. Add theme toggle UI (settings page)

**Deliverables**:
- `styles/theme/dark-theme.css` with dark color palette
- `lib/theme/ThemeProvider.tsx` for theme management
- `lib/theme/useTheme.ts` hook
- Theme toggle component
- Dark theme testing (contrast verification)

**Validation**:
- Dark theme meets WCAG AA contrast requirements
- Theme switches smoothly without flash
- Theme preference persists across sessions
- System preference respected by default
- All components work correctly in dark theme

---

### Phase 6: Accessibility Audits

**Goal**: Ensure full WCAG AA compliance

**Tasks**:
1. Run Lighthouse accessibility audits on all pages
2. Test keyboard navigation (Tab, Enter, ESC, Arrow keys)
3. Test with screen readers (VoiceOver, NVDA, JAWS)
4. Verify focus order is logical
5. Ensure all images have alt text
6. Verify color contrast for all text
7. Test with browser zoom (200%, 400%)
8. Add skip links for keyboard navigation

**Deliverables**:
- Accessibility audit report
- Fixes for identified issues
- Skip link implementation
- Automated accessibility tests

**Validation**:
- Lighthouse accessibility score 90+
- All interactive elements keyboard accessible
- Screen reader announces content correctly
- Focus order is logical
- Text readable at 200% zoom
- No color-only information

---

### Phase 7: Animation & Motion

**Goal**: Implement Material Design motion principles

**Tasks**:
1. Define animation durations (fast: 150ms, medium: 300ms, slow: 500ms)
2. Define easing curves (ease-in, ease-out, ease-in-out)
3. Add ripple effect to buttons and cards (CSS or JS)
4. Add page transition animations
5. Add component enter/exit animations
6. Respect prefers-reduced-motion
7. Ensure animations are hardware-accelerated

**Deliverables**:
- `styles/utilities/animations.css` with keyframes and classes
- Ripple effect implementation
- Page transition animations
- Reduced motion media query support

**Validation**:
- Animations run at 60fps on mobile
- Ripple effect works on touch
- Reduced motion is respected (animations disabled)
- No jank during animations

---

### Phase 8: Documentation & Storybook

**Goal**: Comprehensive component documentation

**Tasks**:
1. Set up Storybook with all components
2. Write stories for all component variants
3. Add interactive controls (args) in Storybook
4. Document component props and usage
5. Add design guidelines (when to use each component)
6. Create theme token reference
7. Add accessibility guidelines

**Deliverables**:
- Complete Storybook with all components
- Component documentation
- Design system guidelines
- Theme token reference
- Accessibility documentation

**Validation**:
- All components have Storybook stories
- Documentation is clear and comprehensive
- Design guidelines help developers choose right components
- Theme tokens are documented with examples

## Design Tokens

### Color Palette

```css
/* styles/theme/variables.css */
:root {
  /* Primary Colors (Material Blue) */
  --color-primary: #1976d2;
  --color-primary-light: #42a5f5;
  --color-primary-dark: #1565c0;
  --color-on-primary: #ffffff;

  /* Secondary Colors (Material Pink) */
  --color-secondary: #dc004e;
  --color-secondary-light: #f50057;
  --color-secondary-dark: #c51162;
  --color-on-secondary: #ffffff;

  /* Semantic Colors */
  --color-success: #4caf50;
  --color-success-light: #81c784;
  --color-success-dark: #388e3c;
  
  --color-warning: #ff9800;
  --color-warning-light: #ffb74d;
  --color-warning-dark: #f57c00;
  
  --color-error: #f44336;
  --color-error-light: #e57373;
  --color-error-dark: #d32f2f;
  
  --color-info: #2196f3;
  --color-info-light: #64b5f6;
  --color-info-dark: #1976d2;

  /* Neutral Colors (Light Theme) */
  --color-background: #fafafa;
  --color-surface: #ffffff;
  --color-surface-variant: #f5f5f5;
  
  --color-text-primary: rgba(0, 0, 0, 0.87);
  --color-text-secondary: rgba(0, 0, 0, 0.60);
  --color-text-disabled: rgba(0, 0, 0, 0.38);
  
  --color-divider: rgba(0, 0, 0, 0.12);
  --color-border: rgba(0, 0, 0, 0.23);
  --color-outline: rgba(0, 0, 0, 0.42);

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
                 'Helvetica Neue', sans-serif;
  --font-family-mono: 'Courier New', Courier, monospace;
  
  --font-size-h1: 2rem;        /* 32px */
  --font-size-h2: 1.75rem;     /* 28px */
  --font-size-h3: 1.5rem;      /* 24px */
  --font-size-h4: 1.25rem;     /* 20px */
  --font-size-body: 1rem;      /* 16px */
  --font-size-small: 0.875rem; /* 14px */
  --font-size-caption: 0.75rem;/* 12px */
  
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  
  --line-height-heading: 1.2;
  --line-height-body: 1.5;

  /* Spacing (8px base unit) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;

  /* Elevation (Material Design shadows) */
  --elevation-0: none;
  --elevation-1: 0 1px 3px rgba(0, 0, 0, 0.12);
  --elevation-2: 0 2px 4px rgba(0, 0, 0, 0.14);
  --elevation-4: 0 4px 8px rgba(0, 0, 0, 0.16);
  --elevation-8: 0 8px 16px rgba(0, 0, 0, 0.18);
  --elevation-16: 0 16px 32px rgba(0, 0, 0, 0.20);
  --elevation-24: 0 24px 48px rgba(0, 0, 0, 0.22);

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-medium: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;

  /* Z-index layers */
  --z-dropdown: 1000;
  --z-modal: 1050;
  --z-tooltip: 1100;
  --z-toast: 1200;
}
```

### Dark Theme Overrides

```css
/* styles/theme/dark-theme.css */
[data-theme="dark"] {
  /* Neutral Colors (Dark Theme) */
  --color-background: #121212;
  --color-surface: #1e1e1e;
  --color-surface-variant: #2c2c2c;
  
  --color-text-primary: rgba(255, 255, 255, 0.87);
  --color-text-secondary: rgba(255, 255, 255, 0.60);
  --color-text-disabled: rgba(255, 255, 255, 0.38);
  
  --color-divider: rgba(255, 255, 255, 0.12);
  --color-border: rgba(255, 255, 255, 0.23);
  --color-outline: rgba(255, 255, 255, 0.42);

  /* Adjust shadows for dark theme */
  --elevation-1: 0 1px 3px rgba(0, 0, 0, 0.30);
  --elevation-2: 0 2px 4px rgba(0, 0, 0, 0.35);
  --elevation-4: 0 4px 8px rgba(0, 0, 0, 0.40);
  --elevation-8: 0 8px 16px rgba(0, 0, 0, 0.45);
  --elevation-16: 0 16px 32px rgba(0, 0, 0, 0.50);
  --elevation-24: 0 24px 48px rgba(0, 0, 0, 0.55);
}
```

## Responsive Breakpoints

```css
/* Mobile-first approach */
/* Base styles: 320px+ (mobile) */

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) { }

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) { }

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) { }

/* Extra large devices (large desktops, 1440px and up) */
@media (min-width: 1440px) { }
```

## Component Examples

### Button Component

```typescript
// components/ui/Button/Button.tsx
import styles from './Button.module.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text'
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'error'
  fullWidth?: boolean
}

export function Button({
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  const className = [
    styles.button,
    styles[variant],
    styles[size],
    styles[color],
    fullWidth && styles.fullWidth,
  ].filter(Boolean).join(' ')

  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}
```

```css
/* components/ui/Button/Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: none;
  
  /* Minimum touch target on mobile */
  min-height: 44px;
  min-width: 44px;
}

/* Sizes */
.small {
  font-size: var(--font-size-small);
  padding: 8px 16px;
}

.medium {
  font-size: var(--font-size-body);
  padding: 12px 24px;
}

.large {
  font-size: var(--font-size-h4);
  padding: 16px 32px;
}

/* Variants */
.contained {
  box-shadow: var(--elevation-2);
}

.contained:hover {
  box-shadow: var(--elevation-4);
}

.contained.primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

.outlined {
  background-color: transparent;
  border: 2px solid currentColor;
}

.outlined.primary {
  color: var(--color-primary);
}

.text {
  background-color: transparent;
  color: var(--color-primary);
}

/* Focus state (accessibility) */
.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Full width */
.fullWidth {
  width: 100%;
}
```

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0"
  },
  "devDependencies": {
    "@storybook/react": "^7.6.0",
    "@storybook/nextjs": "^7.6.0",
    "chromatic": "^10.0.0",
    "@axe-core/playwright": "^4.8.0",
    "playwright": "^1.40.0"
  }
}
```

## Testing Strategy

1. **Visual Regression Tests** (Chromatic):
   - Snapshot all component variants in Storybook
   - Detect unintended visual changes
   - Test at multiple viewport sizes

2. **Accessibility Tests** (Playwright + axe-core):
   - Automated WCAG AA checks
   - Keyboard navigation tests
   - Color contrast verification
   - Screen reader compatibility

3. **Responsive Tests** (Playwright):
   - Test layout at 320px, 768px, 1024px, 1920px
   - Verify no horizontal scroll
   - Test orientation changes (portrait/landscape)

4. **Performance Tests**:
   - CSS bundle size monitoring
   - Layout shift (CLS) measurement
   - Animation frame rate (60fps target)

## Deployment Checklist

- [ ] All components documented in Storybook
- [ ] Lighthouse accessibility score 90+ on all pages
- [ ] Lighthouse performance score 90+ on all pages
- [ ] WCAG AA contrast verified for all colors
- [ ] Keyboard navigation tested on all interactive elements
- [ ] Screen reader testing completed (VoiceOver, NVDA)
- [ ] Responsive layout tested 320px to 1920px+
- [ ] Touch targets verified 44px+ on mobile
- [ ] CSS bundle size < 30KB gzipped
- [ ] Dark theme (if implemented) tested and verified
- [ ] Visual regression tests passing (Chromatic)
- [ ] Animation performance verified (60fps)
