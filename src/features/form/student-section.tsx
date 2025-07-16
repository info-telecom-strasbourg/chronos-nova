import type { Control } from "react-hook-form";
import type { CreateInternshipFormData } from "@/features/form/internship.schema";
import { useWatch } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
          name="studentMajor"
          render={({ field, fieldState }) => {
            const availableMajors = academicYear ? getMajorsForYear(academicYear) : [];

            return (
              <FormItem>
                <FormLabel>
                  Filière <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!academicYear}
                  >
                    <SelectTrigger className={fieldState.invalid ? "border-destructive" : ""}>
                      <SelectValue
                        placeholder={!academicYear ? "Année manquante" : "Sélectionnez une filière"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMajors.map((major) => (
                        <SelectItem key={major.value} value={major.value}>
                          {major.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => field.onChange(value || undefined)}
                    disabled={!academicYear || !studentMajor || !hasOptions}
                  >
                    <SelectTrigger className={fieldState.invalid ? "border-destructive" : ""}>
                      <SelectValue
                        placeholder={(() => {
                          if (!academicYear) {
                            return "Année manquante";
                          } else if (!studentMajor) {
                            return "Filière manquante";
                          } else if (!hasOptions) {
                            return "Aucune option disponible";
                          } else {
                            return "Sélectionnez une option";
                          }
                        })()}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
