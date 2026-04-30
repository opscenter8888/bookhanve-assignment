# BookHaven Coding Conventions

These conventions define how BookHaven implementation and future changes should be written.

## TypeScript Rules

- Use strict TypeScript.
- Prefer explicit exported types for domain models and public APIs.
- Avoid `any`; use `unknown` and narrow when needed.
- Keep type definitions close to their feature unless shared across features.
- Use readonly arrays or objects when data should not be mutated.

## Component Naming

- Use PascalCase for React components.
- Name files after the main component they export.
- Keep component names specific and readable, such as `BookCard` and `CartSummary`.
- Avoid generic names like `Item`, `Box`, or `Thing`.

## File Naming

- Use kebab-case for non-component utility files.
- Use PascalCase for component files if the project setup chooses component-per-file naming.
- Use `*.test.ts` or `*.test.tsx` for Jest tests.
- Keep barrel files limited and avoid hiding ownership boundaries.

## Folder Ownership

- `src/app` owns routes, layouts, and page composition.
- `src/components/ui` owns generic reusable UI primitives.
- `src/components/book` owns reusable book display and catalog control components.
- `src/features/books` owns book data behavior and feature logic.
- `src/features/cart` owns cart state and cart-specific behavior.
- `src/features/admin` owns admin UI, admin API contracts, and admin validation helpers.
- `src/hooks` owns shared React hooks.
- `src/lib` owns framework and utility integrations.
- `src/server` owns server-only database, auth, session, password, and audit logic.
- `src/constants` owns strings, routes, and shared config.
- `src/types` owns cross-feature TypeScript types.

## Styling Rules

- Use Tailwind CSS utilities.
- Keep the UI light themed.
- Prefer consistent spacing, border radius, and typography.
- Do not use one-off inline styles unless there is a specific reason.
- Ensure layouts are responsive from mobile to desktop.
- Avoid decorative complexity that does not support the coding test requirements.

## State Management Rules

- Use Zustand for cart state.
- Keep cart state centralized.
- Keep derived cart totals in selectors or store helpers.
- Persist cart state to localStorage.
- Keep server data and cart state separate.
- Do not duplicate cart business logic in components.
- Keep admin catalog search, sorting, and pagination server-driven instead of fetching all rows into the browser.

## Admin Rules

- Use username/password backed by `admin_users`; do not use API-key login or JWT for the browser admin site.
- Store admin sessions in signed HttpOnly cookies.
- Hash passwords with Node `crypto.scrypt`; never store or log raw passwords.
- Protect unsafe admin methods with same-origin checks because auth is cookie-based.
- Require confirmation dialogs before admin write/logout actions; do not use browser `alert` or `confirm`.
- Show toast feedback for admin success and failure paths.
- Keep audit logging backend-focused unless an audit UI is explicitly requested.

## Constants Rules

- Put user-facing strings in `src/constants`.
- Put route labels and paths in constants where reused.
- Put shared numeric config in constants when it affects behavior or display.
- Do not hardcode repeated labels, empty-state copy, or error messages in components.
- Remove stale copy constants when UI or flows are deleted.

## Testing Rules

- The final test suite must contain exactly 11 Jest tests.
- Test cart logic and important component behavior.
- Prefer user-facing assertions with React Testing Library.
- Avoid brittle tests tied to implementation details.
- Do not create placeholder tests just to satisfy a count.

## Accessibility Rules

- Use semantic HTML where possible.
- Buttons must be real buttons or have equivalent semantics.
- Interactive elements need accessible names.
- Pages should have meaningful heading structure.
- Ensure text contrast is suitable for a light theme.
- Do not block keyboard navigation.
