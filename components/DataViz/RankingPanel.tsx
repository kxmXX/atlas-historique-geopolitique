import { Badge } from "@/components/ui/badge";

type RankingPanelProps = {
  themeId: string;
  year: number;
};

export function RankingPanel({ themeId, year }: RankingPanelProps) {
  const rows = [
    "Territoires associés",
    "Sources disponibles",
    "Confiance méthodologique"
  ];

  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Classement dynamique</p>
        <Badge variant="secondary">{year}</Badge>
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((row, index) => (
          <div key={`${themeId}-${row}`} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{row}</span>
            <span className="font-medium">{index + 1}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
