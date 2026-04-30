import { NextResponse, type NextRequest } from "next/server";
import { APP_COPY } from "@/constants/copy";
import {
  buildAdminErrorResponse,
  validateCreateBookPayload,
  type AdminBookSuccessResponse,
  type AdminBooksSuccessResponse
} from "@/features/admin/admin-api";
import { writeAuditLog } from "@/server/admin/audit";
import {
  createAdminBook,
  DuplicateSkuError,
  listAdminBooks
} from "@/server/admin/books";
import {
  getAdminFromRequest,
  getCsrfBlockedResponse,
  getUnauthorizedAdminResponse,
  isSameOriginRequest
} from "@/server/admin/session";

export const dynamic = "force-dynamic";

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

function getListParams(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  return {
    page: searchParams.get("page"),
    q: searchParams.get("q"),
    sort: searchParams.get("sort")
  };
}

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  try {
    const { books, meta } = await listAdminBooks(getListParams(request));

    return NextResponse.json<AdminBooksSuccessResponse>({
      data: {
        books
      },
      meta
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

export async function POST(request: NextRequest) {
  if (!(await isSameOriginRequest(request))) {
    const { body, status } = await getCsrfBlockedResponse();
    return NextResponse.json(body, { status });
  }

  const admin = await getAdminFromRequest(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  const validation = validateCreateBookPayload(await readJson(request));

  if (!validation.ok) {
    return NextResponse.json(validation.error, { status: 400 });
  }

  try {
    const book = await createAdminBook(validation.input, admin.username);
    await writeAuditLog({
      actor: admin,
      action: "book.create",
      entityType: "book",
      entityId: book.id,
      metadata: {
        sku: book.sku,
        title: book.title
      }
    });

    return NextResponse.json<AdminBookSuccessResponse>(
      {
        data: {
          book
        }
      },
      { status: 201 }
    );
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
