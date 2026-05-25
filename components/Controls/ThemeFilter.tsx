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
        <p className="text-sm font-medium">Thématiques</p>
        <span className="text-xs text-muted-foreground">{themes.length} thèmes V1</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {themes.map((theme) => {
          const isActive = theme.id === value;
          return (
            <Button
              key={theme.id}
              type="button"
              variant={isActive ? "default" : "outline"}
              className={cn(
                "h-auto justify-start px-3 py-2.5 text-left text-sm transition-all gap-2.5 border border-slate-700/50 hover:bg-slate-800/50",
                isActive && "shadow-lg font-semibold"
              )}
              style={
                isActive
                  ? {
                      backgroundColor: theme.color_primary,
                      borderColor: theme.color_primary,
                      color: "#ffffff",
                      boxShadow: `0 0 12px ${theme.color_primary}50`
                    }
                  : {}
              }
              onClick={() => onChange(theme.id)}
            >
              <span className="text-base" aria-hidden="true">
                {theme.icon}
              </span>
              <span>{theme.label}</span>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
