"use client";

/**
 * contexts/ThemeContext.tsx
 * Contexte React partagé — 1 seul chargement du thème pour toute l'app.
 * Tous les composants consomment le même state, pas de fetch dupliqué.
 */

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Theme, Period, Actor } from "@/lib/types";
import { loadThemeCached, prefetchTheme } from "@/lib/theme-cache";
import { themes, defaultThemeId, type ThemeMeta } from "@/lib/theme-data";

type ThemeContextValue = {
  // Meta (liste des thèmes)
  themeMetas: ThemeMeta[];
  // Thème actif
  themeId: string;
  setThemeId: (id: string) => void;
  activeThemeMeta: ThemeMeta;
  // Données complètes chargées
  themeData: Theme | null;
  loading: boolean;
  // Période et année
  year: number;
  setYear: (y: number) => void;
  activePeriod: Period | null;
  periodBounds: [number, number];
  themePeriods: Period[];
  // Helpers
  getActorsForYear: () => Actor[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState(defaultThemeId);
  const [themeData, setThemeData] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(1900);

  // Précharger tous les thèmes en arrière-plan après mount
  useEffect(() => {
    // Charge le thème par défaut immédiatement
    setLoading(true);
    loadThemeCached(defaultThemeId).then((data) => {
      setThemeData(data);
      setLoading(false);
      if (data?.periods?.length) {
        setYear(data.periods[0].start);
      }
    });
    // Précharge les autres thèmes silencieusement (décalé)
    const timeout = setTimeout(() => {
      themes.forEach((t) => {
        if (t.id !== defaultThemeId) prefetchTheme(t.id);
      });
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const setThemeId = useCallback((id: string) => {
    setThemeIdState(id);
    setLoading(true);
    loadThemeCached(id).then((data) => {
      setThemeData(data);
      setLoading(false);
      if (data?.periods?.length) {
        const periods = data.periods;
        const first = periods[0];
        const last = periods[periods.length - 1];
        setYear((prev) =>
          prev < first.start || prev > last.end ? first.start : prev
        );
      }
    });
  }, []);

  const activeThemeMeta: ThemeMeta =
    (themes.find((t) => t.id === themeId) as ThemeMeta) ?? (themes[0] as ThemeMeta);

  const themePeriods = themeData?.periods ?? [];

  const periodBounds: [number, number] =
    activeThemeMeta?.period?.length === 2
      ? [activeThemeMeta.period[0], activeThemeMeta.period[1]]
      : [1500, 2026];

  const activePeriod: Period | null =
    themePeriods.find((p) => year >= p.start && year <= p.end) ??
    themePeriods[0] ??
    null;

  const getActorsForYear = useCallback(() => activePeriod?.actors ?? [], [activePeriod]);

  return (
    <ThemeContext.Provider
      value={{
        themeMetas: themes as ThemeMeta[],
        themeId,
        setThemeId,
        activeThemeMeta,
        themeData,
        loading,
        year,
        setYear,
        activePeriod,
        periodBounds,
        themePeriods,
        getActorsForYear
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
