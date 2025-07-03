"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useCallback } from "react";
import { CircleFlag } from "react-circle-flags";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { getCountryAlpha2Code, getCountryCode, getCountryName } from "@/lib/utils/countries";

const countries = ["fr", "be", "ch", "lu", "de", "es", "it", "nl", "pt", "gb"];

export const CountryFilter = () => {
  const [selectedCountries, setSelectedCountries] = useQueryState(
    "countries",
    parseAsArrayOf(parseAsString),
  );

  const values = selectedCountries?.length ? selectedCountries.map(getCountryName) : undefined;
  const onValuesChange = useCallback(
    (values: string[]) => {
      setSelectedCountries(values.length ? values.map(getCountryAlpha2Code) : null);
    },
    [setSelectedCountries],
  );

  return (
    <MultiSelect values={values} onValuesChange={onValuesChange}>
      <MultiSelectTrigger className="flex-3">
        <MultiSelectValue placeholder="Pays" />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectGroup>
          {countries.map((country) => {
            const [countryName, countryCode] = [getCountryName(country), getCountryCode(country)];
            return (
              <MultiSelectItem
                key={countryCode}
                value={countryName}
                badgeLabel={<CircleFlag countryCode={countryCode} height={20} className="size-3" />}
              >
                <CircleFlag countryCode={countryCode} height={20} className="size-6" />
                {countryName}
              </MultiSelectItem>
            );
          })}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
};
