import { Command } from "commander";
import { parseExcelInternship2A } from "./parserInternship2A";
import { parseExcelSubstitutionInternship } from "./parserSubstitutionInternship";
import path from "path";
import fs from "fs";

const program = new Command();

program
  .option("-f, --file <file>", "Excel name")
  .option("-s, --sheet <names...>", "Sheet names", [
    "2A - Récap. stage",
    "Stage substitution",
  ])
  .parse();

const options = program.opts();

async function main() {
  const fileName = options.file;
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File "${fileName}" not found: ${filePath}`);
  }
  console.log(`Parsed data from file: "${fileName}"\n`);

  for (let i = 0; i < options.sheet.length; i++) {
    const sheetName = options.sheet[i];
    let internships, students, organizations;
    switch (sheetName) {
      case "2A - Récap. stage":
        ({ internships, students, organizations } =
          await parseExcelInternship2A(filePath, sheetName));
        break;
      case "Stage substitution":
        ({ internships, students, organizations } =
          await parseExcelSubstitutionInternship(filePath, sheetName));
        break;
      default:
        throw new Error(`Unknown sheet name: "${sheetName}"`);
    }
    console.log(`Parsed data from sheet: "${sheetName}"`);
    console.log("Internships:", internships);
    console.log("Students:", students);
    console.log("Organizations:", organizations);
  }
}

try {
  main();
} catch (err) {
  console.error("Error during execution:", err);
  process.exit(1);
}
