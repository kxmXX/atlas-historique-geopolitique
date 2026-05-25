"use client";

import { Globe3D, type GlobeHover, type GlobeSelection } from "./Globe3D";
import type { Theme, Period } from "@/lib/types";
import { useCallback } from "react";

type WorldGlobeProps = {
  activeTheme: Theme;
  activePeriod: Period | null;
  onCountryClick: (territory: { name: string; iso3?: string; properties: Record<string, unknown> }) => void;
  onHover: (territory: GlobeHover | null) => void;
};

export function WorldGlobe({
  activeTheme,
  activePeriod,
  onCountryClick,
  onHover
}: WorldGlobeProps) {
  const handleSelect = useCallback(
    (sel: GlobeSelection) => {
      onCountryClick({
        name: sel.name,
        iso3: sel.iso3,
        properties: sel.properties
      });
    },
    [onCountryClick]
  );

  const actors = activePeriod?.actors ?? [];
  const themeColor = activeTheme.color_primary || "#e63946";

  return (
    <Globe3D
      themeId={activeTheme.theme_id}
      actors={actors}
      themeColor={themeColor}
      onHover={onHover}
      onSelect={handleSelect}
    />
  );
}
