"use client";

import { Button } from "@/components/ui/button";
import type { Period } from "@/lib/types";

type PeriodSelectorProps = {
  value: number;
  onChange: (year: number) => void;
  periods: Period[];
};

export function PeriodSelector({ value, onChange, periods }: PeriodSelectorProps) {
  if (!periods || periods.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <p className="text-sm font-medium">Périodes clés</p>
      <div className="flex flex-col gap-1.5">
        {periods.map((period, idx) => {
          const isActive = value >= period.start && value <= period.end;
          const totalSpan = period.end - period.start;
          const elapsed = Math.min(Math.max(value - period.start, 0), totalSpan);
          const pct = totalSpan > 0 ? (elapsed / totalSpan) * 100 : 0;

          return (
            <Button
              key={`${period.start}-${period.end}`}
              type="button"
              size="sm"
              variant={isActive ? "default" : "secondary"}
              className="relative justify-start text-left h-auto py-2.5 px-3 leading-normal border border-slate-700/50 overflow-hidden"
              style={
                isActive
                  ? { background: "hsl(var(--primary) / 0.18)", borderColor: "hsl(var(--primary) / 0.5)" }
                  : {}
              }
              onClick={() => onChange(period.start)}
            >
              {/* Progress fill for active period */}
              {isActive && (
                <span
                  className="pointer-events-none absolute inset-0 origin-left transition-all duration-300"
                  style={{
                    width: `${pct}%`,
                    background: "hsl(var(--primary) / 0.12)"
                  }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2 w-full">
                <span className="flex items-center justify-center size-5 rounded-full border border-slate-700 text-[10px] font-bold text-muted-foreground shrink-0">
                  {idx + 1}
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="font-semibold text-xs text-slate-200">
                    {period.start} – {period.end}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[270px]">
                    {period.actors.map((a) => a.label).join(", ")}
                  </span>
                </span>
                {isActive && (
                  <span className="ml-auto shrink-0 rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wide">
                    Actif
                  </span>
                )}
              </span>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
