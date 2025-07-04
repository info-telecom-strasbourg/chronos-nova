import type { Internship, Organization, Student } from "./type-definition.js";
import { validateAndFormatExcelData } from "./excel-validator.js";
import { parseExcelInternship2A } from "./parser-internship-2A.js";
import { parseExcelSubstitutionInternship } from "./parser-substitution-internship.js";

/**
 * Parse les données de toutes les feuilles spécifiées avec validation Zod
 */
export async function parseAllSheetsWithValidation(
  filePath: string,
  sheetNames: string[],
): Promise<{
  allInternships: Internship[];
  allStudents: Student[];
  allOrganizations: Organization[];
  validationSummary: {
    totalRows: number;
    validRows: number;
    errors: number;
  };
}> {
  const allInternships: Internship[] = [];
  const allStudents: Student[] = [];
  const allOrganizations: Organization[] = [];
  let totalRows = 0;
  let validRows = 0;

  for (let i = 0; i < sheetNames.length; i++) {
    const sheetName = sheetNames[i];
    console.log(`📊 Parsing sheet: "${sheetName}"`);

    let internships: Internship[], students: Student[], organizations: Organization[];

    // Parser avec les fonctions existantes
    switch (sheetName) {
      case "2A - Récap. stage":
        ({ internships, students, organizations } = await parseExcelInternship2A(
          filePath,
          sheetName,
        ));
        break;
      case "Stage substitution":
        ({ internships, students, organizations } = await parseExcelSubstitutionInternship(
          filePath,
          sheetName,
        ));
        break;
      default:
        throw new Error(`Unknown sheet name: "${sheetName}"`);
    }

    console.log(`✅ Parsed ${internships.length} rows from "${sheetName}"`);

    // Préparer les données pour la validation Zod
    const rawDataForValidation = internships.map((internship, index) => ({
      // Données étudiant
      studentFullName: `${students[index]?.lastName || "??"} ${students[index]?.firstName || "??"}`,
      studentMajor: students[index]?.major || "??",

      // Données organisation
      orgName: organizations[index]?.orgName || "??",
      tutorFullName: `${organizations[index]?.tutorLastName || "??"} ${organizations[index]?.tutorFirstName || "??"}`,
      orgType: organizations[index]?.orgType || "L",
      country: organizations[index]?.country || "??",

      // Données stage
      subject: internship.subject,
      confidential: internship.confidential,
      date: internship.date,
      weeksCount: internship.weeksCount,
      year: internship.year,
    }));

    // Valider et formater avec Zod
    console.log(`🔍 Validating and formatting ${rawDataForValidation.length} rows...`);
    const validatedData = validateAndFormatExcelData(rawDataForValidation);

    totalRows += rawDataForValidation.length;
    validRows += validatedData.length;

    // Convertir les données validées vers le format de sortie
    const validatedInternships: Internship[] = validatedData.map((row) => row.internship);
    const validatedStudents: Student[] = validatedData.map((row) => row.student);
    const validatedOrganizations: Organization[] = validatedData.map((row) => row.organization);

    console.log(`✅ Validated ${validatedData.length}/${rawDataForValidation.length} rows`);
    console.log(`- ${validatedInternships.length} internships`);
    console.log(`- ${validatedStudents.length} students`);
    console.log(`- ${validatedOrganizations.length} organizations\n`);

    // Ajouter aux collections globales (données validées)
    allInternships.push(...validatedInternships);
    allStudents.push(...validatedStudents);
    allOrganizations.push(...validatedOrganizations);
  }

  const validationSummary = {
    totalRows,
    validRows,
    errors: totalRows - validRows,
  };

  console.log(`🎯 Validation Summary:`);
  console.log(`- Total rows processed: ${totalRows}`);
  console.log(`- Valid rows: ${validRows}`);
  console.log(`- Errors: ${validationSummary.errors}`);

  return {
    allInternships,
    allStudents,
    allOrganizations,
    validationSummary,
  };
}

/**
 * Parse les données de toutes les feuilles spécifiées (version originale sans validation)
 */
export async function parseAllSheets(
  filePath: string,
  sheetNames: string[],
): Promise<{
  allInternships: Internship[];
  allStudents: Student[];
  allOrganizations: Organization[];
}> {
  const allInternships: Internship[] = [];
  const allStudents: Student[] = [];
  const allOrganizations: Organization[] = [];

  for (let i = 0; i < sheetNames.length; i++) {
    const sheetName = sheetNames[i];
    let internships: Internship[], students: Student[], organizations: Organization[];

    switch (sheetName) {
      case "2A - Récap. stage":
        ({ internships, students, organizations } = await parseExcelInternship2A(
          filePath,
          sheetName,
        ));
        break;
      case "Stage substitution":
        ({ internships, students, organizations } = await parseExcelSubstitutionInternship(
          filePath,
          sheetName,
        ));
        break;
      default:
        throw new Error(`Unknown sheet name: "${sheetName}"`);
    }

    console.log(`Parsed data from sheet: "${sheetName}"`);
    console.log(`- ${internships.length} internships`);
    console.log(`- ${students.length} students`);
    console.log(`- ${organizations.length} organizations\n`);

    // Ajouter aux collections globales
    allInternships.push(...internships);
    allStudents.push(...students);
    allOrganizations.push(...organizations);
  }

  return {
    allInternships,
    allStudents,
    allOrganizations,
  };
}
