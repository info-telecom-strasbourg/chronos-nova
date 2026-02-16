import { Skeleton } from "@chronos/ui/components/skeleton";

export function InternshipCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl bg-card py-4 text-card-foreground ring-1 ring-foreground/10">
      <div className="grid auto-rows-min items-start gap-1 px-4">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-3.5" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-20 rounded-4xl" />
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 px-4">
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-3.5" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-3.5" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-3.5" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-3.5" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function InternshipPaginationSkeleton({ count }: { count: number }) {
  return (
    <div className="flex w-full flex-col gap-4">
      {Array.from({ length: count }, (_, i) => (
        <InternshipCardSkeleton key={i} />
      ))}
    </div>
  );
}
