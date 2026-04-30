import { randomBytes, randomUUID } from "node:crypto";
import {
  ADMIN_BOOKS_PAGE_SIZE,
  DEFAULT_BOOK_AUTHOR,
  DEFAULT_BOOK_DESCRIPTION_PREFIX,
  DEFAULT_BOOK_COVER_IMAGE_URL
} from "@/constants/config";
import { query } from "@/server/db";
import type {
  AdminBookListMeta,
  AdminBookListParams,
  NormalizedCreateBookInput,
  NormalizedUpdateBookInput
} from "@/features/admin/admin-api";
import {
  normalizeAdminBookQuery,
  parseAdminBookPage,
  parseAdminBookSort
} from "@/features/admin/admin-api";
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

export type AdminBookListResult = {
  books: Book[];
  meta: AdminBookListMeta;
};

const BOOK_SELECT_FIELDS = `
  id,
  sku,
  title,
  author,
  description,
  price_cents,
  cover_image_url,
  created_at
`;

export class DuplicateSkuError extends Error {
  constructor() {
    super("Duplicate SKU");
    this.name = "DuplicateSkuError";
  }
}

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

function isDuplicateSkuError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);

  return slug || "book";
}

function buildGeneratedSku(title: string): string {
  return `BKH-${slugify(title).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

function buildDefaultDescription(title: string): string {
  return `${DEFAULT_BOOK_DESCRIPTION_PREFIX} ${title}.`;
}

function getOrderBy(sort: string): string {
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
  return `
    WHERE
      title ILIKE $${params.length}
      OR author ILIKE $${params.length}
      OR sku ILIKE $${params.length}
  `;
}

export async function listAdminBooks(
  params: AdminBookListParams = {}
): Promise<AdminBookListResult> {
  const searchQuery = normalizeAdminBookQuery(params.q);
  const sort = parseAdminBookSort(params.sort);
  const requestedPage = parseAdminBookPage(params.page);
  const countParams: unknown[] = [];
  const whereClause = buildWhereClause(searchQuery, countParams);
  const countRows = await query<CountRow>(
    `SELECT COUNT(*)::text AS total FROM books ${whereClause}`,
    countParams
  );
  const totalItems = Number(countRows[0]?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / ADMIN_BOOKS_PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const offset = (currentPage - 1) * ADMIN_BOOKS_PAGE_SIZE;
  const bookParams = [...countParams, ADMIN_BOOKS_PAGE_SIZE, offset];
  const limitParam = bookParams.length - 1;
  const offsetParam = bookParams.length;
  const rows = await query<BookRow>(
    `
      SELECT ${BOOK_SELECT_FIELDS}
      FROM books
      ${whereClause}
      ORDER BY ${getOrderBy(sort)}
      LIMIT $${limitParam}
      OFFSET $${offsetParam}
    `,
    bookParams
  );

  return {
    books: rows.map(mapBook),
    meta: {
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      query: searchQuery,
      sort,
      totalItems,
      totalPages
    }
  };
}

export async function getAdminBook(id: string): Promise<Book | null> {
  const rows = await query<BookRow>(
    `
      SELECT ${BOOK_SELECT_FIELDS}
      FROM books
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  return rows[0] ? mapBook(rows[0]) : null;
}

export async function createAdminBook(
  input: NormalizedCreateBookInput,
  actorUsername: string
): Promise<Book> {
  try {
    const rows = await query<BookRow>(
      `
        INSERT INTO books (
          id,
          sku,
          title,
          author,
          description,
          price_cents,
          cover_image_url,
          created_by,
          updated_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
        RETURNING ${BOOK_SELECT_FIELDS}
      `,
      [
        randomUUID(),
        input.sku ?? buildGeneratedSku(input.title),
        input.title,
        input.author ?? DEFAULT_BOOK_AUTHOR,
        input.description ?? buildDefaultDescription(input.title),
        input.priceCents,
        input.coverImageUrl ?? DEFAULT_BOOK_COVER_IMAGE_URL,
        actorUsername
      ]
    );

    return mapBook(rows[0]);
  } catch (error) {
    if (isDuplicateSkuError(error)) {
      throw new DuplicateSkuError();
    }

    throw error;
  }
}

export async function updateAdminBook(
  id: string,
  input: NormalizedUpdateBookInput,
  actorUsername: string
): Promise<Book | null> {
  try {
    const rows = await query<BookRow>(
      `
        UPDATE books
        SET
          sku = $2,
          title = $3,
          author = $4,
          description = $5,
          price_cents = $6,
          cover_image_url = $7,
          updated_by = $8,
          updated_at = NOW()
        WHERE id = $1
        RETURNING ${BOOK_SELECT_FIELDS}
      `,
      [
        id,
        input.sku,
        input.title,
        input.author,
        input.description,
        input.priceCents,
        input.coverImageUrl,
        actorUsername
      ]
    );

    return rows[0] ? mapBook(rows[0]) : null;
  } catch (error) {
    if (isDuplicateSkuError(error)) {
      throw new DuplicateSkuError();
    }

    throw error;
  }
}

export async function deleteAdminBook(id: string): Promise<Book | null> {
  const rows = await query<BookRow>(
    `
      DELETE FROM books
      WHERE id = $1
      RETURNING ${BOOK_SELECT_FIELDS}
    `,
    [id]
  );

  return rows[0] ? mapBook(rows[0]) : null;
}
