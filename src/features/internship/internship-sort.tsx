import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortInternshipButton({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Date de début" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Trier par :</SelectLabel>
          <SelectItem value="most-recent">Date de début</SelectItem>
          <SelectItem value="organization">Nom</SelectItem>
          <SelectItem value="duration">Durée</SelectItem>
          <SelectItem value="location">Lieu</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
