"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { Sidebar } from "@/components/Layout/Sidebar";
import { AdBanner } from "@/components/Layout/AdBanner";
import { WorldMap, type TerritoryHover, type TerritorySelection } from "@/components/Map/WorldMap";
import { WorldGlobe } from "@/components/Map/WorldGlobe";
import { TerritorySheet } from "@/components/InfoPanel/TerritorySheet";
import { type ViewMode } from "@/components/Controls/ViewToggle";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { themes, defaultThemeId } from "@/lib/theme-data";
import { loadTheme } from "@/lib/theme-loader";
import type { Theme, Period } from "@/lib/types";
import { iso3ToIso2 } from "@/lib/centroids";
import { getFlagEmojiSafe } from "@/lib/flagEmoji";


export function AtlasApp() {
  const [themeId, setThemeId] = useState(defaultThemeId);
  const [year, setYear] = useState(1900);
  const [viewMode, setViewMode] = useState<ViewMode>("globe");
  const [hoveredTerritory, setHoveredTerritory] = useState<TerritoryHover | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritorySelection | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mapSectionRef = useRef<HTMLDivElement>(null);

  // Loaded full theme data
  const [themeData, setThemeData] = useState<Theme | null>(null);

  const yearRef = useRef(year);
  yearRef.current = year;

  // Load theme data dynamically
  useEffect(() => {
    loadTheme(themeId).then((data) => {
      if (data) {
        setThemeData(data);
        // Automatically snap year to the start of the first period if current year is out of bounds
        const periods = data.periods || [];
        if (periods.length > 0) {
          const firstPeriod = periods[0];
          const lastPeriod = periods[periods.length - 1];
          if (yearRef.current < firstPeriod.start || yearRef.current > lastPeriod.end) {
            setYear(firstPeriod.start);
          }
        }
      }
    });
  }, [themeId]);

  const activeThemeMeta = useMemo(
    () => themes.find((t) => t.id === themeId) ?? themes[0],
    [themeId]
  );

  // Calculate active period based on year
  const activePeriod = useMemo<Period | null>(() => {
    if (!themeData?.periods) return null;
    return themeData.periods.find((p) => year >= p.start && year <= p.end) ?? themeData.periods[0] ?? null;
  }, [themeData, year]);

  // Sync year boundaries when active theme metadata changes
  const periodBounds = useMemo<[number, number]>(() => {
    if (activeThemeMeta?.period && activeThemeMeta.period.length === 2) {
      return [activeThemeMeta.period[0], activeThemeMeta.period[1]];
    }
    return [1500, 2026];
  }, [activeThemeMeta]);

  /* Track mouse position in the map section for globe tooltip positioning */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleGlobeHover = useCallback(
    (territory: any | null) => {
      if (!territory) {
        setHoveredTerritory(null);
        return;
      }
      setHoveredTerritory({
        name: territory.name,
        iso3: territory.iso3,
        point: mousePos
      });
    },
    [mousePos]
  );

  const handleGlobeSelect = useCallback((territory: any) => {
    setSelectedTerritory({
      name: territory.name,
      iso3: territory.iso3,
      properties: territory.properties
    });
  }, []);

  const handleThemeChange = useCallback((id: string) => {
    setThemeId(id);
    setMobileOpen(false);
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-[#0a0a14] text-slate-100">
      <Header
        onMenuClick={() => setMobileOpen(true)}
        activeThemeLabel={activeThemeMeta.label}
        activeThemeColor={activeThemeMeta.color_primary}
        year={year}
      />
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[360px_minmax(0,1fr)]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block overflow-y-auto border-r border-slate-800 bg-[#0d0d1e]">
          <Sidebar
            activeTheme={activeThemeMeta}
            themeId={themeId}
            year={year}
            viewMode={viewMode}
            onThemeChange={setThemeId}
            onYearChange={setYear}
            onViewModeChange={setViewMode}
            periodBounds={periodBounds}
            themePeriods={themeData?.periods ?? []}
          />
        </div>

        {/* Mobile Sidebar Drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[320px] p-0 bg-[#0d0d1e] border-slate-800 text-slate-100 overflow-y-auto z-50">
            <div className="py-4">
              <Sidebar
                activeTheme={activeThemeMeta}
                themeId={themeId}
                year={year}
                viewMode={viewMode}
                onThemeChange={handleThemeChange}
                onYearChange={setYear}
                onViewModeChange={setViewMode}
                periodBounds={periodBounds}
                themePeriods={themeData?.periods ?? []}
              />
            </div>
          </SheetContent>
        </Sheet>

        <section
          ref={mapSectionRef}
          className="relative min-h-[620px] overflow-hidden border-t border-slate-800 bg-[#08080f] lg:border-l lg:border-t-0"
          onMouseMove={handleMouseMove}
        >
          {viewMode === "globe" && themeData ? (
            <WorldGlobe
              activeTheme={themeData}
              activePeriod={activePeriod}
              onCountryClick={handleGlobeSelect}
              onHover={handleGlobeHover}
            />
          ) : (
            <WorldMap
              activeTheme={themeData}
              activePeriod={activePeriod}
              year={year}
              onHover={setHoveredTerritory}
              onSelect={setSelectedTerritory}
            />
          )}
          {hoveredTerritory ? (() => {
            const iso2 = hoveredTerritory.iso3 ? (iso3ToIso2[hoveredTerritory.iso3.toUpperCase()] ?? "") : "";
            const flag = iso2 ? getFlagEmojiSafe(iso2) : "";
            return (
              <div
                className="pointer-events-none absolute z-30 animate-fade-in rounded-lg border bg-slate-950/95 px-3 py-2 text-xs text-white shadow-xl backdrop-blur-sm"
                style={{
                  left: hoveredTerritory.point.x + 14,
                  top: hoveredTerritory.point.y + 14,
                  borderColor: activeThemeMeta.color_primary + "60"
                }}
              >
                <p className="flex items-center gap-1.5 font-semibold text-slate-100">
                  {flag && <span className="text-base leading-none">{flag}</span>}
                  {hoveredTerritory.name}
                </p>
                {hoveredTerritory.iso3 && (
                  <p className="mt-0.5 text-muted-foreground">
                    <span className="rounded bg-slate-800 px-1 py-0.5 font-mono">{hoveredTerritory.iso3}</span>
                  </p>
                )}
              </div>
            );
          })() : null}

          <AdBanner />
        </section>
      </div>
      <TerritorySheet
        territory={selectedTerritory}
        theme={activeThemeMeta}
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
