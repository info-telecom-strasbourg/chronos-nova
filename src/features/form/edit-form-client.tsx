"use client";

import type { InternshipData } from "@/types/drizzle";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import Link from "next/link";
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

interface EditInternshipFormProps {
  internship: InternshipData;
}

export function EditInternshipForm({ internship }: EditInternshipFormProps) {
  const {
    register,
    control,
    formState: { errors },
    trigger,
  } = useForm<CreateInternshipFormData>({
    resolver: zodResolver(createInternshipSchema),
    defaultValues: {
      organizationName: internship.organization.name ?? "",
      organizationType: internship.organization.type ?? undefined,
      organizationCountry: internship.organization.country ?? undefined,
      organizationCity: internship.organization.city ?? "",
      subject: internship.subject ?? "",
      academicYear: internship.academicYear ?? undefined,
      beginDate: internship.beginDate ?? "",
      weeksCount: internship.weeksCount ?? undefined,
      studentFirstName: internship.student.firstName ?? "",
      studentLastName: internship.student.lastName ?? "",
      studentMajor: internship.student.major.alias ?? undefined,
      studentOption: internship.student.option.alias ?? undefined,
    },
  });

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Modifier le stage</CardTitle>
          <p className="mt-1 pl-0.5 text-muted-foreground text-xs">
            <span className="text-destructive">*</span> Champs requis
          </p>
        </CardHeader>
        <Separator />
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <OrganizationSection register={register} errors={errors} control={control} />

            <Separator />

            <InternshipDetailsSection register={register} errors={errors} control={control} />

            <Separator />

            <StudentSection register={register} errors={errors} control={control} />

            <div className="flex items-center justify-center gap-5 pt-6">
              <Button
                type="button"
                className="flex items-center"
                onClick={async () => {
                  await trigger();
                  // TODO: Implement save functionality
                }}
              >
                <Save className="size-4" />
                Sauvegarder
              </Button>

              <Button asChild variant="destructive">
                <Link href="/admin">
                  <X className="size-4" />
                  Annuler
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
