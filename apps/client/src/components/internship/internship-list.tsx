"use client";

import { Skeleton } from "@chronos/ui/components/skeleton";
import { useInternships } from "@/hooks/use-internships";
import { pluralize } from "@/lib/utils";
import {
  DoneInternshipCard,
  InternshipCard,
  NoInternshipCard,
} from "./internship-card";
import { InternshipPaginationSkeleton } from "./internship-skeleton";

export function InternshipList() {
  const {
    internships,
    totalItems,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    sentinelRef,
  } = useInternships();

  if (isPending) {
    return (
      <>
        <Skeleton className="h-5 w-32" />
        <ul className="space-y-4">
          <InternshipPaginationSkeleton count={10} />
        </ul>
      </>
    );
  }

  if (totalItems === 0) {
    return <NoInternshipCard />;
  }

  return (
    <>
      <p className="text-muted-foreground text-sm">
        {pluralize(totalItems, "stage trouvé", "stages trouvés")}
      </p>
      <ul className="space-y-4">
        {internships.map((internship) => (
          <InternshipCard key={internship.id} internship={internship} />
        ))}
        {isFetchingNextPage && <InternshipPaginationSkeleton count={3} />}
        {hasNextPage && <div ref={sentinelRef} />}
        {!hasNextPage && <DoneInternshipCard />}
      </ul>
    </>
  );
}
