import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { majors, options } from "./major";

export const degree = pgEnum("degree", ["gene", "ir", "ti"]);

export const students = pgTable("student", {
  id: uuid("id").defaultRandom().primaryKey(),
  majorAlias: text("majorAlias").references(() => majors.alias, {
    onDelete: "set null",
  }),
  optionAlias: text("optionAlias").references(() => options.alias, {
    onDelete: "set null",
  }),
});
