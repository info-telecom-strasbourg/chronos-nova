/**
 * Utilitaires pour le parsing et la transformation des données Excel
 * Centralise toutes les fonctions de normalisation, transformation et formatage
 */

// ===============================
// FORMATAGE DE TEXTE ET NOMS
// ===============================

/**
 * Sépare un nom complet en nom de famille (majuscules) et prénom
 * Exemple: "DUPONT Jean-Marie" → { lastName: "DUPONT", firstName: "Jean-Marie" }
 */
export function splitLastNameFirstName(fullName: string): {
  lastName: string;
  firstName: string;
} {
  try {
    const trimmed = (fullName || "").trim();
    if (!trimmed || trimmed === "x" || trimmed === "X" || trimmed === "?" || trimmed === "??") {
      return { lastName: "??", firstName: "??" };
    }

    const words = trimmed.split(/\s+/);

    // Séparer les mots en majuscules (nom de famille) et le reste (prénom)
    const lastNameWords: string[] = [];
    const firstNameWords: string[] = [];

    for (const word of words) {
      // Un mot est considéré comme nom de famille s'il est entièrement en majuscules
      // et contient au moins 1 caractère alphabétique (pour gérer les noms courts et composés)
      if (word === word.toUpperCase() && /[A-ZÀ-ÖØ-Ý]/.test(word)) {
        lastNameWords.push(word);
      } else {
        firstNameWords.push(word);
      }
    }

    // Si aucun mot en majuscule n'est trouvé, considérer le dernier mot comme nom de famille
    if (lastNameWords.length === 0 && words.length > 1) {
      const lastWord = words[words.length - 1];
      lastNameWords.push(lastWord.toUpperCase());
      firstNameWords.splice(-1, 1); // Retirer le dernier mot des prénoms
    }

    // Si un seul mot, le considérer comme nom de famille
    if (words.length === 1) {
      return {
        lastName: words[0].toUpperCase(),
        firstName: "??",
      };
    }

    return {
      lastName: lastNameWords.length > 0 ? lastNameWords.join(" ") : "??",
      firstName: firstNameWords.length > 0 ? firstNameWords.join(" ") : "??",
    };
  } catch (error) {
    console.error(`Erreur lors du parsing du nom "${fullName}":`, error);
    return { lastName: "??", firstName: "??" };
  }
}

/**
 * Extrait le nombre de semaines depuis une cellule Excel
 * Exemple: "8 semaines" → 8, "Stage de 12 sem" → 12
 */
export function extractNumberOfWeeks(weeksCell: string): number {
  try {
    if (!weeksCell || typeof weeksCell !== "string" || weeksCell.trim() === "") {
      return 0;
    }

    const trimmed = weeksCell.trim();

    // Chercher un nombre dans la chaîne
    const match = trimmed.match(/\d+/);
    if (match) {
      const weeks = parseInt(match[0], 10);
      return weeks > 0 ? weeks : 0;
    }

    return 0;
  } catch (error) {
    console.error(`Erreur lors de l'extraction du nombre de semaines "${weeksCell}":`, error);
    return 0;
  }
}

// ===============================
// TRANSFORMATIONS DE DONNÉES 2A
// ===============================

/**
 * Convertit une valeur confidentielle en booléen
 * Exemple: "oui" → true, "x" → true, "non" → false
 */
export function parseConfidential(value: string): boolean {
  if (!value || typeof value !== "string") return false;

  const normalized = value.trim().toLowerCase();
  return normalized === "oui" || normalized === "x";
}

/**
 * Convertit un diplôme en alias pour la base de données
 * Exemple: "G" → "gene", "TIS" → "ti-sante", "IR" → "ir"
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
 * Exemple: "SDIA" → "sdia", "RIO" → "rio"
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
 * Exemple: "15/03/2025" → "2025-03-15"
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

// ===============================
// NORMALISATION D'ORGANISATIONS
// ===============================

/**
 * Normalise le type d'organisation pour la base de données
 * Exemple: "E" → "company", "L" → "not_company"
 */
export function normalizeOrganizationType(orgType: string): string {
  try {
    if (!orgType || typeof orgType !== "string") {
      return "not_company"; // Valeur par défaut conforme à la base
    }

    const cleaned = orgType.trim().toUpperCase().replace(/\./g, "");

    // Accepter toutes les variantes de "E" ou "ENTREPRISE"
    if (["E", "ENTREPRISE"].includes(cleaned)) {
      return "company";
    }

    // Tout le reste (L, LABORATOIRE, etc.)
    return "not_company";
  } catch (error) {
    console.error(`Erreur lors de la normalisation du type d'organisation "${orgType}":`, error);
    return "not_company"; // Valeur par défaut conforme à la base
  }
}

// ===============================
// VALIDATION DE CONTENU
// ===============================

/**
 * Vérifier si une ligne Excel a du contenu significatif
 * Utilisé pour arrêter le parsing quand on atteint des lignes vides
 */
export function hasSignificantContent(row: import("exceljs").Row): boolean {
  try {
    if (!row || row.cellCount === 0) return false;

    // Vérifier les cellules importantes pour les stages 2A
    const importantCells = [2, 5, 13, 15]; // Nom étudiant, organisation, sujet, tuteur

    for (const cellIndex of importantCells) {
      const cell = row.getCell(cellIndex);
      const text = cell?.text?.trim();
      if (text && text !== "" && text !== "??") {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}
