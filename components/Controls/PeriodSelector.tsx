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
        {periods.map((period) => {
          const isActive = value >= period.start && value <= period.end;
          return (
            <Button
              key={`${period.start}-${period.end}`}
              type="button"
              size="sm"
              variant={isActive ? "default" : "secondary"}
              className="justify-start text-left h-auto py-2.5 px-3 leading-normal border border-slate-700/50"
              onClick={() => onChange(period.start)}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-xs text-slate-200">
                  {period.start} – {period.end}
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[300px]">
                  {period.actors.map((a) => a.label).join(", ")}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
