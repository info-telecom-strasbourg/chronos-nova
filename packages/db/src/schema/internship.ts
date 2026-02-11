import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { organizations } from "./organization";
import { students } from "./student";

export const academicYear = pgEnum("academic_year", ["1A", "2A", "3A"]);
export const state = pgEnum("state", ["visible", "draft", "deleted"]);

export const internships = pgTable("internship", {
  id: uuid("id").defaultRandom().primaryKey(),
  subject: text("subject"),
  beginDate: date("beginDate"),
  weeksCount: integer("weeksCount"),
  academicYear: academicYear("academicYear"),
  isInvalid: boolean("isInvalid").default(false).notNull(),
  studentId: uuid("studentId")
    .notNull()
    .references(() => students.id, {
      onDelete: "cascade",
    }),
  organizationId: uuid("organizationId")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),
});
