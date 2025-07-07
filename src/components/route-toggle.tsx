"use client";

import { GraduationCap, Shield } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RouteToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname.startsWith("/admin");

  const handleToggle = () => {
    if (isAdmin) {
      router.push("/");
    } else {
      router.push("/admin");
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleToggle} className="flex items-center gap-2">
      {isAdmin ? (
        <>
          <GraduationCap className="size-4" />
          Vue Étudiant
        </>
      ) : (
        <>
          <Shield className="size-4" />
          Vue Admin
        </>
      )}
    </Button>
  );
}
