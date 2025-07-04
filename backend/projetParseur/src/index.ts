import * as fs from "node:fs";
import * as path from "node:path";
import { Command } from "commander";
import { parseAllSheets, parseAllSheetsWithValidation } from "./parser.js";
import { insertDataToSupabase } from "./inserter-supabase.js";

const program = new Command();

program
  .argument("<file>", "Excel source file")
  .option("-s, --sheet <names...>", "Sheet names", ["2A - Récap. stage", "Stage substitution"])
  .option("--no-validation", "Disable Zod validation and formatting")
  .parse();

const options = program.opts();

async function main() {
  const fileName = program.args[0];
  const filePath = path.join(process.cwd(), fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File "${fileName}" not found: ${filePath}`);
  }

  console.log(`📄 Processing file: "${fileName}"\n`);

  // Choisir le parser selon l'option de validation
  if (options.validation === false) {
    console.log("🚀 Using legacy parser (no validation)");
    const { allInternships, allStudents, allOrganizations } = await parseAllSheets(
      filePath,
      options.sheet,
    );

    await insertDataToSupabase(allInternships, allStudents, allOrganizations);
  } else {
    console.log("🛡️  Using enhanced parser with Zod validation");
    const { allInternships, allStudents, allOrganizations, validationSummary } =
      await parseAllSheetsWithValidation(filePath, options.sheet);

    // Afficher le résumé de validation
    if (validationSummary.errors > 0) {
      console.log(`⚠️  ${validationSummary.errors} rows had validation errors and were skipped.`);
    }
    console.log(`✅ Successfully processed ${validationSummary.validRows} rows.\n`);

    await insertDataToSupabase(allInternships, allStudents, allOrganizations);
  }
}

try {
  main();
} catch (err) {
  console.error("Error during execution:", err);
  process.exit(1);
}
