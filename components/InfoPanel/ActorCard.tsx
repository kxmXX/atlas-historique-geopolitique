"use client";

import { Badge } from "@/components/ui/badge";
import type { Actor } from "@/lib/theme-loader";

type ActorCardProps = {
  actor: Actor | null;
};

const CONFIDENCE_STYLES: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
  high: { variant: "default", label: "Haute confiance" },
  medium: { variant: "secondary", label: "Confiance moyenne" },
  debated: { variant: "outline", label: "Débattu" }
};

export function ActorCard({ actor }: ActorCardProps) {
  if (!actor) {
    return (
      <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
        <p className="text-sm font-medium">Acteur</p>
        <p className="text-sm text-muted-foreground">Aucun acteur identifié pour ce territoire à cette période.</p>
      </section>
    );
  }

  const confStyle = CONFIDENCE_STYLES[actor.confidence_level] ?? CONFIDENCE_STYLES.debated;

  return (
    <section className="flex flex-col gap-4 rounded-md border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{actor.label}</p>
          <p className="text-xs text-muted-foreground">Pic d&apos;influence: {actor.peak_year}</p>
        </div>
        <Badge variant={confStyle.variant}>{confStyle.label}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Population touchée</p>
          <p className="font-medium tabular-nums">{actor.population_affected_M} M</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Extraction économique</p>
          <p className="font-medium tabular-nums">{actor.economic_extraction_estimate_B_USD} G$</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Pondération</p>
          <p className="font-medium tabular-nums">{(actor.responsibility_weight * 100).toFixed(0)}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Territoires</p>
          <p className="font-medium tabular-nums">{actor.territories_controlled.length}</p>
        </div>
      </div>

      {actor.disclaimer ? (
        <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground leading-relaxed">
          {actor.disclaimer}
        </div>
      ) : null}
    </section>
  );
}
