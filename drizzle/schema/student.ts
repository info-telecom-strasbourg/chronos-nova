import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { majors, options } from "./major";

export const degree = pgEnum("degree", ["gene", "ir", "ti"]);

export const students = pgTable("student", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  majorAlias: text("majorAlias")
    .notNull()
    .references(() => majors.alias, {
      onDelete: "cascade",
    }),
  optionAlias: text("optionAlias")
    .notNull()
    .references(() => options.alias, {
      onDelete: "cascade",
    }),
});
