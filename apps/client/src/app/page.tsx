import { Suspense } from "react";
import { InternshipHeader } from "@/components/internship/internship-header";
import { InternshipList } from "@/components/internship/internship-list";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Suspense>
        <InternshipHeader />
        <InternshipList />
      </Suspense>
    </div>
  );
}
