import { Suspense } from "react";
import { InternshipInfiniteScroll } from "@/features/infinite-scroll/internship-infinite-scroll";
import { InternshipListSkeleton } from "@/features/infinite-scroll/internship-skeleton";
import { InternshipHeader } from "@/features/search/internship-header";

export default function RoutePage() {
  return (
    <div className="space-y-8">
      <InternshipHeader />
      <Suspense fallback={<InternshipListSkeleton />}>
        <InternshipInfiniteScroll />
      </Suspense>
    </div>
  );
}
