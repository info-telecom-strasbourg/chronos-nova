import { Suspense } from "react";
import { getInternshipsCount } from "@/features/infinite-scroll/internship.query";
import { InternshipInfiniteScroll } from "@/features/infinite-scroll/internship-infinite-scroll";
import { InternshipListSkeleton } from "@/features/infinite-scroll/internship-skeleton";
import { InternshipHeader } from "@/features/search/internship-header";

export default async function RoutePage() {
  const totalInternships = await getInternshipsCount();
  return (
    <div className="space-y-8">
      <InternshipHeader />
      <Suspense fallback={<InternshipListSkeleton />}>
        <InternshipInfiniteScroll totalItems={totalInternships} />
      </Suspense>
    </div>
  );
}
