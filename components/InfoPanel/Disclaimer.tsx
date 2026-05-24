"use client";

import { AlertTriangle } from "lucide-react";

type DisclaimerProps = {
  text: string | null;
  confidenceLevel?: string;
};

export function Disclaimer({ text, confidenceLevel }: DisclaimerProps) {
  if (!text && confidenceLevel !== "debated") {
    return null;
  }

  const displayText = text ?? "Les données affichées présentent un niveau de confiance débattu. Les chiffres sont des estimations et doivent être interprétés avec prudence.";

  return (
    <section className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <p className="leading-relaxed">{displayText}</p>
    </section>
  );
}
