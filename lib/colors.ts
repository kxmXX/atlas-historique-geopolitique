/**
 * lib/colors.ts — Colorimétrie dynamique des pays sur le globe
 * Palette : neutre sombre → orange → rouge intense selon responsibility_weight
 */

import type { Actor } from './types'

/** Interpolation linéaire entre deux couleurs hex selon t (0 → 1) */
export function interpolateColor(colorA: string, colorB: string, t: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))

  const parseHex = (hex: string) => {
    const clean = hex.replace('#', '')
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16)
    }
  }

  const a = parseHex(colorA)
  const b = parseHex(colorB)

  const r = clamp(a.r + (b.r - a.r) * t)
  const g = clamp(a.g + (b.g - a.g) * t)
  const bl = clamp(a.b + (b.b - a.b) * t)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`
}

const PALETTE_LOW    = '#1a1a2e'   // neutre sombre
const PALETTE_MID    = '#f4a261'   // orange (poids moyen)
const PALETTE_HIGH   = '#e63946'   // rouge intense (poids élevé)
const PALETTE_NEUTRAL = 'rgba(20, 20, 35, 0.7)'

/**
 * Retourne la couleur d'un pays selon son responsibility_weight dans le thème actif.
 * - Pays absent → neutre sombre
 * - Poids 0→0.5 → interpolation PALETTE_LOW → PALETTE_MID
 * - Poids 0.5→1.0 → interpolation PALETTE_MID → PALETTE_HIGH
 */
export function getCountryColor(
  isoCode: string,
  actors: Actor[],
  opacity = 1
): string {
  if (!isoCode || isoCode === '-99') return PALETTE_NEUTRAL

  // Cherche l'acteur par son id (ISO_A2) ou dans ses territories_controlled
  let weight = 0
  let found = false

  for (const actor of actors) {
    if (actor.id.toUpperCase() === isoCode.toUpperCase()) {
      weight = actor.responsibility_weight
      found = true
      break
    }
    // Le pays est un territoire contrôlé par cet acteur
    if (actor.territories_controlled.some(
      (t) => t.toUpperCase() === isoCode.toUpperCase()
    )) {
      // Couleur atténuée pour les territoires (70% du poids de l'acteur)
      weight = actor.responsibility_weight * 0.7
      found = true
      break
    }
  }

  if (!found) return PALETTE_NEUTRAL

  // Interpolation deux étapes
  let hex: string
  if (weight <= 0.5) {
    hex = interpolateColor(PALETTE_LOW, PALETTE_MID, weight / 0.5)
  } else {
    hex = interpolateColor(PALETTE_MID, PALETTE_HIGH, (weight - 0.5) / 0.5)
  }

  if (opacity === 1) return hex

  // Convertir en rgba
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/** Couleur primaire d'un thème avec opacité pour les arcs */
export function getThemeColorWithOpacity(hexColor: string, opacity: number): string {
  const clean = hexColor.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
