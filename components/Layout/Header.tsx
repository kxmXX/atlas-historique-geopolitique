import { Globe2, ShieldCheck, BookOpen, Github, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex min-h-14 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
          <Globe2 className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight md:text-lg">
            Atlas historique <span className="text-muted-foreground">&amp;</span> géopolitique
          </h1>
          <p className="hidden text-[11px] text-muted-foreground sm:block">
            Carte interactive &middot; Timeline &middot; Sources visibles
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="hidden gap-1.5 md:inline-flex" asChild>
          <Link href="/methodologie">
            <Scale className="size-3" aria-hidden="true" />
            Méthodologie
          </Link>
        </Button>
        <Badge variant="secondary" className="hidden gap-1.5 md:inline-flex">
          <ShieldCheck className="size-3" aria-hidden="true" />
          Sans LLM utilisateur
        </Badge>
        <Badge variant="outline" className="hidden gap-1.5 md:inline-flex">
          <BookOpen className="size-3" aria-hidden="true" />
          V1
        </Badge>
        <Button variant="ghost" size="icon" className="size-8" asChild>
          <a href="https://github.com/kxmXX/atlas-historique-geopolitique" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="size-4" />
          </a>
        </Button>
      </div>
    </header>
  );
}
