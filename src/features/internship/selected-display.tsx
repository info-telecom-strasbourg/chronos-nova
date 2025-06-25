export function SelectedDisplay({
    selectedCount,
    totalCount,
}: {
    selectedCount: number;
    totalCount: number;
}) {
    return (
        <div className="text-xs text-gray-500 mt-1 pl-1">
            {selectedCount === totalCount
                ? "Tout sélectionné"
                : `${selectedCount} sélectionné${selectedCount > 1 ? "s" : ""}`}
        </div>
    );
}