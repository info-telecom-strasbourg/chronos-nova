export const ACADEMIC_YEARS = ["1A", "2A", "3A"] as const;
export type AcademicYear = (typeof ACADEMIC_YEARS)[number];

export const ORGANIZATION_TYPES = [
  { value: "company", label: "Entreprise" },
  { value: "not_company", label: "Hors Entreprise" },
] as const;

export const MAJOR_MAPPINGS: Record<string, string> = {
  g: "gene",
  gene: "gene",
  généraliste: "gene",
  generaliste: "gene",
  ir: "ir",
  "informatique et réseaux": "ir",
  tis: "ti-sante",
  "ti-sante": "ti-sante",
  "ti santé": "ti-sante",
  "ti sante": "ti-sante",
  m: "master",
  master: "master",
};

export const MAJOR_LABELS: Record<string, string> = {
  gene: "Généraliste",
  ir: "IR",
  "ti-sante": "TI Santé",
  master: "Master",
};

export const OPTION_MAPPINGS: Record<string, string> = {
  aucune: "aucune",
  "": "aucune",
  sdia: "sdia",
  rio: "rio",
  ti: "ti",
  dtmi: "dtmi",
  stq: "stq",
  ispv: "ispv",
  issd: "issd",
  isav: "isav",
  photo: "photo",
  photonique: "photo",
  pm: "pm",
  ese: "ese",
  asi: "asi",
  ht: "ht",
  imed: "imed",
  phynano: "phynano",
  ar: "ar",
  id: "id",
  irmc: "irmc",
  mphot: "mphot",
  topo: "topo",
};

export const OPTION_LABELS: Record<string, string> = {
  aucune: "Aucune",
  sdia: "SDIA",
  rio: "RIO",
  ti: "TI",
  dtmi: "DTMI",
  stq: "STQ",
  ispv: "ISPV",
  issd: "ISSD",
  isav: "ISAV",
  photo: "Photonique",
  pm: "PM",
  ese: "ESE",
  asi: "ASI",
  ht: "HT",
  imed: "IMed",
  phynano: "PhyNano",
  ar: "AR",
  id: "ID",
  irmc: "IRMC",
  mphot: "MPHOT",
  topo: "Topo",
};

export const ORG_TYPE_ALIASES: Record<string, "company" | "not_company"> = {
  e: "company",
  entreprise: "company",
  company: "company",
  l: "not_company",
  labo: "not_company",
  laboratoire: "not_company",
  not_company: "not_company",
};

export const ACADEMIC_STRUCTURE: Record<
  string,
  { label: string; options: { value: string; label: string }[] }[]
> = {
  "1A": [
    { label: "Généraliste", options: [] },
    { label: "IR", options: [] },
    { label: "TI Santé", options: [] },
  ],
  "2A": [
    { label: "Généraliste", options: [] },
    {
      label: "IR",
      options: [
        { value: "rio", label: "RIO" },
        { value: "sdia", label: "SDIA" },
      ],
    },
    {
      label: "TI Santé",
      options: [
        { value: "ti", label: "TI" },
        { value: "dtmi", label: "DTMI" },
      ],
    },
    {
      label: "Master",
      options: [
        { value: "asi", label: "ASI" },
        { value: "ht", label: "HT" },
        { value: "imed", label: "IMed" },
        { value: "phynano", label: "PhyNano" },
      ],
    },
  ],
  "3A": [
    {
      label: "Généraliste",
      options: [
        { value: "pm", label: "PM" },
        { value: "stq", label: "STQ" },
        { value: "photo", label: "Photonique" },
        { value: "ispv", label: "ISPV" },
        { value: "issd", label: "ISSD" },
        { value: "isav", label: "ISAV" },
        { value: "ese", label: "ESE" },
      ],
    },
    {
      label: "IR",
      options: [
        { value: "rio", label: "RIO" },
        { value: "sdia", label: "SDIA" },
      ],
    },
    {
      label: "TI Santé",
      options: [
        { value: "ti", label: "TI" },
        { value: "dtmi", label: "DTMI" },
      ],
    },
    {
      label: "Master",
      options: [
        { value: "id", label: "ID" },
        { value: "ht", label: "HT" },
        { value: "ar", label: "AR" },
        { value: "irmc", label: "IRMC" },
        { value: "mphot", label: "MPHOT" },
        { value: "topo", label: "Topo" },
      ],
    },
  ],
};
