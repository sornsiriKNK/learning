import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { users } from "../src/db/schema";

const SEED_EMAIL = process.env.SEED_EMAIL ?? "admin@example.com";
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? "password123";
const SEED_NAME = process.env.SEED_NAME ?? "Admin";

async function seed() {
  const passwordHash = await Bun.password.hash(SEED_PASSWORD, {
    algorithm: "bcrypt",
    cost: 10,
  });

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, SEED_EMAIL))
    .limit(1);

  if (existingUser.length > 0) {
    await db
      .update(users)
      .set({
        passwordHash,
        name: SEED_NAME,
      })
      .where(eq(users.email, SEED_EMAIL));

    console.log(`Updated seed user: ${SEED_EMAIL}`);
    return;
  }

  await db.insert(users).values({
    email: SEED_EMAIL,
    passwordHash,
    name: SEED_NAME,
  });

  console.log(`Created seed user: ${SEED_EMAIL}`);
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
