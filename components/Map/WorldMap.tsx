"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { type GeoJSONSource, type MapMouseEvent } from "maplibre-gl";
import { Loader2 } from "lucide-react";

type GeoManifest = {
  current: {
    path: string;
  };
  historical: Array<{
    year: number;
    path: string;
  }>;
};

export type TerritoryHover = {
  name: string;
  iso3?: string;
  point: {
    x: number;
    y: number;
  };
};

export type TerritorySelection = {
  name: string;
  iso3?: string;
  properties: Record<string, unknown>;
};

type WorldMapProps = {
  themeId: string;
  year: number;
  onHover: (territory: TerritoryHover | null) => void;
  onSelect: (territory: TerritorySelection) => void;
};

const baseStyle: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors"
    }
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
      paint: {
        "raster-saturation": -0.75,
        "raster-contrast": 0.08,
        "raster-opacity": 0.82
      }
    }
  ]
};

function getTerritoryName(properties: Record<string, unknown>) {
  return String(properties.name ?? properties.NAME ?? properties.NAME_LONG ?? properties.ADMIN ?? "Territoire");
}

function getIso3(properties: Record<string, unknown>) {
  const value = properties["ISO3166-1-Alpha-3"] ?? properties.ISO_A3 ?? properties.ADM0_A3;
  return typeof value === "string" && value !== "-99" ? value : undefined;
}

function nearestHistoricalLayer(manifest: GeoManifest | null, year: number) {
  if (!manifest?.historical.length) {
    return null;
  }

  return manifest.historical.reduce((closest, item) => {
    return Math.abs(item.year - year) < Math.abs(closest.year - year) ? item : closest;
  }, manifest.historical[0]);
}

export function WorldMap({ themeId, year, onHover, onSelect }: WorldMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [manifest, setManifest] = useState<GeoManifest | null>(null);
  const [isReady, setIsReady] = useState(false);
  const historicalLayer = useMemo(() => nearestHistoricalLayer(manifest, year), [manifest, year]);

  useEffect(() => {
    fetch("/data/geo/manifest.json")
      .then((response) => response.json())
      .then((nextManifest: GeoManifest) => setManifest(nextManifest))
      .catch(() => setManifest(null));
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: baseStyle,
      center: [8, 24],
      zoom: 1.35,
      minZoom: 1,
      maxZoom: 6,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => {
      map.addSource("current-countries", {
        type: "geojson",
        data: "/data/geo/countries.geojson"
      });

      map.addLayer({
        id: "country-fill",
        type: "fill",
        source: "current-countries",
        paint: {
          "fill-color": [
            "match",
            ["get", "ISO3166-1-Alpha-3"],
            ["IND", "AUS", "NGA", "ZAF", "EGY"],
            "#0f766e",
            "#d4c7b0"
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.62,
            0.28
          ]
        }
      });

      map.addLayer({
        id: "country-line",
        type: "line",
        source: "current-countries",
        paint: {
          "line-color": "#31536a",
          "line-opacity": 0.38,
          "line-width": 0.7
        }
      });

      setIsReady(true);
    });

    const handleMove = (event: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(event.point, { layers: ["country-fill"] });
      if (!features.length) {
        map.getCanvas().style.cursor = "";
        onHover(null);
        return;
      }

      const properties = features[0].properties as Record<string, unknown>;
      map.getCanvas().style.cursor = "pointer";
      onHover({
        name: getTerritoryName(properties),
        iso3: getIso3(properties),
        point: event.point
      });
    };

    const handleClick = (event: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(event.point, { layers: ["country-fill"] });
      if (!features.length) {
        return;
      }

      const properties = features[0].properties as Record<string, unknown>;
      onSelect({
        name: getTerritoryName(properties),
        iso3: getIso3(properties),
        properties
      });
    };

    map.on("mousemove", handleMove);
    map.on("mouseleave", "country-fill", () => onHover(null));
    map.on("click", handleClick);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onHover, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isReady || !historicalLayer) {
      return;
    }

    const updateHistoricalLayer = async () => {
      const response = await fetch(historicalLayer.path);
      const data = await response.json();
      const source = map.getSource("historical-borders") as GeoJSONSource | undefined;

      if (source) {
        source.setData(data);
        return;
      }

      map.addSource("historical-borders", {
        type: "geojson",
        data
      });

      map.addLayer({
        id: "historical-line",
        type: "line",
        source: "historical-borders",
        paint: {
          "line-color": "#7c2d12",
          "line-opacity": 0.58,
          "line-width": ["interpolate", ["linear"], ["zoom"], 1, 0.4, 4, 1.4],
          "line-dasharray": [3, 2]
        }
      });
    };

    updateHistoricalLayer().catch(() => undefined);
  }, [historicalLayer, isReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isReady || !map.getLayer("country-fill")) {
      return;
    }

    const highlightedTerritories = themeId === "colonisation" ? ["IND", "AUS", "NGA", "ZAF", "EGY"] : [];
    if (highlightedTerritories.length === 0) {
      map.setPaintProperty("country-fill", "fill-color", "#d4c7b0");
      return;
    }

    map.setPaintProperty("country-fill", "fill-color", [
      "match",
      ["get", "ISO3166-1-Alpha-3"],
      highlightedTerritories,
      "#0f766e",
      "#d4c7b0"
    ]);
  }, [themeId, isReady]);

  return (
    <div className="relative size-full">
      <div ref={mapContainerRef} className="absolute inset-0" />
      {!isReady ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm shadow-sm">
            <Loader2 className="animate-spin" aria-hidden="true" />
            Chargement carte
          </div>
        </div>
      ) : null}
      <div className="absolute left-4 top-4 rounded-md border bg-background/92 px-3 py-2 text-xs shadow-sm backdrop-blur">
        <p className="font-medium">Frontières historiques: {historicalLayer?.year ?? "n/a"}</p>
        <p className="text-muted-foreground">Thème: {themeId}</p>
      </div>
    </div>
  );
}
