import { NextResponse, type NextRequest } from "next/server";
import { APP_COPY } from "@/constants/copy";
import {
  buildAdminErrorResponse,
  type AdminAuditLogsSuccessResponse
} from "@/features/admin/admin-api";
import { listAuditLogs } from "@/server/admin/audit";
import {
  getAdminFromRequest,
  getUnauthorizedAdminResponse
} from "@/server/admin/session";

export const dynamic = "force-dynamic";

function unauthorizedResponse() {
  const { body, status } = getUnauthorizedAdminResponse();
  return NextResponse.json(body, { status });
}

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  const limit = Number.parseInt(request.nextUrl.searchParams.get("limit") ?? "50", 10);

  try {
    const auditLogs = await listAuditLogs(Number.isFinite(limit) ? limit : 50);

    return NextResponse.json<AdminAuditLogsSuccessResponse>({
      data: {
        auditLogs
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
