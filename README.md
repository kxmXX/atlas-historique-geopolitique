# Atlas historique & géopolitique

Site éducatif public en français pour explorer des thèmes historiques et géopolitiques via carte interactive, filtres et timeline.

## Décisions J1

- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui.
- Carte: MapLibre GL JS avec fond OSM raster, sans clé API payante.
- Visualisations: D3 prévu pour les graphiques J5.
- Data V1: fichiers JSON/GeoJSON statiques, pas de base de données.
- Données utilisateur: aucun LLM côté utilisateur, contenu pré-généré.
- Hébergement cible: Vercel preview puis production.

## Commandes

```bash
npm run dev
npm run typecheck
npm run lint
npm run validate:data
npm run build
```

## Structure

- `/app`: pages Next.js.
- `/components`: carte, contrôles, panneau d’information, visualisations et layout.
- `/data/themes`: thèmes JSON respectant le schéma V1.
- `/data/schemas/theme.schema.json`: contrat de données.
- `/data/sources`: journaux de sources et pondération.
- `/public/data/geo`: GeoJSON servis au client.
- `/scripts/validate-themes.ts`: validation des règles qualité critiques.

## Sources géographiques J1

- Pays actuels: https://github.com/datasets/geo-countries
- Frontières historiques: https://github.com/aourednik/historical-basemaps

## Règle qualité implémentée

`scripts/validate-themes.ts` bloque les thèmes dont `responsibility_weight` est présent avec moins de deux sources sans `confidence_level: "debated"` et sans `disclaimer`.
