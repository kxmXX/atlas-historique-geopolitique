"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Loader2 } from "lucide-react";

export function TimelineChart() {
  const { themePeriods, year, loading, activeThemeMeta, setYear } = useTheme();

  if (loading) {
    return (
      <section className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-card p-4">
        <p className="text-sm font-semibold text-slate-200">Chronologie</p>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="animate-spin size-4 text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (themePeriods.length === 0) return null;

  const minYear = Math.min(...themePeriods.map((p) => p.start));
  const maxYear = Math.max(...themePeriods.map((p) => p.end));
  const span = maxYear - minYear || 1;
  const themeColor = activeThemeMeta.color_primary;

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-card p-4 animate-slide-up">
      <p className="text-sm font-semibold text-slate-200">Chronologie</p>

      <div className="relative h-10 select-none">
        {/* Track */}
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-800" />

        {/* Period segments */}
        {themePeriods.map((period, index) => {
          const leftPct = ((period.start - minYear) / span) * 100;
          const widthPct = ((period.end - period.start) / span) * 100;
          const isActive = year >= period.start && year <= period.end;
          return (
            <button
              key={index}
              type="button"
              title={period.label}
              onClick={() => setYear(period.start)}
              className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full transition-all duration-300 hover:opacity-100 focus:outline-none"
              style={{
                left: `${leftPct}%`,
                width: `${Math.max(widthPct, 3)}%`,
                background: isActive ? themeColor : themeColor + "50",
                boxShadow: isActive ? `0 0 8px ${themeColor}80` : "none",
                opacity: isActive ? 1 : 0.5
              }}
            />
          );
        })}

        {/* Year cursor */}
        {year >= minYear && year <= maxYear && (
          <div
            className="absolute top-0 h-full w-0.5 transition-all duration-200"
            style={{
              left: `${((year - minYear) / span) * 100}%`,
              background: "white",
              boxShadow: "0 0 4px rgba(255,255,255,0.6)"
            }}
          >
            <div
              className="absolute -top-0.5 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white whitespace-nowrap"
              style={{ background: themeColor }}
            >
              {year}
            </div>
          </div>
        )}
      </div>

      {/* Period labels row */}
      <div className="relative h-5">
        {themePeriods.map((period, index) => {
          const leftPct = ((period.start - minYear) / span) * 100;
          return (
            <span
              key={index}
              className="absolute text-[9px] text-muted-foreground -translate-x-1/2"
              style={{ left: `${leftPct}%`, top: 0 }}
            >
              {period.start}
            </span>
          );
        })}
        <span
          className="absolute text-[9px] text-muted-foreground"
          style={{ right: 0, top: 0 }}
        >
          {maxYear}
        </span>
      </div>
    </section>
  );
}
