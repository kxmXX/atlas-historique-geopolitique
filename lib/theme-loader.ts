import type { Theme, Period, Actor } from "@/lib/types";

export type { Theme, Period, Actor };
export type ActorSource = {
  ref: string;
  url: string | null;
};

export async function loadTheme(themeId: string): Promise<Theme | null> {
  try {
    const res = await fetch(`/data/themes/${themeId}.json`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function getActorForTerritory(theme: Theme, isoCode: string, year: number): Actor | null {
  const period = theme.periods.find((p) => year >= p.start && year <= p.end);
  if (!period) return null;

  const cleanCode = isoCode.toUpperCase();
  return (
    period.actors.find(
      (a) =>
        a.id.toUpperCase() === cleanCode ||
        a.territories_controlled.some((t) => t.toUpperCase() === cleanCode)
    ) ?? null
  );
}

export function getActorsForPeriod(theme: Theme, year: number): Actor[] {
  const period = theme.periods.find((p) => year >= p.start && year <= p.end);
  return period?.actors ?? [];
}
