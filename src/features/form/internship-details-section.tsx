import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { CreateInternshipFormData } from "@/features/form/internship.schema";
import { useState } from "react";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { academicYears } from "@/features/form/options";

interface InternshipDetailsSectionProps {
  register: UseFormRegister<CreateInternshipFormData>;
  errors: FieldErrors<CreateInternshipFormData>;
  setValue: UseFormSetValue<CreateInternshipFormData>;
}

export function InternshipDetailsSection({
  register,
  errors,
  setValue,
}: InternshipDetailsSectionProps) {
  const [academicYear, setAcademicYear] = useState<Option>();

  const handleAcademicYearChange = (option: Option | undefined) => {
    setAcademicYear(option);
    setValue("academicYear", option?.value ?? "");
  };
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Détails du stage</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">
            Sujet du stage <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="subject"
            {...register("subject")}
            className={errors.subject ? "border-destructive focus-visible:ring-destructive" : ""}
            placeholder="Description détaillée du sujet de stage"
          />
          {errors.subject && <p className="text-destructive text-sm">{errors.subject.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="academicYear">
              Année académique <span className="text-destructive">*</span>
            </Label>
            <AutoComplete
              options={academicYears}
              value={academicYear}
              onValueChange={handleAcademicYearChange}
              placeholder="Sélectionnez une année"
              emptyMessage="Aucun résultat"
              error={!!errors.academicYear}
            />
            {errors.academicYear && (
              <p className="text-destructive text-sm">{errors.academicYear.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="beginDate">
              Date de début <span className="text-destructive">*</span>
            </Label>
            <Input
              id="beginDate"
              type="date"
              {...register("beginDate")}
              className={
                errors.beginDate ? "border-destructive focus-visible:ring-destructive" : ""
              }
            />
            {errors.beginDate && (
              <p className="text-destructive text-sm">{errors.beginDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weeksCount">
              Durée (semaines) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="weeksCount"
              type="number"
              min="1"
              max="100"
              {...register("weeksCount", { valueAsNumber: true })}
              className={
                errors.weeksCount ? "border-destructive focus-visible:ring-destructive" : ""
              }
              placeholder="12"
            />
            {errors.weeksCount && (
              <p className="text-destructive text-sm">{errors.weeksCount.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
