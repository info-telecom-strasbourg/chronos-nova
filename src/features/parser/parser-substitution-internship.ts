import type { Worksheet } from "exceljs";
import type { Internship, Organization, Student } from "./type-definition";
import {
  extractNumberOfWeeks,
  parseOrganizationType,
  splitLastNameFirstName,
} from "./parser-utils";

// ===================================
// Parsing functions
// ===================================
const DEFAULT_STARTING_ROW = 8; // Row to start parsing from

export async function parseExcelSubstitutionInternship(
  filePath: string,
  sheetName: string,
  startRow: number = DEFAULT_STARTING_ROW,
): Promise<{
  internships: Internship[];
  students: Student[];
  organizations: Organization[];
}> {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.default.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(sheetName);
  if (!worksheet) {
    throw new Error(`Sheet "${sheetName}" not found.`);
  }

  // Result arrays
  const internships: Internship[] = parseInternships(worksheet, startRow);
  const students: Student[] = parseStudents(worksheet, startRow);
  const organizations: Organization[] = parseOrganizations(worksheet, startRow);

  return { internships, organizations, students };
}

function parseInternships(worksheet: Worksheet, startRow: number): Internship[] {
  const internships: Internship[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber < startRow) return; // skip header rows

    // Extraction directe des données
    const subject = row.getCell(8).text.trim() || "??";
    const confidential = row.getCell(9).text.trim() || "??";
    const date = row.getCell(11).text.trim() || "??";

    const weeksCell = row.getCell(12).text.trim();
    const weeksCount = extractNumberOfWeeks(weeksCell);
    const year = "2A";

    internships.push({
      confidential,
      date,
      subject,
      weeksCount,
      year,
    });
  });

  return internships;
}

function parseStudents(worksheet: Worksheet, startRow: number): Student[] {
  const students: Student[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber < startRow) return; // skip header rows

    // Extraction directe des données
    const fullNameCell = row.getCell(3).text.trim();
    const { lastName, firstName } = splitLastNameFirstName(fullNameCell);

    students.push({
      firstName,
      lastName,
    });
  });

  return students;
}

function parseOrganizations(worksheet: Worksheet, startRow: number): Organization[] {
  const organizations: Organization[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber < startRow) return; // skip header rows

    // Extraction directe des données
    const orgName = row.getCell(5).text.trim() || "??";
    const tutorFullNameCell = row.getCell(10).text.trim();
    const { lastName: tutorLastName, firstName: tutorFirstName } =
      splitLastNameFirstName(tutorFullNameCell);

    // Utiliser parseOrganizationType pour convertir "E" en "Entreprise"
    const orgTypeRaw = row.getCell(6).text.trim();
    const orgType = parseOrganizationType(orgTypeRaw);

    organizations.push({
      orgName,
      orgType,
      tutorFirstName,
      tutorLastName,
    });
  });

  return organizations;
}
