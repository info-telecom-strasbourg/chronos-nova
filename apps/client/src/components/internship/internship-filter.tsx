"use client";

import { Button } from "@chronos/ui/components/button";
import { Input } from "@chronos/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@chronos/ui/components/select";
import { RotateCcw } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MAJOR_MAPPINGS, OPTION_MAPPINGS } from "@/lib/mappings";

const YEAR_OPTIONS = [
  { value: "1A", label: "1A" },
  { value: "2A", label: "2A" },
  { value: "3A", label: "3A" },
];

const MAJOR_OPTIONS = Object.values(MAJOR_MAPPINGS).filter(
  (m, i, arr) => arr.findIndex((x) => x.value === m.value) === i,
);

function getOptionsForMajor(majorValue: string | null) {
  if (!majorValue) return [];
  return Object.values(OPTION_MAPPINGS).filter(
    (o) => o.major === majorValue && o.value !== "aucune",
  );
}

export function InternshipFilter() {
  const [year, setYear] = useQueryState("year", { defaultValue: "" });
  const [major, setMajor] = useQueryState("major", { defaultValue: "" });
  const [option, setOption] = useQueryState("option", { defaultValue: "" });
  const [country, setCountry] = useQueryState("country", { defaultValue: "" });
  const [countryInput, setCountryInput] = useState(country);

  useEffect(() => {
    setCountryInput(country);
  }, [country]);

  const debouncedSetCountry = useDebouncedCallback((val: string) => {
    if (val.length >= 2 || val === "") {
      setCountry(val);
    }
  }, 300);

  const availableOptions = getOptionsForMajor(major || null);

  const handleMajorChange = (value: string | null) => {
    setMajor(value);
    setOption("");
  };

  const handleReset = () => {
    setYear("");
    setMajor("");
    setOption("");
    setCountry("");
    setCountryInput("");
  };

  const hasFilters = year || major || option || country;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={year} onValueChange={(val) => setYear(val)}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Année" />
        </SelectTrigger>
        <SelectContent>
          {YEAR_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={major} onValueChange={(val) => handleMajorChange(val)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Diplôme" />
        </SelectTrigger>
        <SelectContent>
          {MAJOR_OPTIONS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.shortLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {major && availableOptions.length > 0 && (
        <Select value={option} onValueChange={(val) => setOption(val)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filière" />
          </SelectTrigger>
          <SelectContent>
            {availableOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.shortLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Input
        type="text"
        value={countryInput}
        onChange={(e) => {
          setCountryInput(e.target.value);
          debouncedSetCountry(e.target.value);
        }}
        placeholder="Pays"
        className="h-9 w-[140px]"
      />

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="mr-1 size-3" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
