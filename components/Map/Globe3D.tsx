"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { Actor } from "@/lib/types";
import { centroids, iso3ToIso2 } from "@/lib/centroids";
import { buildArcs, type Arc } from "@/lib/arcs";
import { getCountryColor } from "@/lib/colors";
import { getFlagEmojiSafe } from "@/lib/flagEmoji";

/* ------------------------------------------------------------------ */
/*  Dynamic import so react-globe.gl + three don't break SSR           */
/* ------------------------------------------------------------------ */
const Globe = dynamic(() => import("react-globe.gl").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm shadow-sm">
        <Loader2 className="animate-spin" aria-hidden="true" />
        Chargement du globe...
      </div>
    </div>
  )
});

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
export type GlobeHover = {
  name: string;
  iso3?: string;
  point: { x: number; y: number };
};

export type GlobeSelection = {
  name: string;
  iso3?: string;
  properties: Record<string, unknown>;
};

type Globe3DProps = {
  themeId: string;
  actors: Actor[];
  themeColor: string;
  onHover: (territory: GlobeHover | null) => void;
  onSelect: (territory: GlobeSelection) => void;
};

export function Globe3D({ themeId, actors, themeColor, onHover, onSelect }: Globe3DProps) {
  const [, setRerender] = useState(0);
  const globeRef = useRef<any>(null);
  const [polygons, setPolygons] = useState<GeoJSON.FeatureCollection | null>(null);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  /* ---------- load countries GeoJSON ---------- */
  useEffect(() => {
    fetch("/data/geo/globe-countries-110m.geojson")
      .then((r) => r.json())
      .then((data: GeoJSON.FeatureCollection) => setPolygons(data))
      .catch(() => setPolygons(null));
  }, []);

  /* ---------- responsive sizing ---------- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: Math.max(width, 200), height: Math.max(height, 200) });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  /* ---------- derived data ---------- */
  const arcs = useMemo(() => buildArcs(actors, centroids, themeColor), [actors, themeColor]);

  const markers = useMemo(() => {
    return actors
      .map((actor) => {
        const centroid = centroids[actor.id.toUpperCase()];
        if (!centroid) return null;
        return {
          lat: centroid.lat,
          lng: centroid.lng,
          actor
        };
      })
      .filter(Boolean) as Array<{ lat: number; lng: number; actor: Actor }>;
  }, [actors]);

  /* ---------- polygon colour fn ---------- */
  const polygonCapColor = useCallback(
    (feature: any) => {
      const props = feature?.properties ?? {};
      // 110m GeoJSON uses uppercase keys: ISO_A2, ISO_A3, ADM0_A3, NAME
      let iso2 = (props.ISO_A2 ?? props.WB_A2 ?? props.FIPS_10_ ?? "").toUpperCase();
      const iso3 = (props.ISO_A3 ?? props.ADM0_A3 ?? props.SOV_A3 ?? "").toUpperCase();
      const name  = props.NAME ?? props.ADMIN ?? "";

      // Fallback: iso3→iso2 lookup
      if ((!iso2 || iso2 === "-99") && iso3 && iso3ToIso2[iso3]) {
        iso2 = iso3ToIso2[iso3];
      }

      // Manual overrides for Natural Earth -99 anomalies
      if (name === "France")  iso2 = "FR";
      else if (name === "Norway") iso2 = "NO";
      else if (name === "Kosovo") iso2 = "XK";

      return getCountryColor(iso2, actors, 0.85);
    },
    [actors]
  );


  /* ---------- polygon side colour ---------- */
  const polygonSideColor = useCallback(() => "#0f1923", []);

  /* ---------- arc label ---------- */
  const arcLabel = useCallback((arc: object) => (arc as Arc).label ?? "", []);

  /* ---------- globe ready ---------- */
  const handleGlobeReady = useCallback(() => setReady(true), []);

  /* ---------- interactions ---------- */
  const handlePolygonHover = useCallback(
    (polygon: any | null, _prev: any | null) => {
      if (!polygon) {
        onHover(null);
        return;
      }
      const props = polygon?.properties ?? {};
      const name = String(props.NAME ?? props.ADMIN ?? props.NAME_LONG ?? "");
      const iso3 = props.ISO_A3 ?? props.ADM0_A3 ?? props.SOV_A3;
      onHover({
        name: name || "Territoire",
        iso3: typeof iso3 === "string" && iso3 !== "-99" ? iso3 : undefined,
        point: { x: 0, y: 0 }
      });
    },
    [onHover]
  );

  const handlePolygonClick = useCallback(
    (polygon: any | null) => {
      if (!polygon) return;
      const props = polygon?.properties ?? {};
      const name = String(props.NAME ?? props.ADMIN ?? props.NAME_LONG ?? "");
      const iso3 = props.ISO_A3 ?? props.ADM0_A3 ?? props.SOV_A3;
      onSelect({
        name: name || "Territoire",
        iso3: typeof iso3 === "string" && iso3 !== "-99" ? iso3 : undefined,
        properties: props
      });
    },
    [onSelect]
  );

  /* ---------- html element marker for actor flag ---------- */
  const htmlElementFn = useCallback(
    (marker: any) => {
      const actor = marker.actor;
      const el = document.createElement("div");
      
      // Premium CSS for markers with themeColor shadow and outline
      el.className = "flex items-center gap-1.5 bg-slate-950/90 text-[10px] px-2 py-0.5 rounded-full border border-slate-700 shadow-lg text-white pointer-events-none whitespace-nowrap select-none backdrop-blur-xs font-medium";
      el.style.borderColor = themeColor;
      el.style.boxShadow = `0 0 10px ${themeColor}60`;
      
      const flag = getFlagEmojiSafe(actor.id);
      el.innerHTML = `<span class="text-xs">${flag}</span><span>${actor.label}</span>`;
      return el;
    },
    [themeColor]
  );

  /* ---------- after mount, force a re-render so the dynamic Globe loads ---------- */
  useEffect(() => {
    setRerender(1);
  }, []);

  /* ---------- render ---------- */
  return (
    <div ref={containerRef} className="absolute inset-0" style={{ background: "#040d16" }}>
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#0a1628] via-[#050d18] to-[#020508]" />

      {polygons ? (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="/data/geo/earth-blue-marble.jpg"
          backgroundImageUrl="/data/geo/night-sky.png"
          polygonsData={polygons.features}
          polygonCapColor={polygonCapColor}
          polygonSideColor={polygonSideColor}
          polygonStrokeColor={() => "#1e3a5f"}
          polygonAltitude={0.008}
          arcsData={arcs}
          arcColor="color"
          arcAltitudeAutoScale={0.4}
          arcStroke={0.8}
          arcDashLength={0.5}
          arcDashGap={0.15}
          arcDashAnimateTime={2000}
          arcLabel={arcLabel}
          arcsTransitionDuration={600}
          onPolygonHover={handlePolygonHover}
          onPolygonClick={handlePolygonClick}
          onGlobeReady={handleGlobeReady}
          enablePointerInteraction
          atmosphereColor={themeColor}
          atmosphereAltitude={0.25}
          htmlElementsData={markers}
          htmlLat="lat"
          htmlLng="lng"
          htmlElement={htmlElementFn}
          htmlAltitude={0.02}
          rendererConfig={{ antialias: true, alpha: true }}
        />
      ) : null}

      {/* Premium loading overlay */}
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#040d16]/90 backdrop-blur-sm z-10 pointer-events-none gap-4">
          <div className="relative">
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full border-2 animate-spin-slow opacity-30"
              style={{ borderColor: themeColor }}
            />
            {/* Inner spinner */}
            <div
              className="size-14 rounded-full border-2 border-transparent animate-spin"
              style={{ borderTopColor: themeColor, borderRightColor: themeColor + "40" }}
            />
            {/* Center dot */}
            <div
              className="absolute inset-0 m-auto size-4 rounded-full animate-pulse"
              style={{ background: themeColor + "80" }}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-semibold text-slate-200">Chargement du globe 3D</p>
            <p className="text-xs text-muted-foreground">Initialisation Three.js…</p>
          </div>
        </div>
      )}

      {/* Top-left: theme indicator */}
      {ready && (
        <div
          className="absolute left-4 top-4 animate-slide-up rounded-xl border bg-slate-950/80 px-3 py-2 text-xs text-slate-300 shadow-lg backdrop-blur"
          style={{ borderColor: `${themeColor}50` }}
        >
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="inline-block size-2 rounded-full animate-pulse"
              style={{ background: themeColor, boxShadow: `0 0 6px ${themeColor}` }}
            />
            <p className="font-bold text-slate-100 text-[11px] uppercase tracking-widest">Globe 3D</p>
          </div>
          <p className="text-slate-500 text-[10px]">{arcs.length} flux · {markers.length} acteurs</p>
        </div>
      )}

      {/* Bottom-right: interaction hint */}
      {ready && (
        <div className="absolute bottom-4 right-4 animate-fade-in text-[10px] text-slate-600 text-right pointer-events-none">
          <p>Cliquer sur un pays pour les détails</p>
          <p>Faire glisser pour tourner le globe</p>
        </div>
      )}
    </div>
  );
}


