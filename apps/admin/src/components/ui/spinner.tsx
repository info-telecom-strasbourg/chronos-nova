import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Spinner component that displays a loading spinner with optional text.
 * The base code is inspired by:
 * https://github.com/hsuanyi-chou/shadcn-ui-expansions/blob/main/components/ui/spinner.tsx
 */

const loaderVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      sm: "size-6",
      md: "size-8",
      lg: "size-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface SpinnerContentProps extends VariantProps<typeof loaderVariants> {
  className?: string;
}

export function Spinner({ size, className }: SpinnerContentProps) {
  return (
    <>
      <Loader2 className={cn(loaderVariants({ size }), className)} />
      <span className="sr-only">Loading...</span>
    </>
  );
}
