import { relations } from "drizzle-orm";
import { internships } from "./internship";
import { majors, options } from "./major";
import { organizations } from "./organization";
import { students } from "./student";

export const internshipRelations = relations(internships, ({ one }) => ({
  student: one(students, {
    fields: [internships.studentId],
    references: [students.id],
  }),
  organization: one(organizations, {
    fields: [internships.organizationId],
    references: [organizations.id],
  }),
}));

export const studentRelations = relations(students, ({ one }) => ({
  major: one(majors, {
    fields: [students.majorAlias],
    references: [majors.alias],
  }),
  option: one(options, {
    fields: [students.optionAlias],
    references: [options.alias],
  }),
}));
