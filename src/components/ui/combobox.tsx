"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: ComboboxOption;
  onValueChange?: (option: ComboboxOption | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  width?: string;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Sélectionnez...",
  searchPlaceholder = "Rechercher...",
  emptyMessage = "Aucune résultat trouvé.",
  error = false,
  disabled = false,
  className,
  width = "w-full",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="default"
          aria-expanded={open}
          aria-invalid={error}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            width,
            error &&
              "!border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
            className,
          )}
        >
          <span
            data-slot="select-value"
            className={cn(!value && "line-clamp-1 flex items-center gap-2 text-muted-foreground")}
          >
            {value?.label || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", width)}>
        <Command className="bg-popover text-popover-foreground">
          <CommandInput
            placeholder={searchPlaceholder}
            className="placeholder:!opacity-100 placeholder:!text-muted-foreground/80 h-9 bg-popover text-popover-foreground"
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const selectedOption = options.find((opt) => opt.value === currentValue);
                    onValueChange?.(selectedOption === value ? undefined : selectedOption);
                    setOpen(false);
                  }}
                  className="text-foreground hover:bg-transparent hover:text-foreground aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value?.value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
