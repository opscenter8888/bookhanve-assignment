import {
  buildCatalogViewModel,
  normalizeQuery,
  parsePage,
  parseSort
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

test("normalizes catalog query params", () => {
  expect(normalizeQuery("  react  ")).toBe("react");
  expect(normalizeQuery(["backend", "ignored"])).toBe("backend");
});

test("parses sort and page params with safe defaults", () => {
  expect(parseSort("price-asc")).toBe("price-asc");
  expect(parseSort("invalid")).toBe("newest");
  expect(parsePage("2")).toBe(2);
  expect(parsePage("0")).toBe(1);
});

test("builds catalog view model from database page results", () => {
  const viewModel = buildCatalogViewModel({
    books,
    currentPage: 1,
    query: "",
    sort: "newest",
    totalItems: 9,
    totalPages: 2
  });

  expect(viewModel.books).toHaveLength(3);
  expect(viewModel.currentPage).toBe(1);
  expect(viewModel.totalPages).toBe(2);
  expect(viewModel.hasPreviousPage).toBe(false);
  expect(viewModel.hasNextPage).toBe(true);
});

test("builds empty catalog view model for database searches with no matches", () => {
  const viewModel = buildCatalogViewModel({
    books: [],
    currentPage: 1,
    query: "missing",
    sort: "title-asc",
    totalItems: 0,
    totalPages: 1
  });

  expect(viewModel.books).toEqual([]);
  expect(viewModel.totalItems).toBe(0);
  expect(viewModel.currentPage).toBe(1);
  expect(viewModel.hasPreviousPage).toBe(false);
  expect(viewModel.hasNextPage).toBe(false);
});
