import type { ConfidenceLevel } from "@/lib/theme-data";

export type ActorSource = {
  ref: string;
  url: string;
};

export type Actor = {
  id: string;
  label: string;
  territories_controlled: string[];
  peak_year: number;
  population_affected_M: number;
  economic_extraction_estimate_B_USD: number;
  responsibility_weight: number;
  confidence_level: ConfidenceLevel;
  sources: ActorSource[];
  disclaimer: string | null;
};

export type Period = {
  start: number;
  end: number;
  actors: Actor[];
  map_config: {
    type: "heatmap" | "choropleth" | "flow";
    intensity_field: string;
    flow_lines: boolean;
  };
};

export type Theme = {
  theme_id: string;
  theme_label: string;
  periods: Period[];
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

export function getActorForTerritory(theme: Theme, iso3: string, year: number): Actor | null {
  const period = theme.periods.find((p) => year >= p.start && year <= p.end);
  if (!period) return null;
  return period.actors.find((a) => a.territories_controlled.includes(iso3)) ?? null;
}

export function getActorsForPeriod(theme: Theme, year: number): Actor[] {
  const period = theme.periods.find((p) => year >= p.start && year <= p.end);
  return period?.actors ?? [];
}
