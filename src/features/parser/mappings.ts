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
 * Retourne null pour les valeurs vides, mal formatées ou non reconnues
 */
export function parseMajor(value: string): string | null {
  if (!value || typeof value !== "string" || value.trim() === "") return "__inconnu__";

  const trimmedValue = value.trim();

  // Si c'est déjà "__inconnu__", le retourner directement sans warning
  if (trimmedValue === "__inconnu__") return "__inconnu__";

  const normalized = normalizeForMatching(trimmedValue);
  const mapping = MAJOR_MAPPINGS[normalized];

  if (mapping) {
    return mapping.value;
  }

  console.warn(
    `Diplôme non reconnu: "${value}" (normalisé: "${normalized}"). Retour '__inconnu__'.`,
  );
  return "__inconnu__";
}

/**
 * Parse et normalise une option/spécialité vers sa valeur courte
 * Exemple: "SDIA" → "sdia", "RIO" → "rio"
 * Retourne null pour les valeurs vides, mal formatées ou non reconnues
 */
export function parseOption(value: string): string | null {
  if (!value || typeof value !== "string" || value.trim() === "") {
    return "__inconnu__";
  }

  const trimmedValue = value.trim();

  // Si c'est déjà "__inconnu__", le retourner directement
  if (trimmedValue === "__inconnu__") return "__inconnu__";

  const normalized = normalizeForMatching(trimmedValue);
  const mapping = OPTION_MAPPINGS[normalized];

  if (mapping) {
    return mapping.value;
  }

  return "__inconnu__";
}

/**
 * Parse et normalise un pays vers sa valeur courte
 * Exemple: "FRANCE" → "france"
 * Retourne null pour les valeurs vides, mal formatées ou non reconnues
 */
export function parseCountry(value: string): string | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;

  const normalized = normalizeForMatching(value);
  const mapping = COUNTRY_MAPPINGS[normalized];

  if (mapping) {
    return mapping.value;
  }

  return null;
}

/**
 * Parse et normalise un type d'organisation vers sa valeur courte
 * Exemple: "E" → "company", "L" → "not_company", "Hors entreprise" → "not_company"
 * Retourne null pour les valeurs vides, mal formatées ou non reconnues
 */
export function parseOrganizationType(value: string): string | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;

  const trimmedValue = value.trim();

  // Si c'est déjà une valeur normalisée valide, la retourner directement
  if (trimmedValue === "company" || trimmedValue === "not_company") {
    return trimmedValue;
  }

  const normalized = normalizeForMatching(trimmedValue);

  // Vérifier d'abord les alias (pour "E" et "L")
  if (ORGANIZATION_TYPE_ALIASES[normalized]) {
    const result = ORGANIZATION_TYPE_ALIASES[normalized].value;
    // Log pour s'assurer que "L" est bien mappé vers "not_company"
    if (normalized === "l") {
      console.log(`[parseOrganizationType] Mapping "L" to "${result}"`);
    }
    return result;
  }

  // Ensuite vérifier les mappings complets
  if (ORGANIZATION_TYPE_MAPPINGS[normalized]) {
    return ORGANIZATION_TYPE_MAPPINGS[normalized].value;
  }

  // Log si aucun mapping trouvé pour débugger
  console.warn(
    `[parseOrganizationType] No mapping found for: "${value}" (normalized: "${normalized}")`,
  );
  return null;
}
// =====================
// FONCTIONS D'AFFICHAGE
// =====================

/**
 * Formate une date au format "DD/MM/YYYY" pour l'affichage
 * Exemple: "2025-03-15" → "15/03/2025"
 */

export function getCityLabel(city: string | null): string {
  if (!city) return "??";
  return city;
}
/**
 * Obtient le label d'un nombre de semaines pour l'affichage
 * Exemple: 4 → "4 semaines", null → "??"
 */
export function getWeeksLabel(weeksCount: number | null): string {
  if (!weeksCount) return "??";
  return `${weeksCount} semaines`;
}

/**
 * Obtient le label d'un titre pour l'affichage
 * Exemple: "Titre" → "Titre", null → "??"
 */
