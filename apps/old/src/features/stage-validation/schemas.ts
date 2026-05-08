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
 * Schéma strict pour la validation lors de l'approbation d'un stage.
 * Rejette tous les stages qui contiennent des valeurs null, "__inconnu__" ou manquantes.
 *
 * Utilisation : Validation avant approbation d'un stage par un administrateur.
 * Le stage doit avoir toutes ses données complètes et valides pour être approuvé.
 */
export const stageApprovalSchema = z.object({
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
    .refine((major) => studentMajorValues.includes(major) && major !== "__inconnu__", {
      message: "La filière de l'étudiant est invalide ou inconnue",
    }),
  studentOption: z
    .string()
    .min(1, "L'option de l'étudiant est requise")
    .refine((option) => studentOptionValues.includes(option) && option !== "__inconnu__", {
      message: "L'option de l'étudiant est invalide ou inconnue",
    }),
});

/**
 * Schéma permissif pour l'import de données Excel et le stockage en base.
 * Accepte les valeurs null et "__inconnu__" pour permettre l'import de données incomplètes
 * qui pourront être complétées plus tard avant approbation.
 *
 * Utilisation : Import Excel, stockage temporaire de stages en attente.
 */
export const stageImportSchema = z.object({
  // Organisation - peut contenir des valeurs null
  organizationName: z.string().nullable(),
  organizationType: z.string().nullable(), // Accepte toutes les chaînes y compris "__inconnu__"
  organizationCountry: z.string().nullable(), // Accepte toutes les chaînes y compris "__inconnu__"
  organizationCity: z.string().nullable(),

  // Stage - peut contenir des valeurs null
  subject: z.string().nullable(),
  academicYear: z.string().nullable(), // Accepte toutes les chaînes y compris "__inconnu__"
  beginDate: z.string().nullable(),
  weeksCount: z.number().nullable(),

  // Étudiant - peut contenir des valeurs null ou "__inconnu__"
  studentMajor: z.string().nullable(), // Accepte toutes les chaînes y compris "__inconnu__"
  studentOption: z.string().nullable(), // Accepte toutes les chaînes y compris "__inconnu__"
});

/**
 * Schéma pour la création/modification de stages via formulaire.
 * Plus strict que l'import mais autorise certaines valeurs par défaut.
 *
 * Utilisation : Formulaires de création et modification de stages.
 */
export const stageFormSchema = z.object({
  organizationName: z.string().min(1),
  organizationType: z.enum(organizationTypeValues).refine((val) => val !== undefined),
  organizationCountry: z.enum(countryValues).refine((val) => val !== undefined),
  organizationCity: z.string().min(1),
  subject: z.string().min(1),
  academicYear: z.enum(academicYearValues).refine((val) => val !== undefined),
  beginDate: z.string().min(1),
  weeksCount: z.number().min(1),
  studentMajor: z
    .string()
    .min(1, { message: "Le diplôme est requis" })
    .refine((major) => studentMajorValues.includes(major) && major !== "__inconnu__"),
  studentOption: z
    .string()
    .min(1, { message: "L'option est requise" })
    .refine((option) => studentOptionValues.includes(option) && option !== "__inconnu__"),
});

export type StageApprovalData = z.infer<typeof stageApprovalSchema>;
export type StageImportData = z.infer<typeof stageImportSchema>;
export type StageFormData = z.infer<typeof stageFormSchema>;

/**
 * Valide si un stage peut être approuvé (toutes les données sont présentes et valides).
 */
export function validateStageForApproval(data: StageImportData): {
  isValid: boolean;
  errors: string[];
} {
  try {
    stageApprovalSchema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => issue.message);
      return { isValid: false, errors };
    }
    return { isValid: false, errors: ["Erreur de validation inconnue"] };
  }
}

/**
 * Vérifie si un stage contient des valeurs manquantes ou inconnues.
 * Un stage "mal importé" contient au moins une valeur null ou "__inconnu__".
 */
export function isBadlyImportedStage(stage: Partial<StageImportData>): boolean {
  const values = [
    stage.organizationName,
    stage.organizationType,
    stage.organizationCountry,
    stage.organizationCity,
    stage.subject,
    stage.academicYear,
    stage.beginDate,
    stage.weeksCount,
    stage.studentMajor,
  ];

  // Vérifier les valeurs principales
  const hasInvalidMainValues = values.some(
    (value) => value === null || value === "__inconnu__" || value === undefined,
  );

  const hasInvalidOption = stage.studentOption === "__inconnu__";

  return hasInvalidMainValues || hasInvalidOption;
}
