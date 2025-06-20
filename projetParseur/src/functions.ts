// ========================================
// Utility functions
// ========================================

/**
 * Normalizes a text field.
 * - If empty, "x", "X", "?" or invalid => "??"
 */
export function normalizeField(
  value: string,
  rowNumber: number,
  options?: { isCountry?: boolean },
): string {
  const invalidValues = ["x", "X", "?"];

  const abbreviations: Record<string, string> = {
    de: "ALLEMAGNE",
    en: "ANGLETERRE",
    es: "ESPAGNE",
    fr: "FRANCE",
    it: "ITALIE",
  };

  let val = value.trim();

  // Special case for country
  if (options?.isCountry) {
    val = val.toLowerCase();
    if (abbreviations[val]) return abbreviations[val].toUpperCase();
    val = val.toUpperCase();
  }

  // If value is empty or incorrect (other cases)
  if (!val || invalidValues.includes(val)) {
    console.warn(`Row ${rowNumber}: missing or incorrect data ("${value}").`);
    return "??";
  }

  return val;
}

/**
 * Splits a string in the format "LASTNAME Firstname" or "Firstname LASTNAME"
 * using a regexp: extracts the last name (all caps) and the first name.
 */
export function splitLastNameFirstName(fullName: string): {
  lastName: string;
  firstName: string;
} {
  const trimmed = fullName.trim();

  // Try "LASTNAME Firstname"
  let match = trimmed.match(/^([A-ZÀ-ÖØ-Ý\- ]+)\s+(.+)$/u);
  if (match) {
    return {
      firstName: match[2].trim(),
      lastName: match[1].trim(),
    };
  }

  // Try "Firstname LASTNAME"
  match = trimmed.match(/^(.+?)\s+([A-ZÀ-ÖØ-Ý\- ]+)$/u);
  if (match) {
    return {
      firstName: match[1].trim(),
      lastName: match[2].trim(),
    };
  }

  // Fallback: return the whole string as lastName, empty firstName
  return { firstName: "??", lastName: trimmed };
}

/**
 * Extracts the number of weeks from a cell value.
 * If no number is found, returns "??".
 */
export function extractNumberOfWeeks(weeksCell: string): number | string {
  const weeksMatch = weeksCell.trim().match(/\d+/);
  return weeksMatch ? Number(weeksMatch[0]) : "??";
}
