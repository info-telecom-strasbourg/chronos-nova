"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceljs_1 = __importDefault(require("exceljs"));
const path_1 = __importDefault(require("path"));
function parseExcel(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        // 2. Charger le classeur
        const workbook = new exceljs_1.default.Workbook();
        yield workbook.xlsx.readFile(filePath);
        // 3. Sélectionner la feuille
        const worksheet = workbook.getWorksheet('Contacts');
        if (!worksheet) {
            throw new Error("La feuille 'Contacts' est introuvable.");
        }
        const contacts = [];
        // 4. Itérer sur chaque ligne (à partir de la 2ᵉ pour sauter l'en-tête)
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1)
                return; // on saute la ligne d'en-tête
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
    });
}
// 6. Point d'entrée du script
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.resolve(__dirname, '../sample.xlsx');
        const data = yield parseExcel(filePath);
        console.log('Données extraites :', data);
    }
    catch (err) {
        console.error('Erreur lors du parsing :', err);
        process.exit(1);
    }
}))();
