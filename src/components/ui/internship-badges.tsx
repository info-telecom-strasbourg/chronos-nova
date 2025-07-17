import { AlertTriangle, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type InternshipState = "visible" | "draft" | "deleted";

interface InternshipBadgesProps {
  state: InternshipState;
  isInvalid?: boolean;
  isDuplicate?: boolean;
  showState?: boolean;
}

export function InternshipBadges({
  state,
  isInvalid,
  isDuplicate,
  showState = true,
}: InternshipBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {showState && <StateBadge state={state} />}
      {state === "draft" && <ValidationBadges isInvalid={isInvalid} isDuplicate={isDuplicate} />}
    </div>
  );
}

/**
 * Badge pour l'état du stage
 */
function StateBadge({ state }: { state: InternshipState }) {
  const stateConfig = {
    visible: { label: "Actif", variant: "default" as const },
    draft: { label: "En attente", variant: "outline" as const },
    deleted: { label: "Supprimé", variant: "destructive" as const },
  };

  const config = stateConfig[state];
  return config ? <Badge variant={config.variant}>{config.label}</Badge> : null;
}

/**
 * Badges de validation (incomplet et doublon)
 */
function ValidationBadges({
  isInvalid,
  isDuplicate,
}: {
  isInvalid?: boolean;
  isDuplicate?: boolean;
}) {
  return (
    <>
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
    </>
  );
}
