import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const ResetFiltersButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/10"
      onClick={() => {
        router.replace("/");
      }}
    >
      <X /> Réinitialiser
    </Button>
  );
};
