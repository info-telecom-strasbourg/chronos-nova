import type { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SortResult } from "./sort-strategies";
import { sortByLocationWithRPCFallback, sortByOrganizationClientSide } from "./client-side-sorting";
import {
  sortByDateServerSide,
  sortByDefaultServerSide,
  sortByDurationServerSide,
} from "./server-side-sorting";

/**
 * Construit une requête avec tri côté serveur en utilisant des sous-requêtes
 * Utilise exclusivement l'API Supabase pour tous les tris
 */
export async function buildSortedQuery(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  targetState: string,
  sort?: string,
  order?: string,
  from: number = 0,
  to: number = 9,
): Promise<SortResult> {
  switch (sort) {
    case "organization": {
      // Tri par nom d'organisation - côté client car Supabase ne peut pas trier par champs de relation
      return await sortByOrganizationClientSide(supabase, targetState, order, from, to);
    }

    case "location": {
      // Tri par localisation avec tentative RPC puis fallback côté client
      return await sortByLocationWithRPCFallback(supabase, targetState, order, from, to);
    }

    case "most-recent": {
      // Tri par date de début côté serveur
      return await sortByDateServerSide(supabase, targetState, order, from, to);
    }

    case "duration": {
      // Tri par durée côté serveur
      return await sortByDurationServerSide(supabase, targetState, order, from, to);
    }

    default: {
      // Tri par défaut : date de début selon l'ordre demandé
      return await sortByDefaultServerSide(supabase, targetState, order, from, to);
    }
  }
}
