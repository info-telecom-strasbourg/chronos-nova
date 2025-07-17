import type { Row, Worksheet } from "exceljs";
import type { Internship, Organization, Student } from "./type-definition";
import {
  parseCountry,
  parseMajor,
  parseOption,
  parseOrganizationType,
} from "@/features/parser/mappings";
import {
  extractNumberOfWeeks,
  formatCityName,
  hasSignificantContent,
  parseDate,
} from "./parser-utils";

export async function parseExcelInternship2A(
  filePath: string,
  sheetName: string,
  startRow: number,
  year: string,
): Promise<{
  internships: Internship[];
  students: Student[];
  organizations: Organization[];
  rowsRead: number;
}> {
  try {
    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.default.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      throw new Error(`Sheet "${sheetName}" not found.`);
    }

    const parseResult = parseInternships(worksheet, startRow, year);
    const students: Student[] = parseStudents(worksheet, startRow);
    const organizations: Organization[] = parseOrganizations(worksheet, startRow);

    return { 
      internships: parseResult.internships, 
      organizations, 
      students,
      rowsRead: parseResult.rowsRead 
    };
  } catch (error) {
    console.error(`Error parsing Excel file "${filePath}", sheet "${sheetName}":`, error);
    return { internships: [], students: [], organizations: [], rowsRead: 0 };
  }
}

function parseRowsWithContent<T>(
  worksheet: Worksheet,
  startRow: number,
  maxEmptyRows: number,
  parseRow: (row: Row, rowNumber: number) => T | null,
): { results: T[]; rowsRead: number } {
  const results: T[] = [];
  let emptyRowCount = 0;
  let rowsRead = 0;
  
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber < startRow) return;
    
    if (!hasSignificantContent(row)) {
      emptyRowCount++;
      if (emptyRowCount >= maxEmptyRows) {
        return false;
      }
      return;
    }
    
    rowsRead++;
    emptyRowCount = 0;
    
    try {
      const parsed = parseRow(row, rowNumber);
      if (parsed) results.push(parsed);
    } catch (error) {
      console.error(`Error parsing row ${rowNumber}:`, error);
    }
  });
  
  return { results, rowsRead };
}

function parseInternships(worksheet: Worksheet, startRow: number, year: string): { internships: Internship[]; rowsRead: number } {
  const result = parseRowsWithContent(worksheet, startRow, 1, (row) => {
    const subjectCell = row.getCell(13);
    const subject = subjectCell?.text?.trim() || null;

    const dateCell = row.getCell(16);
    const dateRaw = dateCell?.text?.trim() || "";
    const date = parseDate(dateRaw);

    const weeksCell = row.getCell(17);
    const weeksCellText = weeksCell?.text?.trim() || "";
    const weeksCount = extractNumberOfWeeks(weeksCellText);

    return {
      date,
      subject,
      weeksCount,
      year,
    };
  });
  
  return { internships: result.results, rowsRead: result.rowsRead };
}

function parseStudents(worksheet: Worksheet, startRow: number): Student[] {
  const result = parseRowsWithContent(worksheet, startRow, 1, (row) => {
    const majorCell = row.getCell(3);
    const majorRaw = majorCell?.text?.trim();
    const major = parseMajor(majorRaw);

    const optionCell = row.getCell(4);
    const optionRaw = optionCell?.text?.trim();
    const option = parseOption(optionRaw);

    return {
      major,
      option,
    };
  });
  
  return result.results;
}

function parseOrganizations(worksheet: Worksheet, startRow: number): Organization[] {
  const result = parseRowsWithContent(worksheet, startRow, 1, (row) => {
    const orgNameCell = row.getCell(5);
    const orgName = orgNameCell?.text?.trim();

    const orgTypeCell = row.getCell(6);
    const orgTypeRaw = orgTypeCell?.text?.trim();
    const orgType = parseOrganizationType(orgTypeRaw);

    const countryCell = row.getCell(7);
    const countryRaw = countryCell?.text?.trim();
    const country = parseCountry(countryRaw);

    const cityCell = row.getCell(8);
    const cityRaw = cityCell?.text?.trim();
    const city = formatCityName(cityRaw);

    return {
      country,
      orgName,
      orgType,
      city,
    };
  });
  
  return result.results;
}
