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

const degrees = ["Généraliste", "TI Santé", "IR"];

export const DegreeFilter = () => {
  const [selectedDegrees, setSelectedDegrees] = useQueryState(
    "degrees",
    parseAsArrayOf(parseAsString),
  );

  const values = selectedDegrees || undefined;
  const onValuesChange = useCallback(
    (values: string[]) => {
      setSelectedDegrees(values.length ? values : null);
    },
    [setSelectedDegrees],
  );

  return (
    <MultiSelect values={values} onValuesChange={onValuesChange}>
      <MultiSelectTrigger className="min-w-44">
        <MultiSelectValue placeholder="Diplôme" />
      </MultiSelectTrigger>
      <MultiSelectContent search={false}>
        <MultiSelectGroup>
          {degrees.map((degree) => {
            return (
              <MultiSelectItem key={degree} value={degree}>
                {degree}
              </MultiSelectItem>
            );
          })}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
};
