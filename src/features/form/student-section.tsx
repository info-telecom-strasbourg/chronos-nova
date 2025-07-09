import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateInternshipFormData } from "@/features/form/internship.schema";
import { Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { AutoComplete } from "@/components/ui/autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMajorsForYear, getOptionsForMajor, hasOptionsForMajor } from "@/features/form/options";

interface StudentSectionProps {
  register: UseFormRegister<CreateInternshipFormData>;
  errors: FieldErrors<CreateInternshipFormData>;
  control: Control<CreateInternshipFormData>;
}

export function StudentSection({ register, errors, control }: StudentSectionProps) {
  const academicYear = useWatch({ control, name: "academicYear" });
  const studentMajor = useWatch({ control, name: "studentMajor" });

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
          <Controller
            control={control}
            name="studentMajor"
            render={({ field }) => {
              const availableMajors = academicYear ? getMajorsForYear(academicYear) : [];

              return (
                <AutoComplete
                  options={availableMajors}
                  value={availableMajors.find((major) => major.value === field.value) || undefined}
                  onValueChange={(option) => field.onChange(option?.value || "")}
                  placeholder={(() => {
                    if (!academicYear) {
                      return "Sélectionnez une année";
                    } else {
                      return "Sélectionnez une filière";
                    }
                  })()}
                  emptyMessage="Aucun résultat"
                  error={!!errors.studentMajor}
                  disabled={!academicYear}
                  onDisabledClick={() => {
                    toast.error("Veuillez d’abord sélectionner une année académique");
                  }}
                />
              );
            }}
          />
          {errors.studentMajor && (
            <p className="text-destructive text-sm">{errors.studentMajor.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentOption">
            Option <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="studentOption"
            render={({ field }) => {
              const availableOptions =
                academicYear && studentMajor ? getOptionsForMajor(academicYear, studentMajor) : [];
              const hasOptions =
                academicYear && studentMajor
                  ? hasOptionsForMajor(academicYear, studentMajor)
                  : false;

              return (
                <AutoComplete
                  options={availableOptions}
                  value={
                    availableOptions.find((option) => option.value === field.value) || undefined
                  }
                  onValueChange={(option) => field.onChange(option?.value || "")}
                  placeholder={(() => {
                    if (!academicYear) {
                      return "Sélectionnez une année";
                    } else if (!studentMajor) {
                      return "Sélectionnez une filière";
                    } else if (!hasOptions) {
                      return "Aucune option";
                    } else {
                      return "Sélectionnez une option";
                    }
                  })()}
                  emptyMessage="Aucun résultat"
                  error={!!errors.studentOption}
                  disabled={!academicYear || !studentMajor || !hasOptions}
                  onDisabledClick={() => {
                    if (!academicYear) {
                      toast.error("Veuillez d’abord sélectionner une année académique");
                    } else if (!studentMajor) {
                      toast.error("Veuillez d’abord sélectionner une filière");
                    } else if (!hasOptions) {
                      toast.error("Cette filière n’a pas d’option disponible");
                    }
                  }}
                />
              );
            }}
          />
          {errors.studentOption && (
            <p className="text-destructive text-sm">{errors.studentOption.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
