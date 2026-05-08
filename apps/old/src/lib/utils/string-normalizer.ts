/**
 * Utilitaires de normalisation de chaînes de caractères
 * Ces fonctions sont pures et n'importent rien du domaine métier
 */

/**
 * Normalise une chaîne pour le matching
 * Supprime les accents, espaces, et met en minuscules
 */
export function normalizeForMatching(value: string): string {
  if (!value || typeof value !== "string") return "";

  return value
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
}

/**
 * Normalise un nom de pays pour la comparaison
 * Supprime les accents, espaces et met en minuscules
 */
export function normalizeCountryName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9]/g, ""); // Garde seulement lettres et chiffres
}
