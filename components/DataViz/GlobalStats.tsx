"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { getFlagEmojiSafe } from "@/lib/flagEmoji";
import { useMemo } from "react";

export function GlobalStats() {
  const { activePeriod, activeThemeMeta, loading } = useTheme();

  const stats = useMemo(() => {
    if (!activePeriod) return null;
    const actors = activePeriod.actors;
    const totalPop = actors.reduce((sum, a) => sum + (a.population_affected_M ?? 0), 0);
    const totalEco = actors.reduce((sum, a) => sum + (a.economic_extraction_estimate_B_USD ?? 0), 0);
    const territories = actors.reduce((sum, a) => sum + a.territories_controlled.length, 0);
    const topActor = [...actors].sort((a, b) => b.responsibility_weight - a.responsibility_weight)[0];
    return { totalPop, totalEco, territories, topActor, count: actors.length };
  }, [activePeriod]);

  if (loading || !stats) return null;

  const color = activeThemeMeta.color_primary;

  return (
    <section className="grid grid-cols-2 gap-2 animate-fade-in">
      <div className="stat-card col-span-2" style={{ borderColor: color + "30" }}>
        <p className="text-[10px] text-muted-foreground">Acteur dominant</p>
        <p className="text-sm font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
          <span>{getFlagEmojiSafe(stats.topActor?.id ?? "")}</span>
          <span className="truncate">{stats.topActor?.label ?? "—"}</span>
        </p>
      </div>
      <div className="stat-card">
        <p className="text-[10px] text-muted-foreground">Pop. touchée</p>
        <p className="text-sm font-bold text-slate-100 mt-0.5 tabular-nums">
          {stats.totalPop >= 1000
            ? `${(stats.totalPop / 1000).toFixed(1)} G`
            : `${stats.totalPop} M`}
        </p>
      </div>
      <div className="stat-card">
        <p className="text-[10px] text-muted-foreground">Territoires</p>
        <p className="text-sm font-bold text-slate-100 mt-0.5 tabular-nums">{stats.territories}</p>
      </div>
      {stats.totalEco > 0 && (
        <div className="stat-card col-span-2">
          <p className="text-[10px] text-muted-foreground">Extraction économique estimée</p>
          <p className="text-sm font-bold text-slate-100 mt-0.5 tabular-nums">
            {(stats.totalEco / 1000).toFixed(0)} G$ USD
          </p>
        </div>
      )}
    </section>
  );
}
