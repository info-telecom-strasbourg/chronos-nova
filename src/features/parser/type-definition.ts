// ========================================
// Types definition
// ========================================

export interface Internship {
  subject?: string | null; // Subject of the internship
  date?: string | null; // Date of the internship
  weeksCount?: number | null; // Duration in weeks
  year?: string | null; // Year of study for the internship (1A, 2A, 3A)
}

export interface Student {
  major?: string | null; // Major field of study
  option?: string | null; // Course specialization
}

export interface Organization {
  orgName?: string | null; // Name of the organization
  city?: string | null; // City where the organization is located
  // Tutor's information
  tutorLastName?: string | null;
  tutorFirstName?: string | null;
  orgType?: string | null; // Type of organization
  country?: string | null; // Country of the organization
}
