import type { createSupabaseServerClient } from "@/lib/supabase/server";
import type { InternshipData } from "@/types/drizzle";
import {
  createBaseQuery,
  getAscendingForDate,
  getAscendingForOtherFields,
  type SortResult,
} from "./sort-strategies";

/**
 * Tri par date de début côté serveur
 */
export const sortByDateServerSide = async (
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  targetState: string,
  order?: string,
  from: number = 0,
  to: number = 9,
): Promise<SortResult> => {
  const ascending = getAscendingForDate(order);

  const { data, error, count } = await createBaseQuery(supabase, targetState)
    .order("beginDate", { ascending })
    .range(from, to);

  return { data: data as InternshipData[], count, error };
};

/**
 * Tri par durée côté serveur
 */
export const sortByDurationServerSide = async (
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  targetState: string,
  order?: string,
  from: number = 0,
  to: number = 9,
): Promise<SortResult> => {
  const ascending = getAscendingForOtherFields(order);

  const { data, error, count } = await createBaseQuery(supabase, targetState)
    .order("weeksCount", { ascending })
    .range(from, to);

  return { data: data as InternshipData[], count, error };
};

/**
 * Tri par défaut (date de début décroissant - plus récents d'abord)
 */
export const sortByDefaultServerSide = async (
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  targetState: string,
  order?: string,
  from: number = 0,
  to: number = 9,
): Promise<SortResult> => {
  const ascending = getAscendingForDate(order);
  const { data, error, count } = await createBaseQuery(supabase, targetState)
    .order("beginDate", { ascending })
    .range(from, to);

  return { data: data as InternshipData[], count, error };
};
