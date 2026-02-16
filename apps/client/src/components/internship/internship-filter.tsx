"use client";

import { Button } from "@chronos/ui/components/button";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { getInternshipFilterOptionsAction } from "@/actions/internship.action";
import { FilterSelect, type FilterSelectOption } from "./filter-select";

const ORG_TYPE_LABELS: Record<string, string> = {
  company: "Entreprise",
  not_company: "Hors entreprise",
};

function withAvailability(
  all: string[],
  available: string[],
  labelFn: (v: string) => string = (v) => v,
): FilterSelectOption[] {
  const availableSet = new Set(available);
  return all.map((v) => ({
    value: v,
    label: labelFn(v),
    secondary: !availableSet.has(v),
  }));
}

export function InternshipFilter() {
  const [year, setYear] = useQueryState("year", { defaultValue: "" });
  const [major, setMajor] = useQueryState("major", { defaultValue: "" });
  const [option, setOption] = useQueryState("option", { defaultValue: "" });
  const [country, setCountry] = useQueryState("country", { defaultValue: "" });
  const [city, setCity] = useQueryState("city", { defaultValue: "" });
  const [orgType, setOrgType] = useQueryState("orgType", {
    defaultValue: "",
  });

  const { data, isPending, isFetching } = useQuery({
    queryKey: [
      "internship-filter-options",
      { year, major, option, country, city, orgType },
    ],
    queryFn: () =>
      getInternshipFilterOptionsAction({
        academicYear: year || undefined,
        major: major || undefined,
        option: option || undefined,
        country: country || undefined,
        city: city || undefined,
        organizationType:
          orgType === "company" || orgType === "not_company"
            ? orgType
            : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const handleReset = () => {
    setYear("");
    setMajor("");
    setOption("");
    setCountry("");
    setCity("");
    setOrgType("");
  };

  // Reset option si elle n'est plus dans la liste des filières du diplôme sélectionné
  useEffect(() => {
    if (option && data && !data.options.all.includes(option)) {
      setOption("");
    }
  }, [data, option, setOption]);

  // Reset ville si elle n'est plus dans la liste des villes disponibles
  useEffect(() => {
    if (city && data && !data.cities.includes(city)) {
      setCity("");
    }
  }, [data, city, setCity]);

  const hasFilters = year || major || option || country || city || orgType;

  return (
    <>
      <FilterSelect
        param="year"
        placeholder="Année"
        allLabel="Toutes"
        options={
          data
            ? withAvailability(
                data.academicYears.all,
                data.academicYears.available,
              )
            : []
        }
        width="w-[100px]"
        disabled={isFetching}
        loading={isPending}
      />
      <FilterSelect
        param="major"
        placeholder="Diplôme"
        allLabel="Tous"
        options={
          data ? withAvailability(data.majors.all, data.majors.available) : []
        }
        width="w-[140px]"
        disabled={isFetching}
        loading={isPending}
      />
      <FilterSelect
        param="option"
        placeholder="Filière"
        allLabel="Toutes"
        options={
          data
            ? withAvailability(data.options.all, data.options.available, (v) =>
                v.toUpperCase(),
              )
            : []
        }
        width="w-[140px]"
        disabled={isFetching}
        loading={isPending}
      />
      <FilterSelect
        param="country"
        placeholder="Pays"
        allLabel="Tous"
        options={(data?.countries ?? []).map((v) => ({ value: v, label: v }))}
        width="w-[140px]"
        disabled={isFetching}
        loading={isPending}
      />
      <FilterSelect
        param="city"
        placeholder="Ville"
        allLabel="Toutes"
        options={(data?.cities ?? []).map((v) => ({ value: v, label: v }))}
        width="w-[140px]"
        disabled={isFetching}
        loading={isPending}
      />
      <FilterSelect
        param="orgType"
        placeholder="Type de stage"
        allLabel="Tous"
        options={
          data
            ? withAvailability(
                data.organizationTypes.all,
                data.organizationTypes.available,
                (v) => ORG_TYPE_LABELS[v] ?? v,
              )
            : []
        }
        width="w-[160px]"
        disabled={isFetching}
        loading={isPending}
      />

      {hasFilters && (
        <Button variant="destructive" size="sm" onClick={handleReset}>
          <RotateCcw className="mr-1 size-3" />
          Réinitialiser
        </Button>
      )}
    </>
  );
}
