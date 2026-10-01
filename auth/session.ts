import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sessions, users } from "@/db/schema";

const COOKIE_NAME = "session";
const SESSION_DAYS = 30;

// The cookie holds a random token; the database only stores its hash,
// so a leaked database can't be used to log in.
function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// Must be called from a server action or route handler (it sets a cookie).
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt });

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// Must be called from a server action or route handler (it deletes a cookie).
export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  }
  cookieStore.delete(COOKIE_NAME);
}

export type CurrentUser = { id: string; name: string; email: string };

// The one place that answers "who is logged in?". Returns only safe
// fields (never the password hash). cache() dedupes calls per request.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  const [row] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, hashToken(token)))
    .limit(1);

  if (!row || row.expiresAt.getTime() < Date.now()) return null;

  return { id: row.id, name: row.name, email: row.email };
});
