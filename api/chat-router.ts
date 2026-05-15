import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

export const chatRouter = createRouter({
  send: publicQuery.input(
    z.object({
      message: z.string().min(1).max(2000),
      history: z.array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })
      ).optional(),
    })
  ).mutation(async ({ input }) => {
    const systemPrompt = `Esti asistentul virtual al Designer-Web.ro, o agentie de web design din Romania. Ajuti clientii cu informatii despre serviciile noastre: Pagini Prezentare (1200 RON) si Magazine Online (1700 RON). Contact: Alexandria, Teleorman, 0767 494 319, contact@designer-web.ro. Raspunzi in limba romana, fiind prietenos si profesional.`;

    try {
      const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.KIMI_API_KEY || ""}`,
        },
        body: JSON.stringify({
          model: "moonshot-v1-8k",
          messages: [
            { role: "system", content: systemPrompt },
            ...(input.history || []).map((h) => ({ role: h.role, content: h.content })),
            { role: "user", content: input.message },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        // Fallback response when API is unavailable
        return {
          response: "Buna! Sunt asistentul virtual Designer-Web.ro. Poti sa ma intrebi despre serviciile noastre: Pagina Prezentare Unicat (1.200 RON) sau Pagina Magazin Online (1.700 RON). De asemenea, poti sa ne contactezi la 0767 494 319 sau pe WhatsApp. Cu ce te putem ajuta?",
        };
      }

      const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const content = data.choices?.[0]?.message?.content || "";
      return { response: content };
    } catch {
      return {
        response: "Buna! Sunt asistentul virtual Designer-Web.ro. Poti sa ma intrebi despre serviciile noastre: Pagina Prezentare Unicat (1.200 RON) sau Pagina Magazin Online (1.700 RON). Contact: 0767 494 319. Cu ce te putem ajuta?",
      };
    }
  }),
});
