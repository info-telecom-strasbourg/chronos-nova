"use client";
// data
import { countries } from "country-data-list";
import { Check, CheckIcon, ChevronDown, ChevronsUpDown, Globe } from "lucide-react";
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { CircleFlag } from "react-circle-flags";
import { Button } from "@/components/ui/button";
// shadcn
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

// Country interface
export interface Country {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
}

// Dropdown props
interface CountryDropdownProps {
  options?: Country[];
  onChange?: (country: Country) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  slim?: boolean;
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const CountryDropdownComponent = (
  {
    options = countries.all.filter(
      (country: Country) => country.emoji && country.status !== "deleted" && country.ioc !== "PRK",
    ),
    onChange,
    defaultValue,
    disabled = false,
    placeholder = "Select a country",
    slim = false,
    ...props
  }: CountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(undefined);

  useEffect(() => {
    if (defaultValue) {
      const initialCountry = options.find((country) => country.alpha3 === defaultValue);
      if (initialCountry) {
        setSelectedCountry(initialCountry);
      } else {
        // Reset selected country if defaultValue is not found
        setSelectedCountry(undefined);
      }
    } else {
      // Reset selected country if defaultValue is undefined or null
      setSelectedCountry(undefined);
    }
  }, [defaultValue, options]);

  const handleSelect = useCallback(
    (country: Country) => {
      setSelectedCountry(country);
      onChange?.(country);
      setOpen(false);
    },
    [onChange],
  );

  const triggerClasses = cn(
    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
    slim === true && "w-20",
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={ref}
        className={cn(triggerClasses, "w-[180px]")}
        disabled={disabled}
        {...props}
      >
        {selectedCountry ? (
          <div className="flex items-center flex-grow w-0 gap-2 overflow-hidden">
            <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
              <CircleFlag countryCode={selectedCountry.alpha2.toLowerCase()} height={20} />
            </div>
            {slim === false && (
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedCountry.name}
              </span>
            )}
          </div>
        ) : (
          <span>
            {slim === false ? placeholder || setSelectedCountry?.name : <Globe size={20} />}
          </span>
        )}
        <ChevronDown size={16} />
      </PopoverTrigger>
      <PopoverContent collisionPadding={10} side="bottom" className="w-[180px] p-0">
        <Command className="w-full max-h-[200px] sm:max-h-[270px]">
          <CommandList>
            <div className="sticky top-0 z-10 bg-popover">
              <CommandInput placeholder="Search country..." />
            </div>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((x) => x.name)
                .map((option, key: number) => (
                  <CommandItem
                    className="flex items-center w-full gap-2"
                    key={key}
                    onSelect={() => handleSelect(option)}
                  >
                    <div className="flex flex-grow w-0 space-x-2 overflow-hidden">
                      <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                        <CircleFlag countryCode={option.alpha2.toLowerCase()} height={20} />
                      </div>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {option.name}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4 shrink-0",
                        option.name === selectedCountry?.name ? "opacity-100" : "opacity-0",
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
};

CountryDropdownComponent.displayName = "CountryDropdownComponent";

export const CountryDropdown = forwardRef(CountryDropdownComponent);

interface CountryMultiSelectProps {
  options?: Country[];
  value: Country[];
  onChange: (countries: Country[]) => void;
  placeholder?: string;
  label?: string;
}

export function CountryMultiSelectDropdown({
  options = countries.all.filter(
    (country: Country) => country.emoji && country.status !== "deleted" && country.ioc !== "PRK",
  ),
  value,
  onChange,
  placeholder = "Pays",
  label,
}: CountryMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredCountries = useMemo(() => {
    const seen = new Set<string>();
    return options
      .filter(
        (c) =>
          c.name &&
          c.name.length > 1 &&
          c.name.toLowerCase().includes(search.trim().toLowerCase()) &&
          !seen.has(c.alpha3) &&
          seen.add(c.alpha3),
      )
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }, [options, search]);

  const allSelected = value.length === options.length && options.length > 0;

  const handleSelect = (country: Country) => {
    const alreadySelected = value.some((c) => c.alpha3 === country.alpha3);
    if (alreadySelected) {
      onChange(value.filter((c) => c.alpha3 !== country.alpha3));
    } else {
      onChange([...value, country]);
    }
  };

  const handleSelectAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

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
            <CommandInput
              placeholder="Rechercher un pays..."
              value={search}
              onValueChange={setSearch}
              className="sticky top-0 z-10 bg-popover"
            />
            <CommandList>
              <CommandItem key="all" onSelect={handleSelectAll}>
                <span style={{ flex: 1 }}>Tout</span>
                {allSelected && <Check className="h-4 w-4" />}
              </CommandItem>
              <Separator />
              {filteredCountries.length === 0 && <CommandEmpty />}
              {filteredCountries.map((option) => {
                const isSelected = value.some((c) => c.alpha3 === option.alpha3);
                return (
                  <CommandItem
                    key={option.alpha3}
                    onSelect={() => handleSelect(option)}
                    className="flex justify-between"
                  >
                    <div className="flex items-center flex-1 gap-2 overflow-hidden">
                      <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                        <CircleFlag countryCode={option.alpha2.toLowerCase()} height={20} />
                      </div>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {option.name}
                      </span>
                    </div>
                    {isSelected && <Check className="h-4 w-4" />}
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
