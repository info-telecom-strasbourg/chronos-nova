"use client";

import type { SheetConfig } from "@/types/excel-import";
import type { ExcelImportSummary } from "@/types/excel-import";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ExcelImportDialog } from "@/features/excel-import/excel-import-dialog";
import { ExcelImportSummaryDialog } from "@/features/excel-import/excel-import-summary-dialog";
import { importExcelData } from "@/features/excel-import/excel-import.action";
import {
  type CreateInternshipFormData,
  createInternshipSchema,
} from "@/features/form/internship.schema";
import { InternshipDetailsSection } from "@/features/form/internship-details-section";
import { OrganizationSection } from "@/features/form/organization-section";
import { StudentSection } from "@/features/form/student-section";
import { createInternship } from "@/features/infinite-scroll/internship.query";

interface InternshipCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InternshipCreateDialog({ open, onOpenChange }: InternshipCreateDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [importSummary, setImportSummary] = useState<ExcelImportSummary | null>(null);

  const form = useForm<CreateInternshipFormData>({
    resolver: zodResolver(createInternshipSchema),
    defaultValues: {
      organizationName: "",
      organizationType: undefined,
      organizationCountry: undefined,
      organizationCity: "",
      subject: "",
      academicYear: undefined,
      beginDate: "",
      weeksCount: undefined,
      studentMajor: undefined,
      studentOption: undefined,
    },
  });

  const { control, setValue, watch, reset } = form;

  const academicYear = watch("academicYear");
  const studentMajor = watch("studentMajor");

  const prevAcademicYear = useRef(academicYear);
  const prevStudentMajor = useRef(studentMajor);

  useEffect(() => {
    if (prevAcademicYear.current !== academicYear && prevAcademicYear.current !== undefined) {
      setValue("studentMajor", "");
      setValue("studentOption", "");
    }
    prevAcademicYear.current = academicYear;
  }, [academicYear, setValue]);

  useEffect(() => {
    if (prevStudentMajor.current !== studentMajor && prevStudentMajor.current !== undefined) {
      setValue("studentOption", "");
    }
    prevStudentMajor.current = studentMajor;
  }, [studentMajor, setValue]);

  const handleExcelImport = async (file: File, sheetsConfig: SheetConfig[]) => {
    try {
      const arrayBuffer = await file.arrayBuffer();

      const result = await importExcelData(arrayBuffer, sheetsConfig);

      if (result.success) {
        setIsExcelDialogOpen(false);
        onOpenChange(false);

        // Préparer le résumé d'import
        const summary: ExcelImportSummary = {
          totalRowsRead: result.rowsReadCount || 0,
          totalImported: result.importedCount || 0,
          totalBadlyImported: result.badlyImportedCount || 0,
          totalDuplicates: result.duplicateCount || 0,
        };
        setImportSummary(summary);

        // Invalider les requêtes et ouvrir le dialog de résumé
        await queryClient.invalidateQueries({ queryKey: ["internships"] });
        setIsSummaryDialogOpen(true);

        // Rediriger vers la page pending
        router.push("/admin/pending");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'import Excel:", error);
      toast.error("Une erreur s'est produite lors de l'import des données Excel");
    }
  };

  const onSubmit = async (data: CreateInternshipFormData) => {
    startTransition(async () => {
      try {
        await createInternship(data);
        toast.success("Stage créé avec succès");
        reset();
        onOpenChange(false);
        // Invalidate and refetch internships data
        queryClient.invalidateQueries({ queryKey: ["internships"] });
      } catch (error) {
        toast.error("Une erreur s'est produite");
        console.error(error);
      }
    });
  };

  const onError = () => {
    toast.error("Des champs requis sont à remplir");
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-row items-stretch gap-4">
              <div className="flex flex-col justify-between py-2">
                <DialogTitle className="text-xl">Ajouter un nouveau stage</DialogTitle>
                <p className="mt-2 text-muted-foreground text-xs">
                  <span className="text-destructive">*</span> Champs requis
                </p>
              </div>
              <div className="flex flex-col flex-1 justify-center items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  type="button"
                  onClick={() => setIsExcelDialogOpen(true)}
                >
                  <Upload className="size-4" />
                  Importer depuis Excel
                </Button>
              </div>
            </div>
          </DialogHeader>
          <Separator />
          <div className="space-y-6">
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit, onError)}>
                <OrganizationSection control={control} />
                <Separator />
                <InternshipDetailsSection control={control} />
                <Separator />
                <StudentSection control={control} />
                <div className="flex justify-center items-center gap-2 pt-6">
                  <Button
                    type="submit"
                    variant="default"
                    className="flex items-center gap-2"
                    disabled={isPending}
                  >
                    <Plus className="size-4" />
                    Créer
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleClose}
                    className="flex items-center gap-2"
                  >
                    <X className="size-4" />
                    Annuler
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <ExcelImportDialog
        open={isExcelDialogOpen}
        onOpenChange={setIsExcelDialogOpen}
        onImport={handleExcelImport}
      />
      
      <ExcelImportSummaryDialog
        open={isSummaryDialogOpen}
        onOpenChange={setIsSummaryDialogOpen}
        summary={importSummary}
      />
    </>
  );
}
