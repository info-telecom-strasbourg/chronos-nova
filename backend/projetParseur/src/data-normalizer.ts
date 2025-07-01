import type { Internship, Organization, Student } from "./type-definition.js";

/**
 * Centralise toutes les opérations de formatage et normalisation des données
 */

/**
 * Normalise et nettoie un champ de données Excel
 */
export function normalizeField(
  value: string,
  rowNumber?: number,
  options?: { defaultValue?: string },
): string {
  if (!value || value.trim() === "") {
    if (rowNumber) {
      console.log(`Row ${rowNumber}: missing or incorrect data ("${value}").`);
    }
    return options?.defaultValue || "??";
  }

  return value.trim();
}

/**
 * Split un nom complet en nom de famille et prénom
 * Règle : tout ce qui est en majuscule est considéré comme nom de famille
 * Les noms composés en majuscule sont regroupés (même sans tiret)
 */
export function splitLastNameFirstName(fullName: string): {
  lastName: string;
  firstName: string;
} {
  const trimmed = fullName.trim();
  if (!trimmed) return { lastName: "??", firstName: "??" };

  const words = trimmed.split(/\s+/);

  // Séparer les mots en majuscules (nom de famille) et le reste (prénom)
  const lastNameWords: string[] = [];
  const firstNameWords: string[] = [];

  for (const word of words) {
    // Un mot est considéré comme nom de famille s'il est entièrement en majuscules
    // et contient au moins 2 caractères alphabétiques
    if (word === word.toUpperCase() && /[A-ZÀ-ÖØ-Ý]{2,}/.test(word)) {
      lastNameWords.push(word);
    } else {
      firstNameWords.push(word);
    }
  }

  // Si aucun mot en majuscule n'est trouvé, considérer le dernier mot comme nom de famille
  if (lastNameWords.length === 0 && words.length > 1) {
    const lastWord = words[words.length - 1];
    lastNameWords.push(lastWord.toUpperCase());
    firstNameWords.splice(-1, 1); // Retirer le dernier mot des prénoms
  }

  return {
    lastName: lastNameWords.length > 0 ? lastNameWords.join(" ") : "??",
    firstName: firstNameWords.length > 0 ? firstNameWords.join(" ") : "??",
  };
}

/**
 * Normalise le type d'organisation
 */
export function normalizeOrganizationType(orgType: string): string {
  const cleaned = orgType.trim().toUpperCase().replace(/\./g, "");

  // Accepter toutes les variantes de "E" ou "ENTREPRISE"
  if (["E", "ENTREPRISE"].includes(cleaned)) {
    return "Entreprise";
  }

  // Tout le reste (L, LABORATOIRE, etc.)
  return "Hors entreprise";
}

/**
 * Extrait le nombre de semaines depuis une cellule Excel
 */
export function extractNumberOfWeeks(weeksCell: string): number {
  if (!weeksCell || weeksCell.trim() === "") {
    return 0;
  }

  const trimmed = weeksCell.trim();

  // Chercher un nombre dans la chaîne
  const match = trimmed.match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }

  return 0;
}

/**
 * Normalise une valeur de confidentialité
 */
export function normalizeConfidential(value: string | boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = value.toString().trim().toLowerCase();
  return (
    normalized === "true" || normalized === "oui" || normalized === "1" || normalized === "yes"
  );
}

/**
 * Formate les données d'organisation pour l'insertion en base
 */
export function formatOrganizationForDatabase(org: Organization) {
  return {
    organization_name: org.orgName || "??",
    tutor_firstname: org.tutorFirstName || "??",
    tutor_lastname: org.tutorLastName || "??",
    organization_type: normalizeOrganizationType(org.orgType ?? ""),
    organization_country: org.country || "??",
    organization_city: "??",
    organization_postal_code: 0,
  };
}

/**
 * Formate les données d'étudiant pour l'insertion en base
 */
export function formatStudentForDatabase(student: Student, organizationId: number) {
  return {
    student_firstname: student.firstName || "??",
    student_lastname: student.lastName || "??",
    student_degree: student.major || "??",
    student_course: student.course || "??",
    organization_id: organizationId,
  };
}

/**
 * Formate les données de stage pour l'insertion en base
 */
export function formatInternshipForDatabase(internship: Internship) {
  let period: number = 0;
  if (typeof internship.weeksCount === "number") {
    period = internship.weeksCount;
  } else if (typeof internship.weeksCount === "string") {
    period = extractNumberOfWeeks(internship.weeksCount);
  } else if (internship.weeksCount !== undefined && internship.weeksCount !== null) {
    period = extractNumberOfWeeks(String(internship.weeksCount));
  }

  return {
    internship_subject: internship.subject ?? "??",
    internship_confidential: normalizeConfidential(internship.confidential ?? false),
    internship_dates: internship.date ?? "??",
    internship_period: period,
    internship_year: internship.year ?? "2A",
  };
}
