import { Suspense } from "react";
import { AdminTabs } from "@/features/admin/admin-tabs";
import { getInternshipsCount } from "@/features/infinite-scroll/internship.query";
import { InternshipInfiniteScroll } from "@/features/infinite-scroll/internship-infinite-scroll";
import { InternshipListSkeleton } from "@/features/infinite-scroll/internship-skeleton";
import { InternshipHeader } from "@/features/search/internship-header";

export default async function AdminPendingPage() {
  const totalInternships = await getInternshipsCount("draft");
  const pendingCount = await getInternshipsCount("draft");

  return (
    <div className="container mx-auto py-8">
      <AdminTabs pendingCount={pendingCount} />

      <div className="space-y-8">
        <InternshipHeader />
        <Suspense fallback={<InternshipListSkeleton admin />}>
          <InternshipInfiniteScroll totalItems={totalInternships} admin state="draft" />
        </Suspense>
      </div>
    </div>
  );
}
