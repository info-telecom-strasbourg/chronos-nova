"use client";

import { GraduationCap, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export const RouteToggle = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <Button variant="outline" size="sm" asChild className="flex items-center gap-2">
      <Link href={isAdmin ? "/" : "/admin"}>
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
      </Link>
    </Button>
  );
};
