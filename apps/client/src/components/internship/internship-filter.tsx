"use client";

import { Button } from "@chronos/ui/components/button";
import { Checkbox } from "@chronos/ui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@chronos/ui/components/select";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useQueryState } from "nuqs";
import { getInternshipFilterOptionsAction } from "@/actions/internship.action";

export function InternshipFilter() {
  const [year, setYear] = useQueryState("year", { defaultValue: "" });
  const [major, setMajor] = useQueryState("major", { defaultValue: "" });
  const [option, setOption] = useQueryState("option", { defaultValue: "" });
  const [country, setCountry] = useQueryState("country", { defaultValue: "" });
  const [city, setCity] = useQueryState("city", { defaultValue: "" });
  const [companyOnly, setCompanyOnly] = useQueryState("companyOnly", {
    defaultValue: "",
  });

  const { data: filterOptions } = useQuery({
    queryKey: [
      "internship-filter-options",
      { year, major, option, country, city, companyOnly },
    ],
    queryFn: () =>
      getInternshipFilterOptionsAction({
        academicYear: year || undefined,
        major: major || undefined,
        option: option || undefined,
        country: country || undefined,
        city: city || undefined,
        organizationType: companyOnly ? "company" : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const handleMajorChange = (value: string | null) => {
    setMajor(value ?? "");
    setOption("");
  };

  const handleCountryChange = (value: string | null) => {
    setCountry(value ?? "");
    setCity("");
  };

  const handleReset = () => {
    setYear("");
    setMajor("");
    setOption("");
    setCountry("");
    setCity("");
    setCompanyOnly("");
  };

  const hasFilters = year || major || option || country || city || companyOnly;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={year || null} onValueChange={(val) => setYear(val ?? "")}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Année" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>Toutes</SelectItem>
          {(filterOptions?.academicYears ?? []).map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={major || null}
        onValueChange={(val) => handleMajorChange(val)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Diplôme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>Tous</SelectItem>
          {(filterOptions?.majors ?? []).map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={option || null}
        onValueChange={(val) => setOption(val ?? "")}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Filière" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>Toutes</SelectItem>
          {(filterOptions?.options ?? []).map((o) => (
            <SelectItem key={o} value={o}>
              {o.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={country || null}
        onValueChange={(val) => handleCountryChange(val)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Pays" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>Tous</SelectItem>
          {(filterOptions?.countries ?? []).map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={city || null} onValueChange={(val) => setCity(val ?? "")}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Ville" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>Toutes</SelectItem>
          {(filterOptions?.cities ?? []).map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* biome-ignore lint/a11y/noLabelWithoutControl: Base UI Checkbox renders a button, not an input */}
      <label className="flex cursor-pointer items-center gap-1.5 text-sm">
        <Checkbox
          checked={companyOnly === "true"}
          onCheckedChange={(checked) => setCompanyOnly(checked ? "true" : "")}
        />
        Entreprise
      </label>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="mr-1 size-3" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
