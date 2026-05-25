/**
 * lib/types.ts — Types centraux du projet Atlas Historique Géopolitique
 */

export type ConfidenceLevel = 'high' | 'medium' | 'debated'

export interface Source {
  ref: string
  url: string | null
}

export interface Actor {
  id: string                              // ISO_A2 code
  label: string
  territories_controlled: string[]        // ISO_A2 codes
  peak_year: number
  population_affected_M: number
  economic_extraction_estimate_B_USD: number | null
  responsibility_weight: number           // 0.0 → 1.0, somme = 1.0 par période
  confidence_level: ConfidenceLevel
  sources: Source[]
  context_short: string                   // 2-3 phrases factuel, français, neutre
  disclaimer: string | null
}

export interface Period {
  period_id: string
  start: number
  end: number
  label: string
  actors: Actor[]
  global_context: string
}

export interface Theme {
  theme_id: string
  theme_label: string
  theme_description: string
  icon: string
  color_primary: string
  periods: Period[]
}

export interface ThemeMeta {
  id: string
  label: string
  description: string
  icon: string
  color_primary: string
  period: [number, number]
}

export type CentroidsMap = Record<string, { lat: number; lng: number; label: string }>
