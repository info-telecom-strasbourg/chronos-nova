import { boolean, date, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { organizations } from "./organization";
import { students } from "./student";

export const internships = pgTable("internship", {
  id: uuid("id").defaultRandom().primaryKey(),
  subject: text("subject").notNull(),
  confidential: boolean("confidential").notNull(),
  beginDate: date("begin_date").notNull(),
  period: integer("period").notNull(),
  year: text("year").notNull(),
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
