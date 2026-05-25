/**
 * lib/arcs.ts — Building dynamic arcs for Globe3D
 */
import type { Actor } from "./types";

export interface Arc {
  from: [number, number]; // [lng, lat]
  to: [number, number];   // [lng, lat]
  label: string;
  color: string;
  value: number;
}

/** Helper to convert hex color to rgba */
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Builds arcs between each actor and its controlled territories.
 * The arc color is derived from the theme's primary color, with opacity 
 * scaled by the actor's responsibility weight.
 */
export function buildArcs(
  actors: Actor[],
  centroids: Record<string, { lat: number; lng: number; label: string }>,
  colorTheme = "#e63946"
): Arc[] {
  const arcs: Arc[] = [];

  for (const actor of actors) {
    const actorId = actor.id.toUpperCase();
    const actorCentroid = centroids[actorId];
    if (!actorCentroid) continue;

    const fromCoord: [number, number] = [actorCentroid.lng, actorCentroid.lat];
    
    // Scale opacity based on responsibility weight: 0.15 min to 0.8 max
    const opacity = 0.15 + actor.responsibility_weight * 0.65;
    const color = hexToRgba(colorTheme, opacity);

    for (const territoryCode of actor.territories_controlled) {
      const terrId = territoryCode.toUpperCase();
      if (terrId === actorId) {
        // Don't draw an arc to oneself
        continue;
      }

      const territoryCentroid = centroids[terrId];
      if (!territoryCentroid) continue;

      const toCoord: [number, number] = [territoryCentroid.lng, territoryCentroid.lat];
      
      const label = `${actor.label} → ${territoryCentroid.label} (${actor.label})`;

      arcs.push({
        from: fromCoord,
        to: toCoord,
        label,
        color,
        value: actor.responsibility_weight
      });
    }
  }

  return arcs;
}
