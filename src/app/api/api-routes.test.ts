/** @jest-environment node */

import { NextRequest } from "next/server";
import { GET as getPublicBooks } from "@/app/api/books/route";
import { GET as getAdminBooks, POST as postAdminBook } from "@/app/api/admin/books/route";
import {
  DELETE as deleteAdminSession,
  POST as postAdminSession
} from "@/app/api/admin/session/route";
import {
  DELETE as deleteAdminBook,
  PUT as putAdminBook
} from "@/app/api/admin/books/[id]/route";
import { getCatalog } from "@/server/books";
import { authenticateAdmin, getAdminById } from "@/server/admin/users";
import { writeAuditLog } from "@/server/admin/audit";
import {
  createAdminBook,
  deleteAdminBook as deleteAdminBookRecord,
  DuplicateSkuError,
  listAdminBooks,
  updateAdminBook
} from "@/server/admin/books";
import { createAdminSessionValue } from "@/server/admin/session";
import type { CatalogViewModel } from "@/features/books/catalog";

jest.mock("@/server/books", () => ({
  getCatalog: jest.fn()
}));

jest.mock("@/server/admin/users", () => ({
  authenticateAdmin: jest.fn(),
  getAdminById: jest.fn()
}));

jest.mock("@/server/admin/audit", () => ({
  writeAuditLog: jest.fn()
}));

jest.mock("@/server/admin/books", () => {
  class MockDuplicateSkuError extends Error {}

  return {
    createAdminBook: jest.fn(),
    deleteAdminBook: jest.fn(),
    DuplicateSkuError: MockDuplicateSkuError,
    getAdminBook: jest.fn(),
    listAdminBooks: jest.fn(),
    updateAdminBook: jest.fn()
  };
});

const admin = {
  id: "admin-1",
  username: "admin",
  displayName: "Admin"
};

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
const mockedAuthenticateAdmin =
  authenticateAdmin as jest.MockedFunction<typeof authenticateAdmin>;
const mockedGetAdminById = getAdminById as jest.MockedFunction<typeof getAdminById>;
const mockedWriteAuditLog = writeAuditLog as jest.MockedFunction<typeof writeAuditLog>;
const mockedCreateAdminBook =
  createAdminBook as jest.MockedFunction<typeof createAdminBook>;
const mockedDeleteAdminBookRecord =
  deleteAdminBookRecord as jest.MockedFunction<typeof deleteAdminBookRecord>;
const mockedListAdminBooks = listAdminBooks as jest.MockedFunction<typeof listAdminBooks>;
const mockedUpdateAdminBook = updateAdminBook as jest.MockedFunction<typeof updateAdminBook>;

function jsonRequest(url: string, body: unknown, cookie?: string): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {})
    },
    body: JSON.stringify(body)
  });
}

function adminCookie(): string {
  return `bookhaven_admin_session=${createAdminSessionValue(admin.id)}`;
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.ADMIN_SESSION_SECRET = "test-session-secret";
  mockedGetAdminById.mockResolvedValue(admin);
  mockedWriteAuditLog.mockResolvedValue(undefined);
});

