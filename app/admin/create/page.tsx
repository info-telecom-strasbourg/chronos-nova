"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  type CreateInternshipFormData,
  createInternshipSchema,
} from "@/features/form/internship.schema";
import { InternshipDetailsSection } from "@/features/form/internship-details-section";
import { OrganizationSection } from "@/features/form/organization-section";
import { StudentSection } from "@/features/form/student-section";

export default function CreateInternshipPage() {
  const {
    register,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<CreateInternshipFormData>({
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
      studentFirstName: "",
      studentLastName: "",
      studentMajor: undefined,
      studentOption: undefined,
    },
  });

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex justify-end">
        <Button variant="outline" className="flex items-center gap-2" type="button">
          <Upload className="size-4" />
          Importer depuis Excel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Ajouter un nouveau stage</CardTitle>
          <p className="mt-1 pl-0.5 text-muted-foreground text-xs">
            <span className="text-destructive">*</span> Champs requis
          </p>
        </CardHeader>
        <Separator />
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <OrganizationSection register={register} errors={errors} setValue={setValue} />

            <Separator />

            <InternshipDetailsSection register={register} errors={errors} setValue={setValue} />

            <Separator />

            <StudentSection register={register} errors={errors} setValue={setValue} />

            <div className="flex items-center justify-center gap-5 pt-6">
              <Button
                type="button"
                className="flex items-center"
                onClick={async () => {
                  await trigger();
                }}
              >
                <Eye className="size-4" />
                Prévisualiser
              </Button>
              <Button type="button" variant="destructive" className="flex items-center gap-2">
                <X className="size-4" />
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
