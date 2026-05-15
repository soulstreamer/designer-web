import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { localUsers } from "@db/schema";
import { getDb } from "./queries/connection";
import { createLocalToken, verifyLocalToken } from "./local-auth-utils";
import { createRouter, publicQuery } from "./middleware";
import { TRPCError } from "@trpc/server";

export const localAuthRouter = createRouter({
  register: publicQuery.input(
    z.object({
      username: z.string().min(3).max(64),
      displayName: z.string().min(1).max(255),
      email: z.string().email(),
      password: z.string().min(6),
    })
  ).mutation(async ({ input }) => {
    const db = getDb();

    // Check if username exists
    const existingUsername = await db
      .select()
      .from(localUsers)
      .where(eq(localUsers.username, input.username))
      .limit(1);

    if (existingUsername.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Username already taken",
      });
    }

    // Check if email exists
    const existingEmail = await db
      .select()
      .from(localUsers)
      .where(eq(localUsers.email, input.email))
      .limit(1);

    if (existingEmail.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const result = await db.insert(localUsers).values({
      username: input.username,
      displayName: input.displayName,
      email: input.email,
      passwordHash,
    });

    const newUser = await db
      .select()
      .from(localUsers)
      .where(eq(localUsers.id, Number(result[0].insertId)))
      .limit(1);

    const user = newUser[0];
    const token = await createLocalToken(user);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
    };
  }),

  login: publicQuery.input(
    z.object({
      username: z.string(),
      password: z.string(),
    })
  ).mutation(async ({ input }) => {
    const db = getDb();

    const results = await db
      .select()
      .from(localUsers)
      .where(eq(localUsers.username, input.username))
      .limit(1);

    const user = results[0];
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid username or password",
      });
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid username or password",
      });
    }

    const token = await createLocalToken(user);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
    };
  }),

  me: publicQuery.query(async ({ ctx }) => {
    const token = ctx.req.headers.get("x-local-auth-token");
    if (!token) return null;

    const user = await verifyLocalToken(token);
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      name: user.displayName || user.username,
      email: user.email,
      role: user.role,
    };
  }),
});
