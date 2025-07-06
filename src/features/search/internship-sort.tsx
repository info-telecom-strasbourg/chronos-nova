import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_SORT_STATE = "most-recent";
const DEFAULT_ORDER_STATE = "asc";

const options = [
  { value: "most-recent", label: "Date de début" },
  { value: "organization", label: "Nom" },
  { value: "duration", label: "Durée" },
  { value: "location", label: "Lieu" },
];

export function SortInternshipButton() {
  const [sort, setSort] = useQueryState("sort", {
    defaultValue: DEFAULT_SORT_STATE,
  });
  const [order, setOrder] = useQueryState("order", {
    defaultValue: DEFAULT_ORDER_STATE,
  });

  function handleValueChange(optionValue: string) {
    if (optionValue === sort) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(optionValue);
      setOrder(DEFAULT_ORDER_STATE);
    }
  }

  return (
    <Select value={sort} onValueChange={handleValueChange} allowReselect={true}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            <span className="flex items-center gap-2">
              {order === "desc" && opt.value === sort ? (
                <ArrowDownNarrowWide className="size-4" />
              ) : (
                <ArrowUpNarrowWide className="size-4" />
              )}
              {opt.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
