import type { Internship, Organization, Student } from "./typeDefinition";
import ExcelJS from "exceljs";
import { extractNumberOfWeeks, normalizeField, splitLastNameFirstName } from "./functions";

// ===================================
// Parsing functions
// ===================================
const startingRow = 8; // Row to start parsing from

export async function parseExcelSubstitutionInternship(
  filePath: string,
  sheetName: string,
): Promise<{
  internships: Internship[];
  students: Student[];
  organizations: Organization[];
}> {
  const workbook = new ExcelJS.Workbook();
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

function parseInternships(worksheet: ExcelJS.Worksheet): Internship[] {
  const internships: Internship[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber < startingRow) return; // skip header rows

    // Extraction and normalization
    const subject = normalizeField(row.getCell(8).text, rowNumber);
    const confidential = normalizeField(row.getCell(9).text, rowNumber);
    const date = normalizeField(row.getCell(11).text, rowNumber);

    const weeksCell = row.getCell(12).text.trim();
    const weeksCount = extractNumberOfWeeks(weeksCell);
    const year = normalizeField("2A", rowNumber);

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

function parseStudents(worksheet: ExcelJS.Worksheet): Student[] {
  const students: Student[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber < startingRow) return; // skip header rows

    // Extraction and normalization
    const fullNameCell = row.getCell(3).text.trim();
    const { lastName, firstName } = splitLastNameFirstName(normalizeField(fullNameCell, rowNumber));

    students.push({
      firstName,
      lastName,
    });
  });

  return students;
}

function parseOrganizations(worksheet: ExcelJS.Worksheet): Organization[] {
  const organizations: Organization[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber < startingRow) return; // skip header rows

    // Extraction and normalization
    const orgName = normalizeField(row.getCell(5).text, rowNumber);
    const tutorFullNameCell = row.getCell(10).text.trim();
    const { lastName: tutorLastName, firstName: tutorFirstName } = splitLastNameFirstName(
      normalizeField(tutorFullNameCell, rowNumber),
    );
    const orgType = normalizeField(row.getCell(6).text, rowNumber);

    organizations.push({
      orgName,
      orgType,
      tutorFirstName,
      tutorLastName,
    });
  });

  return organizations;
}
