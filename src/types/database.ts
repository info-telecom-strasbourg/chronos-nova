// Types basés sur le schéma de base de données
export interface Internship {
  internship_id: number;
  internship_subject: string;
  internship_confidential: boolean;
  internship_dates: string;
  internship_period: number;
  internship_year: string;
}

export interface Student {
  student_id: number;
  student_firstname: string;
  student_lastname: string;
  student_degree: string;
  student_course: string;
  organization_id: number;
}

export interface Organization {
  organization_id: number;
  organization_name: string;
  tutor_firstname: string;
  tutor_lastname: string;
  organization_type: string;
  organization_country: string;
  organization_city: string;
  organization_postal_code: number;
}

// Type pour les données complètes d'un stage avec ses relations
export interface CompleteInternshipData {
  internship: Internship;
  student: Student;
  organization: Organization;
}

// Type pour les props des composants (compatible avec typeDefinition du projetParseur)
export interface InternshipCardData {
  id: number;
  internship: {
    subject: string;
    confidential: boolean;
    date: string;
    weeksCount: number;
    year: string;
  };
  student: {
    firstName: string;
    lastName: string;
    major?: string;
    course?: string;
  };
  organization: {
    orgName: string;
    tutorFirstName: string;
    tutorLastName: string;
    orgType: string;
    country?: string;
    city?: string;
    postalCode?: number;
  };
}

// Types compatibles avec le projetParseur (pour import/export de données)
export interface ParsedInternship {
  subject: string;
  confidential: string | boolean;
  date: string;
  weeksCount: number | string;
  year: string;
}

export interface ParsedStudent {
  lastName: string;
  firstName: string;
  major?: string;
  course?: string;
}

export interface ParsedOrganization {
  orgName: string;
  tutorLastName: string;
  tutorFirstName: string;
  orgType: string;
  country?: string;
}

// Type combiné pour import depuis projetParseur
export interface ParsedInternshipData {
  internship: ParsedInternship;
  student: ParsedStudent;
  organization: ParsedOrganization;
}
