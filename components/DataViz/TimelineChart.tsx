"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { loadTheme, type Period } from "@/lib/theme-loader";

type TimelineChartProps = {
  themeId: string;
  year: number;
};

export function TimelineChart({ themeId, year }: TimelineChartProps) {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    loadTheme(themeId).then((theme) => {
      setPeriods(theme?.periods ?? []);
      setLoading(false);
    });
  }, [themeId]);

  if (loading) {
    return (
      <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
        <p className="text-sm font-medium">Chronologie</p>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="animate-spin size-4 text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (periods.length === 0) {
    return null;
  }

  const minYear = Math.min(...periods.map((p) => p.start));
  const maxYear = Math.max(...periods.map((p) => p.end));
  const span = maxYear - minYear || 1;

  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
      <p className="text-sm font-medium">Chronologie</p>
      <div ref={containerRef} className="relative h-12">
        {/* Timeline track */}
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-muted" />

        {periods.map((period, index) => {
          const leftPct = ((period.start - minYear) / span) * 100;
          const widthPct = ((period.end - period.start) / span) * 100;

          return (
            <div
              key={index}
              className="absolute top-0 h-full rounded-full"
              style={{
                left: `${leftPct}%`,
                width: `${Math.max(widthPct, 2)}%`
              }}
            >
              <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary/50" />
              <span
                className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap"
              >
                {period.start}
              </span>
              <span
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap"
              >
                {period.end}
              </span>
            </div>
          );
        })}

        {/* Current year indicator */}
        {year >= minYear && year <= maxYear ? (
          <div
            className="absolute top-0 h-full w-0.5 bg-primary shadow-sm"
            style={{ left: `${((year - minYear) / span) * 100}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-primary-foreground whitespace-nowrap">
              {year}
            </div>
          </div>
        ) : null}
      </div>
      <p className="text-[11px] text-muted-foreground">
        {periods.map((p) => `${p.start}–${p.end}`).join(" · ")}
      </p>
    </section>
  );
}
