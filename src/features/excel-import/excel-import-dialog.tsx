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
import { pluralize } from "@/lib/scripts/string";

interface SheetItem extends SheetConfig {
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

  const resetDialog = useCallback(() => {
    setSelectedFile(null);
    setSheets([]);
    setIsLoading(false);
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
        startRow: 1,
        selected: false,
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

  const handleStartRowChange = useCallback((sheetIndex: number, value: string) => {
    const numValue = Number.parseInt(value, 10);
    if (Number.isNaN(numValue) || numValue < 1) return;

    setSheets((prev) =>
      prev.map((sheet, index) => (index === sheetIndex ? { ...sheet, startRow: numValue } : sheet)),
    );
  }, []);

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

      onImport?.(selectedFile, selectedSheets);
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
                className="file:mr-3 file:rounded-sm file:border-0 file:bg-primary file:text-primary-foreground file:text-xs hover:file:bg-primary/90"
              />
              {isLoading && (
                <div className="-translate-y-1/2 absolute top-1/2 right-3">
                  <div className="size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                </div>
              )}
            </div>
          </div>

          {sheets.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Feuilles disponibles</h4>

              <div className="max-h-60 space-y-3 overflow-y-auto">
                {sheets.map((sheet, sheetIndex) => (
                  <div key={sheet.name} className="space-y-2 rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`sheet-${sheetIndex}`}
                        checked={sheet.selected}
                        onCheckedChange={() => handleSheetToggle(sheetIndex)}
                        className="size-4"
                      />
                      <label
                        htmlFor={`sheet-${sheetIndex}`}
                        className="flex cursor-pointer items-center gap-2 font-medium text-sm"
                      >
                        <FileSpreadsheetIcon className="size-4 text-muted-foreground" />
                        {sheet.name}
                      </label>
                    </div>

                    {sheet.selected && (
                      <div className="ml-7 space-y-1">
                        {sheet.name === "2A - Récap. stage" && (
                          <>
                            <Label htmlFor={`start-row-${sheetIndex}`} className="text-xs">
                              Première ligne à analyser
                            </Label>
                            <Input
                              id={`start-row-${sheetIndex}`}
                              type="number"
                              min="1"
                              value={sheet.startRow}
                              onChange={(e) => handleStartRowChange(sheetIndex, e.target.value)}
                              className="h-8"
                              placeholder="1"
                            />
                          </>
                        )}
                        {sheet.name !== "2A - Récap. stage" && (
                          <p className="text-destructive text-xs">
                            Cette feuille ne peut pas être parsée. Seule la feuille "2A -
                            Récap. stage" est supportée.
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

        <DialogFooter className="gap-2 sm:justify-center">
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
