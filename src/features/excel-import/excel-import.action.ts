"use server";

import type { SheetConfig } from "@/types/excel-import";
import { revalidatePath } from "next/cache";
import path from "path";
import { parseExcelInternship2A } from "@/features/parser/parser-internship-2A";
import { pluralize } from "@/lib/scripts/string";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeCompleteStageData } from "@/lib/utils/stage-normalizer";
import { isBadlyImportedStage } from "@/features/stage-validation";

// Types pour les parsers adaptés
interface ParsedData {
  internships: Array<{
    subject: string | null;
    date: string | null;
    weeksCount: number | null;
    year: string | null;
  }>;
  students: Array<{
    major: string | null;
    option: string | null;
  }>;
  organizations: Array<{
    orgName: string | null;
    orgType: string | null;
    country: string | null;
    city: string | null;
  }>;
}

export interface ExcelImportResult {
  success: boolean;
  message: string;
  importedCount?: number;
  badlyImportedCount?: number;
}

async function insertParsedDataToDatabase(
  data: ParsedData,
): Promise<{ insertedCount: number; badlyImportedCount: number }> {
  const supabase = await createSupabaseServerClient();

  let insertedCount = 0;
  let badlyImportedCount = 0;

  for (let i = 0; i < data.internships.length; i++) {
    const internship = data.internships[i];
    const student = data.students[i];
    const organization = data.organizations[i];

    try {
      const normalized = normalizeCompleteStageData(
        {
          studentMajor: student?.major,
          studentOption: student?.option,
          organizationName: organization?.orgName,
          organizationType: organization?.orgType,
          organizationCountry: organization?.country,
          organizationCity: organization?.city,
          subject: internship?.subject,
          beginDate: internship?.date,
          weeksCount: internship?.weeksCount,
          academicYear: internship?.year,
        },
        true, // fromExcel = true
      );

      // Vérifier si le stage est mal importé
      const stageData = {
        organizationName: normalized.organization.name,
        organizationType: normalized.organization.type,
        organizationCountry: normalized.organization.country,
        organizationCity: normalized.organization.city,
        subject: normalized.internship.subject,
        academicYear: normalized.internship.academicYear,
        beginDate: normalized.internship.beginDate,
        weeksCount: normalized.internship.weeksCount,
        studentMajor: normalized.student.major,
        studentOption: normalized.student.option,
      };

      if (isBadlyImportedStage(stageData)) {
        badlyImportedCount++;
      }

      const orgName = normalized.organization.name;
      const orgType = normalized.organization.type;
      const orgCountry = normalized.organization.country;
      const orgCity = normalized.organization.city;

      const studentMajor = normalized.student.major;
      const studentOption = normalized.student.option;

      const internshipSubject = normalized.internship.subject;
      const internshipBeginDate = normalized.internship.beginDate;
      const internshipWeeksCount = normalized.internship.weeksCount;
      const internshipAcademicYear = normalized.internship.academicYear;

      // Si major ou option est null, utiliser un placeholder spécial
      const safeStudentMajor = studentMajor || "__inconnu__";
      const safeStudentOption = studentOption || "__inconnu__";

      // 1. Créer ou récupérer l'organisation
      const { data: orgData, error: orgError } = await supabase
        .from("organization")
        .upsert({
          name: orgName,
          type: orgType,
          country: orgCountry,
          city: orgCity,
        })
        .select("id")
        .single();

      if (orgError) {
        console.error(`Erreur organisation ligne ${i + 1}:`, orgError);
        continue;
      }

      // 2. Assurer que le diplôme existe
      const { error: majorError } = await supabase.from("major").upsert({
        alias: safeStudentMajor,
        name: safeStudentMajor === "gene" ? "Généraliste" : safeStudentMajor,
      });

      if (majorError) {
        console.error(`Erreur major ligne ${i + 1}:`, majorError);
        continue;
      }

      // 3. Assurer que l'option existe
      const { error: optionError } = await supabase.from("option").upsert({
        alias: safeStudentOption,
        name: safeStudentOption === "aucune" ? "Aucune" : safeStudentOption,
      });

      if (optionError) {
        console.error(`Erreur option ligne ${i + 1}:`, optionError);
        continue;
      }

      // 4. Créer l'étudiant
      const { data: studentData, error: studentError } = await supabase
        .from("student")
        .insert({
          majorAlias: safeStudentMajor,
          optionAlias: safeStudentOption,
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
        subject: internshipSubject,
        academicYear: internshipAcademicYear,
        beginDate: internshipBeginDate,
        weeksCount: internshipWeeksCount,
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

  return { insertedCount, badlyImportedCount };
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
    let totalBadlyImported = 0;

    for (const sheetConfig of sheetsConfig) {
      const { name: sheetName, academicYear } = sheetConfig;

      // Créer un fichier temporaire pour le parser
      const os = await import("os");
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, `import_${Date.now()}.xlsx`);
      const fs = await import("fs");
      fs.writeFileSync(tempFilePath, Buffer.from(fileBuffer));

      let parsedData: ParsedData;

      // Utiliser le parser 2A avec startRow configurable
      if (sheetName === "2A - Récap. stage") {
        try {
          const result = await parseExcelInternship2A(
            tempFilePath,
            sheetName,
            typeof sheetConfig.startRow === "number" ? sheetConfig.startRow : 1,
            academicYear || "",
          );

          // Transformer les données pour correspondre au type ParsedData
          parsedData = {
            internships: result.internships.map((i) => ({
              subject: i.subject || null,
              date: i.date || null,
              weeksCount: typeof i.weeksCount === "number" ? i.weeksCount : null,
              year: i.year || academicYear || null,
            })),
            students: result.students.map((s) => ({
              major: s.major || null,
              option: s.option || null,
            })),
            organizations: result.organizations.map((o) => ({
              orgName: o.orgName || null,
              orgType: o.orgType || null,
              country: o.country || null,
              city: o.city || null,
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
          message: `La feuille "${sheetName}" ne peut pas être parsée. Seule la feuille "2A - Récap. stage" est supportée.`,
        };
      }

      // Insérer les données en base
      const result = await insertParsedDataToDatabase(parsedData);
      totalImported += result.insertedCount;
      totalBadlyImported += result.badlyImportedCount;

      // Nettoyer le fichier temporaire
      fs.unlinkSync(tempFilePath);
    }

    // Revalider les pages admin pour refléter les nouveaux stages
    revalidatePath("/admin");
    revalidatePath("/admin/pending");

    // Construire le message d'import
    let message = pluralize(totalImported, "stage importé", "stages importés");
    if (totalBadlyImported > 0) {
      message += ` - ${pluralize(totalBadlyImported, "stage mal importé", "stages mal importés")} (données incomplètes)`;
    }

    return {
      success: true,
      message,
      importedCount: totalImported,
      badlyImportedCount: totalBadlyImported,
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
