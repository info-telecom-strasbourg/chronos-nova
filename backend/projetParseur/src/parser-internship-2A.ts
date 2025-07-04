import type { Worksheet } from "exceljs";
import type { Internship, Organization, Student } from "./type-definition";
import { normalizeOrganizationType } from "./data-normalizer.js";
import { extractNumberOfWeeks, splitLastNameFirstName } from "./functions.js";

// ===================================
// Parsing functions
// ===================================
const startingRow = 12; // Row to start parsing from

export async function parseExcelInternship2A(
  filePath: string,
  sheetName: string,
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
  const internships: Internship[] = parseInternships(worksheet);
  const students: Student[] = parseStudents(worksheet);
  const organizations: Organization[] = parseOrganizations(worksheet);

  return { internships, organizations, students };
}

function parseInternships(worksheet: Worksheet): Internship[] {
  const internships: Internship[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber < startingRow) return; // skip header rows

    // Extraction directe des données
    const subject = row.getCell(11).text.trim() || "??";
    const confidential = row.getCell(12).text.trim() || "??";
    const date = row.getCell(14).text.trim() || "??";

    const weeksCell = row.getCell(15).text.trim();
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

function parseStudents(worksheet: Worksheet): Student[] {
  const students: Student[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber < startingRow) return; // skip header rows

    // Extraction directe des données
    const fullNameCell = row.getCell(2).text.trim();
    const { lastName, firstName } = splitLastNameFirstName(fullNameCell);
    const major = row.getCell(3).text.trim() || "??";

    students.push({
      firstName,
      lastName,
      major,
    });
  });

  return students;
}

function parseOrganizations(worksheet: Worksheet): Organization[] {
  const organizations: Organization[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber < startingRow) return; // skip header rows

    // Extraction directe des données
    const orgName = row.getCell(4).text.trim() || "??";
    const tutorFullNameCell = row.getCell(13).text.trim();
    const { lastName: tutorLastName, firstName: tutorFirstName } =
      splitLastNameFirstName(tutorFullNameCell);

    // Utiliser normalizeOrganizationType pour convertir "E" en "Entreprise"
    const orgTypeRaw = row.getCell(5).text.trim();
    const orgType = normalizeOrganizationType(orgTypeRaw);

    const country = row.getCell(6).text.trim() || "??";

    organizations.push({
      country,
      orgName,
      orgType,
      tutorFirstName,
      tutorLastName,
    });
  });

  return organizations;
}
