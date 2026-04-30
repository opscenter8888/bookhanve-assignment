import {
  buildCatalogViewModel,
  filterBooks,
  sortBooks,
  type SortKey
} from "@/features/books/catalog";
import type { Book } from "@/types/book";

const books: Book[] = [
  {
    id: "react",
    sku: "BKH-R",
    title: "React Patterns",
    author: "Mina Frontend",
    description: "React testing and composition.",
    priceCents: 3000,
    coverImageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    createdAt: "2026-02-01T00:00:00.000Z"
  },
  {
    id: "systems",
    sku: "BKH-S",
    title: "Systems Thinking",
    author: "Alex Backend",
    description: "Systems and architecture.",
    priceCents: 1000,
    coverImageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    createdAt: "2026-03-01T00:00:00.000Z"
  },
  {
    id: "product",
    sku: "BKH-P",
    title: "Product Practice",
    author: "Casey Product",
    description: "Product delivery.",
    priceCents: 2000,
    coverImageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];

test("filters books by title or author", () => {
  expect(filterBooks(books, "backend").map((book) => book.id)).toEqual([
    "systems"
  ]);
  expect(filterBooks(books, "react").map((book) => book.id)).toEqual(["react"]);
});

test("sorts books by price, title, and newest date", () => {
  const sortedIds = (sort: SortKey) =>
    sortBooks(books, sort).map((book) => book.id);

  expect(sortedIds("price-asc")).toEqual(["systems", "product", "react"]);
  expect(sortedIds("price-desc")).toEqual(["react", "product", "systems"]);
  expect(sortedIds("title-asc")).toEqual(["product", "react", "systems"]);
  expect(sortedIds("newest")).toEqual(["systems", "react", "product"]);
});

test("paginates and clamps invalid page values", () => {
  const manyBooks = Array.from({ length: 10 }, (_, index) => ({
    ...books[index % books.length],
    id: `book-${index}`,
    title: `Book ${index}`
  }));

  const viewModel = buildCatalogViewModel(manyBooks, { page: "2" });
  const clampedViewModel = buildCatalogViewModel(manyBooks, { page: "99" });

  expect(viewModel.books).toHaveLength(4);
  expect(viewModel.currentPage).toBe(2);
  expect(viewModel.totalPages).toBe(2);
  expect(clampedViewModel.currentPage).toBe(2);
});

test("returns an empty view model when no books match search", () => {
  const viewModel = buildCatalogViewModel(books, { q: "missing" });

  expect(viewModel.books).toEqual([]);
  expect(viewModel.totalItems).toBe(0);
  expect(viewModel.currentPage).toBe(1);
});
