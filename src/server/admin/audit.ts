import { randomUUID } from "node:crypto";
import { query } from "@/server/db";
import type { AdminAuditLog, AdminSummary } from "@/features/admin/admin-api";

type AuditLogRow = {
  id: string;
  actor_admin_id: string | null;
  actor_username: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | string;
  created_at: Date | string;
};

export type AuditAction =
  | "book.create"
  | "book.delete"
  | "book.update"
  | "session.login_failure"
  | "session.login_success"
  | "session.logout";

type WriteAuditLogInput = {
  actor?: AdminSummary | null;
  actorUsername?: string;
  action: AuditAction;
  entityType: "admin_session" | "book";
  entityId?: string | null;
  metadata?: Record<string, unknown>;
};

function mapAuditLog(row: AuditLogRow): AdminAuditLog {
  const metadata =
    typeof row.metadata === "string"
      ? JSON.parse(row.metadata) as Record<string, unknown>
      : row.metadata;

  return {
    id: row.id,
    actorAdminId: row.actor_admin_id,
    actorUsername: row.actor_username,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    metadata,
    createdAt:
      row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
  };
}

export async function writeAuditLog({
  actor,
  actorUsername,
  action,
  entityType,
  entityId = null,
  metadata = {}
}: WriteAuditLogInput): Promise<void> {
  await query(
    `
      INSERT INTO admin_audit_logs (
        id,
        actor_admin_id,
        actor_username,
        action,
        entity_type,
        entity_id,
        metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
    `,
    [
      randomUUID(),
      actor?.id ?? null,
      actor?.username ?? actorUsername ?? "unknown",
      action,
      entityType,
      entityId,
      JSON.stringify(metadata)
    ]
  );
}

export async function listAuditLogs(limit = 50): Promise<AdminAuditLog[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const rows = await query<AuditLogRow>(
    `
      SELECT
        id,
        actor_admin_id,
        actor_username,
        action,
        entity_type,
        entity_id,
        metadata,
        created_at
      FROM admin_audit_logs
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [safeLimit]
  );

  return rows.map(mapAuditLog);
}
