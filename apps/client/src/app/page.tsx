import { Suspense } from "react";
import { InternshipHeader } from "@/components/internship/internship-header";
import { InternshipList } from "@/components/internship/internship-list";
import { InternshipListSkeleton } from "@/components/internship/internship-skeleton";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <InternshipHeader />
      <Suspense fallback={<InternshipListSkeleton />}>
        <InternshipList />
      </Suspense>
    </div>
  );
}
