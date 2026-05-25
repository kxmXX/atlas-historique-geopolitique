"use client";

import { CookieConsent } from "@/components/Layout/CookieConsent";
import { ThemeProvider } from "@/contexts/ThemeContext";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <CookieConsent />
    </ThemeProvider>
  );
}
