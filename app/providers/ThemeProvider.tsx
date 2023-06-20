"use client";

import { ThemeProvider } from "next-themes";

interface ThemeProviderProps {
  children?: React.ReactNode;
}

export const NextThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
};
