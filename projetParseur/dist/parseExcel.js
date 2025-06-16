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
// =======================
// 1. Import des modules
// =======================
const exceljs_1 = __importDefault(require("exceljs"));
const path_1 = __importDefault(require("path"));
// ========================================
// 3. Fonctions utilitaires de traitement
// ========================================
/**
 * Sépare une chaîne de caractère au format NOM Prénom
 * en deux chaines contenant le nom et le prénom
 */
function splitNomPrenom(fullName) {
    const parts = fullName.trim().split(' ');
    const prenom = parts.pop() || '';
    const nom = parts.join(' ');
    return { nom, prenom };
}
/**
 * Normalise un champ texte.
 * - Si vide, "x" ou  "X" => "??"
 * - Si pays est "FR", "fr" ou "Fr" => "France"
 * - Si pays est suspect (moins de 2 caractères et pas "??"), lève une erreur
 * - Si autre valeur vide ou incorrecte, affiche un warn avec le numéro de ligne
 */
function normalizeField(value, rowNumber, options) {
    const val = value.trim();
    // Cas vide ou "x"
    if (val === "" || val.toLowerCase() === "x" || val === "?") {
        return "??";
    }
    // Cas particulier pour le pays
    if (options === null || options === void 0 ? void 0 : options.isPays) {
        if (val.toUpperCase() === "FR")
            return "FRANCE";
        if (val.length < 2 && val !== "??") {
            throw new Error(`Ligne ${rowNumber} : valeur de pays inconnue : "${value}"`);
        }
    }
    // Si la valeur est vide ou incorrecte (hors cas déjà traités)
    if (!val) {
        console.warn(`Ligne ${rowNumber} : données manquantes ou incorrectes ("${value}").`);
        return "??";
    }
    return val;
}
// ===================================
// 4. Fonction principale de parsing
// ===================================
function parseExcel(filePath, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const workbook = new exceljs_1.default.Workbook();
        yield workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(fileName);
        if (!worksheet) {
            throw new Error(`La feuille ${fileName} est introuvable.`);
        }
        // Tableaux de résultats
        const stages = [];
        const etudiants = [];
        const structures = [];
        // Parcours des lignes du fichier Excel
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber <= 11)
                return; // on saute les lignes d'en-tête
            // ===========================
            // Extraction et normalisation
            // ===========================
            const sujet_stage = normalizeField(row.getCell(11).text, rowNumber);
            const confidentiel_stage = normalizeField(row.getCell(12).text, rowNumber);
            const date_stage = normalizeField(row.getCell(14).text, rowNumber);
            const nomPrenomCell = row.getCell(2).text.trim();
            const { nom: nom_etu, prenom: prenom_etu } = splitNomPrenom(normalizeField(nomPrenomCell, rowNumber));
            const filiere_etu = normalizeField(row.getCell(3).text, rowNumber);
            const annee_etu = normalizeField("2A", rowNumber);
            const nom_struct = normalizeField(row.getCell(4).text, rowNumber);
            const tuteurNomPrenomCell = row.getCell(13).text.trim();
            const { nom: tuteur_nom_struct, prenom: tuteur_prenom_struct } = splitNomPrenom(normalizeField(tuteurNomPrenomCell, rowNumber));
            const type_struct = normalizeField(row.getCell(5).text, rowNumber);
            const pays_struct = normalizeField(row.getCell(6).text, rowNumber, { isPays: true });
            // Extraction du nombre de semaines (ex: "12 semaines")
            const nbSemainesCell = row.getCell(15).text.trim();
            const nbSemainesMatch = nbSemainesCell.match(/\d+/);
            const nbSemaines_stage = nbSemainesMatch ? Number(nbSemainesMatch[0]) : -1;
            // ===========================
            // Ajout aux tableaux résultats
            // ===========================
            etudiants.push({ nom_etu, prenom_etu, filiere_etu, annee_etu });
            stages.push({ sujet_stage, confidentiel_stage, date_stage, nbSemaines_stage });
            structures.push({ nom_struct, tuteur_nom_struct, tuteur_prenom_struct, type_struct, pays_struct });
        });
        return { stages, etudiants, structures };
    });
}
// ==========================
// 5. Point d'entrée du script
// ==========================
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.resolve(__dirname, '../2024-25-Récapitulatif des stages 2A.xlsx');
        const fileName = '2A - Récap. stage';
        const { stages, etudiants, structures } = yield parseExcel(filePath, fileName);
        console.log('Stages :', stages);
        console.log('Etudiants :', etudiants);
        console.log('Structures :', structures);
    }
    catch (err) {
        console.error('Erreur lors du parsing :', err);
        process.exit(1);
    }
}))();
