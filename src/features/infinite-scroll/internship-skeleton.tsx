import { Skeleton } from "@/components/ui/skeleton";

// TODO: Reimplement this component in loading state
export type InternshipCardSkeletonProps = {
  admin?: boolean;
};

export function InternshipCardSkeleton({ admin = false }: InternshipCardSkeletonProps) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm">
      {/* Header */}
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 border-b px-6 pb-6">
        <Skeleton className="h-8 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        <div className="mb-7 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Grid info */}
        <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
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
            <Skeleton className="size-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 px-6 sm:justify-between">
        {admin && (
          <div className="flex gap-2">
            <Skeleton className="h-10 w-26" />
            <Skeleton className="h-10 w-30" />
          </div>
        )}
        <div className="sm:ml-auto">
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}

export function InternshipListSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4" style={{ zIndex: 1 }}>
      {/* Cards skeleton */}
      {[1, 2, 3].map((i) => (
        <InternshipCardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}
