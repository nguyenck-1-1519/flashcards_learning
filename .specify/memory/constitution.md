# Flashcards Learning Constitution

## Core Principles

### I. Mobile-First Responsive Design
All UI components must be designed and tested for mobile devices first, then scaled up to desktop. Breakpoints should follow a mobile-first approach with progressive enhancement. Touch interactions must be intuitive and accessible with minimum target sizes of 44x44px. The website must be fully functional on screen sizes from 320px width upward.

### II. Markdown Fidelity
The markdown renderer must accurately support standard CommonMark specification with extended syntax (tables, task lists, code highlighting). Rendering must preserve the semantic structure and intent of the original markdown. All markdown features used in flashcards must render consistently across different screen sizes and devices.

### III. Performance and User Experience
Page load time must be under 2 seconds on 3G connections. Markdown rendering should be optimized for instant feedback. Lazy loading should be implemented for images and heavy content. The application should work offline with service workers caching critical resources and flashcard data.

### IV. Accessibility First
All interactive elements must be keyboard navigable. ARIA labels required for screen readers. Color contrast must meet WCAG AA standards (4.5:1 for normal text). Focus indicators must be clearly visible. Semantic HTML must be used throughout.

### V. Progressive Enhancement & Simplicity
Start with core functionality (markdown display, flashcard navigation) that works without JavaScript. Enhance with interactive features progressively. Keep the codebase simple and maintainable. Avoid over-engineering - YAGNI principles apply. Use vanilla web standards where possible before reaching for frameworks.

## Technical Standards

### Technology Stack
- **Frontend**: Modern vanilla JavaScript or lightweight framework (React/Vue if needed)
- **Markdown Parser**: CommonMark-compliant library (e.g., marked.js, markdown-it)
- **Styling**: CSS with mobile-first media queries, CSS Grid/Flexbox for layouts
- **Storage**: LocalStorage or IndexedDB for offline flashcard persistence
- **Build Tools**: Minimal bundling setup, ES modules preferred
- **Code Highlighting**: Prism.js or Highlight.js for code blocks in markdown

### Performance Requirements
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s on mobile
- Bundle size: < 100KB gzipped for initial load

### Responsive Breakpoints
- Mobile: 320px - 767px (default/base styles)
- Tablet: 768px - 1023px
- Desktop: 1024px+

## Development Workflow

### Testing Requirements
- Manual testing on real mobile devices (iOS Safari, Android Chrome)
- Responsive design testing at key breakpoints
- Markdown rendering tests for all supported syntax
- Accessibility testing with screen readers
- Performance testing with Lighthouse (mobile & desktop)

### Code Quality Standards
- Semantic, valid HTML5
- CSS follows BEM or logical naming conventions
- JavaScript follows ES6+ standards with clear documentation
- All user-facing text should support internationalization
- Code must be readable and self-documenting

### Version Control
- Meaningful commit messages describing changes
- Feature branches for new functionality
- Main branch should always be deployable
- Tag releases with semantic versioning

## Governance

This constitution defines the core principles and standards for the Flashcards Learning project. All development decisions should align with these principles, prioritizing mobile experience, markdown rendering accuracy, and user accessibility.

Changes to this constitution should be documented with rationale. When in doubt, choose the simpler solution that best serves mobile users learning with flashcards.

**Version**: 1.0.0 | **Ratified**: 2025-12-17 | **Last Amended**: 2025-12-17
