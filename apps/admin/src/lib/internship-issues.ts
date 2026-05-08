import type { InternshipFormData } from "@chronos/db/src/validators/admin-internship.validator";

const KNOWN_CITIES: Set<string> = new Set();
const KNOWN_ORGS: Set<string> = new Set();

export function initKnownValues(cities: string[], orgs: string[]) {
  for (const c of cities) KNOWN_CITIES.add(c.toLowerCase());
  for (const o of orgs) KNOWN_ORGS.add(o.toLowerCase());
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cell = dp[i];
      const prev = dp[i - 1];
      if (cell && prev) {
        cell[j] =
          a[i - 1] === b[j - 1]
            ? (prev[j - 1] ?? 0)
            : 1 + Math.min(prev[j] ?? 0, cell[j - 1] ?? 0, prev[j - 1] ?? 0);
      }
    }
  }
  return dp[m]?.[n] ?? 0;
}

function isSimilar(value: string, known: Set<string>, threshold = 2): boolean {
  const lower = value.toLowerCase();
  if (known.has(lower)) return false;
  for (const k of known) {
    if (levenshtein(lower, k) <= threshold) return true;
  }
  return false;
}

export function detectIssues(data: InternshipFormData): string[] {
  const issues: string[] = [];

  if (!data.subject?.trim()) issues.push("Sujet manquant");
  if (!data.organizationName?.trim())
    issues.push("Nom de l'organisation manquant");
  if (!data.organizationType) issues.push("Type d'organisation manquant");
  if (!data.country) issues.push("Pays manquant");
  if (!data.city?.trim()) issues.push("Ville manquante");
  if (!data.academicYear) issues.push("Année académique manquante");
  if (!data.major) issues.push("Diplôme manquant");
  if (!data.beginDate) issues.push("Date de début manquante");
  if (!data.weeksCount) issues.push("Durée manquante");

  if (
    data.city &&
    KNOWN_CITIES.size > 0 &&
    isSimilar(data.city, KNOWN_CITIES)
  ) {
    issues.push(
      `Ville "${data.city}" ressemble à une ville existante (possible faute de frappe)`,
    );
  }

  if (
    data.organizationName &&
    KNOWN_ORGS.size > 0 &&
    isSimilar(data.organizationName, KNOWN_ORGS, 3)
  ) {
    issues.push(
      `Organisation "${data.organizationName}" ressemble à une organisation existante (possible doublon)`,
    );
  }

  return issues;
}
