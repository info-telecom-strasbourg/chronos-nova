"use server";

import { revalidatePath } from "next/cache";

/**
 * Revalidate all admin pages and layout after any internship mutation
 * This covers all admin lists, counts, and individual pages
 */
export async function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin", "layout");
}

/**
 * Revalidate public pages after internship changes
 */
export async function revalidatePublic() {
  revalidatePath("/");
}

/**
 * Revalidate everything - use for major operations
 */
export async function revalidateAll() {
  await revalidateAdmin();
  revalidatePublic();
}
