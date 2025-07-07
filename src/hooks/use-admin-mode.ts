"use client";

import { usePathname } from "next/navigation";

export function useAdminMode() {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return {
    isAdmin,
    isStudent: !isAdmin,
  };
}
