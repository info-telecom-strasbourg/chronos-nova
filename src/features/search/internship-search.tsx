"use client";

import { Search, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InternshipSearch() {
  const [value, setValue] = useQueryState("q", {
    defaultValue: "",
  });

  const handleClear = () => {
    setValue("");
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          placeholder={"Rechercher..."}
          className="h-11 w-full pr-10 pl-10"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="-translate-y-1/2 absolute top-1/2 right-2 size-7 rounded-md p-0"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
