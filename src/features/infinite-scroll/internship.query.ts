"use server";

import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import type { InternshipData } from "@/types/drizzle";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const getInternshipsQuerySchema = z.object({
  q: z.string().optional(),
  filter: z.string().optional(),
  sort: z.enum(["created_at", "updated_at"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().optional(),
});

const internshipPerPage = 10;

// TODO: Implement search params handling in loadInternships function
export const getInternshipsQuery = async ({
  q,
  filter,
  sort,
  order,
  page = 0,
}: z.infer<typeof getInternshipsQuerySchema>) => {
  const supabase = await createSupabaseServerClient();
  const data = await supabase
    .from("internship")
    .select("*, organization(*), student(*, major(*), option(*))")
    .limit(internshipPerPage)
    .range(page * internshipPerPage, (page + 1) * internshipPerPage - 1);

  return data as PostgrestSingleResponse<InternshipData[]>;
};
