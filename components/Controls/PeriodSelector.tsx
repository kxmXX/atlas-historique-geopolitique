"use client";

import { Button } from "@/components/ui/button";

const periods = [
  { label: "1500", year: 1500 },
  { label: "1715", year: 1715 },
  { label: "1800", year: 1800 },
  { label: "1900", year: 1900 },
  { label: "1945", year: 1945 },
  { label: "1960", year: 1960 },
  { label: "2026", year: 2026 }
];

type PeriodSelectorProps = {
  value: number;
  onChange: (year: number) => void;
};

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <section className="flex flex-col gap-2">
      <p className="text-sm font-medium">Périodes clés</p>
      <div className="grid grid-cols-4 gap-2">
        {periods.map((period) => (
          <Button
            key={period.year}
            type="button"
            size="sm"
            variant={period.year === value ? "default" : "secondary"}
            onClick={() => onChange(period.year)}
          >
            {period.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
