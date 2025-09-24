"use server";

import type { CreateInternshipFormData } from "@/features/form/internship.schema";
import type { InternshipData } from "@/types/drizzle";
import { z } from "zod";
import { studentMajors, studentOptions } from "@/features/form/options";
import { isBadlyImportedStage } from "@/features/stage-validation";
import { revalidateAdmin } from "@/lib/revalidation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enrichWithDuplicateStatus } from "@/lib/utils/duplicate-detection-server";
import { createInternshipHashFromNormalized } from "@/lib/utils/internship-hash-utils";
import { validateInternshipForApproval } from "@/lib/utils/internship-validation";
import { normalizeFormData } from "@/lib/utils/stage-normalizer";
import { buildSortedQuery } from "@/features/sorting";
import { getInternshipsWithSearch } from "@/features/sorting/search-sorting";

const getInternshipsQuerySchema = z.object({
  q: z.string().optional(),
  filter: z.string().optional(),
  sort: z.enum(["most-recent", "organization", "duration", "location"]).optional(),
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

/**
 * Récupère les stages sans recherche avec tri côté serveur
 */
async function getInternshipsWithoutSearch(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  targetState: string,
  sort?: string,
  order?: string,
  from: number = 0,
  to: number = 9,
): Promise<{ data: InternshipData[] | null; count: number | null; error: unknown }> {
  // Utiliser la nouvelle fonction avec tri côté serveur
  return await buildSortedQuery(supabase, targetState, sort, order, from, to);
}

/**
 * Récupère la liste des stages avec tri et pagination
 *
 * @param q - Terme de recherche (optionnel, minimum 2 caractères)
 * @param page - Numéro de page (commence à 0)
 * @param limit - Nombre d'éléments par page
 * @param state - État des stages ("visible", "draft", "deleted")
 * @param sort - Critère de tri ("most-recent", "organization", "duration", "location")
 * @param order - Ordre de tri ("asc", "desc")
 * @returns Liste paginée des stages avec métadonnées
 */
export const getInternshipsQuery = async ({
  q,
  page = 0,
  limit,
  state,
  sort,
  order,
}: Pick<
  z.infer<typeof getInternshipsQuerySchema>,
  "q" | "page" | "limit" | "state" | "sort" | "order"
>): Promise<GetInternshipsResponse> => {
  const supabase = await createSupabaseServerClient();
  const from = page * limit;
  const to = from + limit - 1;
  const targetState = state || "visible";

  let result: { data: InternshipData[] | null; count: number | null; error: unknown };

  // Choisir la stratégie selon la présence de recherche
  if (!q || q.length < 2) {
    // Pas de recherche : tri côté serveur complet
    result = await getInternshipsWithoutSearch(supabase, targetState, sort, order, from, to);
  } else {
    // Avec recherche : tri côté serveur avec déduplication côté client
    result = await getInternshipsWithSearch(supabase, q, targetState, sort, order, from, to);
  }

  if (result.error) throw result.error;

  let enrichedData = (result.data as InternshipData[]) || [];

  // Enrichir avec le statut de doublon si nécessaire
  if (targetState === "draft") {
    enrichedData = await enrichWithDuplicateStatus(enrichedData);
  }

  return {
    data: enrichedData,
    nextPage: enrichedData.length === limit ? page + 1 : undefined,
    hasMore: enrichedData.length === limit,
    total: result.count || 0,
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
  await revalidateAdmin();
};

// Action: Approve a draft internship by setting state to 'visible'
export const approveInternship = async (
  id: string,
): Promise<{ success: boolean; message?: string }> => {
  const supabase = await createSupabaseServerClient();

  // D'abord, récupérer les données complètes du stage pour validation
  const { data: internshipData, error: fetchError } = await supabase
    .from("internship")
    .select("*, organization(*), student(*, major(*), option(*))")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  const validation = await validateInternshipForApproval(internshipData);

  if (!validation.canApprove) {
    return {
      success: false,
      message: validation.errors.join(", "),
    };
  }

  // Générer le hash du stage
  const internshipHash = createInternshipHashFromNormalized({
    internship: {
      subject: internshipData.subject,
      beginDate: internshipData.beginDate,
      weeksCount: internshipData.weeksCount,
      academicYear: internshipData.academicYear,
    },
    organization: {
      name: internshipData.organization?.name || null,
      type: internshipData.organization?.type || null,
      country: internshipData.organization?.country || null,
      city: internshipData.organization?.city || null,
    },
  });

  // Si la validation passe, approuver le stage
  const { error } = await supabase
    .from("internship")
    .update({
      state: "visible",
      internshipHash: internshipHash,
      isInvalid: false, // Un stage approuvé ne peut pas être invalide
    })
    .eq("id", id);

  if (error) throw error;

  // Revalidate admin pages
  await revalidateAdmin();

  return { success: true };
};

// Action: Restore a deleted internship by setting state to 'visible'
export const restoreInternship = async (id: string): Promise<void> => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("internship").update({ state: "draft" }).eq("id", id);

  if (error) throw error;

  // Revalidate admin pages
  await revalidateAdmin();
};

// Action: Permanently delete an internship from the database
export const hardDeleteInternship = async (id: string): Promise<void> => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("internship").delete().eq("id", id);

  if (error) throw error;

  // Revalidate admin pages
  await revalidateAdmin();
};

// Action: Create a new internship
export const createInternship = async (data: CreateInternshipFormData): Promise<{ id: string }> => {
  const supabase = await createSupabaseServerClient();

  // Normaliser les données avec validation Zod puis normalisation
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
      majorAlias: normalized.student.major,
      optionAlias: normalized.student.option,
    })
    .select("id")
    .single();

  if (studentError) throw studentError;

  // Générer le hash du stage
  const internshipHash = createInternshipHashFromNormalized(normalized);

  // Calculer si le stage est invalide
  const isInvalid = isBadlyImportedStage({
    organizationName: normalized.organization.name,
    organizationType: normalized.organization.type,
    organizationCountry: normalized.organization.country,
    organizationCity: normalized.organization.city,
    subject: normalized.internship.subject,
    academicYear: normalized.internship.academicYear,
    beginDate: normalized.internship.beginDate,
    weeksCount: normalized.internship.weeksCount,
    studentMajor: normalized.student.major,
    studentOption: normalized.student.option,
  });

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
      state: "draft", // New internships start as draft
      internshipHash: internshipHash,
      isInvalid: isInvalid,
    })
    .select("id")
    .single();

  if (internshipError) throw internshipError;

  // Revalidate admin pages after creating new internship
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
      majorAlias: normalized.student.major,
      optionAlias: normalized.student.option,
    })
    .eq("id", currentInternship.studentId);

  if (studentError) throw studentError;

  // Générer le nouveau hash du stage
  const internshipHash = createInternshipHashFromNormalized(normalized);

  // Calculer si le stage est invalide
  const isInvalid = isBadlyImportedStage({
    organizationName: normalized.organization.name,
    organizationType: normalized.organization.type,
    organizationCountry: normalized.organization.country,
    organizationCity: normalized.organization.city,
    subject: normalized.internship.subject,
    academicYear: normalized.internship.academicYear,
    beginDate: normalized.internship.beginDate,
    weeksCount: normalized.internship.weeksCount,
    studentMajor: normalized.student.major,
    studentOption: normalized.student.option,
  });

  // Update internship
  const { error: internshipError } = await supabase
    .from("internship")
    .update({
      subject: normalized.internship.subject,
      academicYear: normalized.internship.academicYear,
      beginDate: normalized.internship.beginDate,
      weeksCount: normalized.internship.weeksCount,
      internshipHash: internshipHash,
      isInvalid: isInvalid,
    })
    .eq("id", id);

  if (internshipError) throw internshipError;

  // Revalidate admin pages after update
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

// Action: Soft delete all draft internships
export const deleteAllDrafts = async (): Promise<{ deletedCount: number }> => {
  const supabase = await createSupabaseServerClient();

  // Get count before deletion
  const { count: initialCount } = await supabase
    .from("internship")
    .select("*", { count: "exact", head: true })
    .eq("state", "draft");

  // Update all draft internships to deleted
  const { error } = await supabase
    .from("internship")
    .update({ state: "deleted" })
    .eq("state", "draft");

  if (error) throw error;

  await revalidateAdmin();
  return { deletedCount: initialCount || 0 };
};

// Action: Hard delete all deleted internships
export const deleteAllDeleted = async (): Promise<{ deletedCount: number }> => {
  const supabase = await createSupabaseServerClient();

  // Get count before deletion
  const { count: initialCount } = await supabase
    .from("internship")
    .select("*", { count: "exact", head: true })
    .eq("state", "deleted");

  // Permanently delete all deleted internships
  const { error } = await supabase.from("internship").delete().eq("state", "deleted");

  if (error) throw error;

  await revalidateAdmin();
  return { deletedCount: initialCount || 0 };
};
