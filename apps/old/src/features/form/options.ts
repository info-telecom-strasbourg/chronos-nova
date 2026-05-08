import { ORGANIZATION_TYPE_MAPPINGS } from "@/lib/const/mappings";
import { COUNTRIES_LIST } from "@/lib/utils/countries";
import { getMajorShortLabel, getOptionShortLabel } from "@/lib/utils/formatters";

// Utiliser les mappings centralisés pour la cohérence
export const organizationTypes = Object.values(ORGANIZATION_TYPE_MAPPINGS)
  .filter((mapping) => mapping.value === "company" || mapping.value === "not_company")
  .map((mapping) => ({ value: mapping.value, label: mapping.label }));

export const countries = COUNTRIES_LIST;

export const academicStructure = {
  "1A": {
    gene: {
      label: getMajorShortLabel("gene"),
      options: [],
    },
    ir: {
      label: getMajorShortLabel("ir"),
      options: [],
    },
    "ti-sante": {
      label: getMajorShortLabel("ti-sante"),
      options: [],
    },
  },
  "2A": {
    gene: {
      label: getMajorShortLabel("gene"),
      options: [],
    },
    ir: {
      label: getMajorShortLabel("ir"),
      options: [
        { value: "rio", label: getOptionShortLabel("rio") },
        { value: "sdia", label: getOptionShortLabel("sdia") },
      ],
    },
    "ti-sante": {
      label: getMajorShortLabel("ti-sante"),
      options: [
        { value: "ti", label: getOptionShortLabel("ti") },
        { value: "dtmi", label: getOptionShortLabel("dtmi") },
      ],
    },
    master: {
      label: getMajorShortLabel("master"),
      options: [
        { value: "asi", label: getOptionShortLabel("asi") },
        { value: "ht", label: getOptionShortLabel("ht") },
        { value: "imed", label: getOptionShortLabel("imed") },
        { value: "phynano", label: getOptionShortLabel("phynano") },
      ],
    },
  },
  "3A": {
    gene: {
      label: getMajorShortLabel("gene"),
      options: [
        { value: "pm", label: getOptionShortLabel("pm") },
        { value: "stq", label: getOptionShortLabel("stq") },
        { value: "photo", label: getOptionShortLabel("photo") },
        { value: "ispv", label: getOptionShortLabel("ispv") },
        { value: "issd", label: getOptionShortLabel("issd") },
        { value: "isav", label: getOptionShortLabel("isav") },
        { value: "ese", label: getOptionShortLabel("ese") },
      ],
    },
    ir: {
      label: getMajorShortLabel("ir"),
      options: [
        { value: "rio", label: getOptionShortLabel("rio") },
        { value: "sdia", label: getOptionShortLabel("sdia") },
      ],
    },
    "ti-sante": {
      label: getMajorShortLabel("ti-sante"),
      options: [
        { value: "ti", label: getOptionShortLabel("ti") },
        { value: "dtmi", label: getOptionShortLabel("dtmi") },
      ],
    },
    master: {
      label: getMajorShortLabel("master"),
      options: [
        { value: "id", label: getOptionShortLabel("id") },
        { value: "ht", label: getOptionShortLabel("ht") },
        { value: "ar", label: getOptionShortLabel("ar") },
        { value: "irmc", label: getOptionShortLabel("irmc") },
        { value: "mphot", label: getOptionShortLabel("mphot") },
        { value: "topo", label: getOptionShortLabel("topo") },
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
  if (!yearData) return [{ value: "aucune", label: "Aucune" }];

  const major = yearData[majorKey as keyof typeof yearData];
  if (!major) return [{ value: "aucune", label: "Aucune" }];

  const options = major.options || [];
  return options.length > 0 ? options : [{ value: "aucune", label: "Aucune" }];
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
