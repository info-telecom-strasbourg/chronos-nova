import type { InternshipHashData } from "@/types/drizzle";
import hash from "object-hash";

/**
 * Génère un hash unique pour un stage basé sur les champs discriminants
 */
export function generateInternshipHash(data: InternshipHashData): string {
  // Normaliser et créer un objet avec uniquement les champs non-null
  const hashInput: Record<string, string | number> = {};

  if (data.subject?.trim()) hashInput.subject = data.subject.trim();
  if (data.beginDate?.trim()) hashInput.beginDate = data.beginDate.trim();
  if (data.weeksCount !== null) hashInput.weeksCount = data.weeksCount;
  if (data.academicYear?.trim()) hashInput.academicYear = data.academicYear.trim();
  if (data.organizationName?.trim()) hashInput.organizationName = data.organizationName.trim();
  if (data.organizationType?.trim()) hashInput.organizationType = data.organizationType.trim();
  if (data.organizationCountry?.trim())
    hashInput.organizationCountry = data.organizationCountry.trim();
  if (data.organizationCity?.trim()) hashInput.organizationCity = data.organizationCity.trim();

  return hash(hashInput, { algorithm: "md5" });
}

/**
 * Extrait les données de hash d'un objet InternshipData complet
 */
export function extractHashDataFromInternship(internship: {
  subject?: string | null;
  beginDate?: string | null;
  weeksCount?: number | null;
  academicYear?: string | null;
  organization?: {
    name?: string | null;
    type?: string | null;
    country?: string | null;
    city?: string | null;
  } | null;
}): InternshipHashData {
  return {
    subject: internship.subject || null,
    beginDate: internship.beginDate || null,
    weeksCount: internship.weeksCount || null,
    academicYear: internship.academicYear || null,
    organizationName: internship.organization?.name || null,
    organizationType: internship.organization?.type || null,
    organizationCountry: internship.organization?.country || null,
    organizationCity: internship.organization?.city || null,
  };
}
