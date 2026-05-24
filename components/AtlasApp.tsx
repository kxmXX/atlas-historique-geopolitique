"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import { Header } from "@/components/Layout/Header";
import { Sidebar } from "@/components/Layout/Sidebar";
import { AdBanner } from "@/components/Layout/AdBanner";
import { WorldMap, type TerritoryHover, type TerritorySelection } from "@/components/Map/WorldMap";
import { Globe3D, type GlobeHover, type GlobeSelection } from "@/components/Map/Globe3D";
import { TerritorySheet } from "@/components/InfoPanel/TerritorySheet";
import { ViewToggle, type ViewMode } from "@/components/Controls/ViewToggle";
import { themes, defaultThemeId } from "@/lib/theme-data";

export function AtlasApp() {
  const [themeId, setThemeId] = useState(defaultThemeId);
  const [year, setYear] = useState(1900);
  const [viewMode, setViewMode] = useState<ViewMode>("globe");
  const [hoveredTerritory, setHoveredTerritory] = useState<TerritoryHover | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritorySelection | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const activeTheme = useMemo(
    () => themes.find((theme) => theme.id === themeId) ?? themes[0],
    [themeId]
  );

  /* Track mouse position in the map section for globe tooltip positioning */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  /* Globe hover: the Globe3D component gives us name/iso3 but not screen coords.
     We use the tracked mouse position for the tooltip. */
  const handleGlobeHover = useCallback((territory: GlobeHover | null) => {
    if (!territory) {
      setHoveredTerritory(null);
      return;
    }
    setHoveredTerritory({
      name: territory.name,
      iso3: territory.iso3,
      point: mousePos
    });
  }, [mousePos]);

  const handleGlobeSelect = useCallback((territory: GlobeSelection) => {
    setSelectedTerritory({
      name: territory.name,
      iso3: territory.iso3,
      properties: territory.properties
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[360px_minmax(0,1fr)]">
        <Sidebar
          activeTheme={activeTheme}
          themeId={themeId}
          year={year}
          viewMode={viewMode}
          onThemeChange={setThemeId}
          onYearChange={setYear}
          onViewModeChange={setViewMode}
        />
        <section
          ref={mapSectionRef}
          className="relative min-h-[620px] overflow-hidden border-t bg-card lg:border-l lg:border-t-0"
          onMouseMove={handleMouseMove}
        >
          {viewMode === "globe" ? (
            <Globe3D
              themeId={themeId}
              onHover={handleGlobeHover}
              onSelect={handleGlobeSelect}
            />
          ) : (
            <WorldMap
              themeId={themeId}
              year={year}
              onHover={setHoveredTerritory}
              onSelect={setSelectedTerritory}
            />
          )}
          {hoveredTerritory ? (
            <div
              className="pointer-events-none absolute z-30 rounded-md border bg-popover px-3 py-2 text-xs shadow-lg"
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
