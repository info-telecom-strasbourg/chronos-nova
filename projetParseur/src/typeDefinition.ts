// ========================================
// Types definition
// ========================================

export interface Internship {
  subject: string; // Subject of the internship
  confidential: string; // Is confidential
  date: string; // Date of the internship
  weeksCount: number | string; // Duration in weeks
}

export interface Student {
  lastName: string; // Last name of the student
  firstName: string; // First name of the student
  major?: string; // Major field of study
  year: string; // Year of study (1A, 2A, 3A)
}

export interface Organization {
  orgName: string; // Name of the organization
  // Tutor's information
  tutorLastName: string;
  tutorFirstName: string;
  orgType: string; // Type of organization (E = company, L = laboratory)
  country?: string; // Country of the organization
}
