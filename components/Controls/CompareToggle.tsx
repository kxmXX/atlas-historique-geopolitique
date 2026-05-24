import { Badge } from "@/components/ui/badge";

export function CompareToggle() {
  return (
    <section className="flex items-center justify-between rounded-md border bg-card p-3">
      <div>
        <p className="text-sm font-medium">Comparateur 2 époques</p>
        <p className="text-xs text-muted-foreground">Prévu V2, état désactivé en V1.</p>
      </div>
      <Badge variant="outline">V2</Badge>
    </section>
  );
}
