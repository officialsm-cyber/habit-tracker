"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

// ใช้ ReactNode ซึ่งเป็น Type มาตรฐานของ React แทนการดึงจาก next-themes โดยตรง
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
