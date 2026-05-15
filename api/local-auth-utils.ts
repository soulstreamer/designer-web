import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { localUsers } from "@db/schema";
import { getDb } from "./queries/connection";
import type { LocalUser } from "@db/schema";

const SECRET_KEY = new TextEncoder().encode(
  process.env.LOCAL_AUTH_SECRET || "designer-web-local-auth-secret-key-2025"
);

export async function createLocalToken(user: LocalUser): Promise<string> {
  return new SignJWT({
    localUserId: user.id,
    username: user.username,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET_KEY);
}

export async function verifyLocalToken(token: string): Promise<LocalUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      clockTolerance: 60,
    });
    const localUserId = payload.localUserId as number;
    if (!localUserId) return null;

    const db = getDb();
    const results = await db
      .select()
      .from(localUsers)
      .where(eq(localUsers.id, localUserId))
      .limit(1);

    return results[0] || null;
  } catch {
    return null;
  }
}
