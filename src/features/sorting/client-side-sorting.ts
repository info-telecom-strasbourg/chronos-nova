import type { createSupabaseServerClient } from "@/lib/supabase/server";
import type { InternshipData } from "@/types/drizzle";
import { createBaseQuery, getAscendingForOtherFields, type SortResult } from "./sort-strategies";

/**
 * Tri par nom d'organisation côté client
 */
export const sortByOrganizationClientSide = async (
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  targetState: string,
  order?: string,
  from: number = 0,
  to: number = 9,
): Promise<SortResult> => {
  const ascending = getAscendingForOtherFields(order);

  // Récupération de toutes les données avec tri par défaut
  const { data, error, count } = await createBaseQuery(supabase, targetState).order("beginDate", {
    ascending: false,
  }); // Tri temporaire pour récupération

  if (error) {
    return { data: null, count: null, error };
  }

  // Tri côté client par nom d'organisation
  const sortedData = (data as InternshipData[]).sort((a, b) => {
    const nameA = a.organization?.name || "";
    const nameB = b.organization?.name || "";

    const comparison = nameA.localeCompare(nameB, "fr", { sensitivity: "base" });
    return ascending ? comparison : -comparison;
  });

  // Pagination côté client
  const paginatedData = sortedData.slice(from, to + 1);

  return { data: paginatedData, count, error: null };
};

/**
 * Tri par localisation côté client (pays puis ville)
 */
export const sortByLocationClientSide = async (
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  targetState: string,
  order?: string,
  from: number = 0,
  to: number = 9,
): Promise<SortResult> => {
  const ascending = getAscendingForOtherFields(order);

  // Récupération de toutes les données avec tri par défaut
  const { data, error, count } = await createBaseQuery(supabase, targetState).order("beginDate", {
    ascending: false,
  }); // Tri temporaire pour récupération

  if (error) {
    return { data: null, count: null, error };
  }

  // Tri côté client par localisation (pays puis ville)
  const sortedData = (data as InternshipData[]).sort((a, b) => {
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
  });

  // Pagination côté client
  const paginatedData = sortedData.slice(from, to + 1);

  return { data: paginatedData, count, error: null };
};

/**
 * Tri par localisation avec tentative RPC côté serveur puis fallback côté client
 */
export const sortByLocationWithRPCFallback = async (
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  targetState: string,
  order?: string,
  from: number = 0,
  to: number = 9,
): Promise<SortResult> => {
  const ascending = getAscendingForOtherFields(order);

  // Essayer d'abord la fonction RPC côté serveur pour le tri par localisation
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "get_internships_sorted_by_location",
      {
        target_state: targetState,
        ascending_order: ascending,
        limit_count: to - from + 1,
        offset_count: from,
      },
    );

    if (!rpcError && rpcData) {
      // Obtenir le count total séparément
      const { count } = await supabase
        .from("internship")
        .select("*", { count: "exact", head: true })
        .eq("state", targetState);

      return { data: rpcData as InternshipData[], count, error: null };
    }
  } catch {
  }

  // Fallback : tri par localisation côté client
  return await sortByLocationClientSide(supabase, targetState, order, from, to);
};