test("public books API keeps normalized data and metadata", async () => {
  mockedGetCatalog.mockResolvedValue(catalog);

  const response = await getPublicBooks(
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

test("admin session handles failed and successful login with cookies and audit", async () => {
  mockedAuthenticateAdmin.mockResolvedValueOnce(null);

  const failedResponse = await postAdminSession(
    jsonRequest("http://localhost/api/admin/session", {
      username: "admin",
      password: "wrong"
    })
  );
  const failedBody = await failedResponse.json();

  mockedAuthenticateAdmin.mockResolvedValueOnce(admin);

  const successResponse = await postAdminSession(
    jsonRequest("http://localhost/api/admin/session", {
      username: "admin",
      password: "bookhaven-admin"
    })
  );
  const successBody = await successResponse.json();
  const setCookie = successResponse.headers.get("set-cookie") ?? "";

  expect(failedResponse.status).toBe(401);
  expect(failedBody.error.code).toBe("UNAUTHORIZED");
  expect(successResponse.status).toBe(200);
  expect(successBody.data.admin).toEqual(admin);
  expect(setCookie).toContain("bookhaven_admin_session=");
  expect(setCookie).toContain("HttpOnly");
  expect(setCookie).toContain("SameSite=lax");
  expect(mockedWriteAuditLog).toHaveBeenCalledWith(
    expect.objectContaining({ action: "session.login_failure" })
  );
  expect(mockedWriteAuditLog).toHaveBeenCalledWith(
    expect.objectContaining({ action: "session.login_success" })
  );
});

test("admin book APIs enforce auth, validation, duplicate SKU, writes, and logout audit", async () => {
  const unauthorizedResponse = await getAdminBooks(
    new NextRequest("http://localhost/api/admin/books")
  );
  const invalidResponse = await postAdminBook(
    jsonRequest("http://localhost/api/admin/books", { title: "" }, adminCookie())
  );

  mockedCreateAdminBook.mockRejectedValueOnce(new DuplicateSkuError());

  const duplicateResponse = await postAdminBook(
    jsonRequest(
      "http://localhost/api/admin/books",
      {
        sku: "BKH-API",
        title: "API Design",
        priceCents: 4200
      },
      adminCookie()
    )
  );

  mockedCreateAdminBook.mockResolvedValueOnce(book);
  mockedListAdminBooks.mockResolvedValueOnce({
    books: [book],
    meta: {
      currentPage: 2,
      hasNextPage: false,
      hasPreviousPage: true,
      query: "api",
      sort: "price-desc",
      totalItems: 11,
      totalPages: 2
    }
  });
  mockedUpdateAdminBook.mockResolvedValueOnce({ ...book, title: "Updated API Design" });
  mockedDeleteAdminBookRecord.mockResolvedValueOnce(book);

  const createResponse = await postAdminBook(
    jsonRequest(
      "http://localhost/api/admin/books",
      {
        title: "API Design",
        priceCents: 4200
      },
      adminCookie()
    )
  );
  const listResponse = await getAdminBooks(
    new NextRequest("http://localhost/api/admin/books?q=api&page=2&sort=price-desc", {
      headers: { cookie: adminCookie() }
    })
  );
  const listBody = await listResponse.json();
  const updateResponse = await putAdminBook(
    new NextRequest("http://localhost/api/admin/books/api-book", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: adminCookie()
      },
      body: JSON.stringify(book)
    }),
    { params: Promise.resolve({ id: "api-book" }) }
  );
  const deleteResponse = await deleteAdminBook(
    new NextRequest("http://localhost/api/admin/books/api-book", {
      method: "DELETE",
      headers: { cookie: adminCookie() }
    }),
    { params: Promise.resolve({ id: "api-book" }) }
  );
  const logoutResponse = await deleteAdminSession(
    new NextRequest("http://localhost/api/admin/session", {
      method: "DELETE",
      headers: { cookie: adminCookie() }
    })
  );

  expect(unauthorizedResponse.status).toBe(401);
  expect(invalidResponse.status).toBe(400);
  expect(duplicateResponse.status).toBe(409);
  expect(createResponse.status).toBe(201);
  expect(listResponse.status).toBe(200);
  expect(listBody.meta).toEqual({
    currentPage: 2,
    hasNextPage: false,
    hasPreviousPage: true,
    query: "api",
    sort: "price-desc",
    totalItems: 11,
    totalPages: 2
  });
  expect(updateResponse.status).toBe(200);
  expect(deleteResponse.status).toBe(200);
  expect(logoutResponse.headers.get("set-cookie")).toContain("Max-Age=0");
  expect(mockedCreateAdminBook).toHaveBeenLastCalledWith(
    {
      title: "API Design",
      priceCents: 4200,
      sku: undefined,
      author: undefined,
      description: undefined,
      coverImageUrl: undefined
    },
    admin.username
  );
  expect(mockedListAdminBooks).toHaveBeenCalledWith({
    page: "2",
    q: "api",
    sort: "price-desc"
  });
  expect(mockedWriteAuditLog).toHaveBeenCalledWith(
    expect.objectContaining({ action: "book.create" })
  );
  expect(mockedWriteAuditLog).toHaveBeenCalledWith(
    expect.objectContaining({ action: "book.update" })
  );
  expect(mockedWriteAuditLog).toHaveBeenCalledWith(
    expect.objectContaining({ action: "book.delete" })
  );
  expect(mockedWriteAuditLog).toHaveBeenCalledWith(
    expect.objectContaining({ action: "session.logout" })
  );
});
