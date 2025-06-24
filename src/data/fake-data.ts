export enum InternshipYear {
  FIRST_YEAR = "1A",
  SECOND_YEAR = "2A",
  THIRD_YEAR = "3A",
  _ = "??"
}

export enum StudentMajor {
  G = "Généraliste",
  IR = "Informatique et Réseaux",
  TI = "TI Santé",
  M = "Master",
}

export enum OrgType {
  E = "Entreprise",
  L = "Hors Entreprise",
  _ = "Hors Entreprise",
}

export interface InternshipFD {
  id: number; // Unique identifier for the internship
  subject: string; // Subject of the internship
  confidential: string | boolean; // Is confidential
  date: string; // Date of the internship
  weeksCount: number; // Duration in weeks
  year: InternshipYear; // Year of study for the internship (1A, 2A, 3A)
}

export interface StudentFD {
  id: number; // Unique identifier for the student
  lastName: string; // Last name of the student
  firstName: string; // First name of the student
  major: StudentMajor; // Major field of study
}

export interface OrganizationFD {
  id: number; // Unique identifier for the organization
  orgName: string; // Name of the organization
  // Tutor's information
  tutorLastName: string;
  tutorFirstName: string;
  orgType: OrgType; // Type of organization (E = company, L = laboratory)
  country: string; // Country of the organization
  city: string; // City of the organization
}


export const fakeInternships: InternshipFD[] = [
  {
    id: 1,
    subject: "AI for Healthcare",
    confidential: false,
    date: "2025-04-01",
    weeksCount: 12,
    year: InternshipYear.SECOND_YEAR,
  },
  {
    id: 2,
    subject: "Robotics in Industry",
    confidential: true,
    date: "2025-05-15",
    weeksCount: 10,
    year: InternshipYear.SECOND_YEAR,
  },
  {
    id: 3,
    subject: "Web Development Internship",
    confidential: false,
    date: "2025-07-24",
    weeksCount: 8,
    year: InternshipYear.FIRST_YEAR,
  },
  {
    id: 4,
    subject: "Web Development",
    confidential: false,
    date: "2025-06-20",
    weeksCount: 8,
    year: InternshipYear.FIRST_YEAR,
  },
  {
    id: 5,
    subject: "Chronos Internship",
    confidential: false,
    date: "2025-06-17",
    weeksCount: 8,
    year: InternshipYear.FIRST_YEAR,
  },
  {
    id: 6,
    subject: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.",
    confidential: false,
    date: "2024-03-20",
    weeksCount: 6,
    year: InternshipYear.THIRD_YEAR,
  },
  {
    id: 7,
    subject: "Unknown",
    confidential: false,
    date: "2021-03-20",
    weeksCount: 8,
    year: InternshipYear.FIRST_YEAR,
  },

];

export const fakeStudents: StudentFD[] = [
  {
    id: 1,
    lastName: "DUPONT",
    firstName: "Alice",
    major: StudentMajor.G,
  },
  {
    id: 2,
    lastName: "MARTIN",
    firstName: "Bob",
    major: StudentMajor.IR,
  },
  {
    id: 3,
    lastName: "SMITH",
    firstName: "Charlie",
    major: StudentMajor.TI,
  },
  {
    id: 4,
    lastName: "SMITH",
    firstName: "Charlie",
    major: StudentMajor.G,
  },
  {
    id: 5,
    lastName: "SMITH",
    firstName: "Charlie",
    major: StudentMajor.TI,
  },
  {
    id: 6,
    lastName: "SMITH",
    firstName: "Charlie",
    major: StudentMajor.IR,
  },
  {
    id: 7,
    lastName: "SMITH",
    firstName: "Charlie",
    major: StudentMajor.TI,
  },
];

export const fakeOrganizations: OrganizationFD[] = [
  {
    id: 1,
    orgName: "Tech Solutions",
    tutorLastName: "LEGRAND",
    tutorFirstName: "Sophie",
    orgType: OrgType.E,
    country: "AFRIQUE DU SUD",
    city: "Cape Town",
  },
  {
    id: 2,
    orgName: "Google",
    tutorLastName: "DURAND",
    tutorFirstName: "Pierre",
    orgType: OrgType.E,
    country: "ETATS-UNIS",
    city: "Mountain View",
  },
  {
    id: 3,
    orgName: "WebWorks",
    tutorLastName: "GARCIA",
    tutorFirstName: "Maria",
    orgType: OrgType.L,
    country: "ESPAGNE",
    city: "Madrid",
  },
  {
    id: 4,
    orgName: "Google France",
    tutorLastName: "GARCIA",
    tutorFirstName: "Maria",
    orgType: OrgType.L,
    country: "ESPAGNE",
    city: "Barcelone",
  },
  {
    id: 5,
    orgName: "Crous",
    tutorLastName: "GARCIA",
    tutorFirstName: "Maria",
    orgType: OrgType.L,
    country: "FRANCE",
    city: "Strasbourg",
  },
  {
    id: 6,
    orgName: "Bosch",
    tutorLastName: "GARCIA",
    tutorFirstName: "Maria",
    orgType: OrgType.L,
    country: "ALLEMAGNE",
    city: "Stuttgart",
  },
  {
    id: 7,
    orgName: "Bosch",
    tutorLastName: "GARCIA",
    tutorFirstName: "Maria",
    orgType: OrgType.L,
    country: "ALLEMAGNE",
    city: "Berlin",
  },

];
