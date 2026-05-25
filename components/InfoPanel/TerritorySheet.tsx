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
import { getActorForTerritory, type Theme, type Actor } from "@/lib/theme-loader";
import { loadThemeCached } from "@/lib/theme-cache";
import type { TerritorySelection } from "@/components/Map/WorldMap";
import type { ThemeMeta } from "@/lib/theme-data";
import { iso3ToIso2 } from "@/lib/centroids";
import { getFlagEmojiSafe } from "@/lib/flagEmoji";
import { Loader2, MapPin, Calendar } from "lucide-react";

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
    loadThemeCached(theme.id).then((data) => {
      setThemeData(data);
      if (data && territory.iso3) {
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

  const iso2 = territory?.iso3 ? (iso3ToIso2[territory.iso3.toUpperCase()] ?? "") : "";
  const flag = iso2 ? getFlagEmojiSafe(iso2) : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-xl bg-slate-950 border-slate-800 text-slate-100 p-0">
        {/* Header section with gradient accent */}
        <div
          className="relative px-6 pt-6 pb-5 border-b border-slate-800"
          style={{
            background: `linear-gradient(135deg, ${theme.color_primary}18 0%, transparent 60%)`
          }}
        >
          {/* Theme color accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: `linear-gradient(90deg, ${theme.color_primary}, transparent)` }}
          />
          <SheetHeader className="gap-2">
            <SheetTitle className="text-2xl font-bold flex items-center gap-3 text-slate-100">
              {flag && <span className="text-3xl leading-none">{flag}</span>}
              <span>{territory?.name ?? "Territoire"}</span>
            </SheetTitle>
            <SheetDescription className="text-slate-400 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="text-base">{theme.icon}</span>
                <span>{theme.label}</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                <span className="tabular-nums font-medium text-slate-300">{year}</span>
              </span>
              {territory?.iso3 && (
                <>
                  <span className="text-slate-600">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    <code className="text-xs font-mono text-slate-400">{territory.iso3}</code>
                  </span>
                </>
              )}
            </SheetDescription>
          </SheetHeader>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mt-4">
            {actor ? (
              <Badge
                variant={confidenceLevel === "high" ? "default" : confidenceLevel === "medium" ? "secondary" : "outline"}
                className={confidenceLevel === "high" ? "bg-primary text-primary-foreground" : "text-slate-300 border-slate-700"}
              >
                {confidenceLevel === "high" ? "✓ Haute confiance" : confidenceLevel === "medium" ? "~ Confiance moyenne" : "? Débattu"}
              </Badge>
            ) : null}
            <Badge
              variant="outline"
              className="border-slate-700 text-slate-400 text-[10px]"
              style={{ borderColor: theme.color_primary + "50", color: theme.color_primary }}
            >
              {theme.label}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin size-6 text-primary" />
                <p className="text-xs text-muted-foreground">Chargement des données…</p>
              </div>
            </div>
          ) : (
            <>
              <ActorCard actor={actor} />
              <SourcesList sources={sources} />
              <Disclaimer text={disclaimerText} confidenceLevel={confidenceLevel} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
