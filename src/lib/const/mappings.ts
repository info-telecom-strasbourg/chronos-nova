// ============================================
// MAPPINGS DES DIPLÔMES (Parsing et Affichage)
// ============================================

export interface MajorMapping {
  value: string;
  shortLabel: string;
  fullLabel?: string;
}

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

export interface OptionMapping {
  value: string;
  shortLabel: string;
  fullLabel?: string;
}

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
  ese: {
    value: "ese",
    shortLabel: "ESE",
    fullLabel: "ESE (Électronique et Systèmes Embarqués)",
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

// ========================================================
// MAPPINGS DES TYPES D'ORGANISATION (Affichage et Parsing)
// ========================================================

export interface OrganizationTypeMapping {
  value: string;
  label: string;
}

// Affichage
export const ORGANIZATION_TYPE_MAPPINGS: Record<string, OrganizationTypeMapping> = {
  company: { value: "company", label: "Entreprise" },
  not_company: { value: "not_company", label: "Hors Entreprise" },
} as const;

// Parsing
export const ORGANIZATION_TYPE_ALIASES: Record<string, OrganizationTypeMapping> = {
  e: { value: "company", label: "Entreprise" },
  l: { value: "not_company", label: "Hors Entreprise" },
};
