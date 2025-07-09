import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateInternshipFormData } from "@/features/form/internship.schema";
import { Controller } from "react-hook-form";
import { AutoComplete } from "@/components/ui/autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countries, organizationTypes } from "@/features/form/options";

interface OrganizationSectionProps {
  register: UseFormRegister<CreateInternshipFormData>;
  errors: FieldErrors<CreateInternshipFormData>;
  control: Control<CreateInternshipFormData>;
}

export function OrganizationSection({ register, errors, control }: OrganizationSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Organisation</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="organizationName">
            Nom de l'organisation <span className="text-destructive">*</span>
          </Label>
          <Input
            id="organizationName"
            {...register("organizationName")}
            className={
              errors.organizationName ? "border-destructive focus-visible:ring-destructive" : ""
            }
            placeholder="Nom de la structure d'accueil"
          />
          {errors.organizationName && (
            <p className="text-destructive text-sm">{errors.organizationName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizationType">
            Type d'organisation <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="organizationType"
            render={({ field }) => (
              <AutoComplete
                options={organizationTypes}
                value={organizationTypes.find((type) => type.value === field.value) || undefined}
                onValueChange={(option) => field.onChange(option?.value || "")}
                placeholder="Sélectionnez un type"
                emptyMessage="Aucun résultat"
                error={!!errors.organizationType}
              />
            )}
          />
          {errors.organizationType && (
            <p className="text-destructive text-sm">{errors.organizationType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizationCountry">
            Pays <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="organizationCountry"
            render={({ field }) => (
              <AutoComplete
                options={countries}
                value={countries.find((country) => country.value === field.value) || undefined}
                onValueChange={(option) => field.onChange(option?.value || "")}
                placeholder="Sélectionnez un pays"
                emptyMessage="Aucun résultat"
                error={!!errors.organizationCountry}
              />
            )}
          />
          {errors.organizationCountry && (
            <p className="text-destructive text-sm">{errors.organizationCountry.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizationCity">
            Ville <span className="text-destructive">*</span>
          </Label>
          <Input
            id="organizationCity"
            {...register("organizationCity")}
            className={
              errors.organizationCity ? "border-destructive focus-visible:ring-destructive" : ""
            }
            placeholder="Strasbourg, Nantes, Berlin..."
          />
          {errors.organizationCity && (
            <p className="text-destructive text-sm">{errors.organizationCity.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
