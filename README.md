# BookHaven - Online Book Shop Code Test

BookHaven is a responsive online book shop built for the coding test requirements. It uses a real PostgreSQL-backed data layer, JSON-to-database seed scripts, a polished catalog experience, centralized cart state, and exactly 11 behavior-focused Jest tests.

## Requirement Status

| Requirement | Status | Notes |
| --- | --- | --- |
| Homepage book grid | Done | `/` shows cover image, title, author, SKU, description, and price. |
| Cart page | Done | `/cart` lists selected books, quantities, item prices, totals, remove buttons, and empty state. |
| Add/remove cart | Done | Zustand store handles add, duplicate quantity increment, remove, clear, totals, and persistence. |
| Cart persistence | Done | Cart persists with `localStorage`. |
| Light responsive UI | Done | White background, responsive grid, mobile-friendly controls, subtle transitions. |
| Loading states | Done | App loading state includes a book-card skeleton grid. |
| Error states | Done | Friendly error states avoid raw technical errors when the database is unavailable. |
| Reusable components | Done | UI primitives, book components, cart components, and feature modules are separated. |
| Constants folder | Done | User-facing copy, routes, and catalog config live under `src/constants`. |
| TypeScript | Done | Strict TypeScript is enabled. |
| Jest tests | Done | Exactly 11 tests. |
| Database integration | Done | PostgreSQL via Docker by default; Supabase works through `DATABASE_URL`. |
| JSON into database | Done | `database/seed/books.json` is inserted/upserted by `npm run db:seed`. |
| Commit history | Done | Repository history is squashed into one commit and pushed to `origin/main`. |

## Stack

- Next.js App Router
- TypeScript with strict mode
- Tailwind CSS
- Zustand for centralized cart state
- PostgreSQL through Docker or Supabase
- Direct `pg` database access
- Jest and React Testing Library

No full e-commerce template or heavy UI library was used.

## Install

```bash
npm install
```

## Run The App

```bash
npm run dev
```

Open `http://localhost:3000`.

## Database Setup

BookHaven supports two database options.

### Option A: PostgreSQL With Docker

Start PostgreSQL:

```bash
docker compose up -d
```

Apply the schema:

```bash
npm run db:schema
```

Seed books from JSON:

```bash
npm run db:seed
```

Default local database URL:

```text
postgres://bookhaven:bookhaven@localhost:5432/bookhaven
```

### Option B: Supabase

Supabase is PostgreSQL under the hood. This project does not need `@supabase/supabase-js` unless auth, storage, or realtime features are added later.

Set `.env.local`:

```bash
DATABASE_URL="postgres://..."
```

Use the Supabase **Direct > Connection string** tab. If the direct `db.[project-ref].supabase.co` host does not resolve, use the **Session pooler** or **Transaction pooler** connection string from Supabase instead.

Then run:

```bash
npm run db:schema
npm run db:seed
```

The schema script creates the `books` table. The seed script reads `database/seed/books.json` and upserts 20 book records into the database.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm test
npm run db:schema
npm run db:seed
```

## Architecture Overview

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

- `src/app` owns routes, page composition, and the `/api/books` route handler.
- `src/components/ui` owns reusable Button, Card, Container, Header, Toast, LoadingState, ErrorState, and EmptyState primitives.
- `src/components/book` owns BookCard, BookGrid, and BookGridSkeleton.
- `src/features/books` owns catalog data loading, search, sorting, pagination, and catalog controls.
- `src/features/cart` owns Zustand state and cart UI.
- `src/lib` owns database and formatting helpers.
- `src/constants` centralizes copy, routes, and catalog configuration.
- `src/types` contains shared Book and cart types.

## Database And Data Flow

Book records are served through `/api/books`, a Next.js Route Handler that queries PostgreSQL through the server-side data layer and direct `pg` calls. `database/seed/books.json` is only an input for `npm run db:seed`; it is not used as runtime catalog data.

The homepage UI fetches `/api/books` from the browser and requires a reachable PostgreSQL database behind that API. If the database is unavailable, the app shows a friendly error state instead of substituting bundled mock data.

## Catalog Behavior

The homepage supports:

- Search by title or author with `q`.
- Search runs only when the Search button is submitted.
- Clear filters resets search, sorting, and pagination.
- Sorting with `sort=newest`, `sort=price-asc`, `sort=price-desc`, or `sort=title-asc`.
- Pagination with `page`.
- A fixed page size of 6 books.

Search, sorting, and pagination are executed in SQL using `WHERE`, whitelisted `ORDER BY`, `LIMIT`, and `OFFSET` clauses.

API examples:

```text
/api/books
/api/books?q=react&page=1&sort=title-asc
/api/books?page=2
/api/books?sort=price-asc
```

Examples:

```text
/?q=react&page=1&sort=title-asc
/?page=2
/?sort=price-asc
```

Invalid sort values fall back to newest first. Invalid pages are clamped to the valid page range.

## Cart Behavior

The cart uses Zustand and localStorage persistence. It supports:

- Add item.
- Add duplicate book to increment quantity.
- Remove item.
- Calculate total item count.
- Calculate total price.
- Persist across refreshes.

Shopping actions provide lightweight feedback:

- Add-to-cart button changes to `Added`.
- A toast confirms add/remove actions.
- Header cart badge updates immediately.
- Empty cart state includes a clear CTA back to the homepage.

## Testing

Run:

```bash
npm test
```

The suite intentionally contains exactly 11 tests covering:

- cart add/remove/totals/persistence
- catalog URL parsing and view-model helpers
- BookCard rendering and add feedback
- cart badge/cart summary behavior
- loading/error accessibility roles

## Verification

Before submission, run:

```bash
npm run lint
npm run build
npm test -- --runInBand
```

## LLM/Codex Usage

Codex was used to scaffold, implement, review, and refine the project. The repository includes guidance files such as `AGENTS.md`, `PLANS.md`, `ARCHITECTURE.md`, `CONVENTIONS.md`, `DEFINITION_OF_DONE.md`, `TESTING_STRATEGY.md`, and `code_review.md` to keep future AI-assisted changes consistent.

## Tradeoffs

- Direct `pg` access is used instead of an ORM to keep the data layer transparent.
- Zustand is used because cart state is small and client-focused.
- Catalog filtering, sorting, and pagination run in PostgreSQL to keep the production path database-backed.
- Prices are stored as integer cents to avoid floating point currency issues.
- Quantity can increase from the catalog or through cart controls; decrementing the final unit removes the item.
- Checkout, auth, payments, and admin tools are intentionally out of scope.
- `npm audit` may report dependency advisories; do not run `npm audit fix --force` without reviewing breaking changes.

## Future Improvements

- Checkout flow.
- Server-side database pagination for very large catalogs.
- Better cover asset management.
- End-to-end browser tests.
- Deployment documentation.
