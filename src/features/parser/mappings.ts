// ===============================
// TYPES ET INTERFACES
// ===============================

export interface OptionMapping {
  value: string;
  shortLabel: string;
  fullLabel?: string;
}

export interface MajorMapping {
  value: string;
  shortLabel: string;
  fullLabel?: string;
}

export interface CountryMapping {
  value: string;
  label: string;
}

export interface OrganizationTypeMapping {
  value: string;
  label: string;
}

// ============================================
// MAPPINGS DES DIPLÔMES (Parsing et Affichage)
// ============================================

export const MAJOR_MAPPINGS: Record<string, MajorMapping> = {
  g: { value: "gene", shortLabel: "Généraliste" },
  gene: { value: "gene", shortLabel: "Généraliste" },

  ir: { value: "ir", shortLabel: "IR", fullLabel: "IR (Informatique et Réseaux)" },

  tis: {
    value: "ti-sante",
    shortLabel: "TI Santé",
    fullLabel: "TI Santé (Technologie de l'Information pour la Santé)",
  },
  "ti-sante": {
    value: "ti-sante",
    shortLabel: "TI Santé",
    fullLabel: "TI Santé (Technologie de l'Information pour la Santé)",
  },

  m: { value: "master", shortLabel: "Master" },
  master: { value: "master", shortLabel: "Master" },
} as const;

// ====================================================
// MAPPINGS DES OPTIONS/FILIÈRES (Parsing et Affichage)
// ====================================================

export const OPTION_MAPPINGS: Record<string, OptionMapping> = {
  // Aucune option
  aucune: { value: "aucune", shortLabel: "Aucune" },
  "": { value: "aucune", shortLabel: "Aucune" },

  // Options IR
  sdia: {
    value: "sdia",
    shortLabel: "SDIA",
    fullLabel: "SDIA (Science des Données et Intelligence Artificielle)",
  },
  rio: {
    value: "rio",
    shortLabel: "RIO",
    fullLabel: "RIO (Réseaux Informatiques et Objets connectés)",
  },

  // Options TI Santé
  ti: {
    value: "ti",
    shortLabel: "TI",
    fullLabel: "TI (Technologie de l'Information)",
  },
  dtmi: {
    value: "dtmi",
    shortLabel: "DTMI",
    fullLabel: "DTMI (Dispositifs Thérapeutiques et Maintenance Industrielle)",
  },

  // Options Généraliste 3A
  stq: {
    value: "stq",
    shortLabel: "STQ",
    fullLabel: "STQ (Sciences et Technologies Quantiques)",
  },
  ispv: {
    value: "ispv",
    shortLabel: "ISPV",
    fullLabel: "ISPV (Image, Signal, Photonique et Vision)",
  },
  issd: {
    value: "issd",
    shortLabel: "ISSD",
    fullLabel: "ISSD (Ingénierie des Systèmes et Sécurité des Données)",
  },
  isav: {
    value: "isav",
    shortLabel: "ISAV",
    fullLabel: "ISAV (Ingénierie des Systèmes Automobiles et de Véhicules)",
  },
  photo: {
    value: "photo",
    shortLabel: "Photonique",
  },
  pm: {
    value: "pm",
    shortLabel: "PM",
    fullLabel: "PM (Physique et Modélisation)",
  },

  // Options Master
  asi: {
    value: "asi",
    shortLabel: "ASI",
    fullLabel: "ASI (Automatique, Signal, Informatique)",
  },
  ht: {
    value: "ht",
    shortLabel: "HT",
    fullLabel: "HT (HealthTech)",
  },
  imed: {
    value: "imed",
    shortLabel: "IMed",
    fullLabel: "IMed (Imagerie Médicale)",
  },
  phynano: {
    value: "phynano",
    shortLabel: "PhyNano",
    fullLabel: "PhyNano (Physique et Nanophotonique)",
  },
  ar: {
    value: "ar",
    shortLabel: "AR",
    fullLabel: "AR (Automatique et Robotique)",
  },
  id: {
    value: "id",
    shortLabel: "ID",
    fullLabel: "ID (Images et Données)",
  },
  irmc: {
    value: "irmc",
    shortLabel: "IRMC",
    fullLabel: "IRMC (Imagerie, Robotique Médicale et Chirurgicale)",
  },
  mphot: {
    value: "mphot",
    shortLabel: "MPHOT",
    fullLabel: "MPHOT (Photonique pour les nanosciences et le vivant)",
  },
  topo: {
    value: "topo",
    shortLabel: "Topo",
    fullLabel: "Topo (Topographie et photogrammétrie)",
  },
} as const;

