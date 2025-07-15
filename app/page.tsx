import { Suspense } from "react";
import { InternshipInfiniteScroll } from "@/features/infinite-scroll/internship-infinite-scroll";
import { InternshipListSkeleton } from "@/features/infinite-scroll/internship-skeleton";
import { InternshipHeader } from "@/features/search/internship-header";

interface RoutePageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function RoutePage({ searchParams }: RoutePageProps) {
  const params = await searchParams;
  return (
    <div className="space-y-8">
      <InternshipHeader />
      <Suspense fallback={<InternshipListSkeleton />}>
        <InternshipInfiniteScroll state="visible" />
      </Suspense>
    </div>
  );
}
