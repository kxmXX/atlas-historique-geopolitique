"use client";

import { themes } from "@/lib/theme-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeFilterProps = {
  value: string;
  onChange: (themeId: string) => void;
};

export function ThemeFilter({ value, onChange }: ThemeFilterProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Filtres</p>
        <span className="text-xs text-muted-foreground">{themes.length} thèmes V1</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {themes.map((theme) => (
          <Button
            key={theme.id}
            type="button"
            variant={theme.id === value ? "default" : "outline"}
            className={cn("h-auto justify-start px-3 py-2 text-left text-sm", theme.id === value && "shadow")}
            onClick={() => onChange(theme.id)}
          >
            {theme.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
