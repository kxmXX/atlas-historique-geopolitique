"use client";

import { Badge } from "@/components/ui/badge";
import type { Actor } from "@/lib/theme-loader";

type ActorCardProps = {
  actor: Actor | null;
};

const CONFIDENCE_STYLES: Record<
  string,
  { variant: "default" | "secondary" | "outline" | "destructive"; label: string; color: string }
> = {
  high: { variant: "default", label: "Haute confiance", color: "#22c55e" },
  medium: { variant: "secondary", label: "Confiance moyenne", color: "#f59e0b" },
  debated: { variant: "outline", label: "Débattu", color: "#94a3b8" }
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card animate-slide-up">
      <p className="text-[10px] text-muted-foreground leading-none">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-slate-100 mt-1">{value}</p>
    </div>
  );
}

export function ActorCard({ actor }: ActorCardProps) {
  if (!actor) {
    return (
      <section className="flex flex-col gap-3 rounded-md border bg-card p-4 animate-fade-in">
        <p className="text-sm font-medium text-slate-300">Acteur principal</p>
        <div className="flex items-center gap-3 rounded-md bg-slate-900/60 px-3 py-3 border border-dashed border-slate-700">
          <span className="text-2xl opacity-30">🗺️</span>
          <p className="text-sm text-muted-foreground">Aucun acteur identifié pour ce territoire à cette période.</p>
        </div>
      </section>
    );
  }

  const confStyle = CONFIDENCE_STYLES[actor.confidence_level] ?? CONFIDENCE_STYLES.debated;

  return (
    <section className="flex flex-col gap-4 rounded-md border bg-card p-4 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Acteur principal</p>
          <p className="text-base font-bold text-slate-100 leading-tight">{actor.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Pic d&apos;influence : <span className="tabular-nums text-slate-300 font-medium">{actor.peak_year}</span></p>
        </div>
        <Badge
          variant={confStyle.variant}
          className="shrink-0"
          style={{ borderColor: confStyle.color + "40", color: confStyle.color }}
        >
          {confStyle.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatCard
          label="Population touchée"
          value={`${actor.population_affected_M} M hab.`}
        />
        <StatCard
          label="Extraction économique"
          value={
            actor.economic_extraction_estimate_B_USD !== null
              ? `${actor.economic_extraction_estimate_B_USD} G$`
              : "n/a"
          }
        />
        <StatCard
          label="Poids de responsabilité"
          value={`${(actor.responsibility_weight * 100).toFixed(0)}%`}
        />
        <StatCard
          label="Territoires contrôlés"
          value={`${actor.territories_controlled.length} pays`}
        />
      </div>

      {/* Responsibility bar */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Indice de responsabilité</span>
          <span className="font-semibold text-slate-300">{(actor.responsibility_weight * 100).toFixed(0)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${actor.responsibility_weight * 100}%`,
              background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))"
            }}
          />
        </div>
      </div>

      {actor.context_short ? (
        <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 pl-2.5 border-primary/50 bg-slate-900/40 py-1.5 rounded-r">
          {actor.context_short}
        </p>
      ) : null}

      {actor.disclaimer ? (
        <div className="rounded-md bg-[#e63946]/10 border border-[#e63946]/20 px-3 py-2 text-xs text-[#e63946] leading-relaxed">
          ⚠️ {actor.disclaimer}
        </div>
      ) : null}
    </section>
  );
}
