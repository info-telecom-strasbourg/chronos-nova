"use client";

import { Button } from "@chronos/ui/components/button";
import { cn } from "@chronos/ui/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export type ThemeToggleProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
>;

export const ThemeToggle = ({
  variant = "ghost",
  size = "default",
  className,
  ...props
}: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className={cn("relative", className)}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      size={size}
      variant={variant}
      {...props}
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
