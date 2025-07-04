import { boolean, date, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { organizations } from "./organization";
import { students } from "./student";

export const internships = pgTable("internship", {
  id: uuid("id").defaultRandom().primaryKey(),
  subject: text("subject"),
  confidential: boolean("confidential"),
  beginDate: date("begin_date"),
  weeks_duration: integer("weeks_duration"),
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
