import { ThemeFilter } from "@/components/Controls/ThemeFilter";
import { TimelineSlider } from "@/components/Controls/TimelineSlider";
import { PeriodSelector } from "@/components/Controls/PeriodSelector";
import { CompareToggle } from "@/components/Controls/CompareToggle";
import { ResponsibilityChart } from "@/components/DataViz/ResponsibilityChart";
import { RankingPanel } from "@/components/DataViz/RankingPanel";
import type { ThemeMeta } from "@/lib/theme-data";

type SidebarProps = {
  activeTheme: ThemeMeta;
  themeId: string;
  year: number;
  onThemeChange: (themeId: string) => void;
  onYearChange: (year: number) => void;
};

export function Sidebar({
  activeTheme,
  themeId,
  year,
  onThemeChange,
  onYearChange
}: SidebarProps) {
  return (
    <aside className="flex min-h-0 flex-col gap-5 overflow-y-auto bg-background px-4 py-5 md:px-5">
      <section className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase text-muted-foreground">Thème actif</p>
        <h2 className="text-xl font-semibold leading-tight">{activeTheme.label}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{activeTheme.description}</p>
      </section>

      <ThemeFilter value={themeId} onChange={onThemeChange} />
      <TimelineSlider value={year} onChange={onYearChange} />
      <PeriodSelector value={year} onChange={onYearChange} />
      <CompareToggle />
      <ResponsibilityChart themeId={themeId} year={year} />
      <RankingPanel themeId={themeId} year={year} />
    </aside>
  );
}
