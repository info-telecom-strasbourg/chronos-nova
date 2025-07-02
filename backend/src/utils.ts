/**
 * Utilitaires pour la gestion des dates
 */

/**
 * Formate une date au format français DD/MM/YYYY
 */
export function formatDateFR(date: Date): string {
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
}

/**
 * Génère une date aléatoire dans le passé formatée en français
 */
export function generateRandomPastDateFR(): string {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
  return formatDateFR(pastDate);
}
