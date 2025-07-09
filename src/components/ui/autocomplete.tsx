// import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CommandGroup, CommandItem, CommandList } from "./command";
import { Skeleton } from "./skeleton";

export type Option = Record<"value" | "label", string> & Record<string, string>;

type AutoCompleteProps = {
  options: Option[];
  emptyMessage: string;
  value?: Option;
  onValueChange?: (value: Option | undefined) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  onDisabledClick?: () => void;
};

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
  error = false,
  onDisabledClick,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | undefined>(value);
  const [inputValue, setInputValue] = useState<string>(value?.label ?? "");

  const filteredOptions = inputValue
    ? options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))
    : options;

  const handleBlur = () => {
    setOpen(false);
    if (!inputValue || inputValue.trim() === "") {
      setInputValue("");
      setSelected(undefined);
      onValueChange?.(undefined);
    } else if (selected && inputValue !== selected.label) {
      setInputValue("");
      setSelected(undefined);
      onValueChange?.(undefined);
    } else {
      setInputValue(selected?.label ?? "");
    }
  };

  const handleSelectOption = (selectedOption: Option) => {
    setSelected(selectedOption);
    setInputValue(selectedOption.label);
    onValueChange?.(selectedOption);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isOpen && filteredOptions.length > 0) {
        const items = Array.from(document.querySelectorAll('[role="option"]'));
        const active = items.find((item) => item.getAttribute("aria-selected") === "true");
        if (active) {
          const value =
            active.getAttribute("data-value") || active.getAttribute("value") || active.textContent;
          const selectedOption = filteredOptions.find(
            (opt) => opt.label === value || opt.value === value || opt.label === active.textContent,
          );
          if (selectedOption) {
            handleSelectOption(selectedOption);
            e.preventDefault();
            return;
          }
        }
        handleSelectOption(filteredOptions[0]);
        e.preventDefault();
        return;
      }
      if (!inputValue || inputValue.trim() === "") {
        setSelected(undefined);
        onValueChange?.(undefined);
        setInputValue("");
        setOpen(false);
        e.preventDefault();
      } else {
        const found = options.find((opt) => opt.label === inputValue);
        if (found) {
          handleSelectOption(found);
          e.preventDefault();
        }
      }
    }
  };

  return (
    <CommandPrimitive filter={() => 1} value={inputValue} shouldFilter={false}>
      <div className="relative">
        <CommandPrimitive.Input
          ref={inputRef}
          value={inputValue ?? ""}
          onValueChange={(val) => {
            setInputValue(val);
            setOpen(true);
          }}
          onBlur={handleBlur}
          onFocus={disabled ? onDisabledClick : () => setOpen(true)}
          onClick={disabled ? onDisabledClick : undefined}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          data-slot="input"
          className={cn(
            "flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
            error ? "border-destructive hover:border-destructive" : "",
          )}
        />
        {disabled && onDisabledClick && (
          <button
            type="button"
            onClick={onDisabledClick}
            className="absolute inset-0 cursor-pointer"
            aria-label="Cliquez pour plus d'informations"
          />
        )}
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            "fade-in-0 zoom-in-95 absolute top-0 z-10 w-full animate-in rounded-md border bg-popover text-popover-foreground shadow-md outline-none",
            isOpen ? "block" : "hidden",
          )}
        >
          <CommandList className="p-1">
            {isLoading && (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            )}
            {filteredOptions.length > 0 && !isLoading && (
              <CommandGroup className="overflow-hidden p-1 text-inherit [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-xs">
                {filteredOptions.map((option, idx) => {
                  const isSelected = selected?.value === option.value;
                  return [
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      data-value={option.value}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                        !isSelected ? "pl-8" : null,
                      )}
                    >
                      {isSelected ? <Check className="mr-2 w-4" /> : null}
                      {option.label}
                    </CommandItem>,
                    idx < filteredOptions.length - 1 && (
                      <div
                        key={option.value + "-divider"}
                        className="mx-2 my-0.5 h-px bg-border dark:bg-border/60"
                        aria-hidden="true"
                      />
                    ),
                  ];
                })}
              </CommandGroup>
            )}
            {!isLoading && (
              <CommandPrimitive.Empty className="py-6 text-center text-muted-foreground text-sm">
                {emptyMessage}
              </CommandPrimitive.Empty>
            )}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
