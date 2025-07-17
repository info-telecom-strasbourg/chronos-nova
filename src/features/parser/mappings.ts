// ===============================
// RÉEXPORTATION DES UTILITAIRES
// ===============================

// Re-export des types et constantes
export type { 
  OptionMapping, 
  MajorMapping, 
  OrganizationTypeMapping 
} from "@/lib/const/mappings";

export { 
  MAJOR_MAPPINGS, 
  OPTION_MAPPINGS, 
  ORGANIZATION_TYPE_MAPPINGS 
} from "@/lib/const/mappings";

// Re-export des fonctions de parsing
export {
  parseMajor,
  parseOption,
  parseCountry,
  parseOrganizationType
} from "@/lib/utils/parsers";

// Re-export des fonctions de formatage
export {
  getCityLabel,
  getWeeksLabel,
  getTitleLabel,
  getSubjectLabel,
  getDateLabel,
  getMajorShortLabel,
  getOptionShortLabel,
  getCountryLabel,
  getOrganizationTypeLabel,
  getMajorFullLabel,
  getOptionFullLabel
} from "@/lib/utils/formatters";
