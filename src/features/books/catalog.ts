import { SORT_OPTIONS } from "@/constants/catalog";
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

export type CatalogMeta = Omit<CatalogViewModel, "books">;

export type CatalogApiSuccessResponse = {
  data: {
    books: Book[];
  };
  meta: CatalogMeta;
};

export type CatalogApiErrorCode = "DATABASE_UNAVAILABLE" | "INVALID_QUERY";

export type CatalogApiErrorResponse = {
  error: {
    code: CatalogApiErrorCode;
    message: string;
  };
};

export type CatalogApiResponse = CatalogApiSuccessResponse | CatalogApiErrorResponse;

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

export function buildCatalogViewModel({
  books,
  currentPage,
  query,
  sort,
  totalItems,
  totalPages
}: Pick<
  CatalogViewModel,
  "books" | "currentPage" | "query" | "sort" | "totalItems" | "totalPages"
>): CatalogViewModel {
  return {
    books,
    currentPage,
    totalPages,
    totalItems,
    query,
    sort,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages
  };
}

export function buildCatalogApiResponse(
  catalog: CatalogViewModel
): CatalogApiSuccessResponse {
  const {
    books,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    query,
    sort,
    totalItems,
    totalPages
  } = catalog;

  return {
    data: {
      books
    },
    meta: {
      currentPage,
      hasNextPage,
      hasPreviousPage,
      query,
      sort,
      totalItems,
      totalPages
    }
  };
}

export function buildCatalogViewModelFromApiResponse({
  data,
  meta
}: CatalogApiSuccessResponse): CatalogViewModel {
  return {
    books: data.books,
    ...meta
  };
}
