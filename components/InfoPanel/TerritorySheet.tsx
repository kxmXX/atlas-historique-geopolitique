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
        const found = getActorForTerritory(data, territory.iso3, year);
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-5 overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{territory?.name ?? "Territoire"}</SheetTitle>
          <SheetDescription>
            Thème {theme.label} &mdash; année {year}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">ISO3 {territory?.iso3 ?? "n/a"}</Badge>
          {actor ? (
            <Badge variant={confidenceLevel === "high" ? "default" : confidenceLevel === "medium" ? "secondary" : "outline"}>
              {confidenceLevel === "high" ? "Haute confiance" : confidenceLevel === "medium" ? "Confiance moyenne" : "Débattu"}
            </Badge>
          ) : null}
        </div>

        <Separator />

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin size-5 text-muted-foreground" />
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
