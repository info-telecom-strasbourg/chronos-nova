import { isValidCountry } from "./countries";
import { MAJOR_MAPPINGS, OPTION_MAPPINGS, ORGANIZATION_TYPE_MAPPINGS } from "@/lib/const/mappings";

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
 * Exemple: "FRANCE" → "FRANCE", null → "??"
 */
export function getCountryLabel(value: string | null): string {
  if (!value || typeof value !== "string") return "??";

  // Pour les pays, la valeur et le label sont identiques (tous en MAJUSCULES)
  if (isValidCountry(value)) {
    return value;
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
