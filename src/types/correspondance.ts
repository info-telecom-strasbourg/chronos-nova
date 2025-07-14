import type { InternshipData } from "@/types/drizzle";

/**
 * Formate l'affichage d'un alias et nom sous la forme: alias (nom complet)
 */
export function formatAliasName(item: { alias: string; name: string } | null): string {
  if (!item) return "";
  return `${item.alias} (${item.name})`;
}

/**
 * Hook personnalisé pour formater l'affichage diplôme/filière
 */
export function formatStudentInfo(student: InternshipData["student"]) {
  return {
    formattedMajor: formatAliasName(student.major),
    formattedOption: formatAliasName(student.option),
    majorAlias: student.major?.alias || "",
    majorName: student.major?.name || "",
    optionAlias: student.option?.alias || "",
    optionName: student.option?.name || "",
  };
}
