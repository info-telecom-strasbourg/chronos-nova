import type {
  DuplicateCheckResult,
  InternshipHashData,
  InternshipValidationResult,
} from "@/types/drizzle";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateInternshipHash } from "@/lib/utils/internship-hash";

/**
 * Vérifie s'il existe déjà un stage approuvé avec le même hash
 */
export async function checkDuplicateApprovedInternship(
  hashData: InternshipHashData,
  excludeId?: string,
): Promise<DuplicateCheckResult> {
  const supabase = await createSupabaseServerClient();
  const internshipHash = generateInternshipHash(hashData);

  let query = supabase
    .from("internship")
    .select("id")
    .eq("internshipHash", internshipHash)
    .eq("state", "visible");

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return {
    isDuplicate: !!data,
    duplicateId: data?.id,
  };
}

/**
 * Valide un stage avant approbation - vérifie les données ET les doublons
 */
export async function validateInternshipForApproval(internshipData: {
  id: string;
  subject?: string | null;
  beginDate?: string | null;
  weeksCount?: number | null;
  academicYear?: string | null;
  organization?: {
    name?: string | null;
    type?: string | null;
    country?: string | null;
    city?: string | null;
  } | null;
  student?: {
    major?: { alias?: string | null } | null;
    option?: { alias?: string | null } | null;
  } | null;
}): Promise<InternshipValidationResult> {
  const { validateStageForApproval } = await import("@/features/stage-validation");
  const { extractHashDataFromInternship } = await import("@/lib/utils/internship-hash");

  // 1. Valider les données de base
  const stageData = {
    organizationName: internshipData.organization?.name || null,
    organizationType: internshipData.organization?.type || null,
    organizationCountry: internshipData.organization?.country || null,
    organizationCity: internshipData.organization?.city || null,
    subject: internshipData.subject || null,
    academicYear: internshipData.academicYear || null,
    beginDate: internshipData.beginDate || null,
    weeksCount: internshipData.weeksCount || null,
    studentMajor: internshipData.student?.major?.alias || null,
    studentOption: internshipData.student?.option?.alias || null,
  };

  const validation = validateStageForApproval(stageData);

  if (!validation.isValid) {
    return {
      canApprove: false,
      errors: validation.errors,
      isDuplicate: false,
    };
  }

  // 2. Vérifier les doublons
  const hashData = extractHashDataFromInternship(internshipData);
  const duplicateCheck = await checkDuplicateApprovedInternship(hashData, internshipData.id);

  if (duplicateCheck.isDuplicate) {
    return {
      canApprove: false,
      errors: [
        "Un stage identique est déjà approuvé. Vérifiez les données ou supprimez le doublon existant.",
      ],
      isDuplicate: true,
    };
  }

  return {
    canApprove: true,
    errors: [],
    isDuplicate: false,
  };
}
