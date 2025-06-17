import { Command } from "commander";
import { parseExcelInternship2A } from "./parserInternship2A";
import { parseExcelSubstitutionInternship } from "./parserSubstitutionInternship";
import path from "path";

const program = new Command();

program
  .option("-s, --sheet <name>", "Excel sheet name", "2A - Récap. stage")
  .parse();

const options = program.opts();

async function main() {
  const fileName = "2024-25-Récapitulatif des stages 2A.xlsx";
  const filePath = path.join(process.cwd(), fileName);

  // Utilise le nom de feuille passé en argument ou la valeur par défaut
  const sheetName = options.sheet;
  let internships, students, organizations;
  switch (sheetName) {
    case "2A - Récap. stage":
      ({ internships, students, organizations } = await parseExcelInternship2A(
        filePath,
        sheetName
      ));
      break;
    case "Stage substitution":
      ({ internships, students, organizations } =
        await parseExcelSubstitutionInternship(filePath, sheetName));
      break;
    default:
      throw new Error(`Unknown sheet name: ${sheetName}`);
  }
  console.log(`Parsed data from sheet: ${sheetName}`);
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
