import themesIndex from "@/data/themes/index.json";

export type ConfidenceLevel = "high" | "medium" | "debated";

export type ThemeMeta = {
  id: string;
  label: string;
  period: number[];
  description: string;
  icon: string;
  color_primary: string;
  theme_description: string;
};

export const themes = themesIndex.themes satisfies ThemeMeta[];

export const defaultThemeId = themes[0]?.id ?? "colonisation";
