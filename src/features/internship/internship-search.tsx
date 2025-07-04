"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type InternshipSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function InternshipSearch({ value, onChange }: InternshipSearchProps) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="space-y-2 w-full">
      <div className="relative">
        <Search className="top-1/2 left-3 absolute size-4 text-muted-foreground -translate-y-1/2 pointer-events-none" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          placeholder={"Rechercher..."}
          className="pr-10 pl-10 w-full h-11"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="top-1/2 right-2 absolute p-0 rounded-md size-7 -translate-y-1/2"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
