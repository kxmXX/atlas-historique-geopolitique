"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "atlas-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem(STORAGE_KEY, "refused");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/97 backdrop-blur-lg px-4 py-3 shadow-lg transition-all duration-300 animate-in slide-in-from-bottom">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">Cookies &amp; confidentialité</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cet atlas utilise un cookie de consentement (stockage local) pour mémoriser votre choix. Aucun cookie publicitaire ou traceur tiers n&apos;est déposé sans votre accord. Voir notre{" "}
              <a href="/methodologie" className="underline underline-offset-2 hover:text-foreground">
                méthodologie
              </a>{" "}
              pour plus d&apos;informations.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={refuse}>
            Refuser
          </Button>
          <Button size="sm" onClick={accept}>
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
}
