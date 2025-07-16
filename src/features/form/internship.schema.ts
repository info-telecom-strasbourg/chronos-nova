import { z } from "zod";
import {
  academicStructure,
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

export const createInternshipSchema = z
  .object({
    organizationName: z.string().min(1, { message: "Le nom de l'organisation est requis" }),
    organizationType: z
      .enum(organizationTypeValues)
      .refine((val) => val !== undefined, { message: "Le type d'organisation est requis" }),
    organizationCountry: z
      .enum(countryValues)
      .refine((val) => val !== undefined, { message: "Le pays est requis" }),
    organizationCity: z.string().min(1, { message: "La ville est requise" }),
    subject: z.string().min(1, { message: "Le sujet du stage est requis" }),
    academicYear: z
      .enum(academicYearValues)
      .refine((val) => val !== undefined, { message: "L'année académique est requise" }),
    beginDate: z.string().min(1, { message: "La date de début est requise" }),
    weeksCount: z.number().min(1, { message: "La durée doit être d'au moins 1 semaine" }),
    studentMajor: z
      .string()
      .min(1, { message: "La filière est requise" })
      .refine((major) => studentMajorValues.includes(major), { message: "Filière invalide" }),
    studentOption: z
      .string()
      .optional()
      .refine(
        (option) => {
          if (!option || option === "") return true;
          return studentOptionValues.includes(option);
        },
        { message: "Option invalide" },
      ),
  })
  .refine(
    (data) => {
      const yearData = academicStructure[data.academicYear as keyof typeof academicStructure];
      if (!yearData) return true;

      const majorData = yearData[data.studentMajor as keyof typeof yearData];
      if (!majorData) return true;

      const hasOptions = majorData.options && majorData.options.length > 0;
      if (hasOptions && (!data.studentOption || data.studentOption === "")) {
        return false;
      }

      return true;
    },
    {
      message: "L'option est requise pour cette filière",
      path: ["studentOption"],
    },
  );

export type CreateInternshipFormData = z.infer<typeof createInternshipSchema>;
