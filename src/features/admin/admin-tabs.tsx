"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminTabsProps {
  pendingCount?: number;
}

export function AdminTabs({ pendingCount = 0 }: AdminTabsProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveTab = () => {
    if (pathname === "/admin") return "visible";
    if (pathname === "/admin/pending") return "draft";
    if (pathname === "/admin/deleted") return "deleted";
    return "visible";
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case "visible":
        router.push("/admin");
        break;
      case "draft":
        router.push("/admin/pending");
        break;
      case "deleted":
        router.push("/admin/deleted");
        break;
    }
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

      <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 sm:w-auto">
          <TabsTrigger value="visible">Actifs</TabsTrigger>
          <TabsTrigger value="draft" className="relative">
            En attente
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="deleted">Supprimés</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
