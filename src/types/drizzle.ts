import type { internships, majors, options, organizations, students } from "../../drizzle/schema";

export type Internship = typeof internships.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type Option = typeof options.$inferSelect;
export type Major = typeof majors.$inferSelect;

export type InternshipData = Internship & {
  organization: Organization;
  student: Student & {
    major: Major;
    option: Option;
  };
};
