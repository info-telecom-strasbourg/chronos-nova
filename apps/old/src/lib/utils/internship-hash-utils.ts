import type { InternshipHashData } from "@/types/drizzle";
import { generateInternshipHash } from "@/lib/utils/internship-hash";

/**
 * Utilitaire pour créer un hash à partir des données normalisées
 */
export function createInternshipHashFromNormalized(normalized: {
  internship: {
    subject: string | null;
    beginDate: string | null;
    weeksCount: number | null;
    academicYear: string | null;
  };
  organization: {
    name: string | null;
    type: string | null;
    country: string | null;
    city: string | null;
  };
}): string {
  const hashData: InternshipHashData = {
    subject: normalized.internship.subject,
    beginDate: normalized.internship.beginDate,
    weeksCount: normalized.internship.weeksCount,
    academicYear: normalized.internship.academicYear,
    organizationName: normalized.organization.name,
    organizationType: normalized.organization.type,
    organizationCountry: normalized.organization.country,
    organizationCity: normalized.organization.city,
  };

  return generateInternshipHash(hashData);
}
