"use client";
import type { Country } from "@/features/internship/country-dropdown";
import { countries } from "country-data-list";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  if (selectedYears.length === years.length) {
    setSelectedYears([]);
  }

  return (
    <Card className="mx-auto flex w-full max-w-screen-md justify-center">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter /> Filtres
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Pays
              <SlidersHorizontal />
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Année
              <SlidersHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {years.map((year) => (
                <DropdownMenuCheckboxItem
                  key={year}
                  checked={selectedYears.includes(year)}
                  onCheckedChange={() =>
                    setSelectedYears((prev) =>
                      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
                    )
                  }
                  onSelect={(e) => e.preventDefault()}
                >
                  {year}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Diplôme
              <SlidersHorizontal />
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Type de stage
              <SlidersHorizontal />
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
        <Button
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <X /> Réinitialiser
        </Button>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {selectedYears.map((year) => (
          <Badge key={year} variant="outline">
            {year} <X />
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}
