# BookHaven Definition Of Done

This document defines the acceptance criteria for the completed coding test and future review work.

## Required Verification

- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes.
- [ ] The test suite contains exactly 11 tests.
- [ ] All 11 tests pass.

## Functional Criteria

- [ ] Homepage displays a responsive grid of books.
- [ ] Homepage supports search, sorting, clear filters, and pagination.
- [ ] Cart page exists and is reachable.
- [ ] Users can add books to the cart.
- [ ] Users can remove books from the cart.
- [ ] Adding the same book updates quantity correctly.
- [ ] Cart total item count is correct.
- [ ] Cart total price is correct.
- [ ] Cart state persists through localStorage.
- [ ] Empty cart state is handled clearly.
- [ ] Admin login uses username/password and a signed HttpOnly session cookie.
- [ ] Admin CRUD can create, edit, delete, search, sort, and page books server-side.
- [ ] Admin create requires only title and price; generated/default fields remain editable.
- [ ] Admin write actions use confirmation dialogs and success/failure toasts.

## Database Criteria

- [ ] PostgreSQL runs through Docker.
- [ ] Database schema includes a `books` table.
- [ ] Database schema includes `admin_users` and `admin_audit_logs`.
- [ ] Seed data comes from JSON.
- [ ] Database can be seeded with documented commands.
- [ ] Bootstrap admin can be seeded with documented commands.
- [ ] JSON seed data contains at least 20 realistic book records.
- [ ] Database setup is explained in README.

## UI Criteria

- [ ] UI uses a clean light theme.
- [ ] UI is responsive on mobile, tablet, and desktop.
- [ ] Reusable UI primitives are used consistently.
- [ ] Loading, error, and empty states are covered.
- [ ] Text does not overflow cards, buttons, or page sections.
- [ ] Admin dashboard uses compact responsive table/cards and non-clipped modals.

## Code Quality Criteria

- [ ] TypeScript strict mode is enabled.
- [ ] No avoidable `any` types are introduced.
- [ ] No hardcoded user-facing strings outside constants.
- [ ] Feature logic is separated from route composition.
- [ ] No unnecessary libraries are added.
- [ ] No overengineered abstractions are added.
- [ ] No unused functions, variables, folders, or stale copy constants remain.

## Documentation Criteria

- [ ] README explains setup.
- [ ] README explains database usage.
- [ ] README explains run, build, lint, and test commands.
- [ ] README explains architecture decisions.
- [ ] README includes LLM usage.
- [ ] README documents tradeoffs and future improvements.
- [ ] README documents admin setup, session-cookie auth, and audit scope.

## Accessibility Criteria

- [ ] Interactive controls have accessible names.
- [ ] Keyboard navigation works for primary interactions.
- [ ] Page headings are meaningful.
- [ ] Color contrast is acceptable for the light theme.
- [ ] Empty, loading, and error states are understandable to assistive technology.
