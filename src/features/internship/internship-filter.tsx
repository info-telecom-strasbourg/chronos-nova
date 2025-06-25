"use client";
import { countries } from "country-data-list";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Country } from "@/features/internship/country-dropdown";
import { CountryMultiSelectDropdown } from "@/features/internship/country-dropdown";
import { MultiSelectCombobox } from "@/features/internship/multi-select-combobox";
import { SelectedDisplay } from "./selected-display";

const organizations = ["Entreprise", "Hors entreprise"];

const years = ["1A", "2A", "3A"];

const degrees = ["Généraliste", "TI Santé", "IR"];

const countryOptions = countries.all.filter(
  (country) => country.emoji && country.status !== "deleted" && country.ioc !== "PRK",
);

export function InternshipFilter() {
  const [selectedYears, setSelectedYears] = useState<string[]>([...years]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([...degrees]);
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([...organizations]);
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([...countryOptions]);

  // Fonction pour tout réinitialiser
  const resetFilters = () => {
    setSelectedYears([...years]);
    setSelectedDegrees([...degrees]);
    setSelectedOrganizations([...organizations]);
    setSelectedCountries([...countryOptions]);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-max">
        <div className="border border-gray-300 bg-white/90 rounded-xl shadow-md px-6 py-6 w-max">
          <div
            className="
        grid
        grid-cols-1
        [@media(min-width:500px)]:grid-cols-2
        gap-6
        items-center
        w-full
        [@media(min-width:1150px)]:flex
        [@media(min-width:1150px)]:flex-row
        [@media(min-width:1150px)]:gap-6
        [@media(min-width:1150px)]:items-center
        [@media(min-width:1150px)]:grid-cols-none
    "
          >
            <span
              className="
            font-semibold whitespace-nowrap text-center mb-6
            [@media(min-width:500px)]:col-span-2
            [@media(min-width:1150px)]:col-span-1
            [@media(min-width:1150px)]:mb-5
            [@media(min-width:1150px)]:text-left
        "
            >
              Filtrer par :
            </span>
            <div className="flex flex-col items-center">
              <CountryMultiSelectDropdown
                options={countryOptions}
                value={selectedCountries}
                onChange={setSelectedCountries}
                placeholder="Pays"
              />
              <SelectedDisplay
                selectedCount={selectedCountries.length}
                totalCount={countryOptions.length}
              />
            </div>
            <div className="flex flex-col items-center">
              <MultiSelectCombobox
                placeholder="Année"
                options={years}
                value={selectedYears}
                onChange={setSelectedYears}
              />
              <SelectedDisplay selectedCount={selectedYears.length} totalCount={years.length} />
            </div>
            <div className="flex flex-col items-center">
              <MultiSelectCombobox
                placeholder="Diplôme"
                options={degrees}
                value={selectedDegrees}
                onChange={setSelectedDegrees}
              />
              <SelectedDisplay selectedCount={selectedDegrees.length} totalCount={degrees.length} />
            </div>
            <div className="flex flex-col items-center">
              <MultiSelectCombobox
                placeholder="Type"
                options={organizations}
                value={selectedOrganizations}
                onChange={setSelectedOrganizations}
              />
              <SelectedDisplay
                selectedCount={selectedOrganizations.length}
                totalCount={organizations.length}
              />
            </div>
            <div
              className="
            flex flex-col items-center justify-end w-full
            [@media(min-width:500px)]:col-span-2
            [@media(min-width:1150px)]:col-span-1
            [@media(min-width:1150px)]:mb-5
        "
            >
              <Button
                variant="destructive"
                onClick={resetFilters}
                className="w-full [@media(min-width:1150px)]:w-auto"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
