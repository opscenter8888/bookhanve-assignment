import { randomUUID } from "node:crypto";
import { query } from "@/server/db";
import { hashPassword, verifyPassword } from "@/server/admin/passwords";
import type { AdminSummary } from "@/features/admin/admin-api";

type AdminUserRow = {
  id: string;
  username: string;
  password_hash: string;
  display_name: string;
  is_active: boolean;
};

function mapAdmin(row: AdminUserRow): AdminSummary {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name
  };
}

export async function getAdminById(id: string): Promise<AdminSummary | null> {
  const rows = await query<AdminUserRow>(
    `
      SELECT id, username, password_hash, display_name, is_active
      FROM admin_users
      WHERE id = $1 AND is_active = TRUE
      LIMIT 1
    `,
    [id]
  );

  return rows[0] ? mapAdmin(rows[0]) : null;
}

export async function authenticateAdmin(
  username: string,
  password: string
): Promise<AdminSummary | null> {
  const normalizedUsername = username.trim();
  const rows = await query<AdminUserRow>(
    `
      SELECT id, username, password_hash, display_name, is_active
      FROM admin_users
      WHERE username = $1
      LIMIT 1
    `,
    [normalizedUsername]
  );
  const admin = rows[0];

  if (!admin || !admin.is_active) {
    return null;
  }

  const verified = await verifyPassword(password, admin.password_hash);

  return verified ? mapAdmin(admin) : null;
}

export async function bootstrapAdminUser(): Promise<AdminSummary> {
  const username =
    process.env.ADMIN_BOOTSTRAP_USERNAME ??
    (process.env.NODE_ENV === "production" ? "" : "admin");
  const password =
    process.env.ADMIN_BOOTSTRAP_PASSWORD ??
    (process.env.NODE_ENV === "production" ? "" : "bookhaven-admin");

  if (!username || !password) {
    throw new Error(
      "ADMIN_BOOTSTRAP_USERNAME and ADMIN_BOOTSTRAP_PASSWORD are required in production."
    );
  }

  const existing = await query<AdminUserRow>(
    `
      SELECT id, username, password_hash, display_name, is_active
      FROM admin_users
      WHERE username = $1
      LIMIT 1
    `,
    [username]
  );

  if (existing[0]) {
    return mapAdmin(existing[0]);
  }

  const passwordHash = await hashPassword(password);
  const rows = await query<AdminUserRow>(
    `
      INSERT INTO admin_users (id, username, password_hash, display_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, password_hash, display_name, is_active
    `,
    [randomUUID(), username, passwordHash, username]
  );

  return mapAdmin(rows[0]);
}
