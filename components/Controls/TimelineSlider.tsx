"use client";

import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from "lucide-react";

type TimelineSliderProps = {
  value: number;
  onChange: (year: number) => void;
  min: number;
  max: number;
};

export function TimelineSlider({ value, onChange, min, max }: TimelineSliderProps) {
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const next = valueRef.current + 1;
      if (next > max) {
        setPlaying(false);
      } else {
        onChange(next);
      }
    }, 180);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, max, onChange]);

  // Stop playing when min/max changes
  useEffect(() => {
    setPlaying(false);
  }, [min, max]);

  const handlePlayToggle = () => {
    if (value >= max) {
      onChange(min);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };

  const progress = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Timeline</p>
          <p className="text-xs text-muted-foreground">Sélection de l&apos;année</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePlayToggle}
            className={`play-btn${playing ? " playing" : ""}`}
            aria-label={playing ? "Pause" : "Lecture automatique"}
            title={playing ? "Pause" : "Lecture automatique"}
          >
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5 translate-x-px" />}
          </button>
          <output className="rounded-md bg-secondary px-2.5 py-1 text-sm font-semibold tabular-nums min-w-[3.5rem] text-center">
            {value}
          </output>
        </div>
      </div>

      <Slider
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={(nextValue) => {
          setPlaying(false);
          onChange(nextValue[0] ?? value);
        }}
        aria-label="Année"
      />

      {/* Progress bar */}
      <div className="relative h-0.5 w-full rounded-full overflow-hidden bg-slate-800">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-200"
          style={{
            width: `${progress}%`,
            background: "hsl(var(--primary))",
            boxShadow: "0 0 6px hsl(var(--primary) / 0.6)"
          }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{min}</span>
        <span>{Math.round((min + max) / 2)}</span>
        <span>{max}</span>
      </div>
    </section>
  );
}
