import {
  Internship,
  Student,
  Organization,
} from "../../projetParseur/src/typeDefinition";

enum InternshipYear {
  FIRST_YEAR = "1A",
  SECOND_YEAR = "2A",
  THIRD_YEAR = "3A",
}

enum StudentMajor {
  G = "Généraliste",
  IR = "Informatique et Réseaux",
}

export const fakeInternships: Internship[] = [
  {
    subject: "AI for Healthcare",
    confidential: false,
    date: "2025-04-01",
    weeksCount: 12,
    year: InternshipYear.SECOND_YEAR,
  },
  {
    subject: "Robotics in Industry",
    confidential: true,
    date: "2025-05-15",
    weeksCount: 10,
    year: InternshipYear.SECOND_YEAR,
  },
  {
    subject: "Web Development Internship",
    confidential: false,
    date: "2025-03-20",
    weeksCount: 8,
    year: InternshipYear.FIRST_YEAR,
  },
];

export const fakeStudents: Student[] = [
  {
    lastName: "DUPONT",
    firstName: "Alice",
    major: StudentMajor.G,
  },
  {
    lastName: "MARTIN",
    firstName: "Bob",
    major: StudentMajor.IR,
  },
  {
    lastName: "SMITH",
    firstName: "Charlie",
    major: StudentMajor.IR,
  },
];

export const fakeOrganizations: Organization[] = [
  {
    orgName: "Tech Solutions",
    tutorLastName: "LEGRAND",
    tutorFirstName: "Sophie",
    orgType: "E",
    country: "FRANCE",
  },
  {
    orgName: "Google",
    tutorLastName: "DURAND",
    tutorFirstName: "Pierre",
    orgType: "E",
    country: "UNITED STATES",
  },
  {
    orgName: "WebWorks",
    tutorLastName: "GARCIA",
    tutorFirstName: "Maria",
    orgType: "E",
    country: "SPAIN",
  },
];
