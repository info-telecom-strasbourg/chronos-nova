"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@chronos/ui/components/accordion";
import { Button } from "@chronos/ui/components/button";
import { Checkbox } from "@chronos/ui/components/checkbox";
import { Skeleton } from "@chronos/ui/components/skeleton";
import { cn } from "@chronos/ui/lib/utils";
import { RotateCcw } from "lucide-react";
import { useQueryState } from "nuqs";
import { useInternshipFilters } from "@/hooks/use-internship-filters";
import { FilterRadio } from "./filter-radio";

function AccordionCheckboxGroup({
  param,
  options,
  disabled,
}: {
  param: string;
  options: { value: string; label: string; secondary?: boolean }[];
  disabled?: boolean;
}) {
  const [raw, setRaw] = useQueryState(param, { defaultValue: "" });
  const selected = raw ? raw.split(",").filter(Boolean) : [];

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setRaw(next.join(",") || null);
  };

  const visible = options.filter(
    (o) => !o.secondary || selected.includes(o.value),
  );

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {visible.map((o) => {
        const id = `mobile-${param}-${o.value}`;
        const checked = selected.includes(o.value);
        return (
          <label
            key={o.value}
            htmlFor={id}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded text-sm transition-colors",
              disabled && "pointer-events-none opacity-50",
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
      {visible.length === 0 && (
        <p className="col-span-2 text-muted-foreground text-xs">
          Aucune option
        </p>
      )}
    </div>
  );
}

export function InternshipFilterMobile() {
  const { filterGroups, hasFilters, isPending, isFetching, handleReset } =
    useInternshipFilters();

  return (
    <div>
      {isPending ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <Accordion multiple>
          {filterGroups.map((group) => (
            <AccordionItem key={group.param} value={group.param}>
              <AccordionTrigger>{group.label}</AccordionTrigger>
              <AccordionContent>
                {group.radio ? (
                  <FilterRadio
                    param={group.param}
                    label=""
                    options={group.options.filter((o) => !o.secondary)}
                    disabled={isFetching}
                    columns={group.columns}
                  />
                ) : (
                  <AccordionCheckboxGroup
                    param={group.param}
                    options={group.options}
                    disabled={isFetching}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {hasFilters && (
        <Button
          variant="destructive"
          size="sm"
          className="mt-4 w-full"
          onClick={handleReset}
        >
          <RotateCcw className="mr-1 size-3" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
