import { ThemeFilter } from "@/components/Controls/ThemeFilter";
import { TimelineSlider } from "@/components/Controls/TimelineSlider";
import { PeriodSelector } from "@/components/Controls/PeriodSelector";
import { CompareToggle } from "@/components/Controls/CompareToggle";
import { ViewToggle, type ViewMode } from "@/components/Controls/ViewToggle";
import { ResponsibilityChart } from "@/components/DataViz/ResponsibilityChart";
import { RankingPanel } from "@/components/DataViz/RankingPanel";
import { TimelineChart } from "@/components/DataViz/TimelineChart";
import { GlobalStats } from "@/components/DataViz/GlobalStats";
import type { ThemeMeta } from "@/lib/theme-data";
import type { Period } from "@/lib/types";

type SidebarProps = {
  activeTheme: ThemeMeta;
  themeId: string;
  year: number;
  viewMode: ViewMode;
  onThemeChange: (themeId: string) => void;
  onYearChange: (year: number) => void;
  onViewModeChange: (mode: ViewMode) => void;
  periodBounds: [number, number];
  themePeriods: Period[];
};

export function Sidebar({
  activeTheme,
  themeId,
  year,
  viewMode,
  onThemeChange,
  onYearChange,
  onViewModeChange,
  periodBounds,
  themePeriods
}: SidebarProps) {
  return (
    <aside className="flex min-h-0 flex-col gap-5 overflow-y-auto bg-background px-4 py-5 md:px-5">
      {/* Active theme hero card */}
      <section
        className="relative flex flex-col gap-1.5 rounded-xl p-4 overflow-hidden border animate-slide-up"
        style={{
          borderColor: activeTheme.color_primary + "40",
          background: `linear-gradient(135deg, ${activeTheme.color_primary}12 0%, transparent 70%)`
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
          style={{ background: `linear-gradient(90deg, ${activeTheme.color_primary}, transparent)` }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xl">{activeTheme.icon}</span>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Thème actif
          </p>
        </div>
        <h2 className="text-lg font-bold leading-tight text-slate-100">{activeTheme.label}</h2>
        <p className="text-xs leading-5 text-muted-foreground">{activeTheme.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <div
            className="h-1 flex-1 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${activeTheme.color_primary}, ${activeTheme.color_primary}40)`
            }}
          />
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {activeTheme.period[0]} – {activeTheme.period[1]}
          </span>
        </div>
      </section>

      <GlobalStats />
      <ViewToggle value={viewMode} onChange={onViewModeChange} />
      <ThemeFilter value={themeId} onChange={onThemeChange} />
      <TimelineSlider value={year} onChange={onYearChange} min={periodBounds[0]} max={periodBounds[1]} />
      <PeriodSelector value={year} onChange={onYearChange} periods={themePeriods} />
      <CompareToggle />
      <TimelineChart />
      <ResponsibilityChart />
      <RankingPanel />
    </aside>
  );
}
