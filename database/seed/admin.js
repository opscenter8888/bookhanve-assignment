const { randomBytes, randomUUID, scrypt: scryptCallback } = require("node:crypto");
const { promisify } = require("node:util");
const { Client } = require("pg");
const { loadLocalEnv } = require("../env");

loadLocalEnv();

const scrypt = promisify(scryptCallback);
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://bookhaven:bookhaven@localhost:5432/bookhaven";
const username =
  process.env.ADMIN_BOOTSTRAP_USERNAME ??
  (process.env.NODE_ENV === "production" ? "" : "admin");
const password =
  process.env.ADMIN_BOOTSTRAP_PASSWORD ??
  (process.env.NODE_ENV === "production" ? "" : "bookhaven-admin");

async function hashPassword(value) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(value, salt, 64);

  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

async function main() {
  if (!username || !password) {
    throw new Error(
      "ADMIN_BOOTSTRAP_USERNAME and ADMIN_BOOTSTRAP_PASSWORD are required in production."
    );
  }

  const client = new Client({ connectionString: databaseUrl });

  await client.connect();

  const existing = await client.query(
    "SELECT id FROM admin_users WHERE username = $1 LIMIT 1",
    [username]
  );

  if (existing.rows[0]) {
    await client.end();
    console.log(`Admin user "${username}" already exists.`);
    return;
  }

  await client.query(
    `
      INSERT INTO admin_users (id, username, password_hash, display_name)
      VALUES ($1, $2, $3, $4)
    `,
    [randomUUID(), username, await hashPassword(password), username]
  );
  await client.end();
  console.log(`Created admin user "${username}".`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
