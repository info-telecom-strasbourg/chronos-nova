import type { Control } from "react-hook-form";
import type { CreateInternshipFormData } from "@/features/form/internship.schema";
import { useWatch } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMajorsForYear, getOptionsForMajor } from "@/features/form/options";

interface StudentSectionProps {
  control: Control<CreateInternshipFormData>;
}

export function StudentSection({ control }: StudentSectionProps) {
  const academicYear = useWatch({ control, name: "academicYear" });
  const studentMajor = useWatch({ control, name: "studentMajor" });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Étudiant</h3>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <FormField
          control={control}
          name="studentMajor"
          render={({ field, fieldState }) => {
            const availableMajors = academicYear ? getMajorsForYear(academicYear) : [];

            return (
              <FormItem>
                <FormLabel className={fieldState.invalid ? "text-destructive" : ""}>
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

            let optionPlaceholder = "Sélectionnez une option";
            if (!academicYear) optionPlaceholder = "Année manquante";
            else if (!studentMajor) optionPlaceholder = "Filière manquante";

            return (
              <FormItem>
                <FormLabel className={fieldState.invalid ? "text-destructive" : ""}>
                  Option <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                    disabled={!academicYear || !studentMajor}
                  >
                    <SelectTrigger className={fieldState.invalid ? "border-destructive" : ""}>
                      <SelectValue placeholder={optionPlaceholder} />
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
              </FormItem>
            );
          }}
        />
      </div>
    </div>
  );
}
