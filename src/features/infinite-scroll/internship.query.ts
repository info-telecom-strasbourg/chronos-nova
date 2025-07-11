"use server";

import type { InternshipData } from "@/types/drizzle";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const getInternshipsQuerySchema = z.object({
  q: z.string().optional(),
  filter: z.string().optional(),
  sort: z.enum(["created_at", "updated_at"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().optional(),
  limit: z.number().optional().default(10),
  state: z.enum(["visible", "draft", "deleted"]).optional(),
});

export type GetInternshipsResponse = {
  data: InternshipData[];
  nextPage?: number;
  hasMore: boolean;
};

// TODO: Implement search params handling in loadInternships function
export const getInternshipsQuery = async ({
  q,
  filter,
  sort,
  order,
  page = 0,
  limit,
  state,
}: z.infer<typeof getInternshipsQuerySchema>): Promise<GetInternshipsResponse> => {
  const supabase = await createSupabaseServerClient();
  const from = page * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("internship")
    .select("*, organization(*), student(*, major(*), option(*))")
    .range(from, to);

  // Filter by state if provided
  if (state) {
    query = query.eq("state", state);
  }

  const { data, error } = await query;

  if (error) throw error;

  return {
    data: data || [],
    nextPage: data && data.length === limit ? page + 1 : undefined,
    hasMore: data && data.length === limit,
  };
};

export const getInternshipsCount = async (
  state?: "visible" | "draft" | "deleted",
): Promise<number> => {
  const supabase = await createSupabaseServerClient();

  let query = supabase.from("internship").select("*", { count: "exact", head: true });

  if (state) {
    query = query.eq("state", state);
  }

  const { count, error } = await query;

  if (error) throw error;

  return count || 0;
};
