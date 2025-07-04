import { boolean, date, integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { organizations } from "./organization";
import { students } from "./student";

export const academicYear = pgEnum("academic_year", ["1A", "2A", "3A"]);

export const internships = pgTable("internship", {
  id: uuid("id").defaultRandom().primaryKey(),
  subject: text("subject"),
  confidential: boolean("confidential"),
  beginDate: date("begin_date"),
  weeksDuration: integer("weeks_duration"),
  academicYear: academicYear("academic_year"),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, {
      onDelete: "cascade",
    }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),
});
