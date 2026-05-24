import type { TerritoryHover } from "@/components/Map/WorldMap";

type TooltipOverlayProps = {
  territory: TerritoryHover;
};

export function TooltipOverlay({ territory }: TooltipOverlayProps) {
  return (
    <div
      className="pointer-events-none absolute rounded-md border bg-popover px-3 py-2 text-xs shadow-lg"
      style={{
        left: territory.point.x + 14,
        top: territory.point.y + 14
      }}
    >
      <p className="font-medium">{territory.name}</p>
      <p className="text-muted-foreground">ISO3: {territory.iso3 ?? "n/a"}</p>
    </div>
  );
}
