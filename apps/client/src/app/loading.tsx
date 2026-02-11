import { InternshipListSkeleton } from "@/components/internship/internship-skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="w-full space-y-4">
        <div className="h-11 w-full animate-pulse rounded-md bg-muted-foreground/20" />
        <div className="flex gap-2">
          <div className="h-9 w-[100px] animate-pulse rounded-md bg-muted-foreground/20" />
          <div className="h-9 w-[140px] animate-pulse rounded-md bg-muted-foreground/20" />
          <div className="h-9 w-[140px] animate-pulse rounded-md bg-muted-foreground/20" />
        </div>
        <div className="h-9 w-[180px] animate-pulse rounded-md bg-muted-foreground/20" />
      </div>
      <InternshipListSkeleton />
    </div>
  );
}
