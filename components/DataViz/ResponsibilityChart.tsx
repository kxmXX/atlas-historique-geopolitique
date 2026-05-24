import { Badge } from "@/components/ui/badge";

type ResponsibilityChartProps = {
  themeId: string;
  year: number;
};

export function ResponsibilityChart({ themeId, year }: ResponsibilityChartProps) {
  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Pondération acteurs</p>
        <Badge variant="outline">D3 J5</Badge>
      </div>
      <div className="flex h-24 items-end gap-2">
        {[38, 26, 18, 12, 6].map((height, index) => (
          <div key={`${themeId}-${year}-${index}`} className="flex flex-1 flex-col justify-end gap-1">
            <div className="rounded-sm bg-primary/80" style={{ height: `${height * 2}px` }} />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Aperçu visuel temporaire. La normalisation réelle arrive avec le pipeline données.
      </p>
    </section>
  );
}
