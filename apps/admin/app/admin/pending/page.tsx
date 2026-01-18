import { Suspense } from "react";
import { AdminTabs } from "@/features/admin/admin-tabs";
import { AdminInternshipHeader } from "@/features/admin/admin-internship-header";
import { getInternshipsCount } from "@/features/infinite-scroll/internship.query";
import { InternshipInfiniteScroll } from "@/features/infinite-scroll/internship-infinite-scroll";
import { InternshipListSkeleton } from "@/features/infinite-scroll/internship-skeleton";

export default async function AdminPendingPage() {
  const pendingCount = await getInternshipsCount("draft");

  return (
    <div className="space-y-8 mx-auto py-8 container">
      <AdminTabs pendingCount={pendingCount} />
      <div className="space-y-8">
        <AdminInternshipHeader state="draft" />
        <Suspense fallback={<InternshipListSkeleton admin />}>
          <InternshipInfiniteScroll state="draft" admin />
        </Suspense>
      </div>
    </div>
  );
}