// ========================================
// MAPPINGS DES PAYS (Parsing et Affichage)
// ========================================

export const COUNTRY_MAPPINGS: Record<string, CountryMapping> = {
  france: { value: "france", label: "FRANCE" },
  allemagne: { value: "allemagne", label: "ALLEMAGNE" },
  luxembourg: { value: "luxembourg", label: "LUXEMBOURG" },
  belgique: { value: "belgique", label: "BELGIQUE" },
  bresil: { value: "bresil", label: "BRÉSIL" },
  espagne: { value: "espagne", label: "ESPAGNE" },
  italie: { value: "italie", label: "ITALIE" },
  portugal: { value: "portugal", label: "PORTUGAL" },
  suisse: { value: "suisse", label: "SUISSE" },
} as const;

// ========================================================
// MAPPINGS DES TYPES D'ORGANISATION (Affichage et Parsing)
// ========================================================

// Affichage
export const ORGANIZATION_TYPE_MAPPINGS: Record<string, OrganizationTypeMapping> = {
  company: { value: "company", label: "Entreprise" },
  not_company: { value: "not_company", label: "Hors Entreprise" },
} as const;

// Parsing
const ORGANIZATION_TYPE_ALIASES: Record<string, OrganizationTypeMapping> = {
  e: { value: "company", label: "Entreprise" },
  l: { value: "not_company", label: "Hors Entreprise" },
};

// ===============================
// FONCTIONS DE NORMALISATION
// ===============================

/**
 * Normalise une chaîne pour le matching
 * Supprime les accents, espaces, et met en minuscules
 */
function normalizeForMatching(value: string): string {
  if (!value || typeof value !== "string") return "";

  return value
    .trim()
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "") // Garder lettres, chiffres, espaces et tirets
    .replace(/\s+/g, "") // Supprimer tous les espaces
    .replace(/-+/g, "-"); // Normaliser les tirets multiples
}

// ===============================
// FONCTIONS DE PARSING
// ===============================

/**
 * Parse et normalise un diplôme/filière vers sa valeur courte
 * Exemple: "G" → "gene", "TIS" → "ti-sante"
 */
export function parseMajor(value: string): string {
  if (!value || typeof value !== "string") return "gene";

  const normalized = normalizeForMatching(value);
  const mapping = MAJOR_MAPPINGS[normalized];

  if (mapping) {
    return mapping.value;
  }

  console.warn(
    `Diplôme non reconnu: "${value}" (normalisé: "${normalized}"). Fallback vers "gene".`,
  );
  return "gene";
}

/**
 * Parse et normalise une option/spécialité vers sa valeur courte
 * Exemple: "SDIA" → "sdia", "RIO" → "rio"
 */
export function parseOption(value: string): string {
  if (!value || typeof value !== "string" || value.trim() === "") {
    return "aucune";
  }

  const normalized = normalizeForMatching(value);
  const mapping = OPTION_MAPPINGS[normalized];

  if (mapping) {
    return mapping.value;
  }

  return "aucune";
}

/**
 * Parse et normalise un pays vers sa valeur courte
 * Exemple: "FRANCE" → "france"
 */
export function parseCountry(value: string): string {
  if (!value || typeof value !== "string") return "france";

  const normalized = normalizeForMatching(value);
  const mapping = COUNTRY_MAPPINGS[normalized];

  if (mapping) {
    return mapping.value;
  }

  return "france";
}

