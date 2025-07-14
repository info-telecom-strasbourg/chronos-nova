"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminTabsProps {
  pendingCount?: number;
}

export function AdminTabs({ pendingCount = 0 }: AdminTabsProps) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === "/admin") return "visible";
    if (pathname === "/admin/pending") return "draft";
    if (pathname === "/admin/deleted") return "deleted";
    return "visible";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-3xl">Administration des stages</h1>
          <p className="text-muted-foreground">Gérez tous les stages de l'application</p>
        </div>
        <Button asChild>
          <Link href="/admin/create" className="flex items-center gap-2">
            <Plus className="size-4" />
            Ajouter un stage
          </Link>
        </Button>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-2">
        <Button
          asChild
          variant={getActiveTab() === "visible" ? "default" : "outline"}
          className="flex-1 justify-center text-center"
        >
          <Link href="/admin">Actifs</Link>
        </Button>
        <Button
          asChild
          variant={getActiveTab() === "draft" ? "default" : "outline"}
          className="relative flex-1 justify-center text-center"
        >
          <Link href="/admin/pending">
            En attente
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {pendingCount}
              </Badge>
            )}
          </Link>
        </Button>
        <Button
          asChild
          variant={getActiveTab() === "deleted" ? "default" : "outline"}
          className="flex-1 justify-center text-center"
        >
          <Link href="/admin/deleted">Supprimés</Link>
        </Button>
      </div>
    </div>
  );
}
