"use client";

import { RadioGroup, RadioItem } from "@chronos/ui/components/radio";
import { Skeleton } from "@chronos/ui/components/skeleton";
import { cn } from "@chronos/ui/lib/utils";
import { useQueryState } from "nuqs";

export interface FilterRadioOption {
  value: string;
  label: string;
  secondary?: boolean;
}

interface FilterRadioProps {
  param: string;
  label: string;
  options: FilterRadioOption[];
  disabled?: boolean;
  loading?: boolean;
  columns?: number;
}

export function FilterRadio({
  param,
  label,
  options,
  disabled,
  loading,
  columns = 1,
}: FilterRadioProps) {
  const [raw, setRaw] = useQueryState(param, { defaultValue: "" });

  return (
    <div className="space-y-1">
      <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </p>
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-5 w-full rounded" />
          ))}
        </div>
      ) : (
        <RadioGroup
          value={raw || ""}
          onValueChange={(val: string) => setRaw(val || null)}
          disabled={disabled}
          className={cn(
            columns > 1 ? "grid gap-x-2 gap-y-1" : "space-y-1.5",
            columns === 2 && "grid-cols-2",
            columns === 3 && "grid-cols-3",
          )}
        >
          <label
            htmlFor={`${param}-all`}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm transition-colors hover:bg-muted",
              disabled && "pointer-events-none opacity-50",
            )}
          >
            <RadioItem id={`${param}-all`} value="" />
            Tous
          </label>
          {options.map((o) => (
            <label
              key={o.value}
              htmlFor={`${param}-${o.value}`}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm transition-colors hover:bg-muted",
                (disabled || o.secondary) && "pointer-events-none opacity-50",
              )}
            >
              <RadioItem
                id={`${param}-${o.value}`}
                value={o.value}
                disabled={o.secondary}
              />
              {o.label}
            </label>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}
