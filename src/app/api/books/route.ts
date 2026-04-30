import { NextResponse, type NextRequest } from "next/server";
import { APP_COPY } from "@/constants/copy";
import {
  buildCatalogApiResponse,
  type CatalogApiErrorResponse,
  type CatalogParams
} from "@/features/books/catalog";
import { getCatalog } from "@/server/books";

export const dynamic = "force-dynamic";

function getCatalogParams(request: NextRequest): CatalogParams {
  const { searchParams } = request.nextUrl;

  return {
    page: searchParams.get("page") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    sort: searchParams.get("sort") ?? undefined
  };
}

export async function GET(request: NextRequest) {
  try {
    const catalog = await getCatalog(getCatalogParams(request));

    return NextResponse.json(buildCatalogApiResponse(catalog));
  } catch {
    const response: CatalogApiErrorResponse = {
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: APP_COPY.booksErrorMessage
      }
    };

    return NextResponse.json(
      response,
      { status: 503 }
    );
  }
}
