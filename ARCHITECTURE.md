# BookHaven Intended Architecture

This document describes the implemented architecture and intended boundaries for future changes.

## Overview

BookHaven uses a small production-style architecture based on Next.js App Router, feature folders, reusable UI primitives, centralized cart state, a PostgreSQL data layer, constants, shared types, and focused tests.

## Next.js App Router

The `src/app` layer will own routing, layouts, and page composition. Page files should compose feature modules and shared components rather than containing business logic.

Planned routes:

- `/` for the homepage book grid.
- `/cart` for cart contents and totals.

## Feature-Based Folders

Feature folders will group behavior by domain:

- `features/books` for book data loading and book-specific feature logic.
- `features/books` also owns catalog search, sorting, pagination, and homepage catalog controls.
- `features/cart` for cart state, actions, selectors, and cart-specific UI behavior.

This keeps domain logic separate from route files and generic UI components.

## Reusable UI Components

The `components/ui` layer will contain generic primitives:

- Button.
- Card.
- Container.
- LoadingState.
- ErrorState.
- EmptyState.
- Header.
- Toast.

These components should stay domain-agnostic.

## Book Components

The `components/book` layer will contain reusable book display components:

- BookCard.
- BookGrid.
- BookGridSkeleton.

These components may receive event handlers from features or pages, but should not own cart business logic.

## Centralized Cart Store

The cart will use Zustand. The cart store should own:

- Cart items.
- Add item action.
- Remove item action.
- Quantity updates.
- Total item count.
- Total price.
- Clear cart action.
- localStorage persistence.

Components should call store actions rather than reimplementing cart logic.

## Database Access Layer

The database layer will use PostgreSQL through Docker. A small data access module in `src/lib` should hide connection details and expose simple query helpers.

Planned database assets:

- Docker Compose PostgreSQL service.
- Books table schema.
- JSON seed data.
- Seed script.

An ORM is not planned unless requirements change.

## Constants Layer

The `src/constants` layer will own:

- User-facing strings.
- Route labels and paths.
- Shared app metadata.
- Reusable display config.

Components should not hardcode repeated UI copy.

## Types Layer

The `src/types` layer will own cross-feature types. Feature-specific types should stay in their feature folder unless shared elsewhere.

Planned shared domain types include:

- Book.
- Cart item.
- Money or price-related display shape if needed.

## Testing Layer

Testing will use Jest and React Testing Library. The final suite must contain exactly 11 tests focused on cart logic and key component behavior.

## Planned Folder Tree

This tree is the intended implemented structure.

```text
src/
  app/
    cart/
    globals.css
    layout.tsx
    page.tsx
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
test/
```
