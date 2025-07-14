/**
 * Splits a string in the format "LASTNAME Firstname" or "Firstname LASTNAME"
 * using a regexp: extracts the last name (all caps) and the first name.
 */
export function splitLastNameFirstName(fullName: string): {
  lastName: string;
  firstName: string;
} {
  try {
    const trimmed = (fullName || "").trim();
    if (!trimmed || trimmed === "x" || trimmed === "X" || trimmed === "?" || trimmed === "??") {
      return { lastName: "??", firstName: "??" }; // TODO: valeur temporaire
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
        firstName: "??", // TODO: valeur temporaire
      };
    }

    return {
      lastName: lastNameWords.length > 0 ? lastNameWords.join(" ") : "??", // TODO: valeur temporaire
      firstName: firstNameWords.length > 0 ? firstNameWords.join(" ") : "??", // TODO: valeur temporaire
    };
  } catch (error) {
    console.error(`Erreur lors du parsing du nom "${fullName}":`, error);
    return { lastName: "??", firstName: "??" }; // TODO: valeur temporaire
  }
}

/**
 * Extrait le nombre de semaines depuis une cellule Excel
 */
export function extractNumberOfWeeks(weeksCell: string): number {
  try {
    if (!weeksCell || typeof weeksCell !== "string" || weeksCell.trim() === "") {
      return 0; // TODO: valeur temporaire
    }

    const trimmed = weeksCell.trim();

    // Chercher un nombre dans la chaîne
    const match = trimmed.match(/\d+/);
    if (match) {
      const weeks = parseInt(match[0], 10);
      return weeks > 0 ? weeks : 0; // TODO: valeur temporaire
    }

    return 0; // TODO: valeur temporaire
  } catch (error) {
    console.error(`Erreur lors de l'extraction du nombre de semaines "${weeksCell}":`, error);
    return 0; // TODO: valeur temporaire
  }
}
