import { pgTable, text } from "drizzle-orm/pg-core";

export const majors = pgTable("major", {
  alias: text("alias").primaryKey(),
  name: text("name").notNull(),
});

export const options = pgTable("option", {
  alias: text("alias").primaryKey(),
  name: text("name").notNull(),
});
