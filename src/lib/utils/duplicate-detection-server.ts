import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Vérifie si un stage en attente est un doublon d'un stage déjà approuvé
 */
export async function isDuplicateInternshipServer(
  internshipId: string,
  internshipHash: string | null,
): Promise<boolean> {
  if (!internshipHash) return false;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("internship")
    .select("id")
    .eq("internshipHash", internshipHash)
    .eq("state", "visible")
    .neq("id", internshipId)
    .limit(1);

  if (error) {
    console.error("Error checking duplicate internship (server):", error);
    return false;
  }

  return data.length > 0;
}

export async function enrichInternshipsWithDuplicateServer<
  T extends { id: string; internshipHash: string | null },
>(internships: T[]): Promise<(T & { isDuplicate: boolean })[]> {
  return Promise.all(
    internships.map(async (internship) => ({
      ...internship,
      isDuplicate: await isDuplicateInternshipServer(internship.id, internship.internshipHash),
    })),
  );
}
