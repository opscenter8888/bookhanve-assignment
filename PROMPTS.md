# BookHaven Reusable Codex Prompts

These prompts are intended for future Codex sessions that extend or review BookHaven.

## Project Setup Prompt

### Goal

Initialize the BookHaven project setup phase with Next.js App Router, TypeScript strict mode, Tailwind CSS, Jest, React Testing Library, and linting.

### Constraints

- Follow `AGENTS.md`, `PLANS.md`, `CONVENTIONS.md`, and `DEFINITION_OF_DONE.md`.
- Do not implement books, cart, database logic, app features, or fake tests yet.
- Do not add unnecessary libraries.

### Done When

- Project scripts exist for dev, build, test, and lint.
- The default app builds.
- Jest is configured and can run.
- README setup instructions are updated.

### Output Expected

Summarize files created, commands added, verification results, and any remaining setup risks.

## Database Prompt

### Goal

Add PostgreSQL database setup for BookHaven through Docker.

### Constraints

- Use Docker Compose.
- Add a books table schema.
- Seed from JSON.
- Keep database access simple and avoid an ORM unless requirements change.
- Do not implement UI features in this phase.

### Done When

- PostgreSQL can start locally.
- Schema can be applied.
- Seed data can be loaded repeatedly.
- README database instructions are accurate.

### Output Expected

Summarize database files, commands, seed behavior, and verification results.

## UI Primitives Prompt

### Goal

Create reusable UI primitives for the planned light-theme responsive app.

### Constraints

- Implement only Button, Card, Container, LoadingState, ErrorState, and EmptyState.
- Keep components simple and accessible.
- Use constants for visible copy.
- Avoid building a large design system.

### Done When

- UI primitives are typed and reusable.
- Components render responsively.
- Relevant component tests are added only if this is part of the testing phase plan.

### Output Expected

Summarize components created, styling decisions, accessibility considerations, and verification results.

## Books Feature Prompt

### Goal

Implement the books feature for displaying BookHaven catalog data.

### Constraints

- Use planned feature-based folders.
- Keep database access separate from presentation components.
- Use shared types.
- Use constants for strings.
- Do not implement cart logic beyond the agreed component interface.

### Done When

- Book types exist.
- Book data can be loaded through the intended data layer.
- BookCard and BookGrid render expected information.
- Empty book lists are handled.

### Output Expected

Summarize data flow, files created, UI behavior, and verification results.

## Cart Feature Prompt

### Goal

Implement centralized cart state and cart behavior.

### Constraints

- Use Zustand.
- Persist cart state to localStorage.
- Keep cart logic out of page components.
- Use constants for visible copy.
- Avoid adding checkout, payments, or authentication.

### Done When

- Cart supports add, remove, quantity updates, total item count, total price, and clear behavior.
- Cart persists across refreshes.
- Cart UI handles empty state.

### Output Expected

Summarize store API, persistence behavior, UI integration, and verification results.

## Testing Prompt

### Goal

Add exactly 11 Jest tests for BookHaven.

### Constraints

- Use Jest and React Testing Library.
- Focus on cart logic and key component behavior.
- Do not add more or fewer than 11 tests.
- Avoid fake passing tests.

### Done When

- `npm test` passes.
- The test report shows exactly 11 passing tests.
- Tests cover the planned cases in `TESTING_STRATEGY.md`.

### Output Expected

Summarize test files, the 11 scenarios covered, and test command output.

## Admin CRUD Prompt

### Goal

Extend BookHaven with production-oriented admin catalog management.

### Constraints

- Use username/password login backed by `admin_users`.
- Use signed HttpOnly session cookies, not JWT or browser-exposed API keys.
- Keep shopper APIs and cart behavior unchanged.
- Keep admin search, sorting, and pagination server-side.
- Use confirmation dialogs and toast feedback for admin write/logout actions.
- Do not add upload storage, payments, role management, or a new auth library.
- Keep the final Jest suite at exactly 11 tests.

### Done When

- `/admin/login` and `/admin` work responsively.
- Admin create/edit/delete APIs are protected and validated.
- Optional book fields are generated/defaulted when blank.
- Audit writes cover login success/failure, logout, create, update, and delete.
- README and architecture docs describe setup, session auth, and audit scope.

### Output Expected

Summarize admin routes, schema changes, session behavior, UI behavior, tests, and verification results.

## Self-Review Prompt

### Goal

Review the BookHaven implementation against requirements before final submission.

### Constraints

- Use `code_review.md` as the checklist.
- Verify commands instead of assuming success.
- Do not change unrelated code.
- Update documentation if behavior differs from previous docs.

### Done When

- Build, lint, and tests have been run.
- Exactly 11 tests pass.
- Requirement gaps are fixed or clearly documented.
- README is accurate.

### Output Expected

Summarize checklist status, commands run, issues fixed, and remaining risks.

## README Update Prompt

### Goal

Update README after implementation changes.

### Constraints

- Do not claim unverified behavior.
- Keep setup and database instructions accurate.
- Include LLM usage and tradeoffs.
- Keep reviewer-facing language concise.

### Done When

- README reflects current commands and architecture.
- Setup, database, run, and test sections are accurate.
- Future improvements remain clearly marked as future work.

### Output Expected

Summarize README sections updated and any assumptions documented.
