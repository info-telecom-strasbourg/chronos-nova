import { z } from "zod";

export const promotionSchema = z.enum(["1A", "2A", "3A"]);

export const filtersSchema = z.object({
  countries: z.array(z.string()),
  degrees: z.array(z.string()),
  organizations: z.array(z.string()),
  promotions: z.array(promotionSchema),
});
