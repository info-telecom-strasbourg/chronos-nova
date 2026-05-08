"use client";

import { Checkbox } from "@chronos/ui/components/checkbox";
import { Skeleton } from "@chronos/ui/components/skeleton";
import { cn } from "@chronos/ui/lib/utils";
import { useQueryState } from "nuqs";

export interface FilterMultiSelectOption {
  value: string;
  label: string;
  secondary?: boolean;
}

interface FilterMultiSelectProps {
  param: string;
  label: string;
  options: FilterMultiSelectOption[];
  disabled?: boolean;
  loading?: boolean;
}

export function FilterMultiSelect({
  param,
  label,
  options,
  disabled,
  loading,
}: FilterMultiSelectProps) {
  const [raw, setRaw] = useQueryState(param, { defaultValue: "" });

  const selected = raw ? raw.split(",").filter(Boolean) : [];

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setRaw(next.join(",") || null);
  };

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
        <div className="space-y-1.5">
          {options.map((o) => {
            const id = `${param}-${o.value}`;
            const checked = selected.includes(o.value);
            return (
              <label
                key={o.value}
                htmlFor={id}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm transition-colors hover:bg-muted",
                  disabled && "pointer-events-none opacity-50",
                  o.secondary && "text-muted-foreground",
                )}
              >
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={() => toggle(o.value)}
                  disabled={disabled}
                />
                {o.label}
              </label>
            );
          })}
          {options.length === 0 && (
            <p className="px-1 text-muted-foreground text-xs">Aucune option</p>
          )}
        </div>
      )}
    </div>
  );
}
