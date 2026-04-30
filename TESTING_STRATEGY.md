# BookHaven Testing Strategy

This document defines the testing strategy for the implemented project and future changes.

## Goals

The test suite should prove the most important behavior without becoming large or brittle. The final implementation must include exactly 11 Jest tests.

## What To Test

- Cart store behavior.
- Cart total calculations.
- Quantity updates.
- Remove and clear behavior.
- Key UI component rendering.
- Public catalog query helpers and API response shape.
- Protected admin API auth, validation, CRUD, and audit behavior.
- Empty cart state.
- Basic accessibility-minded behavior such as accessible button names.

## What Not To Test

- Framework internals.
- Tailwind class implementation details.
- Exact pixel layout.
- PostgreSQL internals.
- Next.js routing internals.
- Trivial constants.
- Mock-only behavior with no user or business value.
- Admin modal pixel layout; validate with browser QA instead.

## Current Exact 11 Test Cases

1. Cart store adds a new book and adjusts quantity.
2. Cart store removes a book explicitly and when quantity reaches zero.
3. Cart store calculates total item count and total price.
4. Cart store persists cart state through localStorage.
5. Catalog helpers normalize params and map API response view model.
6. Public books API keeps normalized `data` and `meta`.
7. Admin session handles failed and successful login with cookies and audit.
8. Admin book APIs enforce auth, validation, duplicate SKU, writes, and logout audit.
9. Loading and error states render accessible roles.
10. BookCard renders required book data, adds to cart, and shows feedback.
11. Cart UI renders item quantity controls, summary total, and cart badge count.

## Cart Store Tests

Cart store tests should use direct store actions and selectors where practical. They should avoid React rendering unless the behavior depends on component integration.

Expected coverage:

- Add item.
- Duplicate add increments quantity.
- Remove item.
- Total count.
- Total price.
- Persistence.

## Component Behavior Tests

Component tests should use React Testing Library and assert user-visible behavior.

Expected coverage:

- Buttons are accessible and clickable.
- Book cards display meaningful book information.
- Book card displays required book information.
- Cart badge and summary show the current cart state.
- Loading and error states expose accessible status/alert roles.
- Admin actions use route tests for auth, validation, CRUD, and audit coverage.

## Accessibility-Minded Tests

At least one component test should query by role and accessible name. Tests should encourage semantic HTML without requiring a separate accessibility test library.

Examples:

- Query add-to-cart controls by role `button`.
- Query page or section headings by role when appropriate.
- Assert empty-state copy is visible to users.

## Test Count Control

The final test suite must contain exactly 11 tests. Future contributors should count tests before finishing work and avoid adding incidental extra `it` or `test` blocks.
