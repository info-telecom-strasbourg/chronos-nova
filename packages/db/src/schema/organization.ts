import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const organizationType = pgEnum("organization_type", [
  "company",
  "not_company",
]);

export const organizations = pgTable("organization", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  type: organizationType("type"),
  country: text("country"),
  city: text("city"),
});
