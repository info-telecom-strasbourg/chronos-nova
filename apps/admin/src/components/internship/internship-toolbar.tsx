"use client";

import { Button } from "@chronos/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@chronos/ui/components/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@chronos/ui/components/input-group";
import { Check, Columns2, RotateCcw, Search, X } from "lucide-react";
import {
  ALL_COLUMNS,
  type ColumnKey,
  useAdminFilters,
} from "@/hooks/use-admin-filters";

export function InternshipToolbar() {
  const {
    qInput,
    handleSearchChange,
    handleClearSearch,
    isVisible,
    toggleColumn,
    resetColumns,
    hiddenCols,
  } = useAdminFilters();

  return (
    <div className="flex items-center gap-2">
      <InputGroup className="max-w-sm">
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          placeholder="Rechercher par sujet, organisation, ville…"
          value={qInput}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <InputGroupButton disabled={!qInput} onClick={handleClearSearch}>
          <X />
        </InputGroupButton>
      </InputGroup>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="ml-auto gap-1.5">
              <Columns2 className="size-4" />
              Colonnes
              {hiddenCols.length > 0 && (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground leading-none">
                  {hiddenCols.length}
                </span>
              )}
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          {ALL_COLUMNS.map(({ key, label }) => {
            const visible = isVisible(key as ColumnKey);
            return (
              <DropdownMenuItem
                key={key}
                onSelect={(e) => {
                  e.preventDefault();
                  toggleColumn(key as ColumnKey);
                }}
                className="gap-2"
              >
                <span
                  className={
                    visible
                      ? "text-foreground"
                      : "text-muted-foreground line-through"
                  }
                >
                  {label}
                </span>
                {visible && <Check className="ml-auto size-3.5 text-primary" />}
              </DropdownMenuItem>
            );
          })}
          {hiddenCols.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={resetColumns} className="gap-2">
                <RotateCcw className="size-3.5" />
                Réinitialiser
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
