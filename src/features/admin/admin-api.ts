import { DEFAULT_BOOK_COVER_IMAGE_URL } from "@/constants/config";
import { APP_COPY } from "@/constants/copy";
import type { Book } from "@/types/book";

export type AdminSummary = {
  id: string;
  username: string;
  displayName: string;
};

export type AdminBookInput = {
  sku?: string;
  title?: string;
  author?: string;
  description?: string;
  priceCents?: number;
  coverImageUrl?: string;
};

export type AdminBookSortKey =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "title-asc";

export type AdminBookListParams = {
  page?: string | string[] | null;
  q?: string | string[] | null;
  sort?: string | string[] | null;
};

export type AdminBookListMeta = {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  query: string;
  sort: AdminBookSortKey;
  totalItems: number;
  totalPages: number;
};

export type NormalizedCreateBookInput = {
  sku?: string;
  title: string;
  author?: string;
  description?: string;
  priceCents: number;
  coverImageUrl?: string;
};

export type NormalizedUpdateBookInput = {
  sku: string;
  title: string;
  author: string;
  description: string;
  priceCents: number;
  coverImageUrl: string;
};

export type AdminAuditLog = {
  id: string;
  actorAdminId: string | null;
  actorUsername: string;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type AdminApiErrorCode =
  | "CSRF_BLOCKED"
  | "DATABASE_UNAVAILABLE"
  | "DUPLICATE_SKU"
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "UNAUTHORIZED";

export type AdminApiErrorResponse = {
  error: {
    code: AdminApiErrorCode;
    message: string;
  };
};

export type AdminSessionSuccessResponse = {
  data: {
    authenticated: true;
    admin: AdminSummary;
  };
};

export type AdminLogoutSuccessResponse = {
  data: {
    authenticated: false;
  };
};

export type AdminBookSuccessResponse = {
  data: {
    book: Book;
  };
};

export type AdminBooksSuccessResponse = {
  data: {
    books: Book[];
  };
  meta: AdminBookListMeta;
};

export type AdminAuditLogsSuccessResponse = {
  data: {
    auditLogs: AdminAuditLog[];
  };
};

type ValidationResult<T> =
  | {
      input: T;
      ok: true;
    }
  | {
      error: AdminApiErrorResponse;
      ok: false;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getSingleValue(value: string | string[] | null | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function optionalTrimmedString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function requiredTrimmedString(value: unknown): string | null {
  return optionalTrimmedString(value) ?? null;
}

function validPriceCents(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value > 0
    ? value
    : null;
}

function validHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function buildAdminErrorResponse(
  code: AdminApiErrorCode,
  message: string
): AdminApiErrorResponse {
  return {
    error: {
      code,
      message
    }
  };
}

export function normalizeAdminBookQuery(value: string | string[] | null | undefined): string {
  return getSingleValue(value).trim();
}

export function parseAdminBookPage(value: string | string[] | null | undefined): number {
  const page = Number.parseInt(getSingleValue(value), 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function parseAdminBookSort(
  value: string | string[] | null | undefined
): AdminBookSortKey {
  const sort = getSingleValue(value);

  if (
    sort === "price-asc" ||
    sort === "price-desc" ||
    sort === "title-asc"
  ) {
    return sort;
  }

  return "newest";
}

export function validateCreateBookPayload(
  payload: unknown
): ValidationResult<NormalizedCreateBookInput> {
  if (!isRecord(payload)) {
    return {
      ok: false,
      error: buildAdminErrorResponse(
        "INVALID_REQUEST",
        APP_COPY.adminInvalidPayloadMessage
      )
    };
  }

  const title = requiredTrimmedString(payload.title);
  const priceCents = validPriceCents(payload.priceCents);
  const coverImageUrl = optionalTrimmedString(payload.coverImageUrl);

  if (
    !title ||
    priceCents === null ||
    (coverImageUrl && !validHttpUrl(coverImageUrl))
  ) {
    return {
      ok: false,
      error: buildAdminErrorResponse(
        "INVALID_REQUEST",
        APP_COPY.adminInvalidPayloadMessage
      )
    };
  }

  return {
    ok: true,
    input: {
      sku: optionalTrimmedString(payload.sku),
      title,
      author: optionalTrimmedString(payload.author),
      description: optionalTrimmedString(payload.description),
      priceCents,
      coverImageUrl
    }
  };
}

export function validateUpdateBookPayload(
  payload: unknown
): ValidationResult<NormalizedUpdateBookInput> {
  if (!isRecord(payload)) {
    return {
      ok: false,
      error: buildAdminErrorResponse(
        "INVALID_REQUEST",
        APP_COPY.adminInvalidPayloadMessage
      )
    };
  }

  const sku = requiredTrimmedString(payload.sku);
  const title = requiredTrimmedString(payload.title);
  const author = requiredTrimmedString(payload.author);
  const description = requiredTrimmedString(payload.description);
  const priceCents = validPriceCents(payload.priceCents);
  const coverImageUrl =
    optionalTrimmedString(payload.coverImageUrl) ?? DEFAULT_BOOK_COVER_IMAGE_URL;

  if (
    !sku ||
    !title ||
    !author ||
    !description ||
    priceCents === null ||
    !validHttpUrl(coverImageUrl)
  ) {
    return {
      ok: false,
      error: buildAdminErrorResponse(
        "INVALID_REQUEST",
        APP_COPY.adminInvalidPayloadMessage
      )
    };
  }

  return {
    ok: true,
    input: {
      sku,
      title,
      author,
      description,
      priceCents,
      coverImageUrl
    }
  };
}
