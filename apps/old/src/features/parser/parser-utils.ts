/**
 * Extrait le nombre de semaines depuis une cellule Excel
 * Exemple: "8 semaines" → 8, "Stage de 12 sem" → 12
 * Retourne null pour les valeurs vides, mal formatées ou invalides
 */
export function extractNumberOfWeeks(weeksCell: string): number | null {
  try {
    if (!weeksCell || typeof weeksCell !== "string" || weeksCell.trim() === "") {
      return null;
    }

    const trimmed = weeksCell.trim();

    // Chercher un nombre dans la chaîne
    const match = trimmed.match(/\d+/);
    if (match) {
      const weeks = parseInt(match[0], 10);
      return weeks > 0 ? weeks : null;
    }

    return null;
  } catch (error) {
    console.error(`Erreur lors de l'extraction du nombre de semaines "${weeksCell}":`, error);
    return null;
  }
}

// ===============================
// TRANSFORMATIONS DE DONNÉES 2A
// ===============================

/**
 * Convertit une date au format YYYY-MM-DD
 * Gère aussi les plages de dates (ex: "02/06/2025 - 22/08/2025") en prenant la première date
 * Exemple: "15/03/2025" → "2025-03-15"
 * Retourne null pour les valeurs vides, mal formatées ou invalides
 */
export function parseDate(value: string | null): string | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;

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
        return null;
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
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch {
    return null;
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
    const importantCells = [5, 16]; // Titre stage et Dates stages

    for (const cellIndex of importantCells) {
      const cell = row.getCell(cellIndex);
      const text = cell?.text?.trim();
      if (text && text !== "") {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

// ===============================
// FORMATAGE GÉOGRAPHIQUE
// ===============================

/**
 * Formate un nom de ville avec majuscules appropriées
 * Met une majuscule à la première lettre de chaque mot,
 * sauf pour les déterminants et prépositions qui restent en minuscules
 * Retourne null pour les valeurs vides ou invalides
 */
export function formatCityName(city: string): string | null {
  if (!city || typeof city !== "string" || city.trim() === "") return null;

  const lowercaseWords = new Set([
    "de",
    "du",
    "des",
    "d'",
    "d",
    "la",
    "le",
    "les",
    "l'",
    "l",
    "au",
    "aux",
    "à",
    "en",
    "et",
    "sur",
    "sous",
  ]);

  return city
    .trim()
    .toLowerCase()
    .split(/(\s+|-+)/) // Diviser sur espaces et tirets en gardant les séparateurs
    .map((part, index) => {
      // Si c'est un espace ou un tiret, le garder tel quel
      if (/^(\s+|-+)$/.test(part)) return part;

      // Premier mot toujours en majuscule
      if (index === 0) {
        return part.charAt(0).toUpperCase() + part.slice(1);
      }

      // Vérifier si c'est un déterminant/préposition
      if (lowercaseWords.has(part)) {
        return part;
      }

      // Sinon, mettre la première lettre en majuscule
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}
