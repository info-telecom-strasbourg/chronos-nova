"use server";

import type { CreateInternshipFormData } from "@/features/form/internship.schema";
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
  total: number;
};

export const getInternshipsQuery = async ({
  q,
  page = 0,
  limit,
  state,
}: Pick<
  z.infer<typeof getInternshipsQuerySchema>,
  "q" | "page" | "limit" | "state"
>): Promise<GetInternshipsResponse> => {
  const supabase = await createSupabaseServerClient();
  const from = page * limit;
  const to = from + limit - 1;
  const targetState = state || "visible";

  // Si pas de recherche, requête simple (ne commence qu'à partir de 2 caractères)
  if (!q || q.length < 2) {
    const query = supabase
      .from("internship")
      .select("*, organization(*), student(*, major(*), option(*))", { count: "exact" })
      .eq("state", targetState)
      .range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: data || [],
      nextPage: data && data.length === limit ? page + 1 : undefined,
      hasMore: data && data.length === limit,
      total: count || 0,
    };
  }

  const escapedQuery = q.replace(/[%_\\]/g, "\\$&");

  // Recherche dans le nom d'organisation
  const orgQuery = supabase
    .from("internship")
    .select("*, organization!inner(*), student(*, major(*), option(*))")
    .eq("state", targetState)
    .ilike("organization.name", `%${escapedQuery}%`);

  // Recherche dans le sujet
  const subjectQuery = supabase
    .from("internship")
    .select("*, organization(*), student(*, major(*), option(*))")
    .eq("state", targetState)
    .ilike("subject", `%${escapedQuery}%`);

  const [orgResults, subjectResults] = await Promise.all([orgQuery, subjectQuery]);

  if (orgResults.error && subjectResults.error) {
    throw orgResults.error;
  }

  // Combiner et dédupliquer les résultats
  const allResults = [...(orgResults.data || []), ...(subjectResults.data || [])];

  const uniqueResults = allResults.filter(
    (item, index, arr) => arr.findIndex((t) => t.id === item.id) === index,
  );

  const total = uniqueResults.length;
  const paginatedResults = uniqueResults.slice(from, to + 1);

  return {
    data: paginatedResults,
    nextPage: paginatedResults.length === limit ? page + 1 : undefined,
    hasMore: paginatedResults.length === limit,
    total,
  };
};

export const getInternshipsCount = async (
  state: "visible" | "draft" | "deleted" = "visible",
): Promise<number> => {
  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from("internship")
    .select("*", { count: "exact", head: true })
    .eq("state", state);

  if (error) throw error;

  return count || 0;
};

// Action: Soft delete an internship by setting state to 'deleted'
export const softDeleteInternship = async (id: string): Promise<void> => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("internship").update({ state: "deleted" }).eq("id", id);

  if (error) throw error;

  // Revalidate admin pages
  const { revalidateAdmin } = await import("@/lib/revalidation");
  await revalidateAdmin();
};

// Action: Approve a draft internship by setting state to 'visible'
export const approveInternship = async (id: string): Promise<void> => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("internship").update({ state: "visible" }).eq("id", id);

  if (error) throw error;

  // Revalidate admin pages
  const { revalidateAdmin } = await import("@/lib/revalidation");
  await revalidateAdmin();
};

// Action: Restore a deleted internship by setting state to 'visible'
export const restoreInternship = async (id: string): Promise<void> => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("internship").update({ state: "visible" }).eq("id", id);

  if (error) throw error;

  // Revalidate admin pages
  const { revalidateAdmin } = await import("@/lib/revalidation");
  await revalidateAdmin();
};

// Action: Permanently delete an internship from the database
export const hardDeleteInternship = async (id: string): Promise<void> => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("internship").delete().eq("id", id);

  if (error) throw error;

  // Revalidate admin pages
  const { revalidateAdmin } = await import("@/lib/revalidation");
  await revalidateAdmin();
};

