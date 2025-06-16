import ExcelJS from 'exceljs';
import path from 'path';

// 1. Définir une interface pour typer nos données
interface Contact {
  nom: string;
  age: number;
  email: string;
}

async function parseExcel(filePath: string): Promise<Contact[]> {
  // 2. Charger le classeur
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  // 3. Sélectionner la feuille
  const worksheet = workbook.getWorksheet('Contacts');
  if (!worksheet) {
    throw new Error("La feuille 'Contacts' est introuvable.");
  }

  const contacts: Contact[] = [];

  // 4. Itérer sur chaque ligne (à partir de la 2ᵉ pour sauter l'en-tête)
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // on saute la ligne d'en-tête

    const nomCell = row.getCell(1).text.trim();
    const ageCell = Number(row.getCell(2).value);
    const emailCell = row.getCell(3).text.trim();

    // 5. Validation minimale
    if (!nomCell || isNaN(ageCell) || !emailCell) {
      console.warn(`Ligne ${rowNumber} ignorée : données manquantes ou invalides.`);
      return;
    }

    contacts.push({
      nom: nomCell,
      age: ageCell,
      email: emailCell,
    });
  });

  return contacts;
}

// 6. Point d'entrée du script
(async () => {
  try {
    const filePath = path.resolve(__dirname, '../sample.xlsx');
    const data = await parseExcel(filePath);
    console.log('Données extraites :', data);
  } catch (err) {
    console.error('Erreur lors du parsing :', err);
    process.exit(1);
  }
})();
