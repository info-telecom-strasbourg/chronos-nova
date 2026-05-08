import z from "zod";

export const InternshipFormValidator = z.object({
  subject: z.string().nullable().optional(),
  beginDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  weeksCount: z.number().int().positive().nullable().optional(),
  major: z.string().nullable().optional(),
  option: z.string().nullable().optional(),
  academicYear: z.enum(["1A", "2A", "3A"]).nullable().optional(),
  organizationName: z.string().nullable().optional(),
  organizationType: z.enum(["company", "not_company"]).nullable().optional(),
  country: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
});

export type InternshipFormData = z.infer<typeof InternshipFormValidator>;

export const GetAdminInternshipsValidator = z.object({
  q: z.string().optional(),
  status: z.enum(["visible", "pending", "deleted"]).optional(),
  page: z.number().int().nonnegative().default(0),
  limit: z.number().int().positive().default(50),
  years: z.array(z.string()).optional(),
  majors: z.array(z.string()).optional(),
  options: z.array(z.string()).optional(),
  countries: z.array(z.string()).optional(),
  cities: z.array(z.string()).optional(),
  orgTypes: z.array(z.string()).optional(),
  sortField: z
    .enum(["subject", "organization", "academicYear", "country", "beginDate"])
    .optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
});

export type GetAdminInternshipsParams = z.infer<
  typeof GetAdminInternshipsValidator
>;
