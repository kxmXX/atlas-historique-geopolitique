"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Sidebar } from "@/components/Layout/Sidebar";
import { AdBanner } from "@/components/Layout/AdBanner";
import { WorldMap, type TerritoryHover, type TerritorySelection } from "@/components/Map/WorldMap";
import { TerritorySheet } from "@/components/InfoPanel/TerritorySheet";
import { themes, defaultThemeId } from "@/lib/theme-data";

export function AtlasApp() {
  const [themeId, setThemeId] = useState(defaultThemeId);
  const [year, setYear] = useState(1900);
  const [hoveredTerritory, setHoveredTerritory] = useState<TerritoryHover | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritorySelection | null>(null);

  const activeTheme = useMemo(
    () => themes.find((theme) => theme.id === themeId) ?? themes[0],
    [themeId]
  );

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[360px_minmax(0,1fr)]">
        <Sidebar
          activeTheme={activeTheme}
          themeId={themeId}
          year={year}
          onThemeChange={setThemeId}
          onYearChange={setYear}
        />
        <section className="relative min-h-[620px] overflow-hidden border-t bg-card lg:border-l lg:border-t-0">
          <WorldMap
            themeId={themeId}
            year={year}
            onHover={setHoveredTerritory}
            onSelect={setSelectedTerritory}
          />
          {hoveredTerritory ? (
            <div
              className="pointer-events-none absolute rounded-md border bg-popover px-3 py-2 text-xs shadow-lg"
              style={{
                left: hoveredTerritory.point.x + 14,
                top: hoveredTerritory.point.y + 14
              }}
            >
              <p className="font-medium">{hoveredTerritory.name}</p>
              <p className="text-muted-foreground">ISO3: {hoveredTerritory.iso3 ?? "n/a"}</p>
            </div>
          ) : null}
          <AdBanner />
        </section>
      </div>
      <TerritorySheet
        territory={selectedTerritory}
        theme={activeTheme}
        year={year}
        open={Boolean(selectedTerritory)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTerritory(null);
          }
        }}
      />
    </main>
  );
}
