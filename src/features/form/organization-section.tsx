import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { CreateInternshipFormData } from "@/features/form/internship.schema";
import { useState } from "react";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countries, organizationTypes } from "@/features/form/options";

interface OrganizationSectionProps {
  register: UseFormRegister<CreateInternshipFormData>;
  errors: FieldErrors<CreateInternshipFormData>;
  setValue: UseFormSetValue<CreateInternshipFormData>;
}

export function OrganizationSection({ register, errors, setValue }: OrganizationSectionProps) {
  const [orgType, setOrgType] = useState<Option>();
  const [country, setCountry] = useState<Option>();

  const handleOrgTypeChange = (option: Option | undefined) => {
    setOrgType(option);
    setValue("organizationType", option?.value ?? "");
  };

  const handleCountryChange = (option: Option | undefined) => {
    setCountry(option);
    setValue("organizationCountry", option?.value ?? "");
  };

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
          <AutoComplete
            options={organizationTypes}
            value={orgType}
            onValueChange={handleOrgTypeChange}
            placeholder="Sélectionnez un type"
            emptyMessage="Aucun résultat"
            error={!!errors.organizationType}
          />
          {errors.organizationType && (
            <p className="text-destructive text-sm">{errors.organizationType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizationCountry">
            Pays <span className="text-destructive">*</span>
          </Label>
          <AutoComplete
            options={countries}
            value={country}
            onValueChange={handleCountryChange}
            placeholder="Sélectionnez un pays"
            emptyMessage="Aucun résultat"
            error={!!errors.organizationCountry}
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
