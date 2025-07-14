import type { Row, Worksheet } from "exceljs";
import type { Internship, Organization, Student } from "./type-definition";
import {
  extractNumberOfWeeks,
  formatCityName,
  formatCountry,
  getMajorAlias,
  getOptionAlias,
  hasSignificantContent,
  normalizeOrganizationType,
  parseConfidential,
  parseDate,
  splitLastNameFirstName,
} from "./parser-utils";

export async function parseExcelInternship2A(
  filePath: string,
  sheetName: string,
  startRow: number,
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

function parseRowsWithContent<T>(
  worksheet: Worksheet,
  startRow: number,
  maxEmptyRows: number,
  parseRow: (row: Row, rowNumber: number) => T | null,
): T[] {
  const results: T[] = [];
  let emptyRowCount = 0;
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber < startRow) return;
    if (!hasSignificantContent(row)) {
      emptyRowCount++;
      if (emptyRowCount >= maxEmptyRows) {
        return false;
      }
      return;
    }
    emptyRowCount = 0;
    try {
      const parsed = parseRow(row, rowNumber);
      if (parsed) results.push(parsed);
    } catch (error) {
      console.error(`Error parsing row ${rowNumber}:`, error);
    }
  });
  return results;
}

function parseInternships(worksheet: Worksheet, startRow: number): Internship[] {
  return parseRowsWithContent(worksheet, startRow, 5, (row) => {
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

    return {
      confidential,
      date,
      subject,
      weeksCount,
      year,
    };
  });
}

function parseStudents(worksheet: Worksheet, startRow: number): Student[] {
  return parseRowsWithContent(worksheet, startRow, 1, (row) => {
    const fullNameCell = row.getCell(2);
    const fullNameText = fullNameCell?.text?.trim() || "??";

    const { lastName, firstName } = splitLastNameFirstName(fullNameText);

    const majorCell = row.getCell(3);
    const majorRaw = majorCell?.text?.trim() || "";
    const major = getMajorAlias(majorRaw);

    const optionCell = row.getCell(4);
    const optionRaw = optionCell?.text?.trim() || "";
    const option = getOptionAlias(optionRaw);

    return {
      firstName,
      lastName,
      major,
      option,
    };
  });
}

function parseOrganizations(worksheet: Worksheet, startRow: number): Organization[] {
  return parseRowsWithContent(worksheet, startRow, 5, (row) => {
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
    const countryRaw = countryCell?.text?.trim() || "??";
    const country = formatCountry(countryRaw);

    const cityCell = row.getCell(8);
    const cityRaw = cityCell?.text?.trim() || "??";
    const city = formatCityName(cityRaw);

    return {
      country,
      orgName,
      orgType,
      tutorFirstName,
      tutorLastName,
      city,
    };
  });
}
