import { NextResponse } from "next/server";
import { APP_COPY } from "@/constants/copy";
import type { CatalogApiErrorResponse } from "@/features/books/catalog";
import { pingDatabase } from "@/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await pingDatabase();

    return NextResponse.json({
      data: {
        status: "ok"
      }
    });
  } catch {
    const response: CatalogApiErrorResponse = {
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: APP_COPY.booksErrorMessage
      }
    };

    return NextResponse.json(response, { status: 503 });
  }
}
