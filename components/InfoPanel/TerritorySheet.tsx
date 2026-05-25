"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ActorCard } from "@/components/InfoPanel/ActorCard";
import { SourcesList } from "@/components/InfoPanel/SourcesList";
import { Disclaimer } from "@/components/InfoPanel/Disclaimer";
import { loadTheme, getActorForTerritory, type Theme, type Actor } from "@/lib/theme-loader";
import type { TerritorySelection } from "@/components/Map/WorldMap";
import type { ThemeMeta } from "@/lib/theme-data";
import { iso3ToIso2 } from "@/lib/centroids";
import { getFlagEmojiSafe } from "@/lib/flagEmoji";
import { Loader2 } from "lucide-react";

type TerritorySheetProps = {
  territory: TerritorySelection | null;
  theme: ThemeMeta;
  year: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TerritorySheet({
  territory,
  theme,
  year,
  open,
  onOpenChange
}: TerritorySheetProps) {
  const [themeData, setThemeData] = useState<Theme | null>(null);
  const [actor, setActor] = useState<Actor | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !territory) return;

    setLoading(true);
    loadTheme(theme.id).then((data) => {
      setThemeData(data);
      if (data && territory.iso3) {
        // Translate GeoJSON's ISO3 code to theme's ISO2 code
        const iso2 = iso3ToIso2[territory.iso3.toUpperCase()] ?? territory.iso3;
        const found = getActorForTerritory(data, iso2, year);
        setActor(found);
      } else {
        setActor(null);
      }
      setLoading(false);
    });
  }, [open, territory, theme.id, year]);

  const sources = actor?.sources ?? [];
  const disclaimerText = actor?.disclaimer ?? null;
  const confidenceLevel = actor?.confidence_level;

  const flag = territory?.iso3 ? getFlagEmojiSafe(iso3ToIso2[territory.iso3.toUpperCase()] ?? "") : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-5 overflow-y-auto sm:max-w-xl bg-slate-950 border-slate-800 text-slate-100">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold flex items-center gap-2 text-slate-100">
            <span>{flag}</span>
            <span>{territory?.name ?? "Territoire"}</span>
          </SheetTitle>
          <SheetDescription className="text-slate-400">
            Thème {theme.label} &mdash; année {year}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700">
            ISO3 {territory?.iso3 ?? "n/a"}
          </Badge>
          {actor ? (
            <Badge variant={confidenceLevel === "high" ? "default" : confidenceLevel === "medium" ? "secondary" : "outline"} className={confidenceLevel === "high" ? "bg-primary text-primary-foreground" : "text-slate-300 border-slate-700"}>
              {confidenceLevel === "high" ? "Haute confiance" : confidenceLevel === "medium" ? "Confiance moyenne" : "Débattu"}
            </Badge>
          ) : null}
        </div>

        <Separator className="bg-slate-800" />

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin size-5 text-slate-500" />
          </div>
        ) : (
          <>
            <ActorCard actor={actor} />
            <SourcesList sources={sources} />
            <Disclaimer text={disclaimerText} confidenceLevel={confidenceLevel} />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
