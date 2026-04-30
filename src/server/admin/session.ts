import { createHmac, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS
} from "@/constants/config";
import { APP_COPY } from "@/constants/copy";
import {
  buildAdminErrorResponse,
  type AdminApiErrorResponse,
  type AdminSummary
} from "@/features/admin/admin-api";
import { getAdminById } from "@/server/admin/users";

const LOCAL_ADMIN_SESSION_SECRET = "bookhaven-admin-session-secret";

type ParsedSession = {
  adminId: string;
  expiresAt: number;
};

function getAdminSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET is required in production.");
  }

  return LOCAL_ADMIN_SESSION_SECRET;
}

function signPayload(payload: string): string {
  return createHmac("sha256", getAdminSessionSecret())
    .update(payload)
    .digest("hex");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function createAdminSessionValue(adminId: string, now = Date.now()): string {
  const expiresAt = now + ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${adminId}:${expiresAt}`;

  return `${payload}:${signPayload(payload)}`;
}

export function parseAdminSessionValue(value: string | undefined): ParsedSession | null {
  if (!value) {
    return null;
  }

  const [adminId, expiresAtValue, signature] = value.split(":");
  const expiresAt = Number(expiresAtValue);

  if (!adminId || !signature || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return null;
  }

  const payload = `${adminId}:${expiresAt}`;

  return safeEqual(signature, signPayload(payload))
    ? {
        adminId,
        expiresAt
      }
    : null;
}

export async function getAdminFromSessionValue(
  value: string | undefined
): Promise<AdminSummary | null> {
  const parsedSession = parseAdminSessionValue(value);

  if (!parsedSession) {
    return null;
  }

  return getAdminById(parsedSession.adminId);
}

export async function getAdminFromRequest(
  request: NextRequest
): Promise<AdminSummary | null> {
  return getAdminFromSessionValue(
    request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  );
}

export function setAdminSessionCookie(
  response: NextResponse,
  adminId: string
): void {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: createAdminSessionValue(adminId),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS
  });
}

export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export function getUnauthorizedAdminResponse(): {
  body: AdminApiErrorResponse;
  status: 401;
} {
  return {
    status: 401,
    body: buildAdminErrorResponse(
      "UNAUTHORIZED",
      APP_COPY.adminUnauthorizedMessage
    )
  };
}

export async function isSameOriginRequest(request: NextRequest): Promise<boolean> {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  const headerStore = await headers();
  const host = request.headers.get("host") ?? headerStore.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";

  return origin === `${protocol}://${host}` || origin === `https://${host}`;
}

export async function getCsrfBlockedResponse(): Promise<{
  body: AdminApiErrorResponse;
  status: 403;
}> {
  return {
    status: 403,
    body: buildAdminErrorResponse("CSRF_BLOCKED", APP_COPY.adminGenericErrorMessage)
  };
}
