// ===============================
// RÉEXPORTATION DES UTILITAIRES
// ===============================

// Re-export des types et constantes
export type {
  MajorMapping,
  OptionMapping,
  OrganizationTypeMapping,
} from "@/lib/const/mappings";
export {
  MAJOR_MAPPINGS,
  OPTION_MAPPINGS,
  ORGANIZATION_TYPE_MAPPINGS,
} from "@/lib/const/mappings";
// Re-export des fonctions de formatage
export {
  getCityLabel,
  getCountryLabel,
  getDateLabel,
  getMajorFullLabel,
  getMajorShortLabel,
  getOptionFullLabel,
  getOptionShortLabel,
  getOrganizationTypeLabel,
  getSubjectLabel,
  getTitleLabel,
  getWeeksLabel,
} from "@/lib/utils/formatters";
// Re-export des fonctions de parsing
export {
  parseCountry,
  parseMajor,
  parseOption,
  parseOrganizationType,
} from "@/lib/utils/parsers";
