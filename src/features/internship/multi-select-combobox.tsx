"use client";
import * as React from "react";
import {
    Command,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
                                {allSelected && <Check className="h-4 w-4" />}
                            </CommandItem>
                            <Separator className="bg-gray-300" />
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
                                        {selected && <Check className="h-4 w-4" />}
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