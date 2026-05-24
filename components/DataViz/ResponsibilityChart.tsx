"use client";

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { loadTheme, getActorsForPeriod, type Actor } from "@/lib/theme-loader";

type ResponsibilityChartProps = {
  themeId: string;
  year: number;
};

const ACTOR_COLORS = [
  "#c0392b", "#2980b9", "#27ae60", "#e67e22", "#8e44ad",
  "#16a085", "#d35400", "#2c3e50", "#f39c12", "#1abc9c"
];

export function ResponsibilityChart({ themeId, year }: ResponsibilityChartProps) {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

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
        <p className="text-sm font-medium">Pondération acteurs</p>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="animate-spin size-4 text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (actors.length === 0) {
    return (
      <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
        <p className="text-sm font-medium">Pondération acteurs</p>
        <p className="text-xs text-muted-foreground">Aucune donnée pour cette période.</p>
      </section>
    );
  }

  const maxWeight = Math.max(...actors.map((a) => a.responsibility_weight), 0.01);
  const displayActors = actors.slice(0, 6);

  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Pondération acteurs</p>
        <Badge variant="secondary">{actors.length} acteurs</Badge>
      </div>
      <div className="flex flex-col gap-2">
        {displayActors.map((actor, index) => {
          const pct = (actor.responsibility_weight / maxWeight) * 100;
          return (
            <div key={actor.id} className="flex items-center gap-2">
              <div
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: ACTOR_COLORS[index % ACTOR_COLORS.length] }}
              />
              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                {actor.label}
              </span>
              <div className="flex h-3 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: ACTOR_COLORS[index % ACTOR_COLORS.length]
                  }}
                />
              </div>
              <span className="w-10 text-right text-xs tabular-nums font-medium">
                {(actor.responsibility_weight * 100).toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
