"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Save, X } from "lucide-react";
import { useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  type CreateInternshipFormData,
  createInternshipSchema,
} from "@/features/form/internship.schema";
import { InternshipDetailsSection } from "@/features/form/internship-details-section";
import { OrganizationSection } from "@/features/form/organization-section";
import { StudentSection } from "@/features/form/student-section";
import { updateInternship } from "@/features/infinite-scroll/internship.query";

interface InternshipEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  internshipId: string;
  defaultValues: Partial<CreateInternshipFormData>;
}

export function InternshipEditDialog({
  open,
  onOpenChange,
  internshipId,
  defaultValues,
}: InternshipEditDialogProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

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
      studentOption: "aucune",
      ...defaultValues,
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

  // Reset form when defaultValues change
  useEffect(() => {
    reset({
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
    });
  }, [defaultValues, reset]);

  const onSubmit = async (data: CreateInternshipFormData) => {
    startTransition(async () => {
      try {
        await updateInternship(internshipId, data);
        toast.success("Stage modifié avec succès");
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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Modifier le stage</DialogTitle>
          <p className="text-muted-foreground text-xs">
            <span className="text-destructive">*</span> Champs requis
          </p>
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

              <div className="flex items-center justify-center gap-5 pt-6">
                <Button
                  type="submit"
                  variant="default"
                  className="flex items-center gap-2"
                  disabled={isPending}
                >
                  <Save className="size-4" />
                  Enregistrer
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
  );
}
