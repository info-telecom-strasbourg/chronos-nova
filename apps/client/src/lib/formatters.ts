import {
  MAJOR_MAPPINGS,
  OPTION_MAPPINGS,
  ORGANIZATION_TYPE_MAPPINGS,
} from "./mappings";

export function getCityLabel(city: string | null): string {
  if (!city) return "??";
  return city;
}

export function getWeeksLabel(weeksCount: number | null): string {
  if (!weeksCount) return "??";
  return `${weeksCount} semaines`;
}

export function getTitleLabel(title: string | null): string {
  if (!title) return "??";
  return title;
}

export function getSubjectLabel(subject: string | null): string {
  if (!subject) return "??";
  return subject;
}

export function getDateLabel(dateStr: string | null): string {
  if (!dateStr) return "??";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getMajorShortLabel(value: string | null): string {
  if (!value || value === "__inconnu__") return "??";
  const mapping = MAJOR_MAPPINGS[value];
  if (mapping) return mapping.shortLabel;
  return "??";
}

export function getOptionShortLabel(value: string | null): string {
  if (!value || value === "__inconnu__") return "??";
  const mapping = OPTION_MAPPINGS[value];
  if (mapping && mapping.value !== "aucune") return mapping.shortLabel;
  return "??";
}

export function getCountryLabel(value: string | null): string {
  if (!value) return "??";
  return value;
}

export function getOrganizationTypeLabel(value: string | null): string {
  if (!value) return "??";
  const mapping = ORGANIZATION_TYPE_MAPPINGS[value];
  if (mapping) return mapping.label;
  return "??";
}

export function getMajorFullLabel(value: string | null): string {
  if (!value || value === "__inconnu__") return "??";
  const mapping = MAJOR_MAPPINGS[value];
  if (mapping) return mapping.fullLabel || mapping.shortLabel;
  return "??";
}

export function getOptionFullLabel(value: string | null): string {
  if (!value || value === "__inconnu__") return "??";
  const mapping = OPTION_MAPPINGS[value];
  if (mapping && mapping.value !== "aucune")
    return mapping.fullLabel || mapping.shortLabel;
  return "??";
}
