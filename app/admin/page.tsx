import { Suspense } from "react";
import { AdminTabs } from "@/features/admin/admin-tabs";
import { getInternshipsCount } from "@/features/infinite-scroll/internship.query";
import { InternshipInfiniteScroll } from "@/features/infinite-scroll/internship-infinite-scroll";
import { InternshipListSkeleton } from "@/features/infinite-scroll/internship-skeleton";
import { InternshipHeader } from "@/features/search/internship-header";

export default async function AdminPage() {
  const pendingCount = await getInternshipsCount("draft");

  return (
    <div className="container mx-auto space-y-8 py-8">
      <AdminTabs pendingCount={pendingCount} />

      <div className="space-y-8">
        <InternshipHeader />
        <Suspense fallback={<InternshipListSkeleton admin actions={2} />}>
          <InternshipInfiniteScroll admin state="visible" />
        </Suspense>
      </div>
    </div>
  );
}
