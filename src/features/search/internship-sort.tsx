import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortInternshipButton({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [sortState, setSortState] = useState<{ key: string; order: "asc" | "desc" }>(() => {
    const [key, order] = value.split(":");
    return { key: key || "most-recent", order: order === "desc" ? "desc" : "asc" };
  });

  const options = [
    { value: "most-recent", label: "Date de début" },
    { value: "organization", label: "Nom" },
    { value: "duration", label: "Durée" },
    { value: "location", label: "Lieu" },
  ];

  const selectedOption = options.find((opt) => opt.value === sortState.key);
  function handleValueChange(optionValue: string) {
    if (optionValue === sortState.key) {
      const newOrder = sortState.order === "asc" ? "desc" : "asc";
      const newState = { key: optionValue, order: newOrder as "asc" | "desc" };
      setSortState(newState);
      onChange(`${optionValue}:${newOrder}`);
    } else {
      const newState = { key: optionValue, order: "asc" as const };
      setSortState(newState);
      onChange(`${optionValue}:asc`);
    }
  }

  return (
    <Select value={sortState.key} onValueChange={handleValueChange} allowReselect={true}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          <span className="flex items-center gap-2">
            {sortState.order === "asc" ? (
              <ArrowDownNarrowWide className="size-4" />
            ) : (
              <ArrowUpNarrowWide className="size-4" />
            )}
            {selectedOption?.label || "Date de début"}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => {
          const isSelected = sortState.key === opt.value;
          const icon = isSelected ? (
            sortState.order === "asc" ? (
              <ArrowDownNarrowWide className="size-4" />
            ) : (
              <ArrowUpNarrowWide className="size-4" />
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
