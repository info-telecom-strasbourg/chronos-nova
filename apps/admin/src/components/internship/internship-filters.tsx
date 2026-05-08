"use client";

import { Button } from "@chronos/ui/components/button";
import { RotateCcw } from "lucide-react";
import { useAdminFilters } from "@/hooks/use-admin-filters";
import { FilterDropdown } from "./filter-dropdown";
import { FilterRadio } from "./filter-radio";

const ORG_TYPE_LABELS: Record<string, string> = {
  company: "Entreprise",
  not_company: "Hors entreprise",
};

interface FilterOptions {
  academicYears: { all: string[]; available: string[] };
  majors: { all: string[]; available: string[] };
  options: { all: string[]; available: string[] };
  countries: { all: string[]; available: string[] };
  cities: { all: string[]; available: string[] };
  organizationTypes: { all: string[]; available: string[] };
}

function withAvailability(
  all: string[],
  available: string[],
  labelFn: (v: string) => string = (v) => v,
) {
  const availableSet = new Set(available);
  return all.map((v) => ({
    value: v,
    label: labelFn(v),
    secondary: !availableSet.has(v),
  }));
}

export function InternshipFilters({ options }: { options: FilterOptions }) {
  const {
    yearRaw,
    majorRaw,
    optionRaw,
    countryRaw,
    cityRaw,
    orgTypeRaw,
    setYearRaw,
    setMajorRaw,
    setOptionRaw,
    setCountryRaw,
    setCityRaw,
    setOrgTypeRaw,
    hasFilters,
    handleReset,
  } = useAdminFilters();

  const filterGroups = [
    {
      param: "year",
      label: "Année",
      value: yearRaw,
      set: setYearRaw,
      opts: options.academicYears.all.map((v) => ({
        value: v,
        label: v,
        secondary: false,
      })),
      radio: true,
      columns: 3 as const,
    },
    {
      param: "major",
      label: "Diplôme",
      value: majorRaw,
      set: setMajorRaw,
      opts: withAvailability(options.majors.all, options.majors.available),
      dropdown: true,
    },
    {
      param: "option",
      label: "Filière",
      value: optionRaw,
      set: setOptionRaw,
      opts: withAvailability(
        options.options.all,
        options.options.available,
        (v) => v.toUpperCase(),
      ),
      dropdown: true,
    },
    {
      param: "country",
      label: "Pays",
      value: countryRaw,
      set: setCountryRaw,
      opts: withAvailability(
        options.countries.all,
        options.countries.available,
      ),
      dropdown: true,
    },
    {
      param: "city",
      label: "Ville",
      value: cityRaw,
      set: setCityRaw,
      opts: withAvailability(options.cities.all, options.cities.available),
      dropdown: true,
    },
    {
      param: "orgType",
      label: "Type",
      value: orgTypeRaw,
      set: setOrgTypeRaw,
      opts: withAvailability(
        options.organizationTypes.all,
        options.organizationTypes.available,
        (v) => ORG_TYPE_LABELS[v] ?? v,
      ),
      radio: true,
    },
  ];

  return (
    <div className="space-y-5">
      {filterGroups.map((g) =>
        g.radio ? (
          <FilterRadio
            key={g.param}
            param={g.param}
            label={g.label}
            options={g.opts}
            columns={g.columns}
          />
        ) : (
          <FilterDropdown
            key={g.param}
            param={g.param}
            label={g.label}
            options={g.opts}
          />
        ),
      )}
      {hasFilters && (
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={handleReset}
        >
          <RotateCcw className="size-3" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
