import { NextResponse, type NextRequest } from "next/server";
import { APP_COPY } from "@/constants/copy";
import type { CatalogApiResponse, CatalogParams } from "@/features/books/catalog";
import { getCatalog } from "@/features/books/data";

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
    const response: CatalogApiResponse = { catalog };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: APP_COPY.booksErrorMessage },
      { status: 503 }
    );
  }
}
