/**
 * lib/flagEmoji.ts — Conversion ISO A2 → emoji drapeau Unicode
 * Algorithme : décalage vers les caractères Regional Indicator Symbols (U+1F1E6 à U+1F1FF)
 */

/**
 * Convertit un code ISO 3166-1 Alpha-2 en emoji drapeau.
 * ex: 'FR' → '🇫🇷', 'GB' → '🇬🇧', 'US' → '🇺🇸'
 * Chaque caractère est converti en Regional Indicator Symbol :
 *   'A' (65) → U+1F1E6 (127462), donc offset = 127397
 */
export function getFlagEmoji(isoA2: string): string {
  if (!isoA2 || isoA2.length !== 2) return '🏳️'

  const upper = isoA2.toUpperCase()

  // Vérifier que ce sont bien des lettres A-Z
  if (!/^[A-Z]{2}$/.test(upper)) return '🏳️'

  const codePoint1 = upper.codePointAt(0)! + 127397
  const codePoint2 = upper.codePointAt(1)! + 127397

  return String.fromCodePoint(codePoint1) + String.fromCodePoint(codePoint2)
}

/** Map manuelle pour les cas spéciaux (territoires sans code ISO standard) */
const SPECIAL_FLAGS: Record<string, string> = {
  'UK': '🇬🇧', // UK parfois utilisé au lieu de GB
  'EL': '🇬🇷', // Greece code EU
  'EU': '🇪🇺',
  'UN': '🇺🇳',
}

export function getFlagEmojiSafe(isoA2: string): string {
  if (SPECIAL_FLAGS[isoA2.toUpperCase()]) {
    return SPECIAL_FLAGS[isoA2.toUpperCase()]!
  }
  return getFlagEmoji(isoA2)
}
