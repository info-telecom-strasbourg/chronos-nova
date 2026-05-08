"use server";

import {
  bulkApproveInternships,
  createInternship,
  deleteInternship,
  getAdminInternshipCounts,
  getAdminInternships,
  hardDeleteInternship,
  updateInternship,
  updateInternshipStatus,
} from "@chronos/db/src/queries/admin-internship.query";
import {
  GetAdminInternshipsValidator,
  InternshipFormValidator,
} from "@chronos/db/src/validators/admin-internship.validator";
import { revalidatePath } from "next/cache";
import type { SheetConfig } from "@/lib/excel-parser";
import { detectIssues } from "@/lib/internship-issues";

export async function getInternshipsAction(params: object) {
  const safe = GetAdminInternshipsValidator.parse(params);
  return getAdminInternships(safe);
}

export async function getInternshipCountsAction() {
  return getAdminInternshipCounts();
}

export async function createInternshipAction(data: object) {
  const safe = InternshipFormValidator.parse(data);
  const issues = detectIssues(safe);
  const row = await createInternship({ ...safe, status: "pending", issues });
  revalidatePath("/");
  revalidatePath("/pending");
  return row;
}

export async function updateInternshipAction(id: string, data: object) {
  const safe = InternshipFormValidator.parse(data);
  const row = await updateInternship(id, safe);
  revalidatePath("/");
  revalidatePath("/pending");
  return row;
}

export async function approveInternshipAction(id: string) {
  const row = await updateInternshipStatus(id, "visible");
  revalidatePath("/");
  revalidatePath("/pending");
  return row;
}

export async function rejectInternshipAction(id: string) {
  const row = await deleteInternship(id);
  revalidatePath("/pending");
  return row;
}

export async function deleteInternshipAction(id: string) {
  const row = await deleteInternship(id);
  revalidatePath("/");
  return row;
}

export async function hardDeleteInternshipAction(id: string) {
  const row = await hardDeleteInternship(id);
  revalidatePath("/");
  revalidatePath("/pending");
  return row;
}

export async function unpublishInternshipAction(id: string) {
  const row = await updateInternshipStatus(id, "pending");
  revalidatePath("/");
  revalidatePath("/pending");
  return row;
}

export async function bulkApproveAction(ids: string[]) {
  const rows = await bulkApproveInternships(ids);
  revalidatePath("/");
  revalidatePath("/pending");
  return rows;
}

export async function importExcelAction(
  fileBuffer: ArrayBuffer,
  sheets: SheetConfig[],
) {
  const { parseExcelBuffer } = await import("@/lib/excel-parser");
  const parsed = await parseExcelBuffer(fileBuffer, sheets);

  let imported = 0;
  let withIssues = 0;

  for (const data of parsed) {
    const issues = detectIssues(data);
    if (issues.length > 0) withIssues++;
    await createInternship({ ...data, status: "pending", issues });
    imported++;
  }

  revalidatePath("/");
  revalidatePath("/pending");

  return { imported, withIssues };
}
