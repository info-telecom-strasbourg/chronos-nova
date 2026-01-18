import { z } from "zod";
import {
  academicYears,
  countries,
  organizationTypes,
  studentMajors,
  studentOptions,
} from "@/features/form/options";

const organizationTypeValues = organizationTypes.map((type) => type.value) as [string, ...string[]];
const countryValues = countries.map((country) => country.value) as [string, ...string[]];
const studentMajorValues = studentMajors.map((major) => major.value) as [string, ...string[]];
const studentOptionValues = studentOptions.map((option) => option.value) as [string, ...string[]];
const academicYearValues = academicYears.map((year) => year.value) as [string, ...string[]];

export const createInternshipSchema = z.object({
  organizationName: z.string().min(1),
  organizationType: z.enum(organizationTypeValues).refine((val) => val !== undefined),
  organizationCountry: z.enum(countryValues).refine((val) => val !== undefined),
  organizationCity: z.string().min(1),
  subject: z.string().min(1),
  academicYear: z.enum(academicYearValues).refine((val) => val !== undefined),
  beginDate: z.string().min(1),
  weeksCount: z.number().min(1),
  studentMajor: z
    .string()
    .min(1, { message: "Le diplôme est requis" })
    .refine((major) => studentMajorValues.includes(major) && major !== "__inconnu__"),
  studentOption: z
    .string()
    .min(1, { message: "L'option est requise" })
    .refine((option) => studentOptionValues.includes(option) && option !== "__inconnu__"),
});

export type CreateInternshipFormData = z.infer<typeof createInternshipSchema>;
