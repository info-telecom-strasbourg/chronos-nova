"use server";

import {
  type GetInternshipsParams,
  getInternships,
} from "@chronos/db/src/queries/internship.query";

export async function fetchInternships(params: GetInternshipsParams) {
  return getInternships(params);
}
