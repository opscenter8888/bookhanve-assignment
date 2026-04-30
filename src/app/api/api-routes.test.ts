/** @jest-environment node */

import { NextRequest } from "next/server";
import { GET as getBooks } from "@/app/api/books/route";
import { GET as getHealth } from "@/app/api/health/route";
import { getCatalog } from "@/server/books";
import { pingDatabase } from "@/server/db";
import type { CatalogViewModel } from "@/features/books/catalog";

jest.mock("@/server/books", () => ({
  getCatalog: jest.fn()
}));

jest.mock("@/server/db", () => ({
  pingDatabase: jest.fn()
}));

const book = {
  id: "api-book",
  sku: "BKH-API",
  title: "API Design",
  author: "Nora Backend",
  description: "A backend API fixture.",
  priceCents: 4200,
  coverImageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
  createdAt: "2026-01-01T00:00:00.000Z"
};

const catalog: CatalogViewModel = {
  books: [book],
  currentPage: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  query: "api",
  sort: "newest",
  totalItems: 1,
  totalPages: 1
};

const mockedGetCatalog = getCatalog as jest.MockedFunction<typeof getCatalog>;
const mockedPingDatabase = pingDatabase as jest.MockedFunction<typeof pingDatabase>;

beforeEach(() => {
  jest.clearAllMocks();
});

test("GET /api/books returns normalized data and metadata", async () => {
  mockedGetCatalog.mockResolvedValue(catalog);

  const response = await getBooks(
    new NextRequest("http://localhost/api/books?q=api&page=1&sort=newest")
  );
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(mockedGetCatalog).toHaveBeenCalledWith({
    page: "1",
    q: "api",
    sort: "newest"
  });
  expect(body).toEqual({
    data: {
      books: [book]
    },
    meta: {
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      query: "api",
      sort: "newest",
      totalItems: 1,
      totalPages: 1
    }
  });
});

test("GET /api/books returns a 503 error shape when the database fails", async () => {
  mockedGetCatalog.mockRejectedValue(new Error("connection failed"));

  const response = await getBooks(new NextRequest("http://localhost/api/books"));
  const body = await response.json();

  expect(response.status).toBe(503);
  expect(body.error.code).toBe("DATABASE_UNAVAILABLE");
  expect(body.error.message).toMatch(/database/i);
});

test("GET /api/health reports database reachability", async () => {
  mockedPingDatabase.mockResolvedValueOnce(undefined);

  const okResponse = await getHealth();
  const okBody = await okResponse.json();

  mockedPingDatabase.mockRejectedValueOnce(new Error("connection failed"));

  const errorResponse = await getHealth();
  const errorBody = await errorResponse.json();

  expect(okResponse.status).toBe(200);
  expect(okBody).toEqual({ data: { status: "ok" } });
  expect(errorResponse.status).toBe(503);
  expect(errorBody.error.code).toBe("DATABASE_UNAVAILABLE");
});
