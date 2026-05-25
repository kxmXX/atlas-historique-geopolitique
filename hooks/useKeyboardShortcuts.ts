"use client";

/**
 * hooks/useKeyboardShortcuts.ts
 * Raccourcis clavier globaux :
 *   P / Space  → Play/Pause timeline
 *   G          → Vue Globe
 *   M          → Vue Carte
 *   ←          → Année -1
 *   →          → Année +1
 *   Shift+←    → Année -10
 *   Shift+→    → Année +10
 */

import { useEffect } from "react";
import { type ViewMode } from "@/components/Controls/ViewToggle";

type Opts = {
  year: number;
  setYear: (y: number) => void;
  minYear: number;
  maxYear: number;
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  onPlayToggle: () => void;
};

export function useKeyboardShortcuts({
  year, setYear, minYear, maxYear, viewMode, setViewMode, onPlayToggle
}: Opts) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      // Ignore si focus dans un input/textarea/select
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case "p":
        case "P":
        case " ":
          e.preventDefault();
          onPlayToggle();
          break;
        case "g":
        case "G":
          setViewMode("globe");
          break;
        case "m":
        case "M":
          setViewMode("map");
          break;
        case "ArrowLeft":
          e.preventDefault();
          setYear(Math.max(minYear, year - (e.shiftKey ? 10 : 1)));
          break;
        case "ArrowRight":
          e.preventDefault();
          setYear(Math.min(maxYear, year + (e.shiftKey ? 10 : 1)));
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [year, setYear, minYear, maxYear, viewMode, setViewMode, onPlayToggle]);
}
