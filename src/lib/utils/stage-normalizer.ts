import {
  parseCountry,
  parseMajor,
  parseOption,
  parseOrganizationType,
} from "@/features/parser/mappings";
import { formatCityName, parseDate } from "@/features/parser/parser-utils";

export interface NormalizedStudentData {
  major: string; // "gene", "ir", "ti-sante"
  option: string; // "stq", "sdia", "rio", "aucune", etc.
}

export interface NormalizedOrganizationData {
  name: string;
  type: "company" | "not_company";
  country: string;
  city: string;
}

export interface NormalizedInternshipData {
  subject: string;
  beginDate: string;
  weeksCount: number;
  academicYear: "1A" | "2A" | "3A";
}

/**
 * Normalise les données d'un étudiant - utilise les values courtes partout
 */
export function normalizeStudentData(
  rawData: {
    major?: string;
    option?: string;
  },
  fromExcel: boolean = false,
): NormalizedStudentData {
  let major: string;
  let option: string;

  if (fromExcel) {
    major = parseMajor(rawData.major || "");
    option = parseOption(rawData.option || "");
  } else {
    const majorKey = rawData.major?.trim() || "";
    const optionKey = rawData.option?.trim() || "";

    if (!majorKey) {
      throw new Error("Major requise pour les données de formulaire");
    }

    major = majorKey;
    option = optionKey || "aucune";
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
    name?: string;
    type?: string;
    country?: string;
    city?: string;
  },
  fromExcel: boolean = false,
): NormalizedOrganizationData {
  let country: string;
  let type: string;

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

    country = countryKey;
    type = typeKey;
  }

  return {
    name: rawData.name?.trim() || "??",
    type: type as "company" | "not_company",
    country,
    city: formatCityName(rawData.city || ""),
  };
}

/**
 * Normalise les données d'un stage pour la base de données
 */
export function normalizeInternshipData(rawData: {
  subject?: string;
  beginDate?: string;
  weeksCount?: number | string;
  academicYear?: string;
}): NormalizedInternshipData {
  let weeksCount = 0;
  if (typeof rawData.weeksCount === "number") {
    weeksCount = rawData.weeksCount;
  } else if (typeof rawData.weeksCount === "string") {
    const parsed = parseInt(rawData.weeksCount, 10);
    weeksCount = Number.isNaN(parsed) ? 0 : parsed;
  }

  return {
    subject: rawData.subject?.trim() || "??",
    beginDate: parseDate(rawData.beginDate || ""),
    weeksCount,
    academicYear: (rawData.academicYear as "1A" | "2A" | "3A") || "2A",
  };
}

/**
 * Normalise un stage complet avec toutes ses données associées
 */
export function normalizeCompleteStageData(
  rawData: {
    // Données étudiant
    studentMajor?: string;
    studentOption?: string;

    // Données organisation
    organizationName?: string;
    organizationType?: string;
    organizationCountry?: string;
    organizationCity?: string;

    // Données stage
    subject?: string;
    beginDate?: string;
    weeksCount?: number | string;
    academicYear?: string;
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
