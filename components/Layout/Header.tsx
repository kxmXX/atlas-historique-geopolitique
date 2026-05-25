"use client";

import { Globe2, ShieldCheck, BookOpen, Github, Scale, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type HeaderProps = {
  onMenuClick?: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex min-h-14 items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80 px-4 md:px-6 z-40 sticky top-0 text-slate-100">
      <div className="flex min-w-0 items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="size-9 lg:hidden text-slate-400 hover:text-white"
            onClick={onMenuClick}
            aria-label="Ouvrir le menu"
          >
            <Menu className="size-5" />
          </Button>
        )}
        <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm shadow-primary/30">
          <Globe2 className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight md:text-lg text-slate-100">
            Atlas historique <span className="text-muted-foreground">&amp;</span> géopolitique
          </h1>
          <p className="hidden text-[11px] text-muted-foreground sm:block">
            Carte interactive &middot; Timeline &middot; Décisions V1
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="hidden gap-1.5 md:inline-flex text-slate-300 hover:text-white" asChild>
          <Link href="/methodologie">
            <Scale className="size-3" aria-hidden="true" />
            Méthodologie
          </Link>
        </Button>
        <Badge variant="secondary" className="hidden gap-1.5 md:inline-flex bg-slate-800 text-slate-300 border-slate-700">
          <ShieldCheck className="size-3" aria-hidden="true" />
          Sans LLM utilisateur
        </Badge>
        <Badge variant="outline" className="hidden gap-1.5 md:inline-flex border-slate-700 text-slate-300">
          <BookOpen className="size-3" aria-hidden="true" />
          V1
        </Badge>
        <Button variant="ghost" size="icon" className="size-8 text-slate-400 hover:text-white" asChild>
          <a
            href="https://github.com/kxmXX/atlas-historique-geopolitique"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github className="size-4" />
          </a>
        </Button>
      </div>
    </header>
  );
}
