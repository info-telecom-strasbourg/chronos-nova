"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@chronos/ui/components/select";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { useQueryState } from "nuqs";

const DEFAULT_SORT_STATE = "most-recent";

const sortOptions = [
  { value: "most-recent", label: "Date de début", defaultOrder: "desc" },
  { value: "organization", label: "Nom", defaultOrder: "asc" },
  { value: "duration", label: "Durée", defaultOrder: "desc" },
  { value: "location", label: "Lieu", defaultOrder: "asc" },
] as const;

export function InternshipSort() {
  const [sort, setSort] = useQueryState("sort", {
    defaultValue: DEFAULT_SORT_STATE,
  });
  const [order, setOrder] = useQueryState("order", {
    defaultValue: "desc",
  });

  function handleValueChange(optionValue: string | null) {
    if (optionValue === sort) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      const newOption = sortOptions.find((opt) => opt.value === optionValue);
      setSort(optionValue);
      setOrder(newOption?.defaultOrder ?? "desc");
    }
  }

  const selectedOption = sortOptions.find((opt) => opt.value === sort);

  return (
    <Select value={sort} onValueChange={(val) => handleValueChange(val)}>
      <SelectTrigger className="flex items-center gap-2">
        {order === "desc" ? (
          <ArrowUpNarrowWide className="size-4" />
        ) : (
          <ArrowDownNarrowWide className="size-4" />
        )}
        {selectedOption?.label || "Date de début"}
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((opt) => {
          const isSelected = sort === opt.value;
          const icon = isSelected ? (
            order === "desc" ? (
              <ArrowUpNarrowWide className="size-4" />
            ) : (
              <ArrowDownNarrowWide className="size-4" />
            )
          ) : (
            <ArrowDownNarrowWide className="size-4 opacity-30" />
          );

          return (
            <SelectItem key={opt.value} value={opt.value}>
              <span className="flex items-center gap-2">
                {icon}
                {opt.label}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
