import type { createSupabaseServerClient } from "@/lib/supabase/server";
import type { InternshipData } from "@/types/drizzle";

export type SortOrder = "asc" | "desc";
export type SortField = "most-recent" | "organization" | "duration" | "location";

export interface SortResult {
  data: InternshipData[] | null;
  count: number | null;
  error: unknown;
}

export interface SortParams {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  targetState: string;
  sort?: string;
  order?: string;
  from: number;
  to: number;
}

/**
 * Requête de base pour récupérer les stages avec toutes les relations
 */
export const createBaseQuery = (
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  targetState: string,
) => {
  return supabase
    .from("internship")
    .select(
      `
      *,
      organization:organizationId!inner(
        id,
        name,
        type,
        country,
        city
      ),
      student:studentId!inner(
        id,
        majorAlias,
        optionAlias,
        major:majorAlias!inner(
          alias,
          name
        ),
        option:optionAlias!inner(
          alias,
          name
        )
      )
    `,
      { count: "exact" },
    )
    .eq("state", targetState);
};

/**
 * Convertit l'ordre de tri en boolean pour Supabase
 */
export const getAscendingForDate = (order?: string): boolean => {
  return order === "desc";
};

/**
 * Convertit l'ordre de tri en boolean pour les autres champs
 */
export const getAscendingForOtherFields = (order?: string): boolean => {
  return order !== "desc";
};
