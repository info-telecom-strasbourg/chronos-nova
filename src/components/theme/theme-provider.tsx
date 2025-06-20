"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import type { PropsWithChildren } from "react";

export type ThemeProviderProps = PropsWithChildren &
  React.ComponentProps<typeof NextThemesProvider>;

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
