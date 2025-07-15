import {
  formatCityName,
  formatCountry,
  normalizeOrganizationType,
  parseConfidential,
  parseDate,
  parseDiploma,
  parseOption,
  splitLastNameFirstName,
} from "@/features/parser/parser-utils";

export interface NormalizedStudentData {
  firstName: string;
  lastName: string;
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
  confidential: boolean;
  beginDate: string;
  weeksCount: number;
  academicYear: "1A" | "2A" | "3A";
}

/**
 * Normalise les données d'un étudiant - utilise les values courtes partout
 */
export function normalizeStudentData(
  rawData: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    major?: string;
    option?: string;
  },
  fromExcel: boolean = false,
): NormalizedStudentData {
  let firstName = rawData.firstName || "";
  let lastName = rawData.lastName || "";

  // Si on a un nom complet, le séparer
  if (rawData.fullName && (!firstName || !lastName)) {
    const { firstName: parsedFirstName, lastName: parsedLastName } = splitLastNameFirstName(
      rawData.fullName,
    );
    firstName = firstName || parsedFirstName;
    lastName = lastName || parsedLastName;
  }

  let major: string;
  let option: string;

  if (fromExcel) {
    major = parseDiploma(rawData.major || "");
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
    firstName: firstName.trim() || "??",
    lastName: lastName.trim() || "??",
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
    country = formatCountry(rawData.country || "");
    type = normalizeOrganizationType(rawData.type || "");
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
  confidential?: string | boolean;
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

  let confidential = false;
  if (typeof rawData.confidential === "boolean") {
    confidential = rawData.confidential;
  } else if (typeof rawData.confidential === "string") {
    confidential = parseConfidential(rawData.confidential);
  }

  return {
    subject: rawData.subject?.trim() || "??",
    confidential,
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
    studentFirstName?: string;
    studentLastName?: string;
    studentFullName?: string;
    studentMajor?: string;
    studentOption?: string;

    // Données organisation
    organizationName?: string;
    organizationType?: string;
    organizationCountry?: string;
    organizationCity?: string;

    // Données stage
    subject?: string;
    confidential?: string | boolean;
    beginDate?: string;
    weeksCount?: number | string;
    academicYear?: string;
  },
  fromExcel: boolean = false,
) {
  return {
    student: normalizeStudentData(
      {
        firstName: rawData.studentFirstName,
        lastName: rawData.studentLastName,
        fullName: rawData.studentFullName,
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
      confidential: rawData.confidential,
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
  studentFirstName: string;
  studentLastName: string;
  studentMajor: string;
  studentOption?: string;
}) {
  return normalizeCompleteStageData(
    {
      studentFirstName: formData.studentFirstName,
      studentLastName: formData.studentLastName,
      studentMajor: formData.studentMajor,
      studentOption: formData.studentOption,
      organizationName: formData.organizationName,
      organizationType: formData.organizationType,
      organizationCountry: formData.organizationCountry,
      organizationCity: formData.organizationCity,
      subject: formData.subject,
      confidential: false,
      beginDate: formData.beginDate,
      weeksCount: formData.weeksCount,
      academicYear: formData.academicYear,
    },
    false,
  ); // fromExcel = false car c'est un formulaire
}
