"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type MultiSelectComboboxProps = {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  label?: string;
};

export function MultiSelectCombobox({
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  label,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const allSelected = value.length === options.length && options.length > 0;

  return (
    <div>
      {label && <span>{label} :</span>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[180px] justify-between">
            {placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0">
          <Command>
            <CommandList>
              <CommandItem
                key="all"
                onSelect={() => {
                  if (allSelected) {
                    onChange([]);
                  } else {
                    onChange([...options]);
                  }
                }}
              >
                <span style={{ flex: 1 }}>Tout</span>
                {allSelected && <Check className="size-4" />}
              </CommandItem>
              <CommandSeparator />
              {options.map((option) => {
                const selected = value.includes(option);
                return (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      if (selected) {
                        onChange(value.filter((v) => v !== option));
                      } else {
                        onChange([...value, option]);
                      }
                    }}
                  >
                    <span style={{ flex: 1 }}>{option}</span>
                    {selected && <Check className="size-4" />}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
