import {
  Internship,
  Student,
  Organization,
} from "../../projetParseur/dist/typeDefinition.ts";

export const fakeInternships: Internship[] = [
  {
    subject: "AI for Healthcare",
    confidential: "No",
    date: "2025-04-01",
    weeksCount: 12,
  },
  {
    subject: "Robotics in Industry",
    confidential: "Yes",
    date: "2025-05-15",
    weeksCount: 10,
  },
  {
    subject: "Web Development Internship",
    confidential: "No",
    date: "2025-03-20",
    weeksCount: 8,
  },
];

export const fakeStudents: Student[] = [
  {
    lastName: "DUPONT",
    firstName: "Alice",
    major: "G",
    year: "2A",
  },
  {
    lastName: "MARTIN",
    firstName: "Bob",
    major: "IR",
    year: "2A",
  },
  {
    lastName: "SMITH",
    firstName: "Charlie",
    major: "IR",
    year: "2A",
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
