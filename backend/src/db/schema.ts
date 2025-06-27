import { boolean, foreignKey, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const organizationsTable = pgTable("Organization", {
  organization_id: serial("organization_id").primaryKey(),
  organization_name: text("organization_name").notNull(),
  tutor_firstname: text("tutor_firstname").notNull(),
  tutor_lastname: text("tutor_lastname").notNull(),
  organization_type: text("organization_type").notNull(),
  organization_country: text("organization_country").notNull(),
  organization_city: text("organization_city").notNull(),
  organization_postal_code: integer("organization_postal_code").notNull(),
});

export const studentsTable = pgTable(
  "Student",
  {
    student_id: serial("student_id").primaryKey(),
    student_firstname: text("student_firstname").notNull(),
    student_lastname: text("student_lastname").notNull(),
    student_degree: text("student_degree").notNull(),
    student_course: text("student_course").notNull(),
    organization_id: integer("organization_id").notNull(),
  },
  (table) => ({
    orgFK: foreignKey({
      columns: [table.organization_id],
      foreignColumns: [organizationsTable.organization_id],
    }),
  }),
);

export const internshipsTable = pgTable("Internship", {
  internship_id: serial("internship_id").primaryKey(),
  internship_subject: text("internship_subject").notNull(),
  internship_confidential: boolean("internship_confidential").notNull(),
  internship_dates: text("internship_dates").notNull(),
  internship_period: integer("internship_period").notNull(),
  internship_year: text("internship_year").notNull(),
});

export const completeTable = pgTable(
  "Complete",
  {
    internship_id: integer("internship_id").notNull(),
    student_id: integer("student_id").notNull(),
  },
  (table) => ({
    internshipFK: foreignKey({
      columns: [table.internship_id],
      foreignColumns: [internshipsTable.internship_id],
    }),
    studentFK: foreignKey({
      columns: [table.student_id],
      foreignColumns: [studentsTable.student_id],
    }),
  }),
);
