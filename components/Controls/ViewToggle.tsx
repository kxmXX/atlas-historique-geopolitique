"use client";

import { Globe, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = "globe" | "map";

type ViewToggleProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <section className="flex flex-col gap-2">
      <p className="text-sm font-medium">Vue</p>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          size="sm"
          variant={value === "globe" ? "default" : "outline"}
          className={cn("h-auto justify-start gap-2 px-3 py-2 text-sm", value === "globe" && "shadow")}
          onClick={() => onChange("globe")}
        >
          <Globe className="size-4" />
          Globe 3D
        </Button>
        <Button
          type="button"
          size="sm"
          variant={value === "map" ? "default" : "outline"}
          className={cn("h-auto justify-start gap-2 px-3 py-2 text-sm", value === "map" && "shadow")}
          onClick={() => onChange("map")}
        >
          <Map className="size-4" />
          Carte
        </Button>
      </div>
    </section>
  );
}
