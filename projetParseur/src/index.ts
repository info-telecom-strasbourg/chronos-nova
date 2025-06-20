import { Command } from "commander";
import fs from "fs";
import path from "path";
import { parseExcelInternship2A } from "./parserInternship2A";
import { parseExcelSubstitutionInternship } from "./parserSubstitutionInternship";

const program = new Command();

program
  .argument("<file>", "Excel source file")
  .option("-s, --sheet <names...>", "Sheet names", [
    "2A - Récap. stage",
    "Stage substitution",
  ])
  .parse();

const options = program.opts();

async function main() {
  const fileName = program.args[0];
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
