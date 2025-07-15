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
 * Convertit un diplôme vers sa value courte pour la base de données
 * Exemple: "G" → "gene", "TIS" → "ti-sante", "ti-sante" → "ti-sante"
 */
export function parseDiploma(value: string): string {
  if (!value || typeof value !== "string") return "gene";

  // Normalisation intelligente : garder les caractères importants
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "") // Garder lettres, chiffres, espaces et tirets
    .replace(/\s+/g, "") // Supprimer tous les espaces
    .replace(/-+/g, "-"); // Normaliser les tirets multiples

  switch (normalized) {
    case "g":
      return "gene";
    case "tis":
      return "ti-sante";
    case "ir":
      return "ir";
    default:
      console.warn(
        `Diplôme non reconnu: "${value}" (normalisé: "${normalized}"). Fallback vers "gene".`,
      );
      return "gene";
  }
}

/**
 * Convertit une option vers sa value courte pour la base de données
 */
export function parseOption(value: string): string {
  if (!value || typeof value !== "string" || value.trim() === "") {
    return "aucune";
  }

  // Normalisation intelligente : garder les caractères importants
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "") // Garder lettres, chiffres, espaces et tirets
    .replace(/\s+/g, "") // Supprimer tous les espaces
    .replace(/-+/g, "-"); // Normaliser les tirets multiples

  switch (normalized) {
    case "sdia":
      return "sdia";
    case "rio":
      return "rio";
    case "ti":
      return "ti";
    case "dtmi":
      return "dtmi";
    case "stq":
      return "stq";
    case "ispv":
      return "ispv";
    case "issd":
      return "issd";
    case "isav":
      return "isav";
    case "photo":
      return "photo";
    case "aucune":
    case "":
      return "aucune";
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
 * Exemple: "E" → "company", "Hors entreprise" → "not_company"
 */
export function normalizeOrganizationType(orgType: string): string {
  try {
    if (!orgType || typeof orgType !== "string") {
      return "not_company";
    }

    const cleaned = orgType.trim().toUpperCase().replace(/\./g, "");

    if (["E", "ENTREPRISE"].includes(cleaned)) {
      console.log(`Type organisation "${orgType}" → "company"`);
      return "company";
    }

    console.log(`Type organisation "${orgType}" → "not_company"`);
    return "not_company";
  } catch (error) {
    console.error(`Erreur lors de la normalisation du type d'organisation "${orgType}":`, error);
    return "not_company";
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

// ===============================
// FORMATAGE GÉOGRAPHIQUE
// ===============================

/**
 * Formate un pays en value courte
 * Exemple: "FRANCE" → "france", "LUXEMBOURG" → "luxembourg"
 */
export function formatCountry(country: string): string {
  if (!country || typeof country !== "string") return "france";

  const normalized = country.trim().toUpperCase();

  switch (normalized) {
    case "FRANCE":
      return "france";
    case "ALLEMAGNE":
      return "allemagne";
    case "LUXEMBOURG":
      return "luxembourg";
    case "BELGIQUE":
      return "belgique";
    case "SUISSE":
      return "suisse";
    case "ESPAGNE":
      return "espagne";
    case "ITALIE":
      return "italie";
    case "PORTUGAL":
      return "portugal";
    default:
      return "france"; // Fallback par défaut
  }
}

/**
 * Formate un nom de ville avec majuscules appropriées
 * Met une majuscule à la première lettre de chaque mot,
 * sauf pour les déterminants et prépositions qui restent en minuscules
 */
export function formatCityName(city: string): string {
  if (!city || typeof city !== "string") return "";

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

// ===============================
// MAPPING ENRICHI POUR AFFICHAGE
// ===============================

/**
 * Convertit une value courte de diplôme en nom court pour l'affichage des cartes
 * Exemple: "ti-sante" → "TI Santé", "gene" → "Généraliste", "ir" → "IR"
 */
export function getMajorShortLabel(value: string): string {
  if (!value || typeof value !== "string") return "Généraliste";

  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "gene":
      return "Généraliste";
    case "ir":
      return "IR";
    case "ti-sante":
      return "TI Santé";
    default:
      return value; // Fallback sur la value si pas de mapping
  }
}

/**
 * Convertit une value courte d'option en nom court pour l'affichage des cartes
 * Exemple: "sdia" → "SDIA", "rio" → "RIO", "ti" → "TI"
 */
export function getOptionShortLabel(value: string): string {
  if (!value || typeof value !== "string" || value.trim() === "aucune") return "";

  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "sdia":
      return "SDIA";
    case "rio":
      return "RIO";
    case "ti":
      return "TI";
    case "dtmi":
      return "DTMI";
    case "stq":
      return "STQ";
    case "ispv":
      return "ISPV";
    case "issd":
      return "ISSD";
    case "isav":
      return "ISAV";
    case "photo":
      return "Photonique";
    case "pm":
      return "PM";
    default:
      return value.toUpperCase(); // Fallback en majuscules
  }
}

/**
 * Convertit une value courte de diplôme en label enrichi pour l'affichage
 * Exemple: "ti-sante" → "TI Santé (Technologie de l'Information pour la Santé)"
 */
export function getMajorEnrichedLabel(value: string): string {
  if (!value || typeof value !== "string") return "Généraliste";

  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "gene":
      return "Généraliste";
    case "ir":
      return "IR (Informatique et Réseaux)";
    case "ti-sante":
      return "TI Santé (Technologie de l'Information pour la Santé)";
    default:
      return value; // Fallback sur la value si pas de mapping
  }
}

/**
 * Convertit une value courte d'option en label enrichi pour l'affichage
 * Exemple: "sdia" → "SDIA (Science des Données et Intelligence Artificielle)"
 */
export function getOptionEnrichedLabel(value: string): string {
  if (!value || typeof value !== "string" || value.trim() === "aucune") return "Aucune";

  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "sdia":
      return "SDIA (Science des Données et Intelligence Artificielle)";
    case "rio":
      return "RIO (Réseaux Informatiques et Objets connectés)";
    case "ti":
      return "TI (Technologie de l'Information)";
    case "dtmi":
      return "DTMI (Dispositifs Thérapeutiques et Maintenance Industrielle)";
    case "stq":
      return "STQ (Sciences et Technologies Quantiques)";
    case "ispv":
      return "ISPV (Image, Signal, Photonique et Vision)";
    case "issd":
      return "ISSD (Ingénierie des Systèmes et Sécurité des Données)";
    case "isav":
      return "ISAV (Ingénierie des Systèmes Automobiles et de Véhicules)";
    case "photo":
      return "Photonique";
    case "pm":
      return "PM (Physique et Modélisation)";
    default:
      return value; // Fallback sur la value si pas de mapping
  }
}

/**
 * Convertit une value courte de pays en label enrichi pour l'affichage
 * Exemple: "france" → "FRANCE"
 */
export function getCountryEnrichedLabel(value: string): string {
  if (!value || typeof value !== "string") return "??";
  return value.toUpperCase();
}

/**
 * Convertit une value courte de type d'organisation en label enrichi pour l'affichage
 * Exemple: "company" → "Entreprise"
 */
export function getOrganizationTypeEnrichedLabel(value: string): string {
  if (!value || typeof value !== "string") return "Non spécifié";

  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "company":
      return "Entreprise";
    case "not_company":
      return "Hors Entreprise";
    default:
      return value;
  }
}
