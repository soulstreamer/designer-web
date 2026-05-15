import { z } from "zod";
import { eq, count } from "drizzle-orm";
import { users, localUsers, contacts, messages } from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, adminQuery } from "./middleware";

export const adminRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db = getDb();
    const [userCount] = await db.select({ count: count() }).from(users);
    const [localUserCount] = await db.select({ count: count() }).from(localUsers);
    const [contactCount] = await db.select({ count: count() }).from(contacts);
    const [messageCount] = await db.select({ count: count() }).from(messages);

    return {
      totalUsers: userCount.count,
      totalLocalUsers: localUserCount.count,
      totalContacts: contactCount.count,
      totalMessages: messageCount.count,
    };
  }),

  users: adminQuery.query(async () => {
    const db = getDb();
    const oauthUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      type: users.unionId,
      createdAt: users.createdAt,
    }).from(users);

    const localUsersList = await db.select({
      id: localUsers.id,
      name: localUsers.displayName,
      email: localUsers.email,
      role: localUsers.role,
      type: localUsers.username,
      createdAt: localUsers.createdAt,
    }).from(localUsers);

    return {
      oauthUsers: oauthUsers.map((u) => ({
        ...u,
        userType: "oauth" as const,
      })),
      localUsers: localUsersList.map((u) => ({
        ...u,
        userType: "local" as const,
      })),
    };
  }),

  updateRole: adminQuery.input(
    z.object({
      userId: z.number(),
      userType: z.enum(["oauth", "local"]),
      role: z.enum(["user", "admin"]),
    })
  ).mutation(async ({ input }) => {
    const db = getDb();
    if (input.userType === "oauth") {
      await db.update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.userId));
    } else {
      await db.update(localUsers)
        .set({ role: input.role })
        .where(eq(localUsers.id, input.userId));
    }
    return { success: true };
  }),
});
