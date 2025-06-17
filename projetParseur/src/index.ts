import { parseExcelInternship2A } from "./parserInternship2A";
import { parseExcelSubstitutionInternship } from "./parserSubstitutionInternship";
import path from "path";

async function main() {
  const fileName = "2024-25-Récapitulatif des stages 2A.xlsx";
  const filePath = path.join(process.cwd(), fileName);

  // Stage de 2A
  const sheetName = "2A - Récap. stage";
  const { internships, students, organizations } = await parseExcelInternship2A(
    filePath,
    sheetName
  );

  // Stage de substitution
  /*
  const sheetName = "Stage substitution";
  const { internships, students, organizations } = await parseExcelSubstitutionInternship(
    filePath,
    sheetName
  );
  */

  console.log("Internships:", internships);
  console.log("Students:", students);
  console.log("Organizations:", organizations);
}

try {
  main();
} catch (err) {
  console.error("Error during execution:", err);
  process.exit(1);
}
