// ========================================
// Types definition
// ========================================

export interface Internship {
  subject?: string; // Subject of the internship
  date?: string; // Date of the internship
  weeksCount?: number | string; // Duration in weeks
  year?: string; // Year of study for the internship (1A, 2A, 3A)
}

export interface Student {
  major?: string; // Major field of study
  option?: string; // Course specialization
}

export interface Organization {
  orgName?: string; // Name of the organization
  city?: string; // City where the organization is located
  // Tutor's information
  tutorLastName?: string;
  tutorFirstName?: string;
  orgType?: string; // Type of organization
  country?: string; // Country of the organization
}
