"use client";

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 20;

export const ALL_COLUMNS = [
  { key: "subject", label: "Sujet / Organisation" },
  { key: "organization", label: "Organisation" },
  { key: "formation", label: "Formation" },
  { key: "location", label: "Localisation" },
  { key: "period", label: "Période" },
  { key: "status", label: "Statut" },
] as const;

export type ColumnKey = (typeof ALL_COLUMNS)[number]["key"];

export type SortField =
  | "subject"
  | "organization"
  | "academicYear"
  | "country"
  | "beginDate";
export type SortDir = "asc" | "desc";

const ALL_SORT_FIELDS: SortField[] = [
  "subject",
  "organization",
  "academicYear",
  "country",
  "beginDate",
];

function parseMulti(raw: string) {
  return raw ? raw.split(",").filter(Boolean) : [];
}

export function useAdminFilters() {
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));
  const [qInput, setQInput] = useState(q);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
  );

  const [yearRaw, setYearRaw] = useQueryState(
    "year",
    parseAsString.withDefault(""),
  );
  const [majorRaw, setMajorRaw] = useQueryState(
    "major",
    parseAsString.withDefault(""),
  );
  const [optionRaw, setOptionRaw] = useQueryState(
    "option",
    parseAsString.withDefault(""),
  );
  const [countryRaw, setCountryRaw] = useQueryState(
    "country",
    parseAsString.withDefault(""),
  );
  const [cityRaw, setCityRaw] = useQueryState(
    "city",
    parseAsString.withDefault(""),
  );
  const [orgTypeRaw, setOrgTypeRaw] = useQueryState(
    "orgType",
    parseAsString.withDefault(""),
  );

  const [hiddenCols, setHiddenCols] = useQueryState(
    "cols",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [sortField, setSortField] = useQueryState(
    "sort",
    parseAsString.withDefault(""),
  );
  const [sortDir, setSortDir] = useQueryState(
    "dir",
    parseAsString.withDefault("asc"),
  );

  useEffect(() => {
    if (q !== qInput) setQInput(q);
  }, [q]);

  const debouncedSetQ = useDebouncedCallback((val: string) => {
    setQ(val || null);
    setPage(null);
  }, 300);

  function handleSearchChange(val: string) {
    setQInput(val);
    debouncedSetQ(val);
  }

  function handleClearSearch() {
    setQInput("");
    setQ(null);
    setPage(null);
  }

  function handlePageChange(p: number) {
    setPage(p === 0 ? null : p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLimitChange(l: number) {
    setLimit(l === DEFAULT_PAGE_SIZE ? null : l);
    setPage(null);
  }

  function handleReset() {
    setYearRaw(null);
    setMajorRaw(null);
    setOptionRaw(null);
    setCountryRaw(null);
    setCityRaw(null);
    setOrgTypeRaw(null);
    setPage(null);
  }

  function isVisible(key: ColumnKey) {
    return !hiddenCols.includes(key);
  }

  function toggleColumn(key: ColumnKey) {
    setHiddenCols((prev) => {
      const next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      return next.length === ALL_COLUMNS.length ? prev : next;
    });
  }

  function resetColumns() {
    setHiddenCols(null);
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(null);
  }

  const hasFilters = !!(
    yearRaw ||
    majorRaw ||
    optionRaw ||
    countryRaw ||
    cityRaw ||
    orgTypeRaw
  );

  return {
    qInput,
    q,
    page,
    limit,
    yearRaw,
    majorRaw,
    optionRaw,
    countryRaw,
    cityRaw,
    orgTypeRaw,
    setYearRaw: (v: string | null) => {
      setYearRaw(v);
      setPage(null);
    },
    setMajorRaw: (v: string | null) => {
      setMajorRaw(v);
      setPage(null);
    },
    setOptionRaw: (v: string | null) => {
      setOptionRaw(v);
      setPage(null);
    },
    setCountryRaw: (v: string | null) => {
      setCountryRaw(v);
      setPage(null);
    },
    setCityRaw: (v: string | null) => {
      setCityRaw(v);
      setPage(null);
    },
    setOrgTypeRaw: (v: string | null) => {
      setOrgTypeRaw(v);
      setPage(null);
    },
    handleSearchChange,
    handleClearSearch,
    handlePageChange,
    handleLimitChange,
    handleReset,
    hasFilters,
    years: parseMulti(yearRaw),
    majors: parseMulti(majorRaw),
    options: parseMulti(optionRaw),
    countries: parseMulti(countryRaw),
    cities: parseMulti(cityRaw),
    orgTypes: parseMulti(orgTypeRaw),
    hiddenCols,
    isVisible,
    toggleColumn,
    resetColumns,
    sortField: ALL_SORT_FIELDS.includes(sortField as SortField)
      ? (sortField as SortField)
      : null,
    sortDir: (sortDir === "desc" ? "desc" : "asc") as SortDir,
    handleSort,
  };
}