export function getTitleLabel(title: string | null): string {
  if (!title) return "??";
  return title;
}

/**
 * Obtient le label d'un sujet pour l'affichage
 * Exemple: "Sujet" → "Sujet", null → "??"
 */
export function getSubjectLabel(subject: string | null): string {
  if (!subject) return "??";
  return subject;
}

/**
 * Formate une date au format "DD/MM/YYYY" pour l'affichage
 * Exemple: "2025-03-15" → "15/03/2025"
 * Retourne "??" si la date est nulle
 */
export function getDateLabel(dateStr: string | null): string {
  if (!dateStr) {
    return "??";
  }
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ===================================
// FONCTIONS D'AFFICHAGE - NOMS COURTS
// ===================================

/**
 * Obtient le nom court d'un diplôme pour l'affichage sur les cartes
 * Exemple: "ti-sante" → "TI Santé", "gene" → "Généraliste", null → "??"
 */
export function getMajorShortLabel(value: string | null): string {
  if (!value || typeof value !== "string" || value === "__inconnu__") return "??";

  // Recherche directe par valeur
  const directMapping = Object.values(MAJOR_MAPPINGS).find((mapping) => mapping.value === value);
  if (directMapping) {
    return directMapping.shortLabel;
  }

  return "??";
}

/**
 * Obtient le nom court d'une option pour l'affichage sur les cartes
 * Exemple: "sdia" → "SDIA", "rio" → "RIO", null → "??"
 */
export function getOptionShortLabel(value: string | null): string {
  if (!value || typeof value !== "string" || value === "__inconnu__") return "??";

  // Recherche directe par valeur
  const directMapping = Object.values(OPTION_MAPPINGS).find((mapping) => mapping.value === value);
  if (directMapping && directMapping.value !== "aucune") {
    return directMapping.shortLabel;
  }

  return "??";
}

/**
 * Obtient le label d'un pays pour l'affichage
 * Exemple: "france" → "FRANCE", null → "??"
 */
export function getCountryLabel(value: string | null): string {
  if (!value || typeof value !== "string") return "??";

  const mapping = COUNTRY_MAPPINGS[value];
  if (mapping) {
    return mapping.label;
  }

  return "??";
}

/**
 * Obtient le label d'un type d'organisation pour l'affichage
 * Exemple: "company" → "Entreprise", null → "??"
 */
export function getOrganizationTypeLabel(value: string | null): string {
  if (!value || typeof value !== "string") return "??";

  const mapping = ORGANIZATION_TYPE_MAPPINGS[value];
  if (mapping) {
    return mapping.label;
  }

  return "??";
}

// =====================================
// FONCTIONS D'AFFICHAGE - NOMS COMPLETS
// =====================================

/**
 * Obtient le nom complet enrichi d'un diplôme pour l'affichage détaillé
 * Si pas de nom complet, retourne le nom court
 * Exemple: "ti-sante" → "TI Santé (Technologie de l'Information pour la Santé)", null → "??"
 */
export function getMajorFullLabel(value: string | null): string {
  if (!value || typeof value !== "string" || value === "__inconnu__") return "??";

  // Recherche directe par valeur
  const directMapping = Object.values(MAJOR_MAPPINGS).find((mapping) => mapping.value === value);
  if (directMapping) {
    return directMapping.fullLabel || directMapping.shortLabel;
  }

  return "??";
}

/**
 * Obtient le nom complet enrichi d'une option pour l'affichage détaillé
 * Si pas de nom complet, retourne le nom court
 * Exemple: "sdia" → "SDIA (Science des Données et Intelligence Artificielle)", null → "??"
 */
export function getOptionFullLabel(value: string | null): string {
  if (!value || typeof value !== "string" || value === "__inconnu__") return "??";

  // Recherche directe par valeur
  const directMapping = Object.values(OPTION_MAPPINGS).find((mapping) => mapping.value === value);
  if (directMapping && directMapping.value !== "aucune") {
    return directMapping.fullLabel || directMapping.shortLabel;
  }

  return "??";
}
