import { Suspense } from "react";
import { AdminInternshipHeader } from "@/features/admin/admin-internship-header";
import { AdminTabs } from "@/features/admin/admin-tabs";
import { getInternshipsCount } from "@/features/infinite-scroll/internship.query";
import { InternshipInfiniteScroll } from "@/features/infinite-scroll/internship-infinite-scroll";
import { InternshipListSkeleton } from "@/features/infinite-scroll/internship-skeleton";

export default async function AdminPage() {
  const pendingCount = await getInternshipsCount("draft");

  return (
    <div className="container mx-auto space-y-8 py-8">
      <AdminTabs pendingCount={pendingCount} />

      <div className="space-y-8">
        <AdminInternshipHeader />
        <Suspense fallback={<InternshipListSkeleton admin />}>
          <InternshipInfiniteScroll admin state="visible" />
        </Suspense>
      </div>
    </div>
  );
}
