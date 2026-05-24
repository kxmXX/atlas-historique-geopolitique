"use client";

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
import type { TerritorySelection } from "@/components/Map/WorldMap";
import type { ThemeMeta } from "@/lib/theme-data";

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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-5 overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{territory?.name ?? "Territoire"}</SheetTitle>
          <SheetDescription>
            Vue initiale J1, connectée au thème {theme.label} pour l’année {year}.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">ISO3 {territory?.iso3 ?? "n/a"}</Badge>
          <Badge variant="outline">Confiance visible en V1</Badge>
        </div>

        <Separator />
        <ActorCard />
        <SourcesList />
        <Disclaimer>
          Les données chiffrées complètes seront générées pendant J3-J4. Cette fiche valide le flux UX: clic territoire, contexte, sources et badge de confiance.
        </Disclaimer>
      </SheetContent>
    </Sheet>
  );
}
