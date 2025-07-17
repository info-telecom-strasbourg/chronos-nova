import { AlertTriangle, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StageBadgesProps {
  isInvalid?: boolean;
  isDuplicate?: boolean;
}

export function StageBadges({ isInvalid, isDuplicate }: StageBadgesProps) {
  return (
    <div className="flex gap-1">
      {isInvalid && (
        <Badge variant="destructive">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Incomplet
        </Badge>
      )}
      {isDuplicate && (
        <Badge variant="destructive">
          <Copy className="mr-1 h-3 w-3" />
          Doublon
        </Badge>
      )}
    </div>
  );
}
