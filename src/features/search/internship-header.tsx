import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InternshipFilter } from "@/features/search/internship-filter";
import { InternshipSearch } from "@/features/search/internship-search";
import { SortInternshipButton } from "@/features/search/internship-sort";

export type InternshipHeaderProps = {
  admin?: boolean;
};

export function InternshipHeader({ admin = false }: InternshipHeaderProps) {
  return (
    <div className="w-full space-y-4">
      {admin && (
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/create">
              <Plus className="size-4" />
              Ajouter un stage
            </Link>
          </Button>
        </div>
      )}
      <InternshipSearch />
      <InternshipFilter />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="hidden text-muted-foreground text-sm sm:block">Trier par :</p>
          <SortInternshipButton />
        </div>
      </div>
    </div>
  );
}
