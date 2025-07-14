import type { InternshipData } from "@/types/drizzle";
import { excelToMajorAlias, excelToOptionAlias } from "@/lib/const/major-correspondance";

/**
 * Transforme un alias de diplôme du format Excel vers le format base de données
 */
export function transformMajorAlias(excelAlias: string): string {
  const normalized = excelAlias.toLowerCase().trim();
  return excelToMajorAlias[normalized] || excelAlias;
}

/**
 * Transforme un alias d'option du format Excel vers le format base de données
 */
export function transformOptionAlias(excelAlias: string): string {
  const normalized = excelAlias.toLowerCase().trim();
  return excelToOptionAlias[normalized] || excelAlias.toUpperCase();
}

/**
 * Formate l'affichage d'un alias et nom sous la forme: alias (nom complet)
 * Si l'alias et le nom sont identiques, affiche seulement l'alias
 */
export function formatAliasName(item: { alias: string; name: string } | null): string {
  if (!item) return "";

  // Si l'alias et le nom sont identiques, afficher seulement l'alias
  if (item.alias === item.name) {
    return item.alias;
  }

  // Sinon, afficher alias (nom complet)
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
