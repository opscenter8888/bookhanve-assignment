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
| Admin CRUD | Done | `/admin` supports username/password login, modal book CRUD, confirmation dialogs, and toast feedback. Admin writes are audited in the database. |
| Commit history | Done | Changes are kept in focused commits and can be merged into `main` after verification. |

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

Create the first local admin user:

```bash
npm run db:admin
```

Default local database URL:

```text
postgres://bookhaven:bookhaven@localhost:5432/bookhaven
```

### Option B: Supabase

Supabase is PostgreSQL under the hood. This project does not need `@supabase/supabase-js` unless auth, storage, or realtime features are added later.

Set `.env.local` without wrapping quotes in hosted environment dashboards:

```bash
DATABASE_URL=postgres://...
```

Use the Supabase **Direct > Connection string** tab. If the direct `db.[project-ref].supabase.co` host does not resolve, use the **Session pooler** or **Transaction pooler** connection string from Supabase instead. On Vercel, set `DATABASE_URL` for Production and Preview, include `sslmode=require` when Supabase requires SSL, and redeploy after changing the variable.

Then run:

```bash
npm run db:schema
npm run db:seed
npm run db:admin
```

The schema script creates the `books`, `admin_users`, and `admin_audit_logs` tables. The seed script reads `database/seed/books.json` and upserts 20 book records into the database.

## Admin Setup

The admin site is available directly at `/admin`. It is intentionally not linked from the shopper navigation.

Local development defaults:

```text
ADMIN_BOOTSTRAP_USERNAME=admin
ADMIN_BOOTSTRAP_PASSWORD=bookhaven-admin
ADMIN_SESSION_SECRET=bookhaven-admin-session-secret
```

Production must set explicit values for:

```text
ADMIN_BOOTSTRAP_USERNAME
ADMIN_BOOTSTRAP_PASSWORD
ADMIN_SESSION_SECRET
```

Run `npm run db:schema` before `npm run db:admin`. The admin bootstrap command creates the first admin user only when the username does not already exist. Passwords are hashed with Node `crypto.scrypt`; raw passwords are never stored.

Admin sessions use a signed HttpOnly cookie instead of JWT. This keeps the browser flow simple, avoids localStorage tokens, and supports invalidating sessions by rotating `ADMIN_SESSION_SECRET`.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm test
npm run db:schema
npm run db:admin
npm run db:seed
```

## Architecture Overview

```text
src/
  app/
    (shop)/
    admin/
    api/
  components/
    ui/
    book/
  features/
    admin/
    books/
    cart/
  hooks/
  lib/
  server/
  constants/
  types/
```

- `src/app` owns routes, page composition, and API route handlers.
- `src/components/ui` owns reusable Button, Card, Container, Header, Toast, LoadingState, ErrorState, and EmptyState primitives.
- `src/components/book` owns BookCard, BookGrid, BookGridSkeleton, and shared catalog controls.
- `src/features/admin` owns admin dashboard UI, login UI, and admin API types.
- `src/features/books` owns catalog UI state, API response types, search, sorting, pagination, and catalog controls.
- `src/features/cart` owns Zustand state and cart UI.
- `src/lib` owns shared formatting helpers.
- `src/server` owns PostgreSQL pool setup, DB-backed catalog queries, admin sessions, password hashing, and audit writes.
- `src/constants` centralizes copy, routes, and catalog configuration.
- `src/types` contains shared Book and cart types.

## Database And Data Flow

Book records are served through `/api/books`, a Next.js Route Handler that queries PostgreSQL through the server-side data layer and direct `pg` calls. `database/seed/books.json` is only an input for `npm run db:seed`; it is not used as runtime catalog data.

The homepage UI fetches `/api/books` from the browser and requires a reachable PostgreSQL database behind that API. If the database is unavailable, the app shows a friendly error state instead of substituting bundled mock data.

Admin writes use the same `books` table as the public catalog. The `books` table includes `created_by` and `updated_by` audit columns, while detailed actions are written to `admin_audit_logs`.

## Catalog Behavior

The homepage supports:

- Search by title or author with `q`.
- Search runs only when the Search button is submitted.
- Clear filters resets search, sorting, and pagination.
- Sorting with `sort=newest`, `sort=price-asc`, `sort=price-desc`, or `sort=title-asc`.
- Pagination with `page`.
- A fixed page size of 6 books.

Search, sorting, and pagination are executed in SQL using `WHERE`, whitelisted `ORDER BY`, `LIMIT`, and `OFFSET` clauses.

### API Contract

`GET /api/books` returns:

```json
{
  "data": {
    "books": []
  },
  "meta": {
    "query": "",
    "sort": "newest",
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 0,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```

Database failures return `503`:

```json
{
  "error": {
    "code": "DATABASE_UNAVAILABLE",
    "message": "The database is unavailable. Check the PostgreSQL connection and seeded book records."
  }
}
```

`GET /api/health` returns `200` with `{ "data": { "status": "ok" } }` when PostgreSQL is reachable, or the same `503` error shape when it is not.

API examples:

```text
/api/books
/api/books?q=react&page=1&sort=title-asc
/api/books?page=2
/api/books?sort=price-asc
/api/health
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

## Admin Behavior

The admin dashboard supports:

- Username/password login at `/admin/login`.
- Signed HttpOnly session cookies with an 8-hour max age.
- Modal-based book creation with only title and price required.
- Generated SKU, default author, default description, and default cover image when optional fields are blank.
- Book detail modal for editing all book fields.
- Server-side admin search, sorting, and pagination through `/api/admin/books`.
- Custom confirmation dialogs before save, delete, and logout actions.
- Toast feedback for success and failure states.
- Hard delete for books.
- Audit log entries for login success, login failure, logout, create, update, and delete.

Admin APIs live under `/api/admin/*`. Unsafe methods check same-origin requests because authentication is cookie-based. Audit logs are stored and exposed through a protected backend API, but there is no audit log panel in the admin UI.

## Testing

Run:

```bash
npm test
```

The suite intentionally contains exactly 11 tests covering:

- cart add/remove/totals/persistence
- public catalog API response shape
- admin login, cookie behavior, authorization, validation, CRUD, and audit writes
- URL parsing and public catalog view-model helpers
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
- Admin auth uses a signed HttpOnly session cookie instead of JWT because this is a browser-only admin flow without roles or external API clients.
- Prices are stored as integer cents to avoid floating point currency issues.
- Quantity can increase from the catalog or through cart controls; decrementing the final unit removes the item.
- Checkout, payments, upload storage, and admin user management UI are intentionally out of scope.
- `npm audit` may report dependency advisories; do not run `npm audit fix --force` without reviewing breaking changes.

## Future Improvements

- Checkout flow.
- Better cover asset management.
- Admin user management and role-based permissions.
- End-to-end browser tests.
