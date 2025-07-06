import { boolean, date, integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { organizations } from "./organization";
import { students } from "./student";

export const academicYear = pgEnum("academic_year", ["1A", "2A", "3A"]);

export const internships = pgTable("internship", {
  id: uuid("id").defaultRandom().primaryKey(),
  subject: text("subject").notNull(),
  confidential: boolean("confidential").notNull().default(false),
  beginDate: date("beginDate").notNull(),
  weeksCount: integer("weeksCount").notNull(),
  academicYear: academicYear("academicYear").notNull(),
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
