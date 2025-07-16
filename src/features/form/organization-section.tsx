import type { Control } from "react-hook-form";
import type { CreateInternshipFormData } from "@/features/form/internship.schema";
import { Combobox } from "@/components/ui/combobox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries, organizationTypes } from "@/features/form/options";

interface OrganizationSectionProps {
  control: Control<CreateInternshipFormData>;
}

export function OrganizationSection({ control }: OrganizationSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Organisme</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nom de l'organisme <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'entreprise" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="organizationType"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Type d'organisme <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={fieldState.invalid ? "border-destructive" : ""}>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="organizationCountry"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Pays <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Combobox
                  options={countries}
                  value={countries.find((country) => country.value === field.value) || undefined}
                  onValueChange={(option) => field.onChange(option?.value || "")}
                  placeholder="Sélectionnez un pays"
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
          name="organizationCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Ville <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Ville" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
