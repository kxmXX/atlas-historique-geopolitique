"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { loadTheme, getActorsForPeriod, type Actor } from "@/lib/theme-loader";

type RankingPanelProps = {
  themeId: string;
  year: number;
};

export function RankingPanel({ themeId, year }: RankingPanelProps) {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadTheme(themeId).then((theme) => {
      if (theme) {
        const data = getActorsForPeriod(theme, year);
        setActors(data.sort((a, b) => b.responsibility_weight - a.responsibility_weight));
      } else {
        setActors([]);
      }
      setLoading(false);
    });
  }, [themeId, year]);

  if (loading) {
    return (
      <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
        <p className="text-sm font-medium">Classement</p>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="animate-spin size-4 text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (actors.length === 0) {
    return (
      <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
        <p className="text-sm font-medium">Classement</p>
        <p className="text-xs text-muted-foreground">Aucune donnée pour cette période.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Classement</p>
        <Badge variant="secondary">{year}</Badge>
      </div>
      <div className="flex flex-col gap-2">
        {actors.slice(0, 8).map((actor, index) => (
          <div key={actor.id} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 text-center text-xs font-semibold text-muted-foreground tabular-nums">
                {index + 1}
              </span>
              <span className="truncate">{actor.label}</span>
            </div>
            <span className="shrink-0 font-medium tabular-nums">
              {(actor.responsibility_weight * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
