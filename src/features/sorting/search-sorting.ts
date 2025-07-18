import type { createSupabaseServerClient } from "@/lib/supabase/server";
import type { InternshipData } from "@/types/drizzle";
import {
  createBaseQuery,
  getAscendingForDate,
  getAscendingForOtherFields,
  type SortResult,
} from "./sort-strategies";

/**
 * Crée une requête de recherche avec tri pour un champ spécifique
 */
const createSearchQuery = (
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  targetState: string,
  searchField: string,
  searchValue: string,
  sort?: string,
  order?: string,
) => {
  const baseQuery = createBaseQuery(supabase, targetState).ilike(searchField, `%${searchValue}%`);

  const ascending = getAscendingForOtherFields(order);

  // Appliquer le tri selon le critère
  switch (sort) {
    case "organization":
    case "location":
      // Tri côté client car nous devons trier par champs de relation
      return baseQuery.order("beginDate", { ascending: false }); // Tri temporaire pour récupération
    case "most-recent":
      // Correction: pour beginDate, utiliser la logique des dates
      return baseQuery.order("beginDate", { ascending: getAscendingForDate(order) });
    case "duration":
      return baseQuery.order("weeksCount", { ascending });
    default:
      return baseQuery.order("beginDate", { ascending: false }); // Plus récents d'abord par défaut
  }
};

/**
 * Applique un tri côté client aux résultats de recherche
 */
const applySortingToSearchResults = (
  results: InternshipData[],
  sort?: string,
  order?: string,
): InternshipData[] => {
  if (sort !== "organization" && sort !== "location") {
    return results; // Le tri a déjà été fait côté serveur
  }

  const ascending = getAscendingForOtherFields(order);

  return results.sort((a, b) => {
    if (sort === "organization") {
      const nameA = a.organization?.name || "";
      const nameB = b.organization?.name || "";
      const comparison = nameA.localeCompare(nameB, "fr", { sensitivity: "base" });
      return ascending ? comparison : -comparison;
    } else if (sort === "location") {
      const countryA = a.organization?.country || "";
      const countryB = b.organization?.country || "";
      const cityA = a.organization?.city || "";
      const cityB = b.organization?.city || "";

      // D'abord trier par pays
      const countryComparison = countryA.localeCompare(countryB, "fr", { sensitivity: "base" });
      if (countryComparison !== 0) {
        return ascending ? countryComparison : -countryComparison;
      }

      // Puis par ville si le pays est identique
      const cityComparison = cityA.localeCompare(cityB, "fr", { sensitivity: "base" });
      return ascending ? cityComparison : -cityComparison;
    }
    return 0;
  });
};

/**
 * Récupère les stages avec recherche et tri
 */
export async function getInternshipsWithSearch(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  searchQuery: string,
  targetState: string,
  sort?: string,
  order?: string,
  from: number = 0,
  to: number = 9,
): Promise<SortResult> {
  const escapedQuery = searchQuery.replace(/[%_\\]/g, "\\$&");

  // Exécuter les requêtes en parallèle
  const [orgResults, subjectResults] = await Promise.all([
    createSearchQuery(supabase, targetState, "organization.name", escapedQuery, sort, order),
    createSearchQuery(supabase, targetState, "subject", escapedQuery, sort, order),
  ]);

  if (orgResults.error && subjectResults.error) {
    throw orgResults.error;
  }

  // Combiner et dédupliquer les résultats
  const allResults = [...(orgResults.data || []), ...(subjectResults.data || [])];
  const uniqueResults = allResults.filter(
    (item, index, arr) => arr.findIndex((t) => t.id === item.id) === index,
  );

  // Appliquer le tri côté client si nécessaire
  const sortedResults = applySortingToSearchResults(uniqueResults, sort, order);

  // Pagination côté client pour les résultats de recherche
  const total = sortedResults.length;
  const paginatedResults = sortedResults.slice(from, to + 1);

  return {
    data: paginatedResults as InternshipData[],
    count: total,
    error: null,
  };
}
