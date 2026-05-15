import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { contacts } from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, publicQuery, adminQuery } from "./middleware";

export const contactRouter = createRouter({
  submit: publicQuery.input(
    z.object({
      name: z.string().min(1, "Numele este obligatoriu"),
      phone: z.string().min(10, "Numarul de telefon este obligatoriu"),
      service: z.enum(["prezentare", "magazin"]),
      message: z.string().optional(),
    })
  ).mutation(async ({ input }) => {
    const db = getDb();
    const result = await db.insert(contacts).values({
      name: input.name,
      phone: input.phone,
      service: input.service,
      message: input.message || null,
    });
    return { success: true, id: Number(result[0].insertId) };
  }),

  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }),

  delete: adminQuery.input(
    z.object({ id: z.number() })
  ).mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(contacts).where(eq(contacts.id, input.id));
    return { success: true };
  }),
});
