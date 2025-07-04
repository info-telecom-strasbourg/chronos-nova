import { z } from "zod";
import { extractNumberOfWeeks, splitLastNameFirstName } from "./functions";

// ========================================
// Schémas Zod pour la validation et formatage des données Excel
// ========================================

/**
 * Schéma pour valider et formater les dates
 * Extrait et formate uniquement la date de début au format "1 janvier 2024"
 */
const dateSchema = z.string().transform((value) => {
  const trimmed = value.trim();

  // Si vide ou valeurs invalides, retourner "??"
  if (!trimmed || trimmed === "x" || trimmed === "X" || trimmed === "?") {
    return "??";
  }

  // Si c'est déjà "??"
  if (trimmed === "??") {
    return "??";
  }

  // Extraire la première date trouvée (date de début)
  const dateMatch = trimmed.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (dateMatch) {
    const [, day, month, year] = dateMatch;
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Vérifier que la date est valide
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
      console.warn(`Date invalide: "${value}" -> "??"`);
      return "??";
    }

    // Mapping des mois en français
    const monthNames = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];

    // Formater au format français : "1 janvier 2024"
    return `${dayNum} ${monthNames[monthNum - 1]} ${yearNum}`;
  }

  console.warn(`Format de date non reconnu: "${value}" -> "??"`);
  return "??";
});

/**
 * Schéma pour valider et formater les noms de pays
 */
const countrySchema = z.string().transform((value) => {
  const trimmed = value.trim().toLowerCase();

  // Mapping des abréviations vers les noms complets
  const countryMappings: Record<string, string> = {
    fr: "FRANCE",
    de: "ALLEMAGNE",
    en: "ANGLETERRE",
    uk: "ANGLETERRE",
    es: "ESPAGNE",
    it: "ITALIE",
  };

  // Si vide ou invalide
  if (!trimmed || trimmed === "x" || trimmed === "?" || trimmed === "??") {
    return "??";
  }

  // Vérifier les mappings
  if (countryMappings[trimmed]) {
    return countryMappings[trimmed];
  }

  // Retourner en majuscules si pas de mapping trouvé
  return value.trim().toUpperCase();
});

/**
 * Schéma pour valider et formater les champs texte génériques
 */
const textFieldSchema = z.string().transform((value) => {
  const trimmed = value.trim();

  // Si vide ou valeurs invalides
  if (!trimmed || trimmed === "x" || trimmed === "X" || trimmed === "?") {
    return "??";
  }

  return trimmed;
});

/**
 * Schéma pour valider et formater les spécialités/filières
 * Retourne à la fois le diplôme (général) et la filière (spécialisation originale)
 */
const majorFieldSchema = z.string().transform((value) => {
  const trimmed = value.trim().toUpperCase();

  // Si vide ou valeurs invalides
  if (!trimmed || trimmed === "X" || trimmed === "?") {
    return { diploma: "??", course: "??" };
  }

  // Mapping des acronymes de filières vers les 3 diplômes autorisés
  const majorMappings: Record<string, string> = {
    // Filières Informatique → Diplôme IR
    RIO: "IR", // Réseaux et Informatique Industrielle → IR
    SDIA: "IR", // SDIA (filière informatique) → IR

    // Filières TI Santé → Diplôme TI Santé
    TIS: "TI Santé", // TI Santé → TI Santé

    // Toutes les autres filières → Diplôme Généraliste
    G: "Généraliste", // Généraliste → Généraliste
  };

  // Retourner à la fois le diplôme mappé et la filière originale
  const diploma = majorMappings[trimmed] || "Généraliste"; // Par défaut, toute filière non mappée → Généraliste

  // Ne conserver la filière que pour RIO et SDIA
  const course = trimmed === "RIO" || trimmed === "SDIA" ? trimmed : "??";

  return {
    diploma: diploma, // Le diplôme (Généraliste, IR, ou TI Santé)
    course: course, // La filière (seulement RIO ou SDIA, sinon "??")
  };
});

/**
 * Schéma pour valider et formater le nombre de semaines
 */
const weeksCountSchema = z.union([z.string(), z.number(), z.null()]).transform((value) => {
  if (typeof value === "number") {
    return value > 0 ? value : 0;
  }
  if (value === null) {
    return 0;
  }
  // Utiliser la fonction unifiée de functions.ts
  return extractNumberOfWeeks(value.toString());
});

/**
 * Schéma pour valider et formater les valeurs booléennes (confidentialité)
 */
const confidentialSchema = z.union([z.string(), z.boolean()]).transform((value) => {
  if (typeof value === "boolean") {
    return value;
  }

  const trimmed = value.trim().toLowerCase();

  // Valeurs considérées comme vraies
  const truthyValues = ["oui", "yes", "true", "1", "x"];
  // Valeurs considérées comme fausses
  const falsyValues = ["non", "no", "false", "0", ""];

  if (truthyValues.includes(trimmed)) {
    return true;
  }

  if (falsyValues.includes(trimmed)) {
    return false;
  }

  // Par défaut, considérer comme faux
  return false;
});

/**
 * Schéma pour valider et formater le type d'organisation
 */
