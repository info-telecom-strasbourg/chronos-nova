"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

export const ALL_COLUMNS = [
  { key: "subject", label: "Sujet / Organisation" },
  { key: "formation", label: "Formation" },
  { key: "location", label: "Localisation" },
  { key: "period", label: "Période" },
  { key: "status", label: "Statut" },
] as const;

export type ColumnKey = (typeof ALL_COLUMNS)[number]["key"];

export function useColumnVisibility() {
  const [hidden, setHidden] = useQueryState(
    "cols",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const isVisible = (key: ColumnKey) => !hidden.includes(key);

  function toggleColumn(key: ColumnKey) {
    setHidden((prev) => {
      const next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      return next.length === ALL_COLUMNS.length ? prev : next;
    });
  }

  function resetColumns() {
    setHidden(null);
  }

  return { isVisible, toggleColumn, resetColumns, hidden };
}
