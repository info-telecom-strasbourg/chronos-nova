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
}: z.infer<typeof getInternshipsQuerySchema>): Promise<GetInternshipsResponse> => {
  const supabase = await createSupabaseServerClient();
  const from = page * limit;
  const to = from + limit - 1;
  const { data, error } = await supabase
    .from("internship")
    .select("*, organization(*), student(*, major(*), option(*))")
    .range(from, to);

  if (error) throw error;

  return {
    data: data || [],
    nextPage: data && data.length === limit ? page + 1 : undefined,
    hasMore: data && data.length === limit,
  };
};

export const getInternshipsCount = async (): Promise<number> => {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("internship")
    .select("*", { count: "exact", head: true });

  if (error) throw error;

  return count || 0;
};
