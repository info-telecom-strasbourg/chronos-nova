"use client";

import { Button } from "@chronos/ui/components/button";
import { Input } from "@chronos/ui/components/input";
import { FileSpreadsheet, Plus, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { importExcelAction } from "@/actions/internship.action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACADEMIC_YEARS } from "@/lib/constants";

interface SheetEntry {
  name: string;
  academicYear: string;
  startRow: number;
}

export function ExcelImportDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetEntry[]>([
    { name: "", academicYear: "2A", startRow: 2 },
  ]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function addSheet() {
    setSheets((s) => [...s, { name: "", academicYear: "2A", startRow: 2 }]);
  }

  function removeSheet(i: number) {
    setSheets((s) => s.filter((_, idx) => idx !== i));
  }

  function updateSheet(i: number, patch: Partial<SheetEntry>) {
    setSheets((s) =>
      s.map((entry, idx) => (idx === i ? { ...entry, ...patch } : entry)),
    );
  }

  async function handleImport() {
    if (!file) {
      toast.error("Sélectionner un fichier Excel");
      return;
    }
    const validSheets = sheets.filter((s) => s.name.trim());
    if (validSheets.length === 0) {
      toast.error("Renseigner au moins un nom de feuille");
      return;
    }
    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const result = await importExcelAction(buffer, validSheets);
      toast.success(
        `${result.imported} stage(s) importé(s)${result.withIssues > 0 ? ` — ${result.withIssues} avec des problèmes` : ""}`,
      );
      setOpen(false);
      setFile(null);
      setSheets([{ name: "", academicYear: "2A", startRow: 2 }]);
    } catch {
      toast.error("Erreur lors de l'import");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileSpreadsheet className="size-4" />
          Import Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Importer depuis Excel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Fichier Excel (.xlsx)</Label>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/30 p-4 transition-colors hover:border-muted-foreground/60"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-5 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">
                {file ? file.name : "Cliquer pour sélectionner…"}
              </span>
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Feuilles à importer</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addSheet}
              >
                <Plus className="size-3.5" />
                Ajouter
              </Button>
            </div>

            {sheets.map((sheet, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_auto_auto_auto] items-end gap-2"
              >
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">
                    Nom de la feuille
                  </Label>
                  <Input
                    value={sheet.name}
                    onChange={(e) => updateSheet(i, { name: e.target.value })}
                    placeholder="ex: 2A stages"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Année</Label>
                  <Select
                    value={sheet.academicYear}
                    onValueChange={(v) => updateSheet(i, { academicYear: v })}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACADEMIC_YEARS.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">
                    1ère ligne
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={sheet.startRow}
                    onChange={(e) =>
                      updateSheet(i, {
                        startRow: parseInt(e.target.value, 10) || 2,
                      })
                    }
                    className="w-16"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeSheet(i)}
                  disabled={sheets.length === 1}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleImport} disabled={loading}>
              {loading ? "Import en cours…" : "Importer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
