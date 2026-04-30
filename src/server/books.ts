import { CATALOG_PAGE_SIZE } from "@/constants/catalog";
import {
  buildCatalogViewModel,
  normalizeQuery,
  parsePage,
  parseSort,
  type CatalogParams,
  type CatalogViewModel,
  type SortKey
} from "@/features/books/catalog";
import { query } from "@/server/db";
import type { Book } from "@/types/book";

type BookRow = {
  id: string;
  sku: string;
  title: string;
  author: string;
  description: string;
  price_cents: number;
  cover_image_url: string;
  created_at: Date | string;
};

type CountRow = {
  total: string;
};

function mapBook(row: BookRow): Book {
  return {
    id: row.id,
    sku: row.sku,
    title: row.title,
    author: row.author,
    description: row.description,
    priceCents: row.price_cents,
    coverImageUrl: row.cover_image_url,
    createdAt:
      row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
  };
}

function getOrderBy(sort: SortKey): string {
  if (sort === "price-asc") {
    return "price_cents ASC, title ASC";
  }

  if (sort === "price-desc") {
    return "price_cents DESC, title ASC";
  }

  if (sort === "title-asc") {
    return "title ASC, created_at DESC";
  }

  return "created_at DESC, title ASC";
}

function buildWhereClause(searchQuery: string, params: unknown[]): string {
  if (!searchQuery) {
    return "";
  }

  params.push(`%${searchQuery}%`);
  return `WHERE title ILIKE $${params.length} OR author ILIKE $${params.length}`;
}

export async function getCatalog(params: CatalogParams): Promise<CatalogViewModel> {
  const searchQuery = normalizeQuery(params.q);
  const sort = parseSort(params.sort);
  const requestedPage = parsePage(params.page);
  const countParams: unknown[] = [];
  const whereClause = buildWhereClause(searchQuery, countParams);
  const countRows = await query<CountRow>(
    `SELECT COUNT(*)::text AS total FROM books ${whereClause}`,
    countParams
  );
  const totalItems = Number(countRows[0]?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / CATALOG_PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const offset = (currentPage - 1) * CATALOG_PAGE_SIZE;
  const bookParams = [...countParams, CATALOG_PAGE_SIZE, offset];
  const limitParam = bookParams.length - 1;
  const offsetParam = bookParams.length;
  const rows = await query<BookRow>(
    `
      SELECT id, sku, title, author, description, price_cents, cover_image_url, created_at
      FROM books
      ${whereClause}
      ORDER BY ${getOrderBy(sort)}
      LIMIT $${limitParam}
      OFFSET $${offsetParam}
    `,
    bookParams
  );

  return buildCatalogViewModel({
    books: rows.map(mapBook),
    currentPage,
    query: searchQuery,
    sort,
    totalItems,
    totalPages
  });
}
