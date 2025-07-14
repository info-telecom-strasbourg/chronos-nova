"use server";

import type { SheetConfig } from "@/types/excel-import";
import { revalidatePath } from "next/cache";
import path from "path";
import { parseExcelInternship2A } from "@/features/parser/parser-internship-2A";
import { pluralize } from "@/lib/scripts/string";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Types pour les parsers adaptés
interface ParsedData {
  internships: Array<{
    subject: string;
    confidential: string;
    date: string;
    weeksCount: number;
    year: string;
  }>;
  students: Array<{
    firstName: string;
    lastName: string;
    major: string;
    option?: string;
  }>;
  organizations: Array<{
    orgName: string;
    orgType: string;
    country: string;
    city: string;
    tutorFirstName: string;
    tutorLastName: string;
  }>;
}

export interface ExcelImportResult {
  success: boolean;
  message: string;
  importedCount?: number;
}

async function insertParsedDataToDatabase(data: ParsedData): Promise<number> {
  const supabase = await createSupabaseServerClient();

  let insertedCount = 0;

  for (let i = 0; i < data.internships.length; i++) {
    const internship = data.internships[i];
    const student = data.students[i];
    const organization = data.organizations[i];

    try {
      // Vérifications
      const safeOrganization = {
        orgName: organization?.orgName || "??",
        orgType: organization?.orgType || "not_company",
        country: organization?.country || "??",
        city: organization?.city || "??",
      };

      const safeStudent = {
        firstName: student?.firstName || "??",
        lastName: student?.lastName || "??",
        major: student?.major || "??",
        option: student?.option || "aucune",
      };

      const safeInternship = {
        subject: internship?.subject || "??",
        confidential: internship?.confidential || "??",
        date: internship?.date || "??",
        weeksCount: internship?.weeksCount || 0,
        year: internship?.year || "2A",
      };

      // 1. Créer ou récupérer l'organisation
      const { data: orgData, error: orgError } = await supabase
        .from("organization")
        .upsert({
          name: safeOrganization.orgName,
          type: safeOrganization.orgType,
          country: safeOrganization.country,
          city: safeOrganization.city,
        })
        .select("id")
        .single();

      if (orgError) {
        console.error(`Erreur organisation ligne ${i + 1}:`, orgError);
        continue;
      }

      // 2. Assurer que le diplôme existe
      const majorAlias = safeStudent.major;
      const { error: majorError } = await supabase.from("major").upsert({
        alias: majorAlias,
        name: majorAlias === "??" ? "Non spécifié" : majorAlias,
      });

      if (majorError) {
        console.error(`Erreur major ligne ${i + 1}:`, majorError);
        continue;
      }

      // 3. Assurer que l'option existe
      const optionAlias = safeStudent.option;
      const { error: optionError } = await supabase.from("option").upsert({
        alias: optionAlias,
        name: optionAlias === "aucune" ? "Aucune" : optionAlias,
      });

      if (optionError) {
        console.error(`Erreur option ligne ${i + 1}:`, optionError);
        continue;
      }

      // 4. Créer l'étudiant
      const { data: studentData, error: studentError } = await supabase
        .from("student")
        .insert({
          firstName: safeStudent.firstName,
          lastName: safeStudent.lastName,
          majorAlias: majorAlias,
          optionAlias: optionAlias,
        })
        .select("id")
        .single();

      if (studentError) {
        console.error(`Erreur étudiant ligne ${i + 1}:`, studentError);
        continue;
      }

      // 5. Créer le stage avec statut "draft"
      const { error: internshipError } = await supabase.from("internship").insert({
        organizationId: orgData.id,
        studentId: studentData.id,
        subject: safeInternship.subject,
        academicYear: safeInternship.year as "1A" | "2A" | "3A",
        beginDate: safeInternship.date,
        weeksCount: safeInternship.weeksCount,
        confidential: normalizeConfidential(safeInternship.confidential),
        state: "draft",
      });

      if (internshipError) {
        console.error(`Erreur stage ligne ${i + 1}:`, internshipError);
        continue;
      }

      insertedCount++;
    } catch (error) {
      console.error(`Erreur lors de l'insertion de la ligne ${i + 1}:`, error);
    }
  }

  return insertedCount;
}

function normalizeConfidential(value: string | boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  const normalized = value.toString().trim().toLowerCase();
  return normalized === "oui" || normalized === "x";
}

/**
 * Action principale d'import Excel
 */
export async function importExcelData(
  fileBuffer: ArrayBuffer,
  sheetsConfig: SheetConfig[],
): Promise<ExcelImportResult> {
  try {
    let totalImported = 0;

    for (const sheetConfig of sheetsConfig) {
      const { name: sheetName, startRow } = sheetConfig;

      // Créer un fichier temporaire pour le parser
      const os = await import("os");
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, `import_${Date.now()}.xlsx`);
      const fs = await import("fs");
      fs.writeFileSync(tempFilePath, Buffer.from(fileBuffer));

      let parsedData: ParsedData;

      // Détecter et utiliser le bon parser selon le nom de la feuille
      if (sheetName === "2A - Récap. stage") {
        // Utiliser le parser 2A avec startRow configurable
        try {
          const result = await parseExcelInternship2A(tempFilePath, sheetName, startRow);

          // Transformer les données pour correspondre au type ParsedData
          parsedData = {
            internships: result.internships.map((i) => ({
              subject: i.subject || "??",
              confidential:
                typeof i.confidential === "boolean"
                  ? i.confidential.toString()
                  : i.confidential?.toString() || "false",
              date: i.date || "2025-01-01",
              weeksCount: typeof i.weeksCount === "number" ? i.weeksCount : 0,
              year: i.year || "2A",
            })),
            students: result.students.map((s) => ({
              firstName: s.firstName || "??",
              lastName: s.lastName || "??",
              major: s.major || "gene",
              option: s.option || "aucune",
            })),
            organizations: result.organizations.map((o) => ({
              orgName: o.orgName || "??",
              orgType: o.orgType || "not_company",
              country: o.country || "??",
              city: o.city || "??",
              tutorFirstName: o.tutorFirstName || "??",
              tutorLastName: o.tutorLastName || "??",
            })),
          };
        } catch (error) {
          console.error(`Error parsing sheet "${sheetName}":`, error);
          parsedData = {
            internships: [],
            students: [],
            organizations: [],
          };
        }
      } else {
        // Nettoyer le fichier temporaire
        fs.unlinkSync(tempFilePath);
        return {
          success: false,
          message: `La feuille "${sheetName}" ne peut pas être parsée. Seules les feuilles "2A Récap. stage" et "Stage substitution" sont supportées.`,
        };
      }

      // Insérer les données en base
      const importedCount = await insertParsedDataToDatabase(parsedData);
      totalImported += importedCount;

      // Nettoyer le fichier temporaire
      fs.unlinkSync(tempFilePath);
    }

    // Revalider les pages admin pour refléter les nouveaux stages
    revalidatePath("/admin");
    revalidatePath("/admin/pending");

    return {
      success: true,
      message: pluralize(totalImported, "stage importé", "stages importés"),
      importedCount: totalImported,
    };
  } catch (error) {
    console.error("Error during Excel import:", error);
    return {
      success: false,
      message:
        "Une erreur s'est produite lors de l'import. Veuillez vérifier le format du fichier.",
    };
  }
}
