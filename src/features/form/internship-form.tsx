"use client";

import type { SheetConfig } from "@/types/excel-import";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ExcelImportDialog } from "@/features/excel-import/excel-import-dialog";
import {
  type CreateInternshipFormData,
  createInternshipSchema,
} from "@/features/form/internship.schema";
import { InternshipDetailsSection } from "@/features/form/internship-details-section";
import { OrganizationSection } from "@/features/form/organization-section";
import { StudentSection } from "@/features/form/student-section";
import { createInternship, updateInternship } from "@/features/infinite-scroll/internship.query";

interface InternshipFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<CreateInternshipFormData>;
  internshipId?: string;
}

export function InternshipForm({ mode, defaultValues, internshipId }: InternshipFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);

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
      ...defaultValues,
    },
  });

  const { control, setValue, watch } = form;

  const academicYear = watch("academicYear");
  const studentMajor = watch("studentMajor");

  const prevAcademicYear = useRef(academicYear);
  const prevStudentMajor = useRef(studentMajor);

  useEffect(() => {
    if (prevAcademicYear.current !== academicYear && prevAcademicYear.current !== undefined) {
      setValue("studentMajor", "");
      setValue("studentOption", undefined);
    }
    prevAcademicYear.current = academicYear;
  }, [academicYear, setValue]);

  useEffect(() => {
    if (prevStudentMajor.current !== studentMajor && prevStudentMajor.current !== undefined) {
      setValue("studentOption", undefined);
    }
    prevStudentMajor.current = studentMajor;
  }, [studentMajor, setValue]);

  const handleExcelImport = async (file: File, sheetsConfig: SheetConfig[]) => {
    try {
      const arrayBuffer = await file.arrayBuffer();

      const { importExcelData } = await import("@/features/excel-import/excel-import.action");
      const result = await importExcelData(arrayBuffer, sheetsConfig);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/pending");
        router.refresh();
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
        if (mode === "create") {
          await createInternship(data);
          toast.success("Stage créé avec succès");
          router.push("/admin");
        } else {
          if (!internshipId) {
            toast.error("ID du stage manquant");
            return;
          }
          await updateInternship(internshipId, data);
          toast.success("Stage modifié avec succès");
          router.push("/admin");
        }
      } catch (error) {
        toast.error("Une erreur s'est produite");
        console.error(error);
      }
    });
  };

  const pageTitle = mode === "create" ? "Ajouter un nouveau stage" : "Modifier le stage";
  const submitButtonText = mode === "create" ? "Ajouter" : "Sauvegarder";

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      {mode === "create" && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            type="button"
            onClick={() => setIsExcelDialogOpen(true)}
          >
            <Upload className="size-4" />
            Importer depuis Excel
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{pageTitle}</CardTitle>
          <p className="mt-1 pl-0.5 text-muted-foreground text-xs">
            <span className="text-destructive">*</span> Champs requis
          </p>
        </CardHeader>
        <Separator />
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <OrganizationSection control={control} />

              <Separator />

              <InternshipDetailsSection control={control} />

              <Separator />

              <StudentSection control={control} />

              <div className="flex items-center justify-center gap-5 pt-6">
                <Button
                  type="submit"
                  variant="default"
                  className="flex items-center gap-2"
                  disabled={isPending}
                >
                  {mode === "create" ? (
                    <>
                      <Plus className="size-4" />
                      {submitButtonText}
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      {submitButtonText}
                    </>
                  )}
                </Button>

                <Button asChild variant="destructive">
                  <Link href="/admin" className="flex items-center gap-2">
                    <X className="size-4" />
                    Annuler
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {mode === "create" && (
        <ExcelImportDialog
          open={isExcelDialogOpen}
          onOpenChange={setIsExcelDialogOpen}
          onImport={handleExcelImport}
        />
      )}
    </div>
  );
}
