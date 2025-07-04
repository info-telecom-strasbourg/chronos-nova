import { pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { majors, options } from "./major";

export const degree = pgEnum("degree", ["gene", "ir", "ti"]);

export const students = pgTable("Student", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  majorAlias: text("major_alias")
    .notNull()
    .references(() => majors.alias, {
      onDelete: "cascade",
    }),
  optionAlias: text("option_alias")
    .notNull()
    .references(() => options.alias, {
      onDelete: "cascade",
    }),
});
