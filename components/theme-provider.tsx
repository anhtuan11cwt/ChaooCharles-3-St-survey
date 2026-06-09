"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

// Wrapper next-themes để hỗ trợ dark mode
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
