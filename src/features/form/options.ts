export const organizationTypes = [
  { value: "company", label: "Entreprise" },
  { value: "not_company", label: "Hors Entreprise" },
];

export const countries = [
  { value: "france", label: "FRANCE" },
  { value: "allemagne", label: "ALLEMAGNE" },
  { value: "luxembourg", label: "LUXEMBOURG" },
  { value: "belgique", label: "BELGIQUE" },
  { value: "bresil", label: "BRÉSIL" },
  { value: "espagne", label: "ESPAGNE" },
  { value: "italie", label: "ITALIE" },
  { value: "portugal", label: "PORTUGAL" },
];

export const academicStructure = {
  "1A": {
    gene: {
      label: "Généraliste",
      options: [],
    },
    ir: {
      label: "IR",
      options: [],
    },
    "ti-sante": {
      label: "TI Santé",
      options: [],
    },
  },
  "2A": {
    gene: {
      label: "Généraliste",
      options: [],
    },
    ir: {
      label: "IR",
      options: [
        { value: "rio", label: "RIO" },
        { value: "sdia", label: "SDIA" },
      ],
    },
    "ti-sante": {
      label: "TI Santé",
      options: [
        { value: "ti", label: "TI" },
        { value: "dtmi", label: "DTMI" },
      ],
    },
  },
  "3A": {
    gene: {
      label: "Généraliste",
      options: [
        { value: "stq", label: "STQ" },
        { value: "photo", label: "Photonique" },
        { value: "ispv", label: "ISPV" },
        { value: "issd", label: "ISSD" },
        { value: "isav", label: "ISAV" },
      ],
    },
    ir: {
      label: "IR",
      options: [
        { value: "rio", label: "RIO" },
        { value: "sdia", label: "SDIA" },
      ],
    },
    "ti-sante": {
      label: "TI Santé",
      options: [
        { value: "ti", label: "TI" },
        { value: "dtmi", label: "DTMI" },
      ],
    },
  },
};

export const getAcademicYears = () => {
  return Object.keys(academicStructure).map((year) => ({
    value: year,
    label: year,
  }));
};

export const getMajorsForYear = (year: string) => {
  const yearData = academicStructure[year as keyof typeof academicStructure];
  if (!yearData) return [];

  return Object.entries(yearData).map(([key, major]) => ({
    value: key,
    label: major.label,
  }));
};

export const getOptionsForMajor = (year: string, majorKey: string) => {
  const yearData = academicStructure[year as keyof typeof academicStructure];
  if (!yearData) return [];

  const major = yearData[majorKey as keyof typeof yearData];
  if (!major) return [];

  return major.options || [];
};

export const hasOptionsForMajor = (year: string, majorKey: string) => {
  const options = getOptionsForMajor(year, majorKey);
  return options.length > 0;
};

export const academicYears = getAcademicYears();
export const studentMajors = Array.from(
  new Set(
    Object.values(academicStructure).flatMap((yearData) =>
      Object.entries(yearData).map(([key, major]) =>
        JSON.stringify({ value: key, label: major.label }),
      ),
    ),
  ),
).map((str) => JSON.parse(str));

export const studentOptions = [
  { value: "aucune", label: "Aucune" },
  ...Array.from(
    new Set(
      Object.values(academicStructure)
        .flatMap((yearData) => Object.values(yearData).flatMap((major) => major.options || []))
        .map((option) => JSON.stringify(option)),
    ),
  ).map((str) => JSON.parse(str)),
];
