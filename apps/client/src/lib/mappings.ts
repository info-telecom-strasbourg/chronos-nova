export interface MajorMapping {
  value: string;
  shortLabel: string;
  fullLabel?: string;
}

export const MAJOR_MAPPINGS: Record<string, MajorMapping> = {
  gene: { value: "gene", shortLabel: "Généraliste" },
  ir: {
    value: "ir",
    shortLabel: "IR",
    fullLabel: "IR (Informatique et Réseaux)",
  },
  "ti-sante": {
    value: "ti-sante",
    shortLabel: "TI Santé",
    fullLabel: "TI Santé (Technologie de l'Information pour la Santé)",
  },
  master: { value: "master", shortLabel: "Master" },
} as const;

export interface OptionMapping {
  value: string;
  shortLabel: string;
  fullLabel?: string;
  major?: string;
}

export const OPTION_MAPPINGS: Record<string, OptionMapping> = {
  aucune: { value: "aucune", shortLabel: "Aucune" },

  // Options IR
  sdia: {
    value: "sdia",
    shortLabel: "SDIA",
    fullLabel: "SDIA (Science des Données et Intelligence Artificielle)",
    major: "ir",
  },
  rio: {
    value: "rio",
    shortLabel: "RIO",
    fullLabel: "RIO (Réseaux Informatiques et Objets connectés)",
    major: "ir",
  },

  // Options TI Santé
  ti: {
    value: "ti",
    shortLabel: "TI",
    fullLabel: "TI (Technologie de l'Information)",
    major: "ti-sante",
  },
  dtmi: {
    value: "dtmi",
    shortLabel: "DTMI",
    fullLabel: "DTMI (Dispositifs Thérapeutiques et Maintenance Industrielle)",
    major: "ti-sante",
  },

  // Options Généraliste 3A
  stq: {
    value: "stq",
    shortLabel: "STQ",
    fullLabel: "STQ (Sciences et Technologies Quantiques)",
    major: "gene",
  },
  ispv: {
    value: "ispv",
    shortLabel: "ISPV",
    fullLabel: "ISPV (Image, Signal, Photonique et Vision)",
    major: "gene",
  },
  issd: {
    value: "issd",
    shortLabel: "ISSD",
    fullLabel: "ISSD (Ingénierie des Systèmes et Sécurité des Données)",
    major: "gene",
  },
  isav: {
    value: "isav",
    shortLabel: "ISAV",
    fullLabel: "ISAV (Ingénierie des Systèmes Automobiles et de Véhicules)",
    major: "gene",
  },
  photo: { value: "photo", shortLabel: "Photonique", major: "gene" },
  pm: {
    value: "pm",
    shortLabel: "PM",
    fullLabel: "PM (Physique et Modélisation)",
    major: "gene",
  },
  ese: {
    value: "ese",
    shortLabel: "ESE",
    fullLabel: "ESE (Électronique et Systèmes Embarqués)",
    major: "gene",
  },

  // Options Master
  asi: {
    value: "asi",
    shortLabel: "ASI",
    fullLabel: "ASI (Automatique, Signal, Informatique)",
    major: "master",
  },
  ht: {
    value: "ht",
    shortLabel: "HT",
    fullLabel: "HT (HealthTech)",
    major: "master",
  },
  imed: {
    value: "imed",
    shortLabel: "IMed",
    fullLabel: "IMed (Imagerie Médicale)",
    major: "master",
  },
  phynano: {
    value: "phynano",
    shortLabel: "PhyNano",
    fullLabel: "PhyNano (Physique et Nanophotonique)",
    major: "master",
  },
  ar: {
    value: "ar",
    shortLabel: "AR",
    fullLabel: "AR (Automatique et Robotique)",
    major: "master",
  },
  id: {
    value: "id",
    shortLabel: "ID",
    fullLabel: "ID (Images et Données)",
    major: "master",
  },
  irmc: {
    value: "irmc",
    shortLabel: "IRMC",
    fullLabel: "IRMC (Imagerie, Robotique Médicale et Chirurgicale)",
    major: "master",
  },
  mphot: {
    value: "mphot",
    shortLabel: "MPHOT",
    fullLabel: "MPHOT (Photonique pour les nanosciences et le vivant)",
    major: "master",
  },
  topo: {
    value: "topo",
    shortLabel: "Topo",
    fullLabel: "Topo (Topographie et photogrammétrie)",
    major: "master",
  },
} as const;

export interface OrganizationTypeMapping {
  value: string;
  label: string;
}

export const ORGANIZATION_TYPE_MAPPINGS: Record<
  string,
  OrganizationTypeMapping
> = {
  company: { value: "company", label: "Entreprise" },
  not_company: { value: "not_company", label: "Hors Entreprise" },
} as const;
