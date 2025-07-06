import type { PageParams } from "@/types/next";
import { Suspense } from "react";
import { getInternshipsQuery } from "@/features/infinite-scroll/internship.query";
import { InternshipInfiniteScroll } from "@/features/infinite-scroll/internship-infinite-scroll";
import { InternshipHeader } from "@/features/search/internship-header";

export default async function RoutePage({ searchParams }: PageParams) {
  const { data: internships } = await getInternshipsQuery(await searchParams);

  if (!internships) throw new Error("Implement error handling");
  return (
    <div className="space-y-8">
      <InternshipHeader />
      {/* TODO: Implement Skeleton */}
      <Suspense fallback={<div>TODO: Implement Skeleton</div>}>
        <InternshipInfiniteScroll initialInternships={internships} />
      </Suspense>
    </div>
  );
}