// Action: Create a new internship
export const createInternship = async (data: CreateInternshipFormData): Promise<{ id: string }> => {
  const supabase = await createSupabaseServerClient();

  // Normaliser les données avec validation Zod puis normalisation
  const { normalizeFormData } = await import("@/lib/utils/stage-normalizer");
  const normalized = normalizeFormData(data);

  // First, create or get organization
  const { data: orgData, error: orgError } = await supabase
    .from("organization")
    .upsert({
      name: normalized.organization.name,
      type: normalized.organization.type,
      country: normalized.organization.country,
      city: normalized.organization.city,
    })
    .select("id")
    .single();

  if (orgError) throw orgError;

  // Ensure major exists (with name)
  const { studentMajors } = await import("@/features/form/options");
  const majorLabel =
    studentMajors.find((m) => m.value === normalized.student.major)?.label ||
    normalized.student.major;
  const { error: majorError } = await supabase
    .from("major")
    .upsert({
      alias: normalized.student.major,
      name: majorLabel,
    })
    .select("alias");

  if (majorError) throw majorError;

  // Ensure option exists (with name)
  const { studentOptions } = await import("@/features/form/options");
  const optionLabel =
    studentOptions.find((o) => o.value === normalized.student.option)?.label ||
    normalized.student.option;
  const { error: optionError } = await supabase
    .from("option")
    .upsert({
      alias: normalized.student.option,
      name: optionLabel,
    })
    .select("alias");

  if (optionError) throw optionError;

  // Create student
  const { data: studentData, error: studentError } = await supabase
    .from("student")
    .insert({
      firstName: normalized.student.firstName,
      lastName: normalized.student.lastName,
      majorAlias: normalized.student.major,
      optionAlias: normalized.student.option,
    })
    .select("id")
    .single();

  if (studentError) throw studentError;

  // Finally create internship
  const { data: internshipData, error: internshipError } = await supabase
    .from("internship")
    .insert({
      organizationId: orgData.id,
      studentId: studentData.id,
      subject: normalized.internship.subject,
      academicYear: normalized.internship.academicYear,
      beginDate: normalized.internship.beginDate,
      weeksCount: normalized.internship.weeksCount,
      confidential: normalized.internship.confidential,
      state: "draft", // New internships start as draft
    })
    .select("id")
    .single();

  if (internshipError) throw internshipError;

  // Revalidate admin pages after creating new internship
  const { revalidateAdmin } = await import("@/lib/revalidation");
  await revalidateAdmin();

  return { id: internshipData.id };
};

// Action: Update an existing internship
export const updateInternship = async (
  id: string,
  data: CreateInternshipFormData,
): Promise<void> => {
  const supabase = await createSupabaseServerClient();

  // Normaliser les données avec validation Zod puis normalisation
  const { normalizeFormData } = await import("@/lib/utils/stage-normalizer");
  const normalized = normalizeFormData(data);

  // Get current internship to access related IDs
  const { data: currentInternship, error: fetchError } = await supabase
    .from("internship")
    .select("organizationId, studentId")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // Update organization
  const { error: orgError } = await supabase
    .from("organization")
    .update({
      name: normalized.organization.name,
      type: normalized.organization.type,
      country: normalized.organization.country,
      city: normalized.organization.city,
    })
    .eq("id", currentInternship.organizationId);

  if (orgError) throw orgError;

  // Ensure major exists (with name)
  const { studentMajors } = await import("@/features/form/options");
  const majorLabel =
    studentMajors.find((m) => m.value === normalized.student.major)?.label ||
    normalized.student.major;
  const { error: majorError } = await supabase
    .from("major")
    .upsert({
      alias: normalized.student.major,
      name: majorLabel,
    })
    .select("alias");

  if (majorError) throw majorError;

  // Ensure option exists (with name)
  const { studentOptions } = await import("@/features/form/options");
  const optionLabel =
    studentOptions.find((o) => o.value === normalized.student.option)?.label ||
    normalized.student.option;
  const { error: optionError } = await supabase
    .from("option")
    .upsert({
      alias: normalized.student.option,
      name: optionLabel,
    })
    .select("alias");

  if (optionError) throw optionError;

  // Update student
  const { error: studentError } = await supabase
    .from("student")
    .update({
      firstName: normalized.student.firstName,
      lastName: normalized.student.lastName,
      majorAlias: normalized.student.major,
      optionAlias: normalized.student.option,
    })
    .eq("id", currentInternship.studentId);

  if (studentError) throw studentError;

  // Update internship
  const { error: internshipError } = await supabase
    .from("internship")
    .update({
      subject: normalized.internship.subject,
      academicYear: normalized.internship.academicYear,
      beginDate: normalized.internship.beginDate,
      weeksCount: normalized.internship.weeksCount,
      confidential: normalized.internship.confidential,
    })
    .eq("id", id);

  if (internshipError) throw internshipError;

  // Revalidate admin pages after update
  const { revalidateAdmin } = await import("@/lib/revalidation");
  await revalidateAdmin();
};

/**
 * Récupère la liste des stages avec informations simplifiées
 * Utilise uniquement les alias pour l'affichage
 */
export async function getInternshipsWithDetails({
  page = 1,
  limit = 10,
  state = "visible",
}: {
  page?: number;
  limit?: number;
  state?: "visible" | "draft" | "deleted";
} = {}): Promise<{
  data: InternshipData[];
  count: number;
  hasMore: boolean;
}> {
  const supabase = await createSupabaseServerClient();

  // Calculer l'offset pour la pagination
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from("internship")
    .select(
      `
      *,
      organization:organizationId (
        id,
        name,
        type,
        country,
        city
      ),
      student:studentId (
        id,
        firstName,
        lastName,
        majorAlias,
        optionAlias,
        major:majorAlias (
          alias
        ),
        option:optionAlias (
          alias
        )
      )
    `,
      { count: "exact" },
    )
    .eq("state", state)
    .order("beginDate", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Erreur lors de la récupération des stages:", error);
    throw error;
  }

  const hasMore = count ? offset + limit < count : false;

  return {
    data: data as InternshipData[],
    count: count || 0,
    hasMore,
  };
}
