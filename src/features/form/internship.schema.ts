import { z } from "zod";
import {
  academicYears,
  countries,
  organizationTypes,
  studentMajors,
  studentOptions,
} from "@/features/form/options";

const organizationTypeValues = organizationTypes.map((type) => type.value) as [string, ...string[]];
const countryValues = countries.map((country) => country.value) as [string, ...string[]];
const studentMajorValues = studentMajors.map((major) => major.value) as [string, ...string[]];
const studentOptionValues = studentOptions.map((option) => option.value) as [string, ...string[]];
const academicYearValues = academicYears.map((year) => year.value) as [string, ...string[]];

export const createInternshipSchema = z.object({
  organizationName: z.string().min(1, { message: "Le nom de l'organisation est requis" }),
  organizationType: z.enum(organizationTypeValues, {
    required_error: "Le type d'organisation est requis",
    invalid_type_error: "Type d'organisation invalide",
  }),
  organizationCountry: z.enum(countryValues, {
    required_error: "Le pays est requis",
    invalid_type_error: "Pays invalide",
  }),
  organizationCity: z.string().min(1, { message: "La ville est requise" }),
  subject: z.string().min(1, { message: "Le sujet du stage est requis" }),
  academicYear: z.enum(academicYearValues, {
    required_error: "L'année académique est requise",
    invalid_type_error: "Année académique invalide",
  }),
  beginDate: z.string().min(1, { message: "La date de début est requise" }),
  weeksCount: z
    .number({ invalid_type_error: "La durée est requise" })
    .min(1, { message: "La durée doit être d'au moins 1 semaine" }),
  studentFirstName: z.string().min(1, { message: "Le prénom de l'étudiant est requis" }),
  studentLastName: z.string().min(1, { message: "Le nom de l'étudiant est requis" }),
  studentMajor: z.enum(studentMajorValues, {
    required_error: "La filière est requise",
    invalid_type_error: "Filière invalide",
  }),
  studentOption: z.enum(studentOptionValues, {
    required_error: "L'option est requise",
    invalid_type_error: "Option invalide",
  }),
});

export type CreateInternshipFormData = z.infer<typeof createInternshipSchema>;
