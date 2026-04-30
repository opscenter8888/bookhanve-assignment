# BookHaven Architecture

This document describes the current architecture and ownership boundaries for BookHaven.

## Overview

BookHaven uses Next.js App Router, TypeScript, Tailwind CSS, feature folders, reusable UI primitives, centralized cart state, signed-cookie admin sessions, and PostgreSQL-backed data access. Runtime catalog data comes from the database; seed JSON is only used by the seed script.

## Routes

- `/` renders the public book catalog.
- `/cart` renders the shopper cart.
- `/admin/login` renders the admin username/password login.
- `/admin` renders the protected admin catalog dashboard.
- `/api/books` serves the public catalog with `data.books` and `meta`.
- `/api/health` checks database availability.
- `/api/admin/session` handles admin login/logout.
- `/api/admin/books` and `/api/admin/books/[id]` handle protected admin CRUD.
- `/api/admin/audit-logs` exposes protected backend audit records for operational use.

The public shop routes live under the `(shop)` route group so the shopper header stays out of the admin dashboard.

## Feature Boundaries

- `src/app` owns routes, layouts, and API route handlers.
- `src/components/ui` owns generic primitives such as Button, Card, Container, Header, Toast, LoadingState, ErrorState, and EmptyState.
- `src/components/book` owns reusable book display and catalog control components.
- `src/features/books` owns public catalog UI state, query parsing, sorting, pagination, and view models.
- `src/features/cart` owns Zustand cart state, selectors, persistence, and cart UI.
- `src/features/admin` owns admin login/dashboard UI and admin API types/validation helpers.
- `src/server` owns server-only PostgreSQL access, admin auth helpers, password hashing, sessions, and audit writes.
- `src/constants` owns user-facing copy, routes, and shared behavior/config values.
- `src/types` owns shared domain types.

## Admin Auth

Admin authentication uses `admin_users` in PostgreSQL. Passwords are hashed with Node `crypto.scrypt`; no auth library or JWT is used.

Successful login creates a signed HttpOnly cookie:

```text
bookhaven_admin_session=adminId:expiresAt:signature
```

Session cookies use `SameSite=Lax`, `path=/`, an 8-hour max age, and `Secure` in production. Rotating `ADMIN_SESSION_SECRET` invalidates existing sessions.

## Admin CRUD

Admin book management is protected by the session cookie. Create/edit flows use modals, action confirmation dialogs, and toast feedback. Only title and price are required for create; SKU, author, description, and cover URL are generated/defaulted server-side when blank.

Admin list behavior is backend-driven:

- `page` controls pagination.
- `q` searches title, author, and SKU.
- `sort` supports newest, price ascending, price descending, and title ascending.

The admin UI does not fetch all rows and sort/page in the browser.

## Audit Logging

`admin_audit_logs` records login success, login failure, logout, book create, book update, and book delete. The dashboard does not render an audit panel in v1, but the protected audit API remains available for backend/ops inspection.

Read/list actions are not logged to avoid noisy records.

## Cart State

The cart uses Zustand with localStorage persistence. It owns:

- Cart items.
- Add item.
- Remove item.
- Quantity increase/decrease.
- Total item count.
- Total price.
- Clear cart.

Server catalog data and client cart state remain separate.

## Database

PostgreSQL is accessed directly through `pg`. The schema includes:

- `books`
- `admin_users`
- `admin_audit_logs`

The database layer stays server-only. Browser code never receives database credentials or admin secrets.

## Testing

Jest and React Testing Library cover API behavior, cart logic, catalog helpers, and key UI behavior. The suite intentionally remains exactly 11 tests.
