"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActorSource } from "@/lib/theme-loader";

type SourcesListProps = {
  sources: ActorSource[];
};

export function SourcesList({ sources }: SourcesListProps) {
  if (sources.length === 0) {
    return (
      <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
        <p className="text-sm font-medium">Sources</p>
        <p className="text-sm text-muted-foreground">Aucune source listée.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
      <p className="text-sm font-medium">Sources ({sources.length})</p>
      <ul className="flex flex-col gap-2">
        {sources.map((source, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 shrink-0 text-muted-foreground">[{index + 1}]</span>
            <span className="text-muted-foreground leading-relaxed">
              {source.ref}
              {source.url ? (
                <Button
                  variant="link"
                  size="sm"
                  className="inline-flex h-auto gap-1 px-0 text-xs font-normal"
                  asChild
                >
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3" />
                    Lien
                  </a>
                </Button>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
