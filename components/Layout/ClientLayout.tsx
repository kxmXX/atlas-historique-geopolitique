"use client";

import { CookieConsent } from "@/components/Layout/CookieConsent";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CookieConsent />
    </>
  );
}
