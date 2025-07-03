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

const organizations = ["Entreprise", "Hors entreprise"];

export const OrganizationFilter = () => {
  const [selectedOrganizations, setSelectedOrganizations] = useQueryState(
    "organization",
    parseAsArrayOf(parseAsString),
  );

  const values = selectedOrganizations || undefined;
  const onValuesChange = useCallback(
    (values: string[]) => {
      setSelectedOrganizations(values.length ? values : null);
    },
    [setSelectedOrganizations],
  );

  return (
    <MultiSelect values={values} onValuesChange={onValuesChange}>
      <MultiSelectTrigger className="min-w-40">
        <MultiSelectValue placeholder="Type de stage" />
      </MultiSelectTrigger>
      <MultiSelectContent search={false}>
        <MultiSelectGroup>
          {organizations.map((organization) => {
            return (
              <MultiSelectItem key={organization} value={organization}>
                {organization}
              </MultiSelectItem>
            );
          })}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
};
