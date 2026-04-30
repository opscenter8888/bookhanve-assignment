const fs = require("node:fs/promises");
const path = require("node:path");
const { Client } = require("pg");
const { loadLocalEnv } = require("./env");

loadLocalEnv();

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://bookhaven:bookhaven@localhost:5432/bookhaven";

async function main() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const schema = await fs.readFile(schemaPath, "utf8");
  const client = new Client({ connectionString: databaseUrl });

  await client.connect();
  await client.query(schema);
  await client.end();

  console.log("Applied database schema.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
