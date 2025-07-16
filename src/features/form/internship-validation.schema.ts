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

/**
 * Schéma strict pour la validation lors de l'approbation d'un stage
 * Rejette tous les stages qui contiennent des valeurs null ou manquantes
 */
export const strictInternshipValidationSchema = z.object({
  // Organisation - toutes les valeurs doivent être présentes et valides
  organizationName: z.string().min(1, "Le nom de l'organisation est requis"),
  organizationType: z.enum(organizationTypeValues).refine((val) => val !== undefined, {
    message: "Le type d'organisation est invalide ou manquant",
  }),
  organizationCountry: z.enum(countryValues).refine((val) => val !== undefined, {
    message: "Le pays de l'organisation est invalide ou manquant",
  }),
  organizationCity: z.string().min(1, "La ville de l'organisation est requise"),

  // Stage - toutes les valeurs doivent être présentes et valides
  subject: z.string().min(1, "Le sujet du stage est requis"),
  academicYear: z.enum(academicYearValues).refine((val) => val !== undefined, {
    message: "L'année académique est invalide ou manquante",
  }),
  beginDate: z.string().min(1, "La date de début est requise"),
  weeksCount: z.number().min(1, "La durée du stage doit être d'au moins 1 semaine"),

  // Étudiant - toutes les valeurs doivent être présentes et valides
  studentMajor: z
    .string()
    .min(1, "La filière de l'étudiant est requise")
    .refine((major) => studentMajorValues.includes(major), {
      message: "La filière de l'étudiant est invalide",
    }),
  studentOption: z
    .string()
    .min(1, "L'option de l'étudiant est requise")
    .refine((option) => studentOptionValues.includes(option), {
      message: "L'option de l'étudiant est invalide",
    }),
});

/**
 * Schéma permissif pour les données parsées qui peuvent contenir des valeurs null
 * Utilisé pour stocker les données en base avec des valeurs null
 */
export const permissiveInternshipSchema = z.object({
  // Organisation - peut contenir des valeurs null
  organizationName: z.string().nullable(),
  organizationType: z.enum(organizationTypeValues).nullable(),
  organizationCountry: z.enum(countryValues).nullable(),
  organizationCity: z.string().nullable(),

  // Stage - peut contenir des valeurs null
  subject: z.string().nullable(),
  academicYear: z.enum(academicYearValues).nullable(),
  beginDate: z.string().nullable(),
  weeksCount: z.number().nullable(),

  // Étudiant - peut contenir des valeurs null
  studentMajor: z.string().nullable(),
  studentOption: z.string().nullable(),
});

export type StrictInternshipValidationData = z.infer<typeof strictInternshipValidationSchema>;
export type PermissiveInternshipData = z.infer<typeof permissiveInternshipSchema>;

/**
 * Valide si un stage peut être approuvé (toutes les données sont présentes et valides)
 */
export function validateInternshipForApproval(data: PermissiveInternshipData): {
  isValid: boolean;
  errors: string[];
} {
  try {
    strictInternshipValidationSchema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => issue.message);
      return { isValid: false, errors };
    }
    return { isValid: false, errors: ["Erreur de validation inconnue"] };
  }
}
