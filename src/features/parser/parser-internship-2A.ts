import type { Worksheet } from "exceljs";
import type { Internship, Organization, Student } from "./type-definition";
import { normalizeOrganizationType } from "./data-normalizer";
import { extractNumberOfWeeks, splitLastNameFirstName } from "./functions";
import {
  parseConfidential,
  parseDate,
  parseDiploma,
  parseOption,
} from "./parser-2A-transformations";

const DEFAULT_STARTING_ROW = 12;

export async function parseExcelInternship2A(
  filePath: string,
  sheetName: string,
  startRow: number = DEFAULT_STARTING_ROW,
): Promise<{
  internships: Internship[];
  students: Student[];
  organizations: Organization[];
}> {
  try {
    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.default.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      throw new Error(`Sheet "${sheetName}" not found.`);
    }

    const internships: Internship[] = parseInternships(worksheet, startRow);
    const students: Student[] = parseStudents(worksheet, startRow);
    const organizations: Organization[] = parseOrganizations(worksheet, startRow);

    return { internships, organizations, students };
  } catch (error) {
    console.error(`Error parsing Excel file "${filePath}", sheet "${sheetName}":`, error);
    return { internships: [], students: [], organizations: [] };
  }
}

function hasSignificantContent(row: import("exceljs").Row): boolean {
  try {
    if (!row || row.cellCount === 0) return false;

    // Vérifier les cellules importantes pour les stages 2A
    const importantCells = [2, 5, 13, 15]; // Nom étudiant, organisation, sujet, tuteur

    for (const cellIndex of importantCells) {
      const cell = row.getCell(cellIndex);
      const text = cell?.text?.trim();
      if (text && text !== "" && text !== "??") {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

function parseInternships(worksheet: Worksheet, startRow: number): Internship[] {
  const internships: Internship[] = [];
  let emptyRowCount = 0;
  const maxEmptyRows = 5; // Arrêter après 5 lignes vides consécutives

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber < startRow) return;

    // Vérifier si la ligne a du contenu significatif
    if (!hasSignificantContent(row)) {
      emptyRowCount++;
      if (emptyRowCount >= maxEmptyRows) {
        return false; // Arrêter le parsing
      }
      return; // Ignorer cette ligne vide
    }

    emptyRowCount = 0; // Réinitialiser le compteur de lignes vides

    try {
      const subjectCell = row.getCell(13);
      const subject = subjectCell?.text?.trim() || "??";

      const confidentialCell = row.getCell(12);
      const confidentialRaw = confidentialCell?.text?.trim() || "";
      const confidential = parseConfidential(confidentialRaw);

      const dateCell = row.getCell(16);
      const dateRaw = dateCell?.text?.trim() || "";
      const date = parseDate(dateRaw);

      const weeksCell = row.getCell(17);
      const weeksCellText = weeksCell?.text?.trim() || "";
      const weeksCount = extractNumberOfWeeks(weeksCellText);

      const year = "2A";

      internships.push({
        confidential,
        date,
        subject,
        weeksCount,
        year,
      });
    } catch (error) {
      console.error(`Error parsing row ${rowNumber} (internships):`, error);
    }
  });

  return internships;
}

function parseStudents(worksheet: Worksheet, startRow: number): Student[] {
  const students: Student[] = [];
  let emptyRowCount = 0;
  const maxEmptyRows = 1; // Arrêter après 1 ligne vide consécutive

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber < startRow) return;

    // Vérifier si la ligne a du contenu significatif
    if (!hasSignificantContent(row)) {
      emptyRowCount++;
      if (emptyRowCount >= maxEmptyRows) {
        return false; // Arrêter le parsing
      }
      return; // Ignorer cette ligne vide
    }

    emptyRowCount = 0; // Réinitialiser le compteur de lignes vides

    try {
      const fullNameCell = row.getCell(2);
      const fullNameText = fullNameCell?.text?.trim() || "??";

      const { lastName, firstName } = splitLastNameFirstName(fullNameText);

      const majorCell = row.getCell(3);
      const majorRaw = majorCell?.text?.trim() || "";
      const major = parseDiploma(majorRaw);

      const optionCell = row.getCell(4);
      const optionRaw = optionCell?.text?.trim() || "";
      const option = parseOption(optionRaw);

      students.push({
        firstName,
        lastName,
        major,
        option,
      });
    } catch (error) {
      console.error(`Error parsing row ${rowNumber} (students):`, error);
    }
  });

  return students;
}

function parseOrganizations(worksheet: Worksheet, startRow: number): Organization[] {
  const organizations: Organization[] = [];
  let emptyRowCount = 0;
  const maxEmptyRows = 5; // Arrêter après 5 lignes vides consécutives

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber < startRow) return;

    // Vérifier si la ligne a du contenu significatif
    if (!hasSignificantContent(row)) {
      emptyRowCount++;
      if (emptyRowCount >= maxEmptyRows) {
        return false; // Arrêter le parsing
      }
      return; // Ignorer cette ligne vide
    }

    emptyRowCount = 0; // Réinitialiser le compteur de lignes vides

    try {
      const orgNameCell = row.getCell(5);
      const orgName = orgNameCell?.text?.trim() || "??";

      const tutorFullNameCell = row.getCell(15);
      const tutorFullNameText = tutorFullNameCell?.text?.trim() || "??";

      const { lastName: tutorLastName, firstName: tutorFirstName } =
        splitLastNameFirstName(tutorFullNameText);

      const orgTypeCell = row.getCell(6);
      const orgTypeRaw = orgTypeCell?.text?.trim() || "??";
      const orgType = normalizeOrganizationType(orgTypeRaw);

      const countryCell = row.getCell(7);
      const country = countryCell?.text?.trim() || "??";

      const cityCell = row.getCell(8);
      const city = cityCell?.text?.trim() || "??";

      organizations.push({
        country,
        orgName,
        orgType,
        tutorFirstName,
        tutorLastName,
        city,
      });
    } catch (error) {
      console.error(`Error parsing row ${rowNumber} (organizations):`, error);
    }
  });

  return organizations;
}
