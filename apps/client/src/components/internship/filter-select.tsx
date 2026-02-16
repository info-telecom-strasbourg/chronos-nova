"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@chronos/ui/components/select";
import { Skeleton } from "@chronos/ui/components/skeleton";
import { useQueryState } from "nuqs";
import { useRef } from "react";

export interface FilterSelectOption {
  value: string;
  label: string;
  secondary?: boolean;
}

interface FilterSelectProps {
  param: string;
  placeholder: string;
  allLabel: string;
  options: FilterSelectOption[];
  width: string;
  disabled?: boolean;
  loading?: boolean;
  onValueChange?: (value: string) => void;
}

export function FilterSelect({
  param,
  placeholder,
  allLabel,
  options,
  width,
  disabled,
  loading,
  onValueChange: onValueChangeProp,
}: FilterSelectProps) {
  const [value, setValue] = useQueryState(param, { defaultValue: "" });
  const isOpen = useRef(false);

  if (loading) {
    return <Skeleton className={`h-8 ${width} rounded-lg`} />;
  }

  const handleChange = (val: string | null) => {
    // Ignore auto-resets triggered by Base UI when the selected value
    // is no longer in the items list (dropdown is closed → not user-initiated)
    if (val == null && !isOpen.current) return;
    const next = val ?? "";
    setValue(next);
    onValueChangeProp?.(next);
  };

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <Select
      value={value || null}
      onValueChange={handleChange}
      onOpenChange={(open) => {
        isOpen.current = open;
      }}
      disabled={disabled}
    >
      <SelectTrigger className={width}>
        <SelectValue placeholder={placeholder}>{selectedLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{placeholder}</SelectLabel>
          <SelectItem value={null}>{allLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              className={
                o.secondary
                  ? "text-muted-foreground focus:text-muted-foreground"
                  : undefined
              }
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
