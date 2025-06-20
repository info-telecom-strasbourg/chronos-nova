import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { PropsWithChildren } from "react";
import { ThemeProvider } from "@/features/theme/theme-provider";

export type ProviderProps = PropsWithChildren;

export const Providers = ({ children }: ProviderProps) => {
  return (
    <NuqsAdapter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </NuqsAdapter>
  );
};
