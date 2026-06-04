import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

async function migrate() {
  const pool = new Pool({ connectionString: databaseUrl });
  const migrationsDir = join(import.meta.dir, "../drizzle");
  const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    const migrationSql = readFileSync(join(migrationsDir, file), "utf8");
    await pool.query(migrationSql);
    console.log(`Applied ${file}`);
  }

  await pool.end();

  console.log("Migration completed");
}

migrate().catch((error: unknown) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
