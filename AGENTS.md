# BookHaven Codex Guidance

This repository contains **BookHaven**, an online book shop coding test. Future Codex sessions should use this file as persistent project guidance before making changes.

## Project Goal

Build a production-ready foundation for a small online book shop with:

- A homepage book grid.
- A cart page.
- Add and remove cart functionality.
- Centralized cart state.
- PostgreSQL integration through Docker.
- Responsive light-theme UI.
- Reusable components.
- TypeScript-first implementation.
- Exactly 11 Jest tests.

## Expected Stack

- Next.js with App Router.
- TypeScript with strict mode enabled.
- Tailwind CSS.
- Zustand for client-side cart state.
- PostgreSQL via Docker.
- Jest and React Testing Library.

Do not introduce unnecessary libraries. Prefer simple framework-native patterns.

## Planned Folder Structure

The implementation is expected to use this structure when app code is added:

```text
src/
  app/
  components/
    ui/
    book/
  features/
    books/
    cart/
  hooks/
  lib/
  constants/
  types/
```

This structure is now implemented and should be preserved unless a future task explicitly changes the architecture.

## Commands That Should Eventually Exist

These commands are expected for normal development:

```bash
npm run dev
npm run build
npm test
npm run lint
```

Verify these commands before claiming a change is complete.

## Coding Style

- Keep code small, readable, and production-oriented.
- Prefer explicit types for shared data models and exported APIs.
- Keep React components focused on rendering and interaction.
- Keep business logic in feature modules or stores.
- Use constants for user-facing copy, route labels, and reusable config.
- Avoid hardcoded strings in components once implementation begins.
- Use Tailwind utilities consistently and avoid one-off styling patterns.

## Constraints

- Exactly 11 Jest tests in the final implementation.
- No hardcoded user-facing strings outside the constants layer.
- No fake tests or placeholder passing tests.
- No overengineering, large abstractions, or unnecessary dependencies.
- Cart state must be centralized and persisted to localStorage.
- Database integration must use PostgreSQL through Docker.
- UI must be responsive and light themed.

## What Codex Should Avoid

- Do not scaffold full application code during documentation-only tasks.
- Do not create placeholder React components unless explicitly requested.
- Do not install dependencies unless the task is the setup phase.
- Do not add an ORM unless the user changes the requirements.
- Do not add authentication, payments, search, admin tools, or checkout unless requested.
- Do not claim features are complete before verifying them.

## Definition Of Done

The final implementation will be done only when:

- `npm run build` passes.
- `npm test` passes with exactly 11 tests.
- `npm run lint` passes.
- The homepage shows books in a responsive grid.
- The cart page supports add/remove behavior correctly.
- Cart totals are correct.
- Cart state persists through localStorage.
- PostgreSQL runs through Docker and can be seeded.
- UI states cover loading, error, and empty scenarios.
- README explains setup, database, commands, decisions, and LLM usage.

## Self-Review Before Finishing Work

Before completing any implementation task, Codex should:

1. Compare the changes against the current phase in `PLANS.md`.
2. Confirm the changes follow `CONVENTIONS.md`.
3. Check acceptance criteria in `DEFINITION_OF_DONE.md`.
4. Run relevant verification commands when they exist.
5. Review `code_review.md` for likely issues.
6. Update README or documentation if behavior, setup, or tradeoffs changed.
