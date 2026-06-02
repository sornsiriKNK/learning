import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

async function migrate() {
  const pool = new Pool({ connectionString: databaseUrl });
  const migrationSql = readFileSync(
    join(import.meta.dir, "../drizzle/0000_init.sql"),
    "utf8",
  );

  await pool.query(migrationSql);
  await pool.end();

  console.log("Migration completed");
}

migrate().catch((error: unknown) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
