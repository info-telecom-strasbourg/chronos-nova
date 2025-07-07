"use client";

import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-6 p-4 min-h-[60vh]">
      <AlertTriangle className="size-12 text-destructive" />
      <h1 className="font-bold text-2xl">Page non trouvée</h1>
      <p className="text-muted-foreground text-center">
        La page que vous cherchez n’existe pas ou a été déplacée.
      </p>
      <Button
        onClick={() => {
          window.location.href = "/";
        }}
        className="w-full max-w-xs"
      >
        <Home className="mr-2 size-4" />
        Retourner à l’accueil
      </Button>
    </div>
  );
}
