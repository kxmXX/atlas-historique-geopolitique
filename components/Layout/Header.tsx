import { BookOpen, Globe2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Globe2 aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold md:text-lg">Atlas historique & géopolitique</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Carte interactive, timeline et sources visibles pour chaque donnée.
          </p>
        </div>
      </div>
      <div className="hidden items-center gap-2 md:flex">
        <Badge variant="secondary" className="gap-1.5">
          <ShieldCheck aria-hidden="true" />
          Sans LLM utilisateur
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <BookOpen aria-hidden="true" />
          V1 français
        </Badge>
      </div>
    </header>
  );
}
