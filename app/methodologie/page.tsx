import { Header } from "@/components/Layout/Header";
import { BookOpen, ShieldCheck, AlertTriangle, Database, Globe2, Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Méthodologie — Atlas historique & géopolitique",
  description: "Comment les données sont collectées, pondérées et validées sur l'Atlas historique & géopolitique."
};

export default function MethodologiePage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link href="/">
              <ArrowLeft className="size-4" />
              Retour à l&apos;atlas
            </Link>
          </Button>
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">Méthodologie</h1>
        <p className="mb-8 text-muted-foreground">
          Transparence sur la collecte, la pondération et la validation des données présentées dans cet atlas.
        </p>

        {/* Principes */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Scale className="size-5 text-primary" />
            Principes fondateurs
          </h2>
          <div className="grid gap-4">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-1 font-semibold">1. Aucune donnée sans source</h3>
              <p className="text-sm text-muted-foreground">
                Chaque chiffre affiché dans l&apos;atlas est accompagné de sa source. Même les données générées par IA sont déclarées comme telles, avec la mention explicite du processus de génération.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-1 font-semibold">2. Niveaux de confiance visibles</h3>
              <p className="text-sm text-muted-foreground">
                Chaque donnée reçoit un niveau de confiance — <strong>Haute confiance</strong>, <strong>Confiance moyenne</strong> ou <strong>Débattu</strong> — affiché dans l&apos;interface. Ce niveau reflète la qualité et la convergence des sources disponibles.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-1 font-semibold">3. Disclaimer automatique</h3>
              <p className="text-sm text-muted-foreground">
                Dès qu&apos;une donnée est marquée &quot;Débattu&quot;, un disclaimer méthodologique s&apos;affiche automatiquement dans la fiche territoire, expliquant les limites de l&apos;estimation.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-1 font-semibold">4. Contenu pré-généré, zéro LLM côté utilisateur</h3>
              <p className="text-sm text-muted-foreground">
                Tout le contenu de l&apos;atlas est statique et pré-généré. Aucun modèle de langage n&apos;est appelé pendant la navigation. Les agents IA servent uniquement à construire le site, pas à le faire fonctionner.
              </p>
            </div>
          </div>
        </section>

        {/* Données */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Database className="size-5 text-primary" />
            Sources des données
          </h2>
          <div className="rounded-lg border bg-card p-4">
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <strong>Données économiques historiques :</strong> Maddison Project Database, CLIO-INFRA, World Bank, BP Statistical Review of World Energy.
              </li>
              <li>
                <strong>Données démographiques :</strong> UNHCR Global Trends, IOM World Migration Report, IDMC, US Census Bureau Historical Statistics.
              </li>
              <li>
                <strong>Données militaires et conflits :</strong> Correlates of War Project, UCDP/PRIO Armed Conflict Dataset, ACLED, SIPRI Military Expenditure Database.
              </li>
              <li>
                <strong>Données géographiques :</strong> Natural Earth (datasets/geo-countries), aourednik/historical-basemaps (frontières historiques).
              </li>
              <li>
                <strong>Données sur la traite :</strong> Slave Voyages Database (Eltis &amp; Richardson).
              </li>
              <li>
                <strong>Données géopolitiques :</strong> OTAN, votes ONU (UNGA), Eurostat.
              </li>
            </ul>
          </div>
        </section>

        {/* Pondération */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Scale className="size-5 text-primary" />
            Comment la pondération est calculée
          </h2>
          <div className="rounded-lg border bg-card p-4">
            <p className="mb-4 text-sm text-muted-foreground">
              Le <code>responsibility_weight</code> de chaque acteur est calculé via une pondération factuelle en trois axes :
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-muted p-3 text-center">
                <p className="text-lg font-bold text-primary">40%</p>
                <p className="text-xs text-muted-foreground">Poids économique (volume extraction / échanges)</p>
              </div>
              <div className="rounded-md bg-muted p-3 text-center">
                <p className="text-lg font-bold text-primary">35%</p>
                <p className="text-xs text-muted-foreground">Poids territorial (superficie contrôlée × durée)</p>
              </div>
              <div className="rounded-md bg-muted p-3 text-center">
                <p className="text-lg font-bold text-primary">25%</p>
                <p className="text-xs text-muted-foreground">Poids démographique (population touchée)</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Les poids sont normalisés pour que la somme des <code>responsibility_weight</code> par thème × période soit égale à 1,0 — permettant une comparaison visuelle équitable entre acteurs au sein d&apos;un même contexte.
            </p>
          </div>
        </section>

        {/* Validation */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <ShieldCheck className="size-5 text-primary" />
            Règles de validation
          </h2>
          <div className="rounded-lg border bg-card p-4">
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>✓ Tout <code>responsibility_weight</code> &gt; 0 exige au minimum <strong>2 sources</strong> distinctes.</li>
              <li>✓ Si une seule source est disponible, <code>confidence_level</code> passe à <code>&quot;debated&quot;</code> et un <code>disclaimer</code> est renseigné.</li>
              <li>✓ Chaque territoire référencé doit exister dans les fichiers GeoJSON de l&apos;atlas.</li>
              <li>✓ Les années doivent être dans la plage de la période déclarée.</li>
              <li>✓ La somme des <code>responsibility_weight</code> d&apos;une période = 1,0 ± 0,001.</li>
              <li>✓ Les thèmes sont validés automatiquement au build via <code>scripts/validate-themes.ts</code> (Zod).</li>
            </ul>
          </div>
        </section>

        {/* Limites */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <AlertTriangle className="size-5 text-amber-600" />
            Limites et précautions
          </h2>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
            <ul className="flex flex-col gap-2 text-sm text-amber-900 dark:text-amber-200">
              <li>Les données historiques — en particulier pour les périodes antérieures à 1900 — sont par nature des <strong>estimations</strong> fondées sur des travaux de recherche qui peuvent diverger.</li>
              <li>L&apos;extraction économique est estimée en dollars US constants pour permettre des comparaisons, mais cette conversion comporte des limites méthodologiques (pouvoir d&apos;achat, inflation sur longue période).</li>
              <li>Les frontières historiques sont approximatives : les tracés exacts varient selon les sources et les époques.</li>
              <li>Cet atlas est un <strong>outil éducatif</strong>, pas une source académique primaire. Pour des travaux de recherche, consultez les sources originales listées dans chaque fiche.</li>
            </ul>
          </div>
        </section>

        {/* Thèmes */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Globe2 className="size-5 text-primary" />
            Les 6 thèmes V1
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">Colonisation européenne</h3>
              <p className="text-xs text-muted-foreground">1500–1960</p>
              <p className="mt-1 text-sm text-muted-foreground">Contrôle territorial, extraction économique et effets démographiques des empires européens. 8 empires couverts, basés sur Maddison Project et CLIO-INFRA.</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">Traite négrière &amp; esclavage</h3>
              <p className="text-xs text-muted-foreground">1500–1900</p>
              <p className="mt-1 text-sm text-muted-foreground">Flux de déportation transatlantique basés sur la Slave Voyages Database. 7 acteurs couvrant les routes principales.</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">Guerres &amp; conflits majeurs</h3>
              <p className="text-xs text-muted-foreground">1800–2026</p>
              <p className="mt-1 text-sm text-muted-foreground">Conflits interétatiques et guerres civiles, basés sur Correlates of War, UCDP/PRIO et ACLED. 3 périodes distinctes.</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">Influence géopolitique contemporaine</h3>
              <p className="text-xs text-muted-foreground">1945–2026</p>
              <p className="mt-1 text-sm text-muted-foreground">Institutions, dépenses militaires (SIPRI), alliances et leviers économiques (World Bank). 11 puissances majeures.</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">Exploitation des ressources</h3>
              <p className="text-xs text-muted-foreground">1850–2026</p>
              <p className="mt-1 text-sm text-muted-foreground">Production et commerce des ressources énergétiques et minières. BP Statistical Review, USGS.</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">Déplacements de populations</h3>
              <p className="text-xs text-muted-foreground">1900–2026</p>
              <p className="mt-1 text-sm text-muted-foreground">Migrations forcées, réfugiés, déplacés internes. Données UNHCR, IOM et IDMC.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
