/**
 * Fonctions de transformation et normalisation des données Excel pour les stages 2A
 */

/**
 * Convertit une valeur confidentielle en booléen
 */
export function parseConfidential(value: string): boolean {
  if (!value || typeof value !== "string") return false;

  const normalized = value.trim().toLowerCase();
  return (
    normalized === "oui" ||
    normalized === "x"
  );
}

/**
 * Convertit un diplôme en alias pour la base de données
 */
export function parseDiploma(value: string): string {
  if (!value || typeof value !== "string") return "gene";

  const normalized = value.trim().toUpperCase();

  switch (normalized) {
    case "G":
      return "gene";
    case "TIS":
      return "ti-sante";
    case "IR":
      return "ir";
    default:
      return "gene";
  }
}

/**
 * Convertit une option en alias pour la base de données
 */
export function parseOption(value: string): string {
  if (!value || typeof value !== "string" || value.trim() === "") {
    return "aucune";
  }

  const normalized = value.trim().toUpperCase();

  switch (normalized) {
    case "SDIA":
      return "sdia";
    case "RIO":
      return "rio";
    case "TI":
      return "ti";
    default:
      return "aucune";
  }
}

/**
 * Convertit une date au format YYYY-MM-DD
 * Gère aussi les plages de dates (ex: "02/06/2025 - 22/08/2025") en prenant la première date
 */
export function parseDate(value: string): string {
  if (!value || typeof value !== "string") return "2025-01-01";

  try {
    let trimmed = value.trim();

    // Si c'est une plage de dates (contient un tiret), prendre la première date
    if (trimmed.includes(" - ")) {
      const dates = trimmed.split(" - ");
      trimmed = dates[0].trim();
    }

    // Si c'est déjà au bon format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    // Format DD/MM/YYYY ou DD-MM-YYYY (format français/européen)
    if (/^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/.test(trimmed)) {
      const parts = trimmed.split(/[/-]/);
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      const date = new Date(year, month - 1, day);
      
      // Vérifier si la date est valide
      if (Number.isNaN(date.getTime())) {
        return "2025-01-01";
      }

      // Convertir au format YYYY-MM-DD
      const yearStr = date.getFullYear();
      const monthStr = String(date.getMonth() + 1).padStart(2, "0");
      const dayStr = String(date.getDate()).padStart(2, "0");

      return `${yearStr}-${monthStr}-${dayStr}`;
    }

    // Essayer de parser directement
    const date = new Date(trimmed);
    if (Number.isNaN(date.getTime())) {
      return "2025-01-01";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch {
    return "2025-01-01";
  }
}

