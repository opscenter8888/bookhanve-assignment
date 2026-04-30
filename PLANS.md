# BookHaven Implementation Plan

The application has been implemented from this plan. Keep this file as phase guidance for future changes and reviews.

## Phase 1: Project Setup

### Goal

Create the baseline Next.js project with TypeScript, Tailwind CSS, linting, and Jest configuration.

### Deliverables

- Next.js App Router structure.
- Strict TypeScript configuration.
- Tailwind CSS setup.
- Jest and React Testing Library setup.
- Package scripts for dev, build, test, and lint.

### Verification Checklist

- `npm run dev` starts the app.
- `npm run build` passes.
- `npm run lint` passes.
- `npm test` runs.

### Risks

- Adding unnecessary dependencies.
- Creating feature code too early.
- Misconfiguring Jest for App Router components.

## Phase 2: Database Setup

### Goal

Add PostgreSQL through Docker and define the books data foundation.

### Deliverables

- `docker-compose.yml` for PostgreSQL.
- Books table schema.
- JSON seed data.
- Seed script and documented seed command.
- Minimal database access layer.

### Verification Checklist

- PostgreSQL starts through Docker.
- Schema can be applied repeatedly.
- Seed data can be loaded.
- Database setup is documented in README.

### Risks

- Making database setup too complex.
- Introducing an ORM without need.
- Seed script drifting from the domain type.

## Phase 3: UI Primitives

### Goal

Create reusable UI components for consistent layout and states.

### Deliverables

- Button.
- Card.
- Container.
- LoadingState.
- ErrorState.
- EmptyState.

### Verification Checklist

- Components are responsive.
- Components use constants for visible copy.
- Components are accessible by default.
- Components avoid unnecessary props and styling variants.

### Risks

- Overbuilding a design system.
- Hardcoding copy inside components.
- Inconsistent spacing or colors.

## Phase 4: Books Feature

### Goal

Represent and display book data cleanly.

### Deliverables

- Book type definitions.
- Book data access helper.
- BookCard.
- BookGrid.
- Constants for book-related UI copy.

### Verification Checklist

- Book grid renders multiple books.
- Book cards display title, author, price, and relevant metadata.
- Components handle empty book lists.
- Data shape is shared through types.

### Risks

- Coupling UI directly to database details.
- Hardcoding seed data in components.
- Missing responsive grid behavior.

## Phase 5: Cart Feature

### Goal

Implement centralized cart behavior with Zustand.

### Deliverables

- Cart store.
- Add item action.
- Remove item action.
- Quantity handling.
- Total item count selector.
- Total price selector.
- localStorage persistence.
- Cart UI components.

### Verification Checklist

- Adding the same book increments quantity.
- Removing an item updates totals.
- Cart persists after refresh.
- Derived totals are accurate.

### Risks

- Hydration issues with persisted client state.
- Floating point formatting mistakes.
- Duplicating cart logic in components.

## Phase 6: Pages

### Goal

Compose implemented features into user-facing pages.

### Deliverables

- Homepage at `/`.
- Cart page at `/cart`.
- Shared layout and navigation.
- Responsive page composition.

### Verification Checklist

- Homepage displays the book grid.
- Cart page displays cart content and totals.
- Navigation between pages works.
- Mobile layout remains usable.

### Risks

- Page components becoming too large.
- Duplicating layout code.
- Missing empty-state handling.

## Phase 7: Loading/Error/Empty States

### Goal

Handle common UI states consistently.

### Deliverables

- Loading state usage where data may be pending.
- Error state usage where data access may fail.
- Empty state usage for no books and empty cart.

### Verification Checklist

- States use shared UI primitives.
- State copy comes from constants.
- States are accessible and responsive.

### Risks

- Treating all failures as the same.
- Forgetting empty cart behavior.
- Adding state components without real usage.

## Phase 8: Testing

### Goal

Add exactly 11 meaningful Jest tests.

### Deliverables

- Cart store tests.
- Component behavior tests.
- Test setup utilities if needed.
- Documented test command.

### Verification Checklist

- `npm test` passes.
- Exactly 11 tests are present and passing.
- Tests cover cart logic and key components.
- Tests avoid brittle implementation details.

### Risks

- Accidentally adding more or fewer than 11 tests.
- Testing framework internals instead of behavior.
- Creating fake passing tests.

## Phase 9: Polish And Review

### Goal

Bring the project to submission quality.

### Deliverables

- README updated with real setup and decisions.
- Self-review completed.
- Build, lint, and tests passing.
- UI checked at mobile and desktop widths.

### Verification Checklist

- `npm run build` passes.
- `npm run lint` passes.
- `npm test` passes with exactly 11 tests.
- `code_review.md` checklist is complete.

### Risks

- Claiming unverified behavior.
- Leaving documentation stale.
- Missing accessibility basics.
