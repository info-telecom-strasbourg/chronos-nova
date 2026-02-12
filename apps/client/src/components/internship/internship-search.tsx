"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@chronos/ui/components/input-group";
import { Search, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function InternshipSearch() {
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
  });
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    if (search !== searchInput) setSearchInput(search);
  }, [search]);

  const handleClear = () => {
    setSearch("");
  };

  const debouncedSetSearch = useDebouncedCallback((val: string) => {
    setSearch(val);
  }, 300);

  return (
    <InputGroup>
      <InputGroupInput
        type="text"
        placeholder="Rechercher..."
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          debouncedSetSearch(e.target.value);
        }}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupButton disabled={!searchInput} onClick={handleClear}>
        <X />
      </InputGroupButton>
    </InputGroup>
  );
}