/**
 * Parse et normalise un type d'organisation vers sa valeur courte
 * Exemple: "E" → "company", "Hors entreprise" → "not_company"
 */
export function parseOrganizationType(value: string): string {
  if (!value || typeof value !== "string") return "not_company";
  const normalized = normalizeForMatching(value);
  if (ORGANIZATION_TYPE_ALIASES[normalized]) {
    return ORGANIZATION_TYPE_ALIASES[normalized].value;
  }
  if (ORGANIZATION_TYPE_MAPPINGS[normalized]) {
    return ORGANIZATION_TYPE_MAPPINGS[normalized].value;
  }
  return "not_company";
}

// ===================================
// FONCTIONS D'AFFICHAGE - NOMS COURTS
// ===================================

/**
 * Obtient le nom court d'un diplôme pour l'affichage sur les cartes
 * Exemple: "ti-sante" → "TI Santé", "gene" → "Généraliste"
 */
export function getMajorShortLabel(value: string): string {
  if (!value || typeof value !== "string") return "Généraliste";

  // Recherche directe par valeur
  const directMapping = Object.values(MAJOR_MAPPINGS).find((mapping) => mapping.value === value);
  if (directMapping) {
    return directMapping.shortLabel;
  }

  return value; // Fallback sur la valeur si pas de mapping
}

/**
 * Obtient le nom court d'une option pour l'affichage sur les cartes
 * Exemple: "sdia" → "SDIA", "rio" → "RIO"
 */
export function getOptionShortLabel(value: string): string {
  if (!value || typeof value !== "string" || value.trim() === "aucune") return "";

  // Recherche directe par valeur
  const directMapping = Object.values(OPTION_MAPPINGS).find((mapping) => mapping.value === value);
  if (directMapping && directMapping.value !== "aucune") {
    return directMapping.shortLabel;
  }

  return value.toUpperCase(); // Fallback en majuscules
}

/**
 * Obtient le label d'un pays pour l'affichage
 * Exemple: "france" → "FRANCE"
 */
export function getCountryLabel(value: string): string {
  if (!value || typeof value !== "string") return "??";

  const mapping = COUNTRY_MAPPINGS[value];
  if (mapping) {
    return mapping.label;
  }

  return value.toUpperCase();
}

/**
 * Obtient le label d'un type d'organisation pour l'affichage
 * Exemple: "company" → "Entreprise"
 */
export function getOrganizationTypeLabel(value: string): string {
  if (!value || typeof value !== "string") return "Non spécifié";

  const mapping = ORGANIZATION_TYPE_MAPPINGS[value];
  if (mapping) {
    return mapping.label;
  }

  return value;
}

// =====================================
// FONCTIONS D'AFFICHAGE - NOMS COMPLETS
// =====================================

/**
 * Obtient le nom complet enrichi d'un diplôme pour l'affichage détaillé
 * Si pas de nom complet, retourne le nom court
 * Exemple: "ti-sante" → "TI Santé (Technologie de l'Information pour la Santé)"
 */
export function getMajorFullLabel(value: string): string {
  if (!value || typeof value !== "string") return "Généraliste";

  // Recherche directe par valeur
  const directMapping = Object.values(MAJOR_MAPPINGS).find((mapping) => mapping.value === value);
  if (directMapping) {
    return directMapping.fullLabel || directMapping.shortLabel;
  }

  return value; // Fallback sur la valeur si pas de mapping
}

/**
 * Obtient le nom complet enrichi d'une option pour l'affichage détaillé
 * Si pas de nom complet, retourne le nom court
 * Exemple: "sdia" → "SDIA (Science des Données et Intelligence Artificielle)"
 */
export function getOptionFullLabel(value: string): string {
  if (!value || typeof value !== "string" || value.trim() === "aucune") return "Aucune";

  // Recherche directe par valeur
  const directMapping = Object.values(OPTION_MAPPINGS).find((mapping) => mapping.value === value);
  if (directMapping && directMapping.value !== "aucune") {
    return directMapping.fullLabel || directMapping.shortLabel;
  }

  return value; // Fallback sur la valeur si pas de mapping
}
