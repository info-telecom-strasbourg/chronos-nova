"use client";

import { Button } from "@chronos/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@chronos/ui/components/input-group";
import { RotateCcw, Search, X } from "lucide-react";
import {
  ALL_COLUMNS,
  type ColumnKey,
  useAdminFilters,
} from "@/hooks/use-admin-filters";
import {
  FilterDropdown,
  FilterDropdownBase,
  type FilterDropdownOption,
} from "./filter-dropdown";

const ORG_TYPE_LABELS: Record<string, string> = {
  company: "Entreprise",
  not_company: "Hors entreprise",
};

export interface ToolbarFilterOptions {
  academicYears: string[];
  majors: string[];
  options: string[];
  countries: string[];
  cities: string[];
  organizationTypes: string[];
}

function toOpts(
  values: string[],
  labelFn?: (v: string) => string,
): FilterDropdownOption[] {
  return values.map((v) => ({ value: v, label: labelFn ? labelFn(v) : v }));
}

export function InternshipToolbar({
  filterOptions,
}: {
  filterOptions: ToolbarFilterOptions;
}) {
  const {
    qInput,
    handleSearchChange,
    handleClearSearch,
    isVisible,
    toggleColumn,
    resetColumns,
    hiddenCols,
    hasFilters,
    handleReset,
  } = useAdminFilters();

  const columnOptions: FilterDropdownOption[] = ALL_COLUMNS.map(
    ({ key, label }) => ({
      value: key,
      label,
    }),
  );

  const visibleKeys = ALL_COLUMNS.map((c) => c.key).filter((k) =>
    isVisible(k as ColumnKey),
  );

  return (
    <div className="space-y-2">
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

        <div className="ml-auto flex items-center gap-2">
          <FilterDropdownBase
            label="Colonnes"
            options={columnOptions}
            selected={visibleKeys}
            onToggle={(key) => toggleColumn(key as ColumnKey)}
            allLabel="Toutes"
          />
          {hiddenCols.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetColumns}
              className="gap-1.5 text-xs"
            >
              <RotateCcw className="size-3" />
              Colonnes
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="w-36">
          <FilterDropdown
            param="year"
            label="Année"
            options={toOpts(filterOptions.academicYears)}
          />
        </div>
        <div className="w-40">
          <FilterDropdown
            param="major"
            label="Diplôme"
            options={toOpts(filterOptions.majors)}
          />
        </div>
        <div className="w-36">
          <FilterDropdown
            param="option"
            label="Filière"
            options={toOpts(filterOptions.options, (v) => v.toUpperCase())}
          />
        </div>
        <div className="w-40">
          <FilterDropdown
            param="country"
            label="Pays"
            options={toOpts(filterOptions.countries)}
          />
        </div>
        <div className="w-40">
          <FilterDropdown
            param="city"
            label="Ville"
            options={toOpts(filterOptions.cities)}
          />
        </div>
        <div className="w-44">
          <FilterDropdown
            param="orgType"
            label="Type"
            options={toOpts(
              filterOptions.organizationTypes,
              (v) => ORG_TYPE_LABELS[v] ?? v,
            )}
          />
        </div>

        {hasFilters && (
          <Button
            variant="destructive"
            size="sm"
            className="mb-0.5 gap-1.5"
            onClick={handleReset}
          >
            <RotateCcw className="size-3" />
            Réinitialiser
          </Button>
        )}
      </div>
    </div>
  );
}
