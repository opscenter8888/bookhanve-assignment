const fs = require("node:fs/promises");
const path = require("node:path");
const { Client } = require("pg");
const { loadLocalEnv } = require("../env");

loadLocalEnv();

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://bookhaven:bookhaven@localhost:5432/bookhaven";

async function main() {
  const booksPath = path.join(__dirname, "books.json");
  const books = JSON.parse(await fs.readFile(booksPath, "utf8"));
  const client = new Client({ connectionString: databaseUrl });

  await client.connect();

  for (const book of books) {
    await client.query(
      `
        INSERT INTO books (
          id,
          sku,
          title,
          author,
          description,
          price_cents,
          cover_image_url,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id)
        DO UPDATE SET
          sku = EXCLUDED.sku,
          title = EXCLUDED.title,
          author = EXCLUDED.author,
          description = EXCLUDED.description,
          price_cents = EXCLUDED.price_cents,
          cover_image_url = EXCLUDED.cover_image_url,
          created_at = EXCLUDED.created_at,
          updated_at = NOW()
      `,
      [
        book.id,
        book.sku,
        book.title,
        book.author,
        book.description,
        book.priceCents,
        book.coverImageUrl,
        book.createdAt
      ]
    );
  }

  await client.end();
  console.log(`Seeded ${books.length} books.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
