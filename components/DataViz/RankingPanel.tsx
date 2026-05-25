"use client";

import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { getFlagEmojiSafe } from "@/lib/flagEmoji";

const MEDALS = ["🥇", "🥈", "🥉"];

export function RankingPanel() {
  const { activePeriod, loading, year } = useTheme();

  const actors = (activePeriod?.actors ?? [])
    .slice()
    .sort((a, b) => b.responsibility_weight - a.responsibility_weight);

  if (loading) {
    return (
      <section className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-card p-4">
        <p className="text-sm font-semibold text-slate-200">Classement</p>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="animate-spin size-4 text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (actors.length === 0) {
    return (
      <section className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-card p-4">
        <p className="text-sm font-semibold text-slate-200">Classement</p>
        <p className="text-xs text-muted-foreground">Aucune donnée pour cette période.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-card p-4 animate-slide-up">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-200">Classement</p>
        <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-400 border-slate-700">
          {year}
        </Badge>
      </div>
      <div className="flex flex-col gap-1.5">
        {actors.slice(0, 8).map((actor, index) => {
          const flag = getFlagEmojiSafe(actor.id);
          const medal = MEDALS[index];
          const barWidth = `${(actor.responsibility_weight / (actors[0]?.responsibility_weight ?? 1)) * 100}%`;
          return (
            <div
              key={actor.id}
              className="relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm overflow-hidden group hover:bg-slate-800/50 transition-colors"
            >
              {/* background progress bar */}
              <div
                className="absolute left-0 top-0 h-full rounded-lg opacity-10 transition-all duration-500"
                style={{ width: barWidth, background: index === 0 ? "#fbbf24" : index === 1 ? "#94a3b8" : index === 2 ? "#b45309" : "#334155" }}
              />
              <span className="relative z-10 w-6 text-center text-base shrink-0">
                {medal ?? <span className="text-xs text-muted-foreground tabular-nums">{index + 1}</span>}
              </span>
              <span className="relative z-10 text-sm shrink-0">{flag}</span>
              <span className="relative z-10 truncate min-w-0 flex-1 text-[12px] text-slate-200">
                {actor.label}
              </span>
              <span className="relative z-10 shrink-0 font-bold tabular-nums text-[12px] text-slate-300">
                {(actor.responsibility_weight * 100).toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
