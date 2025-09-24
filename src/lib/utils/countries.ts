import countries from "i18n-iso-countries";
import fr from "i18n-iso-countries/langs/fr.json";
import { normalizeCountryName } from "./string-normalizer";

// Enregistrer la langue française
countries.registerLocale(fr);

/**
 * Interface pour un pays
 */
export interface Country {
  value: string;
  label: string;
}

/**
 * Génère la liste des pays depuis i18n-iso-countries
 * Les noms sont en français et les valeurs sont en MAJUSCULES
 */
export function generateCountriesList(): Country[] {
  const countryNames = countries.getNames("fr");

  return Object.entries(countryNames)
    .map(([, name]) => ({
      value: name.toUpperCase(),
      label: name.toUpperCase(),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
}

export const COUNTRIES_LIST = generateCountriesList();

/**
 * Trouve un pays par son nom (insensible à la casse et aux accents)
 * Retourne le nom en MAJUSCULES ou null si non trouvé
 */
export function findCountryByName(input: string): string | null {
  if (!input || typeof input !== "string") return null;

  const normalizedInput = normalizeCountryName(input);

  // Recherche stricte dans la liste officielle (insensible à la casse et aux accents)
  const exactMatch = COUNTRIES_LIST.find(
    (country) => normalizeCountryName(country.value) === normalizedInput,
  );

  return exactMatch ? exactMatch.value : null;
}

/**
 * Valide qu'un pays appartient à la liste officielle
 */
export function isValidCountry(countryName: string): boolean {
  return findCountryByName(countryName) !== null;
}

/**
 * Obtient la liste des valeurs de pays pour la validation Zod
 */
export function getCountryValues(): [string, ...string[]] {
  const values = COUNTRIES_LIST.map((country) => country.value);
  return [values[0], ...values.slice(1)];
}
