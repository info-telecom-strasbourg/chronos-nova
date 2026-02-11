"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@chronos/ui/components/select";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { useQueryState } from "nuqs";

const DEFAULT_SORT_STATE = "most-recent";
const DEFAULT_ORDER_STATE = "asc";

const sortOptions = [
  { value: "most-recent", label: "Date de début" },
  { value: "organization", label: "Nom" },
  { value: "duration", label: "Durée" },
  { value: "location", label: "Lieu" },
];

export function InternshipSort() {
  const [sort, setSort] = useQueryState("sort", {
    defaultValue: DEFAULT_SORT_STATE,
  });
  const [order, setOrder] = useQueryState("order", {
    defaultValue: DEFAULT_ORDER_STATE,
  });

  function handleValueChange(optionValue: string | null) {
    if (optionValue === sort) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(optionValue);
      setOrder(DEFAULT_ORDER_STATE);
    }
  }

  const selectedOption = sortOptions.find((opt) => opt.value === sort);

  return (
    <Select value={sort} onValueChange={(val) => handleValueChange(val)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          <span className="flex items-center gap-2">
            {order === "desc" ? (
              <ArrowUpNarrowWide className="size-4" />
            ) : (
              <ArrowDownNarrowWide className="size-4" />
            )}
            {selectedOption?.label || "Date de début"}
          </span>
        </SelectValue>
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
