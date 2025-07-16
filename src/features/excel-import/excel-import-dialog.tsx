"use client";

import type { SheetConfig } from "@/types/excel-import";
import * as ExcelJS from "exceljs";
import { FileSpreadsheetIcon, UploadIcon } from "lucide-react";
import { type ChangeEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { academicYears } from "@/features/form/options";
import { pluralize } from "@/lib/scripts/string";

interface SheetItem extends SheetConfig {
  startRow?: number;
  selected: boolean;
}

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport?: (file: File, sheetsConfig: SheetConfig[]) => void;
}

export function ExcelImportDialog({ open, onOpenChange, onImport }: ExcelImportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [academicYearErrors, setAcademicYearErrors] = useState<number[]>([]);
  const [startRowErrors, setStartRowErrors] = useState<number[]>([]);

  const resetDialog = useCallback(() => {
    setSelectedFile(null);
    setSheets([]);
    setIsLoading(false);
    setAcademicYearErrors([]);
    setStartRowErrors([]);
  }, []);

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setSheets([]);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("Veuillez sélectionner un fichier Excel (.xlsx)");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);

    try {
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      const worksheetNames = workbook.worksheets.map((worksheet) => worksheet.name);

      const allSheets: SheetItem[] = worksheetNames.map((name) => ({
        name,
        startRow: undefined,
        selected: false,
        academicYear: undefined,
      }));

      setSheets(allSheets);
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier Excel:", error);
      toast.error(
        "Erreur lors de la lecture du fichier Excel. Veuillez vérifier que le fichier est valide.",
      );
      setSelectedFile(null);
      setSheets([]);
      event.target.value = "";
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSheetToggle = useCallback((sheetIndex: number) => {
    setSheets((prev) =>
      prev.map((sheet, index) =>
        index === sheetIndex ? { ...sheet, selected: !sheet.selected } : sheet,
      ),
    );
  }, []);

  const handleStartRowChange = useCallback(
    (sheetIndex: number, value: string) => {
      if (value === "") {
        setSheets((prev) =>
          prev.map((sheet, index) =>
            index === sheetIndex ? { ...sheet, startRow: undefined } : sheet,
          ),
        );
        if (startRowErrors.includes(sheetIndex)) {
          setStartRowErrors((prev) => prev.filter((i) => i !== sheetIndex));
        }
        return;
      }
      const numValue = Number.parseInt(value, 10);
      if (Number.isNaN(numValue) || numValue < 1) return;
      setSheets((prev) =>
        prev.map((sheet, index) =>
          index === sheetIndex ? { ...sheet, startRow: numValue } : sheet,
        ),
      );
      if (startRowErrors.includes(sheetIndex)) {
        setStartRowErrors((prev) => prev.filter((i) => i !== sheetIndex));
      }
    },
    [startRowErrors],
  );

  const handleAcademicYearChange = useCallback(
    (sheetIndex: number, value: string) => {
      setSheets((prev) =>
        prev.map((sheet, index) =>
          index === sheetIndex ? { ...sheet, academicYear: value } : sheet,
        ),
      );
      if (academicYearErrors.includes(sheetIndex)) {
        setAcademicYearErrors((prev) => prev.filter((i) => i !== sheetIndex));
      }
    },
    [academicYearErrors],
  );

  const handleCancel = useCallback(() => {
    resetDialog();
    onOpenChange(false);
  }, [resetDialog, onOpenChange]);

  const handleValidate = useCallback(() => {
    if (selectedFile && sheets.length > 0) {
      const selectedSheets = sheets
        .filter((sheet) => sheet.selected)
        .map(({ selected, ...sheetConfig }) => sheetConfig);

      // Vérifier que toutes les feuilles sélectionnées sont supportées
      const unsupportedSheets = selectedSheets.filter(
        (sheet) => sheet.name !== "2A - Récap. stage",
      );

      if (unsupportedSheets.length > 0) {
        toast.error(
          `Les feuilles suivantes ne peuvent pas être parsées : ${unsupportedSheets
            .map((s) => s.name)
            .join(", ")}`,
        );
        return;
      }

      // Vérifier que toutes les feuilles "2A - Récap. stage" ont une année académique sélectionnée
      const sheetsWithoutYear = selectedSheets.filter(
        (sheet) => sheet.name === "2A - Récap. stage" && !sheet.academicYear,
      );

      // Vérifier que toutes les feuilles "2A - Récap. stage" ont une première ligne à analyser
      const sheetsWithoutStartRow = selectedSheets.filter(
        (sheet) =>
          sheet.name === "2A - Récap. stage" && (typeof sheet.startRow !== "number" || sheet.startRow < 1),
      );

      // Si des champs sont manquants, mettre à jour les erreurs visuelles
      if (sheetsWithoutYear.length > 0 || sheetsWithoutStartRow.length > 0) {
        // Identifier les indices des feuilles avec erreurs
        const academicYearErrorIndices: number[] = [];
        const startRowErrorIndices: number[] = [];

        sheets.forEach((sheet, index) => {
          if (sheet.selected && sheet.name === "2A - Récap. stage") {
            if (!sheet.academicYear) {
              academicYearErrorIndices.push(index);
            }
            if (typeof sheet.startRow !== "number" || sheet.startRow < 1) {
              startRowErrorIndices.push(index);
            }
          }
        });

        setAcademicYearErrors(academicYearErrorIndices);
        setStartRowErrors(startRowErrorIndices);

        // Afficher un seul toast d'erreur générique
        toast.error("Veuillez remplir les champs manquants dans les feuilles sélectionnées.");
        return;
      }

      setAcademicYearErrors([]);
      setStartRowErrors([]);
      // On s'assure que startRow est bien un number avant d'appeler onImport
      const cleanedSheets = selectedSheets.map((sheet) => ({
        ...sheet,
        startRow: typeof sheet.startRow === "number" ? sheet.startRow : 1,
      }));
      onImport?.(selectedFile, cleanedSheets);
      resetDialog();
      onOpenChange(false);
    }
  }, [selectedFile, sheets, onImport, resetDialog, onOpenChange]);

  const selectedSheetsCount = sheets.filter((sheet) => sheet.selected).length;
  const isValidateDisabled = !selectedFile || selectedSheetsCount === 0 || isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheetIcon className="size-5" />
            Importer depuis Excel
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un fichier Excel puis configurez l'import des données.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="excel-file">Fichier Excel (.xlsx)</Label>
            <div className="relative">
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                disabled={isLoading}
                className="hover:file:bg-primary/90 file:bg-primary file:mr-3 file:border-0 file:rounded-sm file:text-primary-foreground file:text-xs"
              />
              {isLoading && (
                <div className="top-1/2 right-3 absolute -translate-y-1/2">
                  <div className="border-2 border-muted-foreground border-t-transparent rounded-full size-4 animate-spin" />
                </div>
              )}
            </div>
          </div>

          {sheets.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Feuilles disponibles</h4>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {sheets.map((sheet, sheetIndex) => (
                  <div key={sheet.name} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`sheet-${sheetIndex}`}
                        checked={sheet.selected}
                        onCheckedChange={() => handleSheetToggle(sheetIndex)}
                        className="size-4"
                      />
                      <label
                        htmlFor={`sheet-${sheetIndex}`}
                        className="flex items-center gap-2 font-medium text-sm cursor-pointer"
                      >
                        <FileSpreadsheetIcon className="size-4 text-muted-foreground" />
                        {sheet.name}
                      </label>
                    </div>

                    {sheet.selected && (
                      <div className="space-y-3 ml-7">
                        {sheet.name === "2A - Récap. stage" && (
                          <>
                            <div>
                              <Label
                                htmlFor={`start-row-${sheetIndex}`}
                                className={`text-xs ${startRowErrors.includes(sheetIndex) ? "text-destructive" : ""}`}
                              >
                                Première ligne à analyser
                              </Label>
                              <Input
                                id={`start-row-${sheetIndex}`}
                                type="number"
                                min="1"
                                value={typeof sheet.startRow === "number" ? sheet.startRow : ""}
                                onChange={(e) => handleStartRowChange(sheetIndex, e.target.value)}
                                className={`h-8 ${startRowErrors.includes(sheetIndex) ? "border-destructive ring-2 ring-destructive/40" : ""}`}
                                placeholder="4"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor={`academic-year-${sheetIndex}`}
                                className={`text-xs ${academicYearErrors.includes(sheetIndex) ? "text-destructive" : ""}`}
                              >
                                Année académique
                              </Label>
                              <Select
                                value={sheet.academicYear || ""}
                                onValueChange={(value) =>
                                  handleAcademicYearChange(sheetIndex, value)
                                }
                              >
                                <SelectTrigger
                                  className={`h-8 ${academicYearErrors.includes(sheetIndex) ? "border-destructive ring-2 ring-destructive/40" : ""}`}
                                >
                                  <SelectValue placeholder="Sélectionnez une année" />
                                </SelectTrigger>
                                <SelectContent>
                                  {academicYears.map((year) => (
                                    <SelectItem key={year.value} value={year.value}>
                                      {year.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                        {sheet.name !== "2A - Récap. stage" && (
                          <p className="text-destructive text-xs">
                            Cette feuille ne peut pas être parsée. Seule la feuille "2A - Récap.
                            stage" est supportée.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedSheetsCount > 0 && (
                <p className="text-muted-foreground text-xs">
                  {pluralize(selectedSheetsCount, "feuille sélectionnée", "feuilles sélectionnées")}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button onClick={handleValidate} disabled={isValidateDisabled} className="gap-2">
            <UploadIcon className="size-4" />
            Valider
          </Button>
          <Button variant="destructive" onClick={handleCancel}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
