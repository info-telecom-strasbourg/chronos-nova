import { normalizeForMatching } from "./string-normalizer";
import { findCountryByName } from "./countries";
import { MAJOR_MAPPINGS, OPTION_MAPPINGS, ORGANIZATION_TYPE_MAPPINGS, ORGANIZATION_TYPE_ALIASES } from "@/lib/const/mappings";

// ===============================
// FONCTIONS DE PARSING
// ===============================

/**
 * Parse et normalise un diplôme/filière vers sa valeur courte
 * Exemple: "G" → "gene", "TIS" → "ti-sante"
 * Retourne null pour les valeurs vides, mal formatées ou non reconnues
 */
export function parseMajor(value: string): string | null {
  if (!value || typeof value !== "string" || value.trim() === "") return "__inconnu__";

  const trimmedValue = value.trim();

  // Si c'est déjà "__inconnu__", le retourner directement sans warning
  if (trimmedValue === "__inconnu__") return "__inconnu__";

  const normalized = normalizeForMatching(trimmedValue);
  const mapping = MAJOR_MAPPINGS[normalized];

  if (mapping) {
    return mapping.value;
  }

  console.warn(
    `Diplôme non reconnu: "${value}" (normalisé: "${normalized}"). Retour '__inconnu__'.`,
  );
  return "__inconnu__";
}

/**
 * Parse et normalise une option/spécialité vers sa valeur courte
 * Exemple: "SDIA" → "sdia", "RIO" → "rio"
 * Retourne null pour les valeurs vides, mal formatées ou non reconnues
 */
export function parseOption(value: string): string | null {
  if (!value || typeof value !== "string" || value.trim() === "") {
    return "__inconnu__";
  }

  const trimmedValue = value.trim();

  // Si c'est déjà "__inconnu__", le retourner directement
  if (trimmedValue === "__inconnu__") return "__inconnu__";

  const normalized = normalizeForMatching(trimmedValue);
  const mapping = OPTION_MAPPINGS[normalized];

  if (mapping) {
    return mapping.value;
  }

  return "__inconnu__";
}

/**
 * Parse et normalise un pays vers sa valeur courte
 * Exemple: "france" → "FRANCE", "allemagne" → "ALLEMAGNE"
 * Retourne null pour les valeurs vides, mal formatées ou non reconnues
 */
export function parseCountry(value: string): string | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;

  return findCountryByName(value);
}

/**
 * Parse et normalise un type d'organisation vers sa valeur courte
 * Exemple: "E" → "company", "L" → "not_company", "Hors entreprise" → "not_company"
 * Retourne null pour les valeurs vides, mal formatées ou non reconnues
 */
export function parseOrganizationType(value: string): string | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;

  const trimmedValue = value.trim();

  // Si c'est déjà une valeur normalisée valide, la retourner directement
  if (trimmedValue === "company" || trimmedValue === "not_company") {
    return trimmedValue;
  }

  const normalized = normalizeForMatching(trimmedValue);

  // Vérifier d'abord les alias (pour "E" et "L")
  if (ORGANIZATION_TYPE_ALIASES[normalized]) {
    const result = ORGANIZATION_TYPE_ALIASES[normalized].value;
    // Log pour s'assurer que "L" est bien mappé vers "not_company"
    if (normalized === "l") {
      console.log(`[parseOrganizationType] Mapping "L" to "${result}"`);
    }
    return result;
  }

  // Ensuite vérifier les mappings complets
  if (ORGANIZATION_TYPE_MAPPINGS[normalized]) {
    return ORGANIZATION_TYPE_MAPPINGS[normalized].value;
  }

  // Log si aucun mapping trouvé pour débugger
  console.warn(
    `[parseOrganizationType] No mapping found for: "${value}" (normalized: "${normalized}")`,
  );
  return null;
}
