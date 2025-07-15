import { pgTable, text } from "drizzle-orm/pg-core";

export const majors = pgTable("major", {
  alias: text("alias").primaryKey(),
});

export const options = pgTable("option", {
  alias: text("alias").primaryKey(),
});
