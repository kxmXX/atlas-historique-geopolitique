"use client";

import { Slider } from "@/components/ui/slider";

type TimelineSliderProps = {
  value: number;
  onChange: (year: number) => void;
};

export function TimelineSlider({ value, onChange }: TimelineSliderProps) {
  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Timeline</p>
          <p className="text-xs text-muted-foreground">Snap manuel sur années clés</p>
        </div>
        <output className="rounded-md bg-secondary px-2 py-1 text-sm font-semibold">{value}</output>
      </div>
      <Slider
        min={0}
        max={2026}
        step={1}
        value={[value]}
        onValueChange={(nextValue) => onChange(nextValue[0] ?? value)}
        aria-label="Année"
      />
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>0</span>
        <span>1500</span>
        <span>1900</span>
        <span>2026</span>
      </div>
    </section>
  );
}
