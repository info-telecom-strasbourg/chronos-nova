"use client";

import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_SORT_STATE = "most-recent";
const DEFAULT_ORDER_STATE = "asc";

const options = [
  { value: "most-recent", label: "Date de début" },
  { value: "organization", label: "Nom" },
  { value: "duration", label: "Durée" },
  { value: "location", label: "Lieu" },
];

export function SortInternshipButton() {
  const [sort, setSort] = useQueryState("sort", {
    defaultValue: DEFAULT_SORT_STATE,
  });
  const [order, setOrder] = useQueryState("order", {
    defaultValue: DEFAULT_ORDER_STATE,
  });

  function handleValueChange(optionValue: string) {
    if (optionValue === sort) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(optionValue);
      setOrder(DEFAULT_ORDER_STATE);
    }
  }

  const selectedOption = options.find((opt) => opt.value === sort);

  return (
    <Select value={sort} onValueChange={handleValueChange} allowReselect={true}>
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
        {options.map((opt) => {
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
