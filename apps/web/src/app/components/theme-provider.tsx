"use client";

import { ComponentPropsWithoutRef } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export type ThemeProviderProps = ComponentPropsWithoutRef<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
};
