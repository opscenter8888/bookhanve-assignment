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
- `src/components/book` owns reusable book display components.
- `src/features/books` owns book data behavior and feature logic.
- `src/features/cart` owns cart state and cart-specific behavior.
- `src/hooks` owns shared React hooks.
- `src/lib` owns framework, database, and utility integrations.
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

## Constants Rules

- Put user-facing strings in `src/constants`.
- Put route labels and paths in constants where reused.
- Put shared numeric config in constants when it affects behavior or display.
- Do not hardcode repeated labels, empty-state copy, or error messages in components.

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
