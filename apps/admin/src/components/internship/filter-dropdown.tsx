"use client";

import { Checkbox } from "@chronos/ui/components/checkbox";
import { Input } from "@chronos/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chronos/ui/components/popover";
import { Skeleton } from "@chronos/ui/components/skeleton";
import { cn } from "@chronos/ui/lib/utils";
import { ChevronDown } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";

export interface FilterDropdownOption {
  value: string;
  label: string;
  secondary?: boolean;
}

interface FilterDropdownProps {
  param: string;
  label: string;
  options: FilterDropdownOption[];
  disabled?: boolean;
  loading?: boolean;
}

export function FilterDropdown({
  param,
  label,
  options,
  disabled,
  loading,
}: FilterDropdownProps) {
  const [raw, setRaw] = useQueryState(param, { defaultValue: "" });
  const [search, setSearch] = useState("");

  const selected = raw ? raw.split(",").filter(Boolean) : [];

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setRaw(next.join(",") || null);
  };

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedOptions = filtered.filter((o) => selected.includes(o.value));
  const unselectedAvailable = filtered.filter(
    (o) => !selected.includes(o.value) && !o.secondary,
  );
  const unselectedDisabled = filtered.filter(
    (o) => !selected.includes(o.value) && o.secondary,
  );

  const sortedOptions = [
    ...selectedOptions,
    ...unselectedAvailable,
    ...unselectedDisabled,
  ];

  const selectedCount = selected.length;
  const hasAvailable = options.some((o) => !o.secondary);
  const isEmpty = !hasAvailable && selectedCount === 0;

  const selectedLabels = options
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label);
  const triggerLabel = isEmpty
    ? "Aucune option"
    : selectedCount === 0
      ? "Tous"
      : selectedCount <= 2
        ? selectedLabels.join(", ")
        : `${selectedLabels.slice(0, 2).join(", ")} +${selectedCount - 2}`;

  return (
    <div className="space-y-1">
      <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </p>
      {loading ? (
        <Skeleton className="h-8 w-full rounded-lg" />
      ) : (
        <Popover>
          <PopoverTrigger
            disabled={disabled || isEmpty}
            title={
              isEmpty ? "Aucune option avec les filtres actuels" : undefined
            }
            className={cn(
              "flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
              isEmpty && "border-dashed",
            )}
          >
            <span
              className={cn(
                "min-w-0 flex-1 truncate",
                (!selectedCount || isEmpty) && "text-muted-foreground",
              )}
            >
              {triggerLabel}
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </PopoverTrigger>
          <PopoverContent className="w-(--anchor-width) min-w-48">
            <div className="p-2">
              <Input
                placeholder="Rechercher…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-7 text-xs"
              />
            </div>
            <div className="max-h-52 overflow-y-auto px-1 pb-1">
              {sortedOptions.length === 0 ? (
                <p className="px-2 py-1 text-muted-foreground text-xs">
                  Aucun résultat
                </p>
              ) : (
                sortedOptions.map((o) => {
                  const id = `${param}-${o.value}`;
                  const checked = selected.includes(o.value);
                  return (
                    <label
                      key={o.value}
                      htmlFor={id}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm transition-colors hover:bg-muted",
                        o.secondary &&
                          !checked &&
                          "cursor-not-allowed opacity-40",
                      )}
                    >
                      <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={() =>
                          !o.secondary || checked ? toggle(o.value) : undefined
                        }
                        disabled={o.secondary && !checked}
                      />
                      {o.label}
                    </label>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
