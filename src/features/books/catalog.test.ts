import {
  buildCatalogApiResponse,
  buildCatalogViewModel,
  buildCatalogViewModelFromApiResponse,
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

test("normalizes catalog params and maps API response view model", () => {
  expect(normalizeQuery("  react  ")).toBe("react");
  expect(normalizeQuery(["backend", "ignored"])).toBe("backend");
  expect(parseSort("price-asc")).toBe("price-asc");
  expect(parseSort("invalid")).toBe("newest");
  expect(parsePage("2")).toBe(2);
  expect(parsePage("0")).toBe(1);

  const viewModel = buildCatalogViewModel({
    books,
    currentPage: 1,
    query: "react",
    sort: "newest",
    totalItems: 9,
    totalPages: 2
  });
  const apiResponse = buildCatalogApiResponse(viewModel);

  expect(buildCatalogViewModelFromApiResponse(apiResponse)).toEqual(viewModel);
  expect(apiResponse.data.books).toHaveLength(3);
  expect(apiResponse.meta.totalPages).toBe(2);
  expect(viewModel.hasPreviousPage).toBe(false);
  expect(viewModel.hasNextPage).toBe(true);
});
