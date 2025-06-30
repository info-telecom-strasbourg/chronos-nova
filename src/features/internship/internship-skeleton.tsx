import { Skeleton } from "@/components/ui/skeleton";

export function InternshipCardSkeleton() {
  return (
    <div className="space-y-4 rounded-lg border p-6">
      {/* Header */}
      <div className="space-y-2 border-b pb-4">
        <Skeleton className="h-8 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Grid info */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center pt-4 sm:justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export function InternshipListSkeleton() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4" style={{ zIndex: 1 }}>
      {/* Count and sort skeleton */}
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="hidden h-5 w-20 sm:block" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Cards skeleton */}
      <InternshipCardSkeleton key="skeleton-1" />
      <InternshipCardSkeleton key="skeleton-2" />
      <InternshipCardSkeleton key="skeleton-3" />
    </div>
  );
}
