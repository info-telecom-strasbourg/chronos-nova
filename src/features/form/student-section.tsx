import type { Control } from "react-hook-form";
import type { CreateInternshipFormData } from "@/features/form/internship.schema";
import { useWatch } from "react-hook-form";
import { toast } from "sonner";
import { AutoComplete } from "@/components/ui/autocomplete";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getMajorsForYear, getOptionsForMajor, hasOptionsForMajor } from "@/features/form/options";

interface StudentSectionProps {
  control: Control<CreateInternshipFormData>;
}

export function StudentSection({ control }: StudentSectionProps) {
  const academicYear = useWatch({ control, name: "academicYear" });
  const studentMajor = useWatch({ control, name: "studentMajor" });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Étudiant</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="studentFirstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Prénom <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Jean" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="studentLastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nom <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Dupont" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="studentMajor"
          render={({ field, fieldState }) => {
            const availableMajors = academicYear ? getMajorsForYear(academicYear) : [];

            return (
              <FormItem>
                <FormLabel>
                  Filière <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <AutoComplete
                    options={availableMajors}
                    value={
                      field.value === undefined || field.value === ""
                        ? undefined
                        : availableMajors.find((major) => major.value === field.value)
                    }
                    onValueChange={(option) => field.onChange(option?.value || "")}
                    placeholder={
                      !academicYear ? "Sélectionnez une année" : "Sélectionnez une filière"
                    }
                    emptyMessage="Aucun résultat"
                    disabled={!academicYear}
                    onDisabledClick={() => {
                      toast.error("Veuillez d'abord sélectionner une année académique");
                    }}
                    error={fieldState.invalid}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={control}
          name="studentOption"
          render={({ field, fieldState }) => {
            const availableOptions =
              academicYear && studentMajor ? getOptionsForMajor(academicYear, studentMajor) : [];
            const hasOptions =
              academicYear && studentMajor ? hasOptionsForMajor(academicYear, studentMajor) : false;

            return (
              <FormItem>
                <FormLabel>
                  Option <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <AutoComplete
                    options={availableOptions}
                    value={
                      field.value === undefined || field.value === ""
                        ? undefined
                        : availableOptions.find((option) => option.value === field.value)
                    }
                    onValueChange={(option) => field.onChange(option?.value || undefined)}
                    placeholder={(() => {
                      if (!academicYear) {
                        return "Sélectionnez une année";
                      } else if (!studentMajor) {
                        return "Sélectionnez une filière";
                      } else if (!hasOptions) {
                        return "Aucune option disponible";
                      } else {
                        return "Sélectionnez une option";
                      }
                    })()}
                    emptyMessage="Aucun résultat"
                    disabled={!academicYear || !studentMajor || !hasOptions}
                    onDisabledClick={() => {
                      if (!academicYear) {
                        toast.error("Veuillez d'abord sélectionner une année académique");
                      } else if (!studentMajor) {
                        toast.error("Veuillez d'abord sélectionner une filière");
                      } else if (!hasOptions) {
                        toast.error("Cette filière n'a pas d'options disponibles");
                      }
                    }}
                    error={fieldState.invalid}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    </div>
  );
}
