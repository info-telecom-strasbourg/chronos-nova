import { Suspense } from "react";
import { InternshipHeader } from "@/components/internship/internship-header";
import { InternshipList } from "@/components/internship/internship-list";
import { InternshipSidebar } from "@/components/internship/internship-sidebar";

export default function HomePage() {
  return (
    <Suspense>
      <div className="space-y-6">
        <InternshipHeader />
      </div>
      <div className="mt-8 flex gap-8">
        <InternshipSidebar />
        <div className="min-w-0 flex-1">
          <InternshipList />
        </div>
      </div>
    </Suspense>
  );
}
