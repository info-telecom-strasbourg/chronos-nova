import {
  parseCountry,
  parseMajor,
  parseOption,
  parseOrganizationType,
} from "@/lib/utils/parsers";
import { formatCityName, parseDate } from "@/features/parser/parser-utils";

export interface NormalizedStudentData {
  major: string | null | "__inconnu__"; // "gene", "ir", "ti-sante", "__inconnu__" ou null
  option: string | null | "__inconnu__"; // "stq", "sdia", "rio", "aucune", "__inconnu__" ou null
}

export interface NormalizedOrganizationData {
  name: string | null;
  type: string | null; // "company", "not_company" ou null
  country: string | null;
  city: string | null;
}

export interface NormalizedInternshipData {
  subject: string | null;
  beginDate: string | null;
  weeksCount: number | null;
  academicYear: string | null; // "1A", "2A", "3A" ou null
}

/**
 * Normalise les données d'un étudiant - utilise les values courtes partout
 */
export function normalizeStudentData(
  rawData: {
    major?: string | null;
    option?: string | null;
  },
  fromExcel: boolean = false,
): NormalizedStudentData {
  let major: string | null;
  let option: string | null;

  if (fromExcel) {
    major = parseMajor(rawData.major || "");
    option = parseOption(rawData.option || "");
  } else {
    const majorKey = rawData.major?.trim() || "";
    const optionKey = rawData.option?.trim() || "";

    if (!majorKey) {
      major = "__inconnu__";
    } else {
      major = majorKey;
    }
    option = optionKey || "__inconnu__";
  }

  return {
    major,
    option,
  };
}

/**
 * Normalise les données d'une organisation - utilise les values courtes partout
 */
export function normalizeOrganizationData(
  rawData: {
    name?: string | null;
    type?: string | null;
    country?: string | null;
    city?: string | null;
  },
  fromExcel: boolean = false,
): NormalizedOrganizationData {
  let country: string | null;
  let type: string | null;

  if (fromExcel) {
    country = parseCountry(rawData.country || "");
    type = parseOrganizationType(rawData.type || "");
  } else {
    const countryKey = rawData.country?.trim() || "";
    const typeKey = rawData.type?.trim() || "";

    if (!countryKey) {
      throw new Error("Pays requis pour les données de formulaire");
    }
    if (!typeKey) {
      throw new Error("Type d'organisation requis pour les données de formulaire");
    }
    type = typeKey;
    country = countryKey;
  }

  const name = rawData.name?.trim() || null;
  const city = rawData.city?.trim() ? formatCityName(rawData.city.trim()) : null;

  return {
    name,
    type,
    country,
    city,
  };
}

/**
 * Normalise les données d'un stage pour la base de données
 */
export function normalizeInternshipData(rawData: {
  subject?: string | null;
  beginDate?: string | null;
  weeksCount?: number | string | null;
  academicYear?: string | null;
}): NormalizedInternshipData {
  let weeksCount: number | null = null;
  if (typeof rawData.weeksCount === "number") {
    weeksCount = rawData.weeksCount > 0 ? rawData.weeksCount : null;
  } else if (typeof rawData.weeksCount === "string") {
    const parsed = parseInt(rawData.weeksCount, 10);
    weeksCount = !Number.isNaN(parsed) && parsed > 0 ? parsed : null;
  }

  const subject = rawData.subject?.trim() || null;
  const beginDate = parseDate(rawData.beginDate || "") || null;
  const academicYear = rawData.academicYear?.trim();
  const validAcademicYear =
    academicYear && ["1A", "2A", "3A"].includes(academicYear) ? academicYear : null;

  return {
    subject,
    beginDate,
    weeksCount,
    academicYear: validAcademicYear,
  };
}

/**
 * Normalise un stage complet avec toutes ses données associées
 */
export function normalizeCompleteStageData(
  rawData: {
    // Données étudiant
    studentMajor?: string | null;
    studentOption?: string | null;

    // Données organisation
    organizationName?: string | null;
    organizationType?: string | null;
    organizationCountry?: string | null;
    organizationCity?: string | null;

    // Données stage
    subject?: string | null;
    beginDate?: string | null;
    weeksCount?: number | null;
    academicYear?: string | null;
  },
  fromExcel: boolean = false,
) {
  return {
    student: normalizeStudentData(
      {
        major: rawData.studentMajor,
        option: rawData.studentOption,
      },
      fromExcel,
    ),
    organization: normalizeOrganizationData(
      {
        name: rawData.organizationName,
        type: rawData.organizationType,
        country: rawData.organizationCountry,
        city: rawData.organizationCity,
      },
      fromExcel,
    ),
    internship: normalizeInternshipData({
      subject: rawData.subject,
      beginDate: rawData.beginDate,
      weeksCount: rawData.weeksCount,
      academicYear: rawData.academicYear,
    }),
  };
}

/**
 * Transforme les données du formulaire vers le format normalisé
 * (Les formulaires utilisent déjà les values courtes)
 */
export function normalizeFormData(formData: {
  organizationName: string;
  organizationType: string;
  organizationCountry: string;
  organizationCity: string;
  subject: string;
  academicYear: string;
  beginDate: string;
  weeksCount: number;
  studentMajor: string;
  studentOption?: string;
}) {
  return normalizeCompleteStageData(
    {
      studentMajor: formData.studentMajor,
      studentOption: formData.studentOption,
      organizationName: formData.organizationName,
      organizationType: formData.organizationType,
      organizationCountry: formData.organizationCountry,
      organizationCity: formData.organizationCity,
      subject: formData.subject,
      beginDate: formData.beginDate,
      weeksCount: formData.weeksCount,
      academicYear: formData.academicYear,
    },
    false,
  ); // fromExcel = false car c'est un formulaire
}
