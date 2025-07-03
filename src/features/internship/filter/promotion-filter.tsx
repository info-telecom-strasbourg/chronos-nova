"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useCallback } from "react";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";

const promotions = ["1A", "2A", "3A"];

export const PromotionFilter = () => {
  const [selectedPromotions, setSelectedPromotions] = useQueryState(
    "promotions",
    parseAsArrayOf(parseAsString),
  );

  const values = selectedPromotions || undefined;
  const onValuesChange = useCallback(
    (values: string[]) => {
      setSelectedPromotions(values.length ? values : null);
    },
    [setSelectedPromotions],
  );

  return (
    <MultiSelect values={values} onValuesChange={onValuesChange}>
      <MultiSelectTrigger className="min-w-44">
        <MultiSelectValue placeholder="Promotion" />
      </MultiSelectTrigger>
      <MultiSelectContent search={false}>
        <MultiSelectGroup>
          {promotions.map((promotion) => {
            return (
              <MultiSelectItem key={promotion} value={promotion}>
                {promotion}
              </MultiSelectItem>
            );
          })}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
};
