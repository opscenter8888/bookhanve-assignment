import { NextResponse, type NextRequest } from "next/server";
import { APP_COPY } from "@/constants/copy";
import {
  buildAdminErrorResponse,
  validateUpdateBookPayload,
  type AdminBookSuccessResponse
} from "@/features/admin/admin-api";
import { writeAuditLog } from "@/server/admin/audit";
import {
  deleteAdminBook,
  DuplicateSkuError,
  getAdminBook,
  updateAdminBook
} from "@/server/admin/books";
import {
  getAdminFromRequest,
  getCsrfBlockedResponse,
  getUnauthorizedAdminResponse,
  isSameOriginRequest
} from "@/server/admin/session";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function readJson(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function unauthorizedResponse() {
  const { body, status } = getUnauthorizedAdminResponse();
  return NextResponse.json(body, { status });
}

function notFoundResponse() {
  return NextResponse.json(
    buildAdminErrorResponse("NOT_FOUND", APP_COPY.adminNotFoundMessage),
    { status: 404 }
  );
}

export async function GET(request: NextRequest, context: RouteContext) {
  const admin = await getAdminFromRequest(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;

  try {
    const book = await getAdminBook(id);

    if (!book) {
      return notFoundResponse();
    }

    return NextResponse.json<AdminBookSuccessResponse>({
      data: {
        book
      }
    });
  } catch {
    return NextResponse.json(
      buildAdminErrorResponse(
        "DATABASE_UNAVAILABLE",
        APP_COPY.adminGenericErrorMessage
      ),
      { status: 503 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!(await isSameOriginRequest(request))) {
    const { body, status } = await getCsrfBlockedResponse();
    return NextResponse.json(body, { status });
  }

  const admin = await getAdminFromRequest(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  const validation = validateUpdateBookPayload(await readJson(request));

  if (!validation.ok) {
    return NextResponse.json(validation.error, { status: 400 });
  }

  const { id } = await context.params;

  try {
    const book = await updateAdminBook(id, validation.input, admin.username);

    if (!book) {
      return notFoundResponse();
    }

    await writeAuditLog({
      actor: admin,
      action: "book.update",
      entityType: "book",
      entityId: book.id,
      metadata: {
        sku: book.sku,
        title: book.title
      }
    });

    return NextResponse.json<AdminBookSuccessResponse>({
      data: {
        book
      }
    });
  } catch (error) {
    if (error instanceof DuplicateSkuError) {
      return NextResponse.json(
        buildAdminErrorResponse("DUPLICATE_SKU", APP_COPY.adminDuplicateSkuMessage),
        { status: 409 }
      );
    }

    return NextResponse.json(
      buildAdminErrorResponse(
        "DATABASE_UNAVAILABLE",
        APP_COPY.adminGenericErrorMessage
      ),
      { status: 503 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!(await isSameOriginRequest(request))) {
    const { body, status } = await getCsrfBlockedResponse();
    return NextResponse.json(body, { status });
  }

  const admin = await getAdminFromRequest(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;

  try {
    const book = await deleteAdminBook(id);

    if (!book) {
      return notFoundResponse();
    }

    await writeAuditLog({
      actor: admin,
      action: "book.delete",
      entityType: "book",
      entityId: book.id,
      metadata: {
        sku: book.sku,
        title: book.title
      }
    });

    return NextResponse.json<AdminBookSuccessResponse>({
      data: {
        book
      }
    });
  } catch {
    return NextResponse.json(
      buildAdminErrorResponse(
        "DATABASE_UNAVAILABLE",
        APP_COPY.adminGenericErrorMessage
      ),
      { status: 503 }
    );
  }
}
