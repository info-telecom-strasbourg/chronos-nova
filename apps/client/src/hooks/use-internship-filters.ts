"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { getInternshipFilterOptionsAction } from "@/actions/internship.action";

const ORG_TYPE_LABELS: Record<string, string> = {
  company: "Entreprise",
  not_company: "Hors entreprise",
};

function parseMulti(raw: string) {
  return raw ? raw.split(",").filter(Boolean) : [];
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

export function useInternshipFilters() {
  const [yearRaw, setYearRaw] = useQueryState("year", { defaultValue: "" });
  const [majorRaw, setMajorRaw] = useQueryState("major", { defaultValue: "" });
  const [optionRaw, setOptionRaw] = useQueryState("option", {
    defaultValue: "",
  });
  const [countryRaw, setCountryRaw] = useQueryState("country", {
    defaultValue: "",
  });
  const [cityRaw, setCityRaw] = useQueryState("city", { defaultValue: "" });
  const [orgTypeRaw, setOrgTypeRaw] = useQueryState("orgType", {
    defaultValue: "",
  });

  const years = parseMulti(yearRaw);
  const majors = parseMulti(majorRaw);
  const options = parseMulti(optionRaw);
  const countries = parseMulti(countryRaw);
  const cities = parseMulti(cityRaw);
  const orgTypes = parseMulti(orgTypeRaw);

  const { data, isPending, isFetching } = useQuery({
    queryKey: [
      "internship-filter-options",
      { yearRaw, majorRaw, optionRaw, countryRaw, cityRaw, orgTypeRaw },
    ],
    queryFn: () =>
      getInternshipFilterOptionsAction({
        academicYear: years.length
          ? (years as ("1A" | "2A" | "3A")[])
          : undefined,
        major: majors.length ? majors : undefined,
        option: options.length ? options : undefined,
        country: countries.length ? countries : undefined,
        city: cities.length ? cities : undefined,
        organizationType: orgTypes.length
          ? (orgTypes as ("company" | "not_company")[])
          : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const handleReset = () => {
    setYearRaw(null);
    setMajorRaw(null);
    setOptionRaw(null);
    setCountryRaw(null);
    setCityRaw(null);
    setOrgTypeRaw(null);
  };

  // Reset options que ne font plus partie du diplôme sélectionné
  useEffect(() => {
    if (!data || !optionRaw) return;
    const validOptions = options.filter((o) => data.options.all.includes(o));
    if (validOptions.length !== options.length)
      setOptionRaw(validOptions.join(",") || null);
  }, [data, optionRaw]);

  // Reset villes qui ne sont plus disponibles
  useEffect(() => {
    if (!data || !cityRaw) return;
    const validCities = cities.filter((c) => data.cities.includes(c));
    if (validCities.length !== cities.length)
      setCityRaw(validCities.join(",") || null);
  }, [data, cityRaw]);

  const hasFilters =
    yearRaw || majorRaw || optionRaw || countryRaw || cityRaw || orgTypeRaw;

  const filterGroups = data
    ? [
        {
          param: "year",
          label: "Année",
          options: withAvailability(
            data.academicYears.all,
            data.academicYears.available,
          ),
        },
        {
          param: "major",
          label: "Diplôme",
          options: withAvailability(data.majors.all, data.majors.available),
        },
        {
          param: "option",
          label: "Filière",
          options: withAvailability(
            data.options.all,
            data.options.available,
            (v) => v.toUpperCase(),
          ),
        },
        {
          param: "country",
          label: "Pays",
          options: data.countries.map((v) => ({ value: v, label: v })),
        },
        {
          param: "city",
          label: "Ville",
          options: data.cities.map((v) => ({ value: v, label: v })),
        },
        {
          param: "orgType",
          label: "Type de stage",
          options: withAvailability(
            data.organizationTypes.all,
            data.organizationTypes.available,
            (v) => ORG_TYPE_LABELS[v] ?? v,
          ),
        },
      ]
    : [];

  return {
    filterGroups,
    hasFilters,
    isPending,
    isFetching,
    handleReset,
  };
}
