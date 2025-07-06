import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const getInternshipsQuerySchema = z.object({
  q: z.string().optional(),
  filter: z.string().optional(),
  sort: z.enum(["created_at", "updated_at"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().optional(),
});

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
    .limit(10)
    .range(page * 10, (page + 1) * 10);

  return data;
};
