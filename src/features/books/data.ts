import { fallbackBooks } from "@/lib/books";
import { query } from "@/lib/db";
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

export type BooksResult = {
  books: Book[];
  didUseFallback: boolean;
};

export async function getBooks(): Promise<BooksResult> {
  try {
    const rows = await query<BookRow>(
      `
        SELECT id, sku, title, author, description, price_cents, cover_image_url, created_at
        FROM books
        ORDER BY created_at DESC
      `
    );

    return {
      books: rows.map(mapBook),
      didUseFallback: false
    };
  } catch {
    return {
      books: fallbackBooks,
      didUseFallback: true
    };
  }
}
