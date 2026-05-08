"use client";

import type { InternshipFormData } from "@chronos/db/src/validators/admin-internship.validator";
import { Button } from "@chronos/ui/components/button";
import { Input } from "@chronos/ui/components/input";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ACADEMIC_YEARS,
  MAJOR_LABELS,
  OPTION_LABELS,
  ORGANIZATION_TYPES,
} from "@/lib/constants";

interface InternshipFormProps {
  defaultValues?: Partial<InternshipFormData>;
  onSubmit: (data: InternshipFormData) => Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
}

export function InternshipForm({
  defaultValues,
  onSubmit,
  submitLabel = "Enregistrer",
  isLoading,
}: InternshipFormProps) {
  const { register, handleSubmit, setValue } = useForm<InternshipFormData>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="subject">Sujet du stage</Label>
          <Input id="subject" {...register("subject")} placeholder="Sujet…" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="organizationName">Organisation</Label>
          <Input
            id="organizationName"
            {...register("organizationName")}
            placeholder="Nom de l'organisation…"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Type d'organisation</Label>
          <Select
            defaultValue={defaultValues?.organizationType ?? undefined}
            onValueChange={(v) =>
              setValue("organizationType", v as "company" | "not_company")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner…" />
            </SelectTrigger>
            <SelectContent>
              {ORGANIZATION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="country">Pays</Label>
          <Input
            id="country"
            {...register("country")}
            placeholder="France, Allemagne…"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city">Ville</Label>
          <Input id="city" {...register("city")} placeholder="Paris…" />
        </div>

        <div className="space-y-1.5">
          <Label>Année académique</Label>
          <Select
            defaultValue={defaultValues?.academicYear ?? undefined}
            onValueChange={(v) =>
              setValue("academicYear", v as "1A" | "2A" | "3A")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner…" />
            </SelectTrigger>
            <SelectContent>
              {ACADEMIC_YEARS.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Diplôme</Label>
          <Select
            defaultValue={defaultValues?.major ?? undefined}
            onValueChange={(v) => setValue("major", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner…" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MAJOR_LABELS).map(([v, label]) => (
                <SelectItem key={v} value={v}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Option</Label>
          <Select
            defaultValue={defaultValues?.option ?? undefined}
            onValueChange={(v) => setValue("option", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner…" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(OPTION_LABELS).map(([v, label]) => (
                <SelectItem key={v} value={v}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="beginDate">Date de début</Label>
          <Input id="beginDate" type="date" {...register("beginDate")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="endDate">Date de fin</Label>
          <Input id="endDate" type="date" {...register("endDate")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="weeksCount">Durée (semaines)</Label>
          <Input
            id="weeksCount"
            type="number"
            min={1}
            {...register("weeksCount", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
