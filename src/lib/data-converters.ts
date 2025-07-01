import type { 
  ParsedInternshipData, 
  InternshipCardData,
  ParsedInternship,
  ParsedStudent,
  ParsedOrganization 
} from "@/types/database";

/**
 * Utilitaires pour convertir entre les formats projetParseur et database
 */

/**
 * Convertit les données du projetParseur vers le format InternshipCardData
 */
export function convertParsedToCardData(
  parsed: ParsedInternshipData & { id: number }
): InternshipCardData {
  return {
    id: parsed.id,
    internship: {
      subject: parsed.internship.subject,
      confidential: typeof parsed.internship.confidential === 'string' 
        ? parsed.internship.confidential.toLowerCase() === 'true' || parsed.internship.confidential === 'Oui'
        : parsed.internship.confidential,
      date: parsed.internship.date,
      weeksCount: typeof parsed.internship.weeksCount === 'string' 
        ? parseInt(parsed.internship.weeksCount) 
        : parsed.internship.weeksCount,
      year: parsed.internship.year,
    },
    student: {
      firstName: parsed.student.firstName,
      lastName: parsed.student.lastName,
      major: parsed.student.major,
      course: parsed.student.course,
    },
    organization: {
      orgName: parsed.organization.orgName,
      tutorFirstName: parsed.organization.tutorFirstName,
      tutorLastName: parsed.organization.tutorLastName,
      orgType: parsed.organization.orgType === "E" ? "Entreprise" : "Laboratoire",
      country: parsed.organization.country,
      city: undefined, // Non disponible dans projetParseur
    },
  };
}

/**
 * Convertit InternshipCardData vers le format projetParseur
 */
export function convertCardDataToParsed(
  cardData: InternshipCardData
): ParsedInternshipData {
  return {
    internship: {
      subject: cardData.internship.subject,
      confidential: cardData.internship.confidential,
      date: cardData.internship.date,
      weeksCount: cardData.internship.weeksCount,
      year: cardData.internship.year,
    },
    student: {
      firstName: cardData.student.firstName,
      lastName: cardData.student.lastName,
      major: cardData.student.major,
    },
    organization: {
      orgName: cardData.organization.orgName,
      tutorFirstName: cardData.organization.tutorFirstName,
      tutorLastName: cardData.organization.tutorLastName,
      orgType: cardData.organization.orgType === "Entreprise" ? "E" : "L",
      country: cardData.organization.country,
    },
  };
}

/**
 * Valide qu'un objet a la structure ParsedInternshipData
 */
export function isParsedInternshipData(obj: any): obj is ParsedInternshipData {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.internship &&
    obj.student &&
    obj.organization &&
    typeof obj.internship.subject === 'string' &&
    typeof obj.student.firstName === 'string' &&
    typeof obj.student.lastName === 'string' &&
    typeof obj.organization.orgName === 'string'
  );
}
