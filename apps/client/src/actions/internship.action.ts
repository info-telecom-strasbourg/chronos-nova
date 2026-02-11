"use server";

import {
  type GetInternshipsParams,
  getInternships,
} from "@chronos/db/src/queries/internship";

export async function fetchInternships(params: GetInternshipsParams) {
  return getInternships(params);
}
