"use client";

import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { getFlagEmojiSafe } from "@/lib/flagEmoji";

const ACTOR_COLORS = [
  "#e63946", "#457b9d", "#2a9d8f", "#e9c46a", "#f4a261",
  "#8338ec", "#06d6a0", "#fb8500", "#219ebc", "#c77dff"
];

export function ResponsibilityChart() {
  const { activePeriod, loading, activeThemeMeta } = useTheme();

  const actors = (activePeriod?.actors ?? [])
    .slice()
    .sort((a, b) => b.responsibility_weight - a.responsibility_weight);

  if (loading) {
    return (
      <section className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-card p-4">
        <p className="text-sm font-semibold text-slate-200">Poids de responsabilité</p>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="animate-spin size-4 text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (actors.length === 0) {
    return (
      <section className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-card p-4">
        <p className="text-sm font-semibold text-slate-200">Poids de responsabilité</p>
        <p className="text-xs text-muted-foreground">Aucune donnée pour cette période.</p>
      </section>
    );
  }

  const maxWeight = Math.max(...actors.map((a) => a.responsibility_weight), 0.01);
  const displayActors = actors.slice(0, 6);

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-card p-4 animate-slide-up">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-200">Poids de responsabilité</p>
        <Badge
          variant="secondary"
          className="text-[10px]"
          style={{ background: activeThemeMeta.color_primary + "20", color: activeThemeMeta.color_primary, borderColor: activeThemeMeta.color_primary + "40" }}
        >
          {actors.length} acteurs
        </Badge>
      </div>
      <div className="flex flex-col gap-2.5">
        {displayActors.map((actor, index) => {
          const pct = (actor.responsibility_weight / maxWeight) * 100;
          const color = ACTOR_COLORS[index % ACTOR_COLORS.length];
          const flag = getFlagEmojiSafe(actor.id);
          return (
            <div key={actor.id} className="flex items-center gap-2 group">
              <span className="text-xs w-5 text-center shrink-0" title={actor.label}>{flag}</span>
              <span className="min-w-0 w-24 shrink-0 truncate text-[11px] text-slate-300">{actor.label}</span>
              <div className="relative flex h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
                />
              </div>
              <span className="w-9 text-right text-[11px] tabular-nums font-semibold text-slate-300 shrink-0">
                {(actor.responsibility_weight * 100).toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
