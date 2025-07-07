import { Skeleton } from "@/components/ui/skeleton";

// TODO: Reimplement this component in loading state
export function InternshipCardSkeleton() {
  return (
    <div className="flex flex-col gap-6 bg-card shadow-sm py-6 border rounded-xl w-full text-card-foreground">
      {/* Header */}
      <div className="items-start gap-1.5 grid grid-rows-[auto_auto] auto-rows-min px-6 pb-6 border-b">
        <Skeleton className="w-3/4 h-8" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="w-24 h-4" />
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        <div className="space-y-2 mb-7">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-2/3 h-4" />
        </div>

        {/* Grid info */}
        <div className="gap-x-4 gap-y-2 grid grid-cols-1 sm:grid-cols-2 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-32 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-28 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-24 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center sm:justify-end items-center px-6">
        <Skeleton className="w-32 h-10" />
      </div>
    </div>
  );
}

export function InternshipListSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full" style={{ zIndex: 1 }}>
      {/* Cards skeleton */}
      {[1, 2, 3].map((i) => (
        <InternshipCardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}
