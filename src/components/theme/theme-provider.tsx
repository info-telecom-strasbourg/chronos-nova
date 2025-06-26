"use client";

import type * as React from "react";
import type { PropsWithChildren } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export type ThemeProviderProps = PropsWithChildren &
  React.ComponentProps<typeof NextThemesProvider>;

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
