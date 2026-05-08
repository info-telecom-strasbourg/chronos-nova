"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function useInternshipSearch() {
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
  const [input, setInput] = useState(search);

  useEffect(() => {
    if (search !== input) setInput(search);
  }, [search]);

  const debouncedSet = useDebouncedCallback((val: string) => {
    setSearch(val || null);
  }, 300);

  function handleChange(val: string) {
    setInput(val);
    debouncedSet(val);
  }

  function handleClear() {
    setInput("");
    setSearch(null);
  }

  return { input, search, handleChange, handleClear };
}
