import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { CreateInternshipFormData } from "@/features/form/internship.schema";
import { useState } from "react";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { studentMajors, studentOptions } from "@/features/form/options";

interface StudentSectionProps {
  register: UseFormRegister<CreateInternshipFormData>;
  errors: FieldErrors<CreateInternshipFormData>;
  setValue: UseFormSetValue<CreateInternshipFormData>;
}

export function StudentSection({ register, errors, setValue }: StudentSectionProps) {
  const [studentMajor, setStudentMajor] = useState<Option>();
  const [studentOption, setStudentOption] = useState<Option>();

  const handleStudentMajorChange = (option: Option | undefined) => {
    setStudentMajor(option);
    setValue("studentMajor", option?.value ?? "");
  };

  const handleStudentOptionChange = (option: Option | undefined) => {
    setStudentOption(option);
    setValue("studentOption", option?.value ?? "");
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Étudiant</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studentFirstName">
            Prénom <span className="text-destructive">*</span>
          </Label>
          <Input
            id="studentFirstName"
            {...register("studentFirstName")}
            className={
              errors.studentFirstName ? "border-destructive focus-visible:ring-destructive" : ""
            }
            placeholder="Jean"
          />
          {errors.studentFirstName && (
            <p className="text-destructive text-sm">{errors.studentFirstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentLastName">
            Nom <span className="text-destructive">*</span>
          </Label>
          <Input
            id="studentLastName"
            {...register("studentLastName")}
            className={
              errors.studentLastName ? "border-destructive focus-visible:ring-destructive" : ""
            }
            placeholder="Dupont"
          />
          {errors.studentLastName && (
            <p className="text-destructive text-sm">{errors.studentLastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentMajor">
            Filière <span className="text-destructive">*</span>
          </Label>
          <AutoComplete
            options={studentMajors}
            value={studentMajor}
            onValueChange={handleStudentMajorChange}
            placeholder="Sélectionnez une filière"
            emptyMessage="Aucun résultat"
            error={!!errors.studentMajor}
          />
          {errors.studentMajor && (
            <p className="text-destructive text-sm">{errors.studentMajor.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentOption">
            Option <span className="text-destructive">*</span>
          </Label>
          <AutoComplete
            options={studentOptions}
            value={studentOption}
            onValueChange={handleStudentOptionChange}
            placeholder="Sélectionnez une option"
            emptyMessage="Aucun résultat"
            error={!!errors.studentOption}
          />
          {errors.studentOption && (
            <p className="text-destructive text-sm">{errors.studentOption.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
