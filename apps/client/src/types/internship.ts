import type { internships } from "@chronos/db/src/schema";

export type InternshipData = typeof internships.$inferSelect;
