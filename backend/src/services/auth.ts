import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, type User } from "../db/schema";

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user;
}

export async function verifyUserPassword(
  email: string,
  password: string,
): Promise<User | null> {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await Bun.password.verify(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return user;
}
