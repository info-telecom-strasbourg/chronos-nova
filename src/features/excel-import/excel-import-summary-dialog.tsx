"use client";

import type { ExcelImportSummary } from "@/types/excel-import";
import { CheckCircle, FileSpreadsheet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { pluralize } from "@/lib/scripts/string";

interface ExcelImportSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: ExcelImportSummary | null;
}

export function ExcelImportSummaryDialog({
  open,
  onOpenChange,
  summary,
}: ExcelImportSummaryDialogProps) {
  if (!summary) return null;

  const hasIssues = summary.totalBadlyImported > 0 || summary.totalDuplicates > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCircle className="size-5 text-green-600" />
            Résumé de l'import
          </AlertDialogTitle>
          <AlertDialogDescription>
            Voici un récapitulatif de l'import Excel qui vient d'être effectué.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <FileSpreadsheet className="size-4 text-muted-foreground" />
              <span className="font-medium text-sm">Import terminé</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lignes lues :</span>
                <span className="font-medium">{summary.totalRowsRead}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stages importés :</span>
                <span className="font-medium text-green-600">{summary.totalImported}</span>
              </div>
            </div>

            {hasIssues && (
              <div className="mt-4 pt-3 border-t">
                <div className="mb-2 font-medium text-sm">Dont :</div>
                <div className="space-y-1 text-sm">
                  {summary.totalBadlyImported > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stages incomplets :</span>
                      <span className="font-medium text-amber-600">
                        {summary.totalBadlyImported}
                      </span>
                    </div>
                  )}
                  {summary.totalDuplicates > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stages en doublon :</span>
                      <span className="font-medium text-orange-600">
                        {summary.totalDuplicates}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="text-muted-foreground text-xs text-center">
            {summary.totalImported > 0 ? (
              <>
                {pluralize(summary.totalImported, "stage a été importé", "stages ont été importés")} 
                {" "}en brouillon et {summary.totalImported > 1 ? "sont" : "est"} en attente de validation.
              </>
            ) : (
              "Aucun stage n'a été importé."
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <Button variant="destructive" onClick={() => onOpenChange(false)} className="w-full">
            <X className="mr-2 size-4" />
            Fermer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
