import type { Control } from "react-hook-form";
import type { CreateInternshipFormData } from "@/features/form/internship.schema";
import { AutoComplete } from "@/components/ui/autocomplete";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { academicYears } from "@/features/form/options";

interface InternshipDetailsSectionProps {
  control: Control<CreateInternshipFormData>;
}

export function InternshipDetailsSection({ control }: InternshipDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Détails du stage</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="subject"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>
                Sujet du stage <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez le sujet du stage"
                  className="min-h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="academicYear"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Année académique <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <AutoComplete
                  options={academicYears}
                  value={academicYears.find((year) => year.value === field.value) || undefined}
                  onValueChange={(option) => field.onChange(option?.value || "")}
                  placeholder="Sélectionnez une année"
                  emptyMessage="Aucun résultat"
                  error={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="beginDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Date de début <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="weeksCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nombre de semaines <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="52"
                  placeholder="8"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
