import { NextResponse, type NextRequest } from "next/server";
import { APP_COPY } from "@/constants/copy";
import {
  buildAdminErrorResponse,
  type AdminLogoutSuccessResponse,
  type AdminSessionSuccessResponse
} from "@/features/admin/admin-api";
import { writeAuditLog } from "@/server/admin/audit";
import {
  clearAdminSessionCookie,
  getAdminFromRequest,
  getCsrfBlockedResponse,
  isSameOriginRequest,
  setAdminSessionCookie
} from "@/server/admin/session";
import { authenticateAdmin } from "@/server/admin/users";

export const dynamic = "force-dynamic";

async function readJson(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function getCredential(payload: unknown, key: "password" | "username"): string {
  if (typeof payload !== "object" || payload === null || !(key in payload)) {
    return "";
  }

  const value = (payload as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

export async function POST(request: NextRequest) {
  if (!(await isSameOriginRequest(request))) {
    const { body, status } = await getCsrfBlockedResponse();
    return NextResponse.json(body, { status });
  }

  const payload = await readJson(request);
  const username = getCredential(payload, "username").trim();
  const password = getCredential(payload, "password");

  try {
    const admin = username && password
      ? await authenticateAdmin(username, password)
      : null;

    if (!admin) {
      await writeAuditLog({
        actorUsername: username || "unknown",
        action: "session.login_failure",
        entityType: "admin_session",
        metadata: {
          username
        }
      });

      return NextResponse.json(
        buildAdminErrorResponse("UNAUTHORIZED", APP_COPY.adminInvalidLoginMessage),
        { status: 401 }
      );
    }

    await writeAuditLog({
      actor: admin,
      action: "session.login_success",
      entityType: "admin_session"
    });

    const response = NextResponse.json<AdminSessionSuccessResponse>({
      data: {
        authenticated: true,
        admin
      }
    });
    setAdminSessionCookie(response, admin.id);

    return response;
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

export async function DELETE(request: NextRequest) {
  if (!(await isSameOriginRequest(request))) {
    const { body, status } = await getCsrfBlockedResponse();
    return NextResponse.json(body, { status });
  }

  try {
    const admin = await getAdminFromRequest(request);

    if (admin) {
      await writeAuditLog({
        actor: admin,
        action: "session.logout",
        entityType: "admin_session"
      });
    }

    const response = NextResponse.json<AdminLogoutSuccessResponse>({
      data: {
        authenticated: false
      }
    });
    clearAdminSessionCookie(response);

    return response;
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
