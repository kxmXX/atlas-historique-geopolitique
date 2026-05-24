import { Badge } from "@/components/ui/badge";

export function ActorCard() {
  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Acteur principal</p>
          <p className="text-sm text-muted-foreground">À connecter aux fichiers `/data/themes/*.json`.</p>
        </div>
        <Badge variant="outline">debated</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Pondération</p>
          <p className="font-medium">Pré-générée</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Sources requises</p>
          <p className="font-medium">2 minimum</p>
        </div>
      </div>
    </section>
  );
}
