import { CATALOG_PAGE_SIZE, SORT_OPTIONS } from "@/constants/catalog";
import type { Book } from "@/types/book";

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export type CatalogParams = {
  page?: string | string[];
  q?: string | string[];
  sort?: string | string[];
};

export type CatalogViewModel = {
  books: Book[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  query: string;
  sort: SortKey;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

function getSingleValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export function parseSort(value: string | string[] | undefined): SortKey {
  const sortValue = getSingleValue(value);
  const match = SORT_OPTIONS.find((option) => option.value === sortValue);
  return match?.value ?? "newest";
}

export function parsePage(value: string | string[] | undefined): number {
  const pageValue = Number.parseInt(getSingleValue(value), 10);
  return Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1;
}

export function normalizeQuery(value: string | string[] | undefined): string {
  return getSingleValue(value).trim();
}

export function filterBooks(books: Book[], query: string): Book[] {
  const normalizedQuery = query.toLowerCase();

  if (!normalizedQuery) {
    return books;
  }

  return books.filter((book) => {
    const searchableText = `${book.title} ${book.author}`.toLowerCase();
    return searchableText.includes(normalizedQuery);
  });
}

export function sortBooks(books: Book[], sort: SortKey): Book[] {
  return [...books].sort((firstBook, secondBook) => {
    if (sort === "price-asc") {
      return firstBook.priceCents - secondBook.priceCents;
    }

    if (sort === "price-desc") {
      return secondBook.priceCents - firstBook.priceCents;
    }

    if (sort === "title-asc") {
      return firstBook.title.localeCompare(secondBook.title);
    }

    return (
      new Date(secondBook.createdAt).getTime() -
      new Date(firstBook.createdAt).getTime()
    );
  });
}

export function buildCatalogViewModel(
  books: Book[],
  params: CatalogParams
): CatalogViewModel {
  const query = normalizeQuery(params.q);
  const sort = parseSort(params.sort);
  const requestedPage = parsePage(params.page);
  const filteredBooks = filterBooks(books, query);
  const sortedBooks = sortBooks(filteredBooks, sort);
  const totalItems = sortedBooks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / CATALOG_PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * CATALOG_PAGE_SIZE;

  return {
    books: sortedBooks.slice(startIndex, startIndex + CATALOG_PAGE_SIZE),
    currentPage,
    totalPages,
    totalItems,
    query,
    sort,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages
  };
}
