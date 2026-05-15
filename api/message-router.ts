import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { messages } from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, publicQuery, adminQuery } from "./middleware";

export const messageRouter = createRouter({
  create: publicQuery.input(
    z.object({
      name: z.string().min(1, "Numele este obligatoriu"),
      email: z.string().email("Email invalid"),
      content: z.string().min(1, "Mesajul este obligatoriu").max(2000),
    })
  ).mutation(async ({ input }) => {
    const db = getDb();
    const result = await db.insert(messages).values({
      name: input.name,
      email: input.email,
      content: input.content,
    });
    return { success: true, id: Number(result[0].insertId) };
  }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(messages).orderBy(desc(messages.createdAt));
  }),

  delete: adminQuery.input(
    z.object({ id: z.number() })
  ).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(messages).where(eq(messages.id, input.id));
    return { success: true };
  }),
});
