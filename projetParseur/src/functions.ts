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
  options?: { isCountry?: boolean }
): string {
  const invalidValues = ["x", "X", "?"];

  const abreviations: Record<string, string> = {
    fr: "FRANCE",
    en: "ANGLETERRE",
    it: "ITALIE",
    de: "ALLEMAGNE",
    es: "ESPAGNE",
  };

  let val = value.trim();

  // Special case for country
  if (options?.isCountry) {
    val = val.toLowerCase();
    if (abreviations[val]) return abreviations[val].toUpperCase();
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
      lastName: match[1].trim(),
      firstName: match[2].trim(),
    };
  }

  // Try "Firstname LASTNAME"
  match = trimmed.match(/^(.+?)\s+([A-ZÀ-ÖØ-Ý\- ]+)$/u);
  if (match) {
    return {
      lastName: match[2].trim(),
      firstName: match[1].trim(),
    };
  }

  // Fallback: return the whole string as lastName, empty firstName
  return { lastName: trimmed, firstName: "??" };
}

/**
 * Extracts the number of weeks from a cell value.
 * If no number is found, returns "??".
 */
export function extractNumberOfWeeks(weeksCell: string): number | string {
  const weeksMatch = weeksCell.trim().match(/\d+/);
  return weeksMatch ? Number(weeksMatch[0]) : "??";
}
