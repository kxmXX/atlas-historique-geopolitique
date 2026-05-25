"use client";

import { useEffect } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

export function AdBanner() {
  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      /* AdSense blocked or not available */
    }
  }, []);

  /* Don't render anything if no AdSense client ID is configured */
  if (!ADSENSE_CLIENT) {
    return (
      <aside className="absolute bottom-4 left-1/2 hidden w-[min(728px,calc(100%-32px))] -translate-x-1/2 rounded-md border bg-background/92 px-4 py-2 text-center text-xs text-muted-foreground shadow-sm backdrop-blur md:block">
        Publicité &mdash; activable via <code>NEXT_PUBLIC_ADSENSE_CLIENT</code>
      </aside>
    );
  }

  return (
    <aside className="absolute bottom-4 left-1/2 hidden w-[min(728px,calc(100%-32px))] -translate-x-1/2 md:block">
      <ins
        className="adsbygoogle block"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOT ?? "auto"}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
        style={{ display: "block", height: 90 }}
      />
    </aside>
  );
}
