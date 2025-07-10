import type { InternshipData } from "@/types/drizzle";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getInternshipById(id: string): Promise<InternshipData | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("internship")
    .select("*, organization(*), student(*, major(*), option(*))")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching internship:", error);
    return null;
  }

  return data as InternshipData;
}
