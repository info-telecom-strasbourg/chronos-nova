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

  // First, create or get organization
  const { data: orgData, error: orgError } = await supabase
    .from("organization")
    .upsert({
      name: data.organizationName,
      type: data.organizationType,
      country: data.organizationCountry,
      city: data.organizationCity,
    })
    .select("id")
    .single();

  if (orgError) throw orgError;

  // Ensure major exists
  const { error: majorError } = await supabase
    .from("major")
    .upsert({
      alias: data.studentMajor,
      name: data.studentMajor,
    })
    .select("alias");

  if (majorError) throw majorError;

  // Ensure option exists (if provided, otherwise use default)
  const optionAlias =
    data.studentOption && data.studentOption.trim() !== "" ? data.studentOption.trim() : "aucune"; // Default option for cases where no option is selected

  // Ensure the option exists in database
  const { error: optionError } = await supabase
    .from("option")
    .upsert({
      alias: optionAlias,
      name: optionAlias === "aucune" ? "Aucune" : optionAlias,
    })
    .select("alias");

  if (optionError) throw optionError;

  // Create student
  const { data: studentData, error: studentError } = await supabase
    .from("student")
    .insert({
      firstName: data.studentFirstName,
      lastName: data.studentLastName,
      majorAlias: data.studentMajor,
      optionAlias: optionAlias,
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
      subject: data.subject,
      academicYear: data.academicYear,
      beginDate: data.beginDate,
      weeksCount: data.weeksCount,
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
      name: data.organizationName,
      type: data.organizationType,
      country: data.organizationCountry,
      city: data.organizationCity,
    })
    .eq("id", currentInternship.organizationId);

  if (orgError) throw orgError;

  // Ensure major exists
  const { error: majorError } = await supabase.from("major").upsert({
    alias: data.studentMajor,
    name: data.studentMajor,
  });

  if (majorError) throw majorError;

  // Ensure option exists (if provided, otherwise use default)
  const optionAlias =
    data.studentOption && data.studentOption.trim() !== "" ? data.studentOption.trim() : "aucune"; // Default option for cases where no option is selected

  // Ensure the option exists in database
  const { error: optionError } = await supabase.from("option").upsert({
    alias: optionAlias,
    name: optionAlias === "aucune" ? "Aucune" : optionAlias,
  });

  if (optionError) throw optionError;

  // Update student
  const { error: studentError } = await supabase
    .from("student")
    .update({
      firstName: data.studentFirstName,
      lastName: data.studentLastName,
      majorAlias: data.studentMajor,
      optionAlias: optionAlias,
    })
    .eq("id", currentInternship.studentId);

  if (studentError) throw studentError;

  // Update internship
  const { error: internshipError } = await supabase
    .from("internship")
    .update({
      subject: data.subject,
      academicYear: data.academicYear,
      beginDate: data.beginDate,
      weeksCount: data.weeksCount,
    })
    .eq("id", id);

  if (internshipError) throw internshipError;

  // Revalidate admin pages after update
  const { revalidateAdmin } = await import("@/lib/revalidation");
  await revalidateAdmin();
};
