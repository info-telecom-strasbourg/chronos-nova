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

// Types pour la gestion des doublons
export type InternshipHashData = {
  subject: string | null;
  beginDate: string | null;
  weeksCount: number | null;
  academicYear: string | null;
  organizationName: string | null;
  organizationType: string | null;
  organizationCountry: string | null;
  organizationCity: string | null;
};

export type DuplicateCheckResult = {
  isDuplicate: boolean;
  duplicateId?: string;
};

export type InternshipValidationResult = {
  canApprove: boolean;
  errors: string[];
  isDuplicate: boolean;
};
