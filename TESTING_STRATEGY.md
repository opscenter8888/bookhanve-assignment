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
- Book grid rendering.
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

## Current Exact 11 Test Cases

1. Cart store adds a new book and increments quantity for duplicate adds.
2. Cart store removes a book by id.
3. Cart store calculates total item count and total price.
4. Cart store persists cart state through localStorage.
5. BookCard renders required book data, adds to cart, and shows feedback.
6. Cart UI renders item quantity, summary total, and cart badge count.
7. Loading and error states render accessible roles.
8. Catalog search filters books by title or author.
9. Catalog sorting handles price, title, and newest date.
10. Catalog pagination returns the expected page slice and clamps invalid pages.
11. Catalog search returns an empty view model when no books match.

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

## Accessibility-Minded Tests

At least one component test should query by role and accessible name. Tests should encourage semantic HTML without requiring a separate accessibility test library.

Examples:

- Query add-to-cart controls by role `button`.
- Query page or section headings by role when appropriate.
- Assert empty-state copy is visible to users.

## Test Count Control

The final test suite must contain exactly 11 tests. Future contributors should count tests before finishing work and avoid adding incidental extra `it` or `test` blocks.
