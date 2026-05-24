import themesIndex from "@/data/themes/index.json";

export type ConfidenceLevel = "high" | "medium" | "debated";

export type ThemeMeta = {
  id: string;
  label: string;
  period: number[];
  description: string;
};

export const themes = themesIndex.themes satisfies ThemeMeta[];

export const defaultThemeId = themes[0]?.id ?? "colonisation";
