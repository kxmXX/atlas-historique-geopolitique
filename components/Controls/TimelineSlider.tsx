"use client";

import { Slider } from "@/components/ui/slider";

type TimelineSliderProps = {
  value: number;
  onChange: (year: number) => void;
  min: number;
  max: number;
};

export function TimelineSlider({ value, onChange, min, max }: TimelineSliderProps) {
  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Timeline</p>
          <p className="text-xs text-muted-foreground">Sélection de l&apos;année</p>
        </div>
        <output className="rounded-md bg-secondary px-2 py-1 text-sm font-semibold">{value}</output>
      </div>
      <Slider
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={(nextValue) => onChange(nextValue[0] ?? value)}
        aria-label="Année"
      />
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{min}</span>
        <span>{Math.round((min + max) / 2)}</span>
        <span>{max}</span>
      </div>
    </section>
  );
}
