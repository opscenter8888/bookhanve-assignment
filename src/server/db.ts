import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null = null;

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    return databaseUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required in production.");
  }

  return "postgres://bookhaven:bookhaven@localhost:5432/bookhaven";
}

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      max: 5
    });
  }

  return pool;
}

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

export async function pingDatabase(): Promise<void> {
  await query("SELECT 1");
}