const orgTypeSchema = z.string().transform((value) => {
  const trimmed = value.trim().toUpperCase();

  // Normaliser les types d'organisation
  if (trimmed === "E" || trimmed === "ENTREPRISE") {
    return "Entreprise";
  }

  if (trimmed === "L" || trimmed === "LABORATOIRE") {
    return "Hors entreprise";
  }

  return "Hors entreprise";
});

// ========================================
// Schémas principaux pour les entités
// ========================================

/**
 * Schéma Zod pour une organisation
 */
export const OrganizationSchema = z
  .object({
    orgName: textFieldSchema,
    tutorLastName: z.string(),
    tutorFirstName: z.string(),
    orgType: orgTypeSchema,
    country: countrySchema.optional(),
  })
  .transform((data) => {
    // Si tutorFullName est fourni au lieu de tutorLastName/tutorFirstName séparés
    if (data.tutorLastName && !data.tutorFirstName) {
      const { firstName, lastName } = splitLastNameFirstName(data.tutorLastName);
      return {
        ...data,
        tutorFirstName: firstName,
        tutorLastName: lastName,
      };
    }
    return data;
  });

/**
 * Schéma Zod pour un étudiant
 */
export const StudentSchema = z
  .object({
    lastName: z.string(),
    firstName: z.string(),
    major: z.string().optional(), // Diplôme (IR, GM, GE, etc.)
    course: z.string().optional(), // Filière (RIO, GEII, TC, etc.)
  })
  .transform((data) => {
    // Si fullName est fourni au lieu de lastName/firstName séparés
    if (data.lastName && !data.firstName) {
      const { firstName, lastName } = splitLastNameFirstName(data.lastName);
      return {
        ...data,
        firstName,
        lastName,
      };
    }
    return data;
  });

/**
 * Schéma Zod pour un stage
 */
export const InternshipSchema = z.object({
  subject: textFieldSchema,
  confidential: confidentialSchema,
  date: dateSchema,
  weeksCount: weeksCountSchema,
  year: textFieldSchema,
});

/**
 * Schéma Zod pour une ligne complète de données Excel
 */
export const ExcelRowSchema = z
  .object({
    // Données étudiant
    studentFullName: z.string(),
    studentMajor: z.string().optional(),

    // Données organisation
    orgName: z.string(),
    tutorFullName: z.string(),
    orgType: z.string(),
    country: z.string().optional(),

    // Données stage
    subject: z.string(),
    confidential: z.union([z.string(), z.boolean()]),
    date: z.string(),
    weeksCount: z.union([z.string(), z.number(), z.null()]),
    year: z.string(),
  })
  .transform((data) => {
    // Parser les noms complets
    const student = splitLastNameFirstName(data.studentFullName);
    const tutor = splitLastNameFirstName(data.tutorFullName);

    // Traiter la filière pour extraire diplôme et filière originale
    const originalCourse = data.studentMajor || "??";
    const degree = majorFieldSchema.parse(originalCourse); // {diploma: "IR", course: "RIO"}

    return {
      student: {
        firstName: student.firstName,
        lastName: student.lastName,
        major: typeof degree.diploma === "string" ? degree.diploma : "??", // Toujours string
        course: typeof degree.course === "string" ? degree.course : "??", // Toujours string
      },
      organization: {
        orgName: data.orgName,
        tutorFirstName: tutor.firstName,
        tutorLastName: tutor.lastName,
        orgType: data.orgType,
        country: data.country,
      },
      internship: {
        subject: data.subject,
        confidential: data.confidential,
        date: data.date,
        weeksCount: data.weeksCount,
        year: data.year,
      },
    };
  });

// ========================================
// Fonctions utilitaires de validation
// ========================================

/**
 * Valide et formate les données d'une ligne Excel
 */
export function validateAndFormatExcelRow(rawData: unknown): {
  student: z.infer<typeof StudentSchema>;
  organization: z.infer<typeof OrganizationSchema>;
  internship: z.infer<typeof InternshipSchema>;
} {
  const result = ExcelRowSchema.parse(rawData);

  // Valider chaque entité individuellement pour plus de précision
  const student = StudentSchema.parse(result.student);
  const organization = OrganizationSchema.parse(result.organization);
  const internship = InternshipSchema.parse(result.internship);

  return { student, organization, internship };
}

/**
 * Valide et formate un tableau de données Excel
 */
export function validateAndFormatExcelData(rawData: unknown[]): Array<{
  student: z.infer<typeof StudentSchema>;
  organization: z.infer<typeof OrganizationSchema>;
  internship: z.infer<typeof InternshipSchema>;
}> {
  const results = [];
  const errors = [];

  for (let i = 0; i < rawData.length; i++) {
    try {
      const formattedRow = validateAndFormatExcelRow(rawData[i]);
      results.push(formattedRow);
    } catch (error) {
      console.error(`Erreur ligne ${i + 1}:`, error);
      errors.push({ row: i + 1, error });
    }
  }

  if (errors.length > 0) {
    console.warn(`${errors.length} erreurs de validation détectées`);
  }

  return results;
}

// Export des types pour utilisation
export type ValidatedStudent = z.infer<typeof StudentSchema>;
export type ValidatedOrganization = z.infer<typeof OrganizationSchema>;
export type ValidatedInternship = z.infer<typeof InternshipSchema>;
export type ValidatedExcelRow = {
  student: ValidatedStudent;
  organization: ValidatedOrganization;
  internship: ValidatedInternship;
};
