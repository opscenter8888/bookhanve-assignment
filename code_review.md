# BookHaven Code Review Checklist

Use this checklist before submitting implementation work or future changes.

## Requirement Coverage

- [ ] Homepage displays a book grid.
- [ ] Homepage supports search, sorting, clear filters, and pagination.
- [ ] Cart page exists.
- [ ] Users can add books to the cart.
- [ ] Users can remove books from the cart.
- [ ] Cart state is centralized.
- [ ] PostgreSQL database runs through Docker.
- [ ] Seed data is sourced from JSON.
- [ ] JSON seed data is inserted/upserted into the database by `npm run db:seed`.
- [ ] Admin login, session, CRUD, and audit writes work through protected APIs.
- [ ] Admin list search, sorting, and pagination are backend-driven.
- [ ] Admin write/logout actions use confirmation dialogs and toast feedback.
- [ ] Exactly 11 Jest tests exist and pass.
- [ ] README explains setup, decisions, and LLM usage.

## Architecture

- [ ] Code follows the planned `src/` structure.
- [ ] Feature logic lives under the relevant feature folder.
- [ ] Shared UI is reusable and not feature-specific.
- [ ] Shared types are centralized.
- [ ] Components do not contain database concerns.
- [ ] Admin server-only logic stays under `src/server`.
- [ ] No unnecessary libraries or abstractions were introduced.

## Cart Behavior

- [ ] Adding a new book creates one cart item.
- [ ] Adding the same book increments quantity.
- [ ] Removing a book updates cart contents.
- [ ] Cart totals update correctly.
- [ ] Cart state persists through localStorage.
- [ ] Cart handles an empty state.

## Database Integration

- [ ] Docker configuration is simple and documented.
- [ ] Books table schema matches the domain type.
- [ ] Seed command is repeatable.
- [ ] Database credentials are not hardcoded in source code.
- [ ] Supabase usage, if selected, is configured through `DATABASE_URL`.
- [ ] Database failure states are handled clearly.
- [ ] Admin secrets are sourced from environment variables, not browser code.
- [ ] `admin_users` and `admin_audit_logs` schema changes are documented.

## UI Consistency

- [ ] Light theme is consistent.
- [ ] Spacing, typography, and borders are consistent.
- [ ] Reusable Button, Card, and Container components are used where appropriate.
- [ ] Loading, error, and empty states use shared primitives.
- [ ] User-facing strings come from constants.
- [ ] Admin modal layout has one cancel action location and is not clipped on mobile.
- [ ] Confirmation dialogs are custom UI, not browser alerts.

## Responsiveness

- [ ] Homepage works on mobile, tablet, and desktop.
- [ ] Cart page works on mobile, tablet, and desktop.
- [ ] Admin dashboard works on mobile, tablet, and desktop.
- [ ] Book grid adapts to viewport width.
- [ ] Text does not overflow controls or cards.
- [ ] Tap targets are usable on mobile.

## Accessibility

- [ ] Buttons use native button elements or correct semantics.
- [ ] Interactive elements have accessible names.
- [ ] Page structure uses meaningful headings.
- [ ] Color contrast is acceptable.
- [ ] Keyboard navigation is not blocked.

## Testing Quality

- [ ] Tests focus on user-visible behavior and cart logic.
- [ ] Tests avoid implementation-detail assertions.
- [ ] Test names describe expected behavior.
- [ ] The suite contains exactly 11 tests.
- [ ] No fake or placeholder tests were added.

## TypeScript Quality

- [ ] Strict TypeScript passes.
- [ ] Shared types are used consistently.
- [ ] Avoid `any` unless explicitly justified.
- [ ] Component props are typed clearly.
- [ ] Derived values have predictable return types.
- [ ] Unused constants, functions, variables, and empty folders are removed.

## Performance

- [ ] Components avoid unnecessary client-side rendering.
- [ ] Cart selectors avoid repeated complex calculations where practical.
- [ ] Images or media, if added, are optimized appropriately.
- [ ] Database access avoids avoidable repeated queries.

## README Completeness

- [ ] Setup steps are accurate.
- [ ] Database steps are accurate.
- [ ] Admin setup steps are accurate.
- [ ] Commands are accurate.
- [ ] Architecture decisions are explained.
- [ ] LLM usage is disclosed.
- [ ] Tradeoffs and future improvements are documented.
