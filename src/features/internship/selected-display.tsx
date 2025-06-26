export function SelectedDisplay({
  selectedCount,
  totalCount,
}: {
  selectedCount: number;
  totalCount: number;
}) {
  return (
    <div className="mt-1 pl-1 text-gray-500 text-xs">
      {selectedCount === totalCount
        ? "Tout sélectionné"
        : `${selectedCount} sélectionné${selectedCount > 1 ? "s" : ""}`}
    </div>
  );
}
