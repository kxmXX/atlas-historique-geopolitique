"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { ThemeMeta } from "@/lib/theme-data";

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
  onHover: (territory: GlobeHover | null) => void;
  onSelect: (territory: GlobeSelection) => void;
};

/* ------------------------------------------------------------------ */
/*  Capital / anchor coordinates for flow arcs                        */
/* ------------------------------------------------------------------ */
const CAPITALS: Record<string, [number, number]> = {
  GBR: [-0.1276, 51.5074],   // London
  FRA: [2.3522, 48.8566],    // Paris
  ESP: [-3.7038, 40.4168],   // Madrid
  PRT: [-9.1393, 38.7223],   // Lisbon
  NLD: [4.9041, 52.3676],    // Amsterdam
  BEL: [4.3517, 50.8503],    // Brussels
  DEU: [13.405, 52.52],      // Berlin
  ITA: [12.4964, 41.9028],   // Rome
  RUS: [37.6173, 55.7558],   // Moscow
  TUR: [32.8597, 39.9334],   // Ankara
  USA: [-77.0369, 38.9072],  // Washington DC
  CHN: [116.4074, 39.9042],  // Beijing
  JPN: [139.6917, 35.6895],  // Tokyo
  IND: [77.209, 28.6139],    // New Delhi
  AUS: [149.13, -35.2809],   // Canberra
  NGA: [7.4951, 9.0579],     // Abuja
  ZAF: [28.0473, -26.2041],  // Pretoria
  EGY: [31.2357, 30.0444],   // Cairo
  BRA: [-47.8822, -15.7939], // Brasilia
  CAN: [-75.6972, 45.4215],  // Ottawa
  MEX: [-99.1332, 19.4326],  // Mexico City
  ARG: [-58.3816, -34.6037], // Buenos Aires
  IDN: [106.8456, -6.2088],  // Jakarta
  VNM: [105.8342, 21.0278],  // Hanoi
  DZA: [3.0583, 36.7539],    // Algiers
  COD: [15.3229, -4.3276],   // Kinshasa
  KEN: [36.8219, -1.2921],   // Nairobi
  PER: [-77.0428, -12.0464], // Lima
  COL: [-74.0721, 4.711],    // Bogotá
  CHL: [-70.6483, -33.4489], // Santiago
  MAR: [-6.8498, 34.0209],   // Rabat
  SEN: [-17.4441, 14.7167],  // Dakar
  MLI: [-8.0029, 12.6392],   // Bamako
  GIN: [-13.6775, 9.537],    // Conakry
  CIV: [-5.2851, 5.3608],    // Abidjan
  BEN: [2.6285, 6.4969],     // Cotonou
  TCD: [15.0557, 12.1192],   // N'Djamena
  SDN: [32.5599, 15.5007],   // Khartoum
  ETH: [38.7578, 9.145],     // Addis Ababa
  TZA: [35.7458, -6.1731],   // Dar es Salaam
  MOZ: [32.6052, -25.9692],  // Maputo
  AGO: [13.2343, -8.8368],   // Luanda
  ZWE: [31.0578, -17.8277],  // Harare
  ZMB: [28.2836, -15.4165],  // Lusaka
  GHA: [-0.187, 5.6037],     // Accra
  MRT: [-15.9784, 18.0792],  // Nouakchott
  SOM: [45.3254, 2.04],      // Mogadishu
  YEM: [44.2033, 15.3694],   // Sanaa
  SAU: [46.7167, 24.6333],   // Riyadh
  IRN: [51.389, 35.6892],    // Tehran
  IRQ: [44.3661, 33.3152],   // Baghdad
  SYR: [36.2911, 33.5102],   // Damascus
  AFG: [69.1723, 34.5285],   // Kabul
  PAK: [73.0479, 33.6844],   // Islamabad
  BGD: [90.4125, 23.8103],   // Dhaka
  MMR: [96.1954, 16.8409],   // Yangon
  THA: [100.5018, 13.7563],  // Bangkok
  PHL: [120.9842, 14.5995],  // Manila
  KOR: [126.978, 37.5665],   // Seoul
  UKR: [30.5234, 50.4501],   // Kyiv
  POL: [21.0122, 52.2297],   // Warsaw
  CZE: [14.4378, 50.0755],   // Prague
  HUN: [19.0402, 47.4979],   // Budapest
  AUT: [16.3738, 48.2082],   // Vienna
  CHE: [7.4474, 46.948],     // Bern
  SWE: [18.0686, 59.3293],   // Stockholm
  NOR: [10.7522, 59.9139],   // Oslo
  DNK: [12.5683, 55.6761],   // Copenhagen
  FIN: [24.9384, 60.1699],   // Helsinki
  GRC: [23.7275, 37.9838],   // Athens
  ISR: [35.2137, 31.7683],   // Tel Aviv
  ARE: [55.2708, 25.2048],   // Dubai
  QAT: [51.531, 25.2769],    // Doha
  KWT: [47.9783, 29.3759],   // Kuwait City
  LBN: [35.4955, 33.8886],   // Beirut
  JOR: [35.9399, 31.9539],   // Amman
  TUN: [10.1658, 36.8065],   // Tunis
  LBY: [13.1854, 32.8752],   // Tripoli
  CMR: [11.5026, 3.8628],    // Yaoundé
  UGA: [32.5825, 0.3136],    // Kampala
  RWA: [30.1044, -1.9536],   // Kigali
  BDI: [29.3599, -3.3818],   // Bujumbura
  NER: [2.1157, 13.5012],    // Niamey
  BFA: [-1.5176, 12.3605],   // Ouagadougou
  MWI: [33.7741, -13.9626],  // Lilongwe
  MDG: [47.5167, -18.9108],  // Antananarivo
  NAM: [17.0784, -22.5609],  // Windhoek
  BWA: [25.9122, -24.6569],  // Gaborone
};

/* ------------------------------------------------------------------ */
/*  Theme-specific arc definitions                                    */
/* ------------------------------------------------------------------ */
type ArcDef = {
  from: [number, number];
  to: [number, number];
  label: string;
  color: string;
  value: number;
};

const THEME_ARCS: Record<string, ArcDef[]> = {
  colonisation: [
    { from: CAPITALS.GBR, to: CAPITALS.IND, label: "GB → Inde", color: "#c0392b", value: 1.0 },
    { from: CAPITALS.GBR, to: CAPITALS.AUS, label: "GB → Australie", color: "#c0392b", value: 0.5 },
    { from: CAPITALS.GBR, to: CAPITALS.NGA, label: "GB → Nigeria", color: "#c0392b", value: 0.6 },
    { from: CAPITALS.GBR, to: CAPITALS.ZAF, label: "GB → Afrique du Sud", color: "#c0392b", value: 0.5 },
    { from: CAPITALS.GBR, to: CAPITALS.EGY, label: "GB → Égypte", color: "#c0392b", value: 0.4 },
    { from: CAPITALS.FRA, to: CAPITALS.DZA, label: "FR → Algérie", color: "#2980b9", value: 0.7 },
    { from: CAPITALS.FRA, to: CAPITALS.SEN, label: "FR → Sénégal", color: "#2980b9", value: 0.4 },
    { from: CAPITALS.FRA, to: CAPITALS.VNM, label: "FR → Viêt Nam", color: "#2980b9", value: 0.5 },
    { from: CAPITALS.FRA, to: CAPITALS.MLI, label: "FR → Mali", color: "#2980b9", value: 0.3 },
    { from: CAPITALS.FRA, to: CAPITALS.MAR, label: "FR → Maroc", color: "#2980b9", value: 0.4 },
    { from: CAPITALS.FRA, to: CAPITALS.CIV, label: "FR → Côte d'Ivoire", color: "#2980b9", value: 0.3 },
    { from: CAPITALS.FRA, to: CAPITALS.GIN, label: "FR → Guinée", color: "#2980b9", value: 0.2 },
    { from: CAPITALS.FRA, to: CAPITALS.BEN, label: "FR → Bénin", color: "#2980b9", value: 0.2 },
    { from: CAPITALS.FRA, to: CAPITALS.TCD, label: "FR → Tchad", color: "#2980b9", value: 0.2 },
    { from: CAPITALS.FRA, to: CAPITALS.CMR, label: "FR → Cameroun", color: "#2980b9", value: 0.3 },
    { from: CAPITALS.FRA, to: CAPITALS.MDG, label: "FR → Madagascar", color: "#2980b9", value: 0.3 },
    { from: CAPITALS.ESP, to: CAPITALS.MEX, label: "ES → Mexique", color: "#e67e22", value: 0.6 },
    { from: CAPITALS.ESP, to: CAPITALS.COL, label: "ES → Colombie", color: "#e67e22", value: 0.4 },
    { from: CAPITALS.ESP, to: CAPITALS.PER, label: "ES → Pérou", color: "#e67e22", value: 0.5 },
    { from: CAPITALS.ESP, to: CAPITALS.CHL, label: "ES → Chili", color: "#e67e22", value: 0.3 },
    { from: CAPITALS.ESP, to: CAPITALS.ARG, label: "ES → Argentine", color: "#e67e22", value: 0.4 },
    { from: CAPITALS.ESP, to: CAPITALS.MAR, label: "ES → Maroc", color: "#e67e22", value: 0.2 },
    { from: CAPITALS.PRT, to: CAPITALS.BRA, label: "PT → Brésil", color: "#27ae60", value: 0.6 },
    { from: CAPITALS.PRT, to: CAPITALS.AGO, label: "PT → Angola", color: "#27ae60", value: 0.3 },
    { from: CAPITALS.PRT, to: CAPITALS.MOZ, label: "PT → Mozambique", color: "#27ae60", value: 0.3 },
    { from: CAPITALS.BEL, to: CAPITALS.COD, label: "BE → Congo", color: "#8e44ad", value: 0.5 },
    { from: CAPITALS.NLD, to: CAPITALS.IDN, label: "NL → Indonésie", color: "#16a085", value: 0.4 },
    { from: CAPITALS.NLD, to: CAPITALS.ZAF, label: "NL → Afrique du Sud", color: "#16a085", value: 0.2 },
    { from: CAPITALS.DEU, to: CAPITALS.TZA, label: "DE → Tanzanie", color: "#2c3e50", value: 0.3 },
    { from: CAPITALS.DEU, to: CAPITALS.NAM, label: "DE → Namibie", color: "#2c3e50", value: 0.2 },
    { from: CAPITALS.DEU, to: CAPITALS.CMR, label: "DE → Cameroun", color: "#2c3e50", value: 0.2 },
    { from: CAPITALS.DEU, to: CAPITALS.TGO, label: "DE → Togo", color: "#2c3e50", value: 0.1 },
    { from: CAPITALS.ITA, to: CAPITALS.LBY, label: "IT → Libye", color: "#d35400", value: 0.3 },
    { from: CAPITALS.ITA, to: CAPITALS.SOM, label: "IT → Somalie", color: "#d35400", value: 0.2 },
    { from: CAPITALS.ITA, to: CAPITALS.ETH, label: "IT → Éthiopie", color: "#d35400", value: 0.2 },
    { from: CAPITALS.GBR, to: CAPITALS.GHA, label: "GB → Ghana", color: "#c0392b", value: 0.3 },
    { from: CAPITALS.GBR, to: CAPITALS.KEN, label: "GB → Kenya", color: "#c0392b", value: 0.3 },
    { from: CAPITALS.GBR, to: CAPITALS.SDN, label: "GB → Soudan", color: "#c0392b", value: 0.2 },
    { from: CAPITALS.GBR, to: CAPITALS.ZWE, label: "GB → Zimbabwe", color: "#c0392b", value: 0.2 },
    { from: CAPITALS.GBR, to: CAPITALS.ZMB, label: "GB → Zambie", color: "#c0392b", value: 0.2 },
    { from: CAPITALS.GBR, to: CAPITALS.MMR, label: "GB → Birmanie", color: "#c0392b", value: 0.2 },
    { from: CAPITALS.GBR, to: CAPITALS.PAK, label: "GB → Pakistan", color: "#c0392b", value: 0.3 },
    { from: CAPITALS.GBR, to: CAPITALS.BGD, label: "GB → Bangladesh", color: "#c0392b", value: 0.2 },
    { from: CAPITALS.GBR, to: CAPITALS.CAN, label: "GB → Canada", color: "#c0392b", value: 0.4 },
  ],
  "traite-esclavage": [
    { from: CAPITALS.GBR, to: CAPITALS.GHA, label: "GB → Ghana (Côte de l'Or)", color: "#c0392b", value: 0.6 },
    { from: CAPITALS.GBR, to: CAPITALS.NGA, label: "GB → Nigeria", color: "#c0392b", value: 0.5 },
    { from: CAPITALS.FRA, to: CAPITALS.SEN, label: "FR → Sénégal", color: "#2980b9", value: 0.5 },
    { from: CAPITALS.FRA, to: CAPITALS.BEN, label: "FR → Bénin (Côte des Esclaves)", color: "#2980b9", value: 0.6 },
    { from: CAPITALS.PRT, to: CAPITALS.AGO, label: "PT → Angola", color: "#27ae60", value: 0.7 },
    { from: CAPITALS.PRT, to: CAPITALS.BRA, label: "PT → Brésil", color: "#27ae60", value: 0.8 },
    { from: CAPITALS.ESP, to: CAPITALS.COL, label: "ES → Colombie (Carthagène)", color: "#e67e22", value: 0.4 },
    { from: CAPITALS.NLD, to: CAPITALS.SUR, label: "NL → Suriname", color: "#16a085", value: 0.3 },
    { from: CAPITALS.GBR, to: CAPITALS.JAM, label: "GB → Jamaïque", color: "#c0392b", value: 0.4 },
    { from: CAPITALS.FRA, to: CAPITALS.HTI, label: "FR → Haïti", color: "#2980b9", value: 0.5 },
    { from: CAPITALS.GBR, to: CAPITALS.USA, label: "GB → États-Unis", color: "#c0392b", value: 0.4 },
    { from: CAPITALS.FRA, to: CAPITALS.GIN, label: "FR → Guinée", color: "#2980b9", value: 0.3 },
    { from: CAPITALS.PRT, to: CAPITALS.MOZ, label: "PT → Mozambique", color: "#27ae60", value: 0.3 },
    { from: CAPITALS.GBR, to: CAPITALS.SLE, label: "GB → Sierra Leone", color: "#c0392b", value: 0.2 },
    { from: CAPITALS.FRA, to: CAPITALS.CIV, label: "FR → Côte d'Ivoire", color: "#2980b9", value: 0.2 },
  ],
  conflits: [
    { from: CAPITALS.USA, to: CAPITALS.IRQ, label: "US → Irak", color: "#e74c3c", value: 0.8 },
    { from: CAPITALS.USA, to: CAPITALS.AFG, label: "US → Afghanistan", color: "#e74c3c", value: 0.7 },
    { from: CAPITALS.USA, to: CAPITALS.VNM, label: "US → Vietnam", color: "#e74c3c", value: 0.6 },
    { from: CAPITALS.RUS, to: CAPITALS.UKR, label: "RU → Ukraine", color: "#c0392b", value: 0.9 },
    { from: CAPITALS.RUS, to: CAPITALS.SYR, label: "RU → Syrie", color: "#c0392b", value: 0.5 },
    { from: CAPITALS.USA, to: CAPITALS.KOR, label: "US → Corée", color: "#e74c3c", value: 0.5 },
    { from: CAPITALS.CHN, to: CAPITALS.KOR, label: "CN → Corée", color: "#f39c12", value: 0.4 },
    { from: CAPITALS.FRA, to: CAPITALS.DZA, label: "FR → Algérie", color: "#2980b9", value: 0.4 },
    { from: CAPITALS.GBR, to: CAPITALS.ARG, label: "GB → Argentine (Malouines)", color: "#c0392b", value: 0.3 },
    { from: CAPITALS.IRN, to: CAPITALS.IRQ, label: "IR → Irak", color: "#27ae60", value: 0.4 },
    { from: CAPITALS.IRQ, to: CAPITALS.KWT, label: "IQ → Koweït", color: "#8e44ad", value: 0.3 },
    { from: CAPITALS.ISR, to: CAPITALS.LBN, label: "IL → Liban", color: "#3498db", value: 0.4 },
    { from: CAPITALS.ISR, to: CAPITALS.SYR, label: "IL → Syrie", color: "#3498db", value: 0.3 },
    { from: CAPITALS.ISR, to: CAPITALS.JOR, label: "IL → Jordanie", color: "#3498db", value: 0.2 },
    { from: CAPITALS.CHN, to: CAPITALS.VNM, label: "CN → Vietnam", color: "#f39c12", value: 0.3 },
    { from: CAPITALS.RUS, to: CAPITALS.AFG, label: "RU → Afghanistan", color: "#c0392b", value: 0.4 },
    { from: CAPITALS.USA, to: CAPITALS.SYR, label: "US → Syrie", color: "#e74c3c", value: 0.4 },
    { from: CAPITALS.SAU, to: CAPITALS.YEM, label: "SA → Yémen", color: "#2ecc71", value: 0.5 },
    { from: CAPITALS.TUR, to: CAPITALS.SYR, label: "TR → Syrie", color: "#e67e22", value: 0.3 },
  ],
  "influence-contemporaine": [
    { from: CAPITALS.USA, to: CAPITALS.JPN, label: "US → Japon", color: "#2980b9", value: 0.7 },
    { from: CAPITALS.USA, to: CAPITALS.KOR, label: "US → Corée du Sud", color: "#2980b9", value: 0.6 },
    { from: CAPITALS.USA, to: CAPITALS.DEU, label: "US → Allemagne", color: "#2980b9", value: 0.6 },
    { from: CAPITALS.USA, to: CAPITALS.GBR, label: "US → Royaume-Uni", color: "#2980b9", value: 0.6 },
    { from: CAPITALS.USA, to: CAPITALS.ISR, label: "US → Israël", color: "#2980b9", value: 0.5 },
    { from: CAPITALS.USA, to: CAPITALS.SAU, label: "US → Arabie Saoudite", color: "#2980b9", value: 0.4 },
    { from: CAPITALS.CHN, to: CAPITALS.PAK, label: "CN → Pakistan", color: "#e74c3c", value: 0.5 },
    { from: CAPITALS.CHN, to: CAPITALS.RUS, label: "CN → Russie", color: "#e74c3c", value: 0.5 },
    { from: CAPITALS.CHN, to: CAPITALS.IRN, label: "CN → Iran", color: "#e74c3c", value: 0.3 },
    { from: CAPITALS.CHN, to: CAPITALS.MMR, label: "CN → Birmanie", color: "#e74c3c", value: 0.3 },
    { from: CAPITALS.RUS, to: CAPITALS.SYR, label: "RU → Syrie", color: "#8e44ad", value: 0.5 },
    { from: CAPITALS.RUS, to: CAPITALS.IRN, label: "RU → Iran", color: "#8e44ad", value: 0.4 },
    { from: CAPITALS.RUS, to: CAPITALS.BLR, label: "RU → Biélorussie", color: "#8e44ad", value: 0.6 },
    { from: CAPITALS.FRA, to: CAPITALS.SEN, label: "FR → Sénégal", color: "#3498db", value: 0.4 },
    { from: CAPITALS.FRA, to: CAPITALS.CIV, label: "FR → Côte d'Ivoire", color: "#3498db", value: 0.3 },
    { from: CAPITALS.GBR, to: CAPITALS.IND, label: "GB → Inde", color: "#2c3e50", value: 0.3 },
    { from: CAPITALS.CHN, to: CAPITALS.AFG, label: "CN → Afghanistan", color: "#e74c3c", value: 0.2 },
    { from: CAPITALS.USA, to: CAPITALS.PHL, label: "US → Philippines", color: "#2980b9", value: 0.4 },
    { from: CAPITALS.USA, to: CAPITALS.AUS, label: "US → Australie", color: "#2980b9", value: 0.4 },
  ],
  ressources: [
    { from: CAPITALS.RUS, to: CAPITALS.DEU, label: "Gaz: RU → DE", color: "#f39c12", value: 0.7 },
    { from: CAPITALS.SAU, to: CAPITALS.USA, label: "Pétrole: SA → US", color: "#2ecc71", value: 0.6 },
    { from: CAPITALS.SAU, to: CAPITALS.CHN, label: "Pétrole: SA → CN", color: "#2ecc71", value: 0.5 },
    { from: CAPITALS.RUS, to: CAPITALS.CHN, label: "Gaz: RU → CN", color: "#f39c12", value: 0.5 },
    { from: CAPITALS.IRN, to: CAPITALS.CHN, label: "Pétrole: IR → CN", color: "#c0392b", value: 0.4 },
    { from: CAPITALS.AGO, to: CAPITALS.CHN, label: "Pétrole: AO → CN", color: "#e67e22", value: 0.3 },
    { from: CAPITALS.NGA, to: CAPITALS.USA, label: "Pétrole: NG → US", color: "#16a085", value: 0.3 },
    { from: CAPITALS.VEN, to: CAPITALS.CHN, label: "Pétrole: VE → CN", color: "#c0392b", value: 0.3 },
    { from: CAPITALS.IDN, to: CAPITALS.JPN, label: "Charbon: ID → JP", color: "#8e44ad", value: 0.3 },
    { from: CAPITALS.AUS, to: CAPITALS.CHN, label: "Minéraux: AU → CN", color: "#e74c3c", value: 0.4 },
    { from: CAPITALS.BRA, to: CAPITALS.CHN, label: "Soja: BR → CN", color: "#27ae60", value: 0.3 },
    { from: CAPITALS.CHL, to: CAPITALS.CHN, label: "Cuivre: CL → CN", color: "#e74c3c", value: 0.3 },
    { from: CAPITALS.COD, to: CAPITALS.CHN, label: "Cobalt: CD → CN", color: "#2c3e50", value: 0.4 },
    { from: CAPITALS.ARE, to: CAPITALS.JPN, label: "Pétrole: AE → JP", color: "#2ecc71", value: 0.3 },
    { from: CAPITALS.QAT, to: CAPITALS.GBR, label: "GNL: QA → GB", color: "#2ecc71", value: 0.3 },
    { from: CAPITALS.ZAF, to: CAPITALS.CHN, label: "Platine: ZA → CN", color: "#c0392b", value: 0.2 },
    { from: CAPITALS.PER, to: CAPITALS.CHN, label: "Cuivre: PE → CN", color: "#e74c3c", value: 0.3 },
    { from: CAPITALS.KAZ, to: CAPITALS.CHN, label: "Uranium: KZ → CN", color: "#f39c12", value: 0.2 },
  ],
  deplacements: [
    { from: CAPITALS.SYR, to: CAPITALS.TUR, label: "Réfugiés: SY → TR", color: "#e74c3c", value: 0.9 },
    { from: CAPITALS.SYR, to: CAPITALS.DEU, label: "Réfugiés: SY → DE", color: "#e74c3c", value: 0.6 },
    { from: CAPITALS.AFG, to: CAPITALS.IRN, label: "Réfugiés: AF → IR", color: "#f39c12", value: 0.6 },
    { from: CAPITALS.AFG, to: CAPITALS.PAK, label: "Réfugiés: AF → PK", color: "#f39c12", value: 0.7 },
    { from: CAPITALS.SSD, to: CAPITALS.UGA, label: "Réfugiés: SS → UG", color: "#8e44ad", value: 0.5 },
    { from: CAPITALS.SSD, to: CAPITALS.ETH, label: "Réfugiés: SS → ET", color: "#8e44ad", value: 0.4 },
    { from: CAPITALS.SOM, to: CAPITALS.KEN, label: "Réfugiés: SO → KE", color: "#2980b9", value: 0.5 },
    { from: CAPITALS.MMR, to: CAPITALS.BGD, label: "Réfugiés: MM → BD", color: "#2ecc71", value: 0.7 },
    { from: CAPITALS.VEN, to: CAPITALS.COL, label: "Réfugiés: VE → CO", color: "#e67e22", value: 0.6 },
    { from: CAPITALS.VEN, to: CAPITALS.PER, label: "Réfugiés: VE → PE", color: "#e67e22", value: 0.4 },
    { from: CAPITALS.UKR, to: CAPITALS.POL, label: "Réfugiés: UA → PL", color: "#3498db", value: 0.8 },
    { from: CAPITALS.UKR, to: CAPITALS.DEU, label: "Réfugiés: UA → DE", color: "#3498db", value: 0.6 },
    { from: CAPITALS.UKR, to: CAPITALS.CZE, label: "Réfugiés: UA → CZ", color: "#3498db", value: 0.4 },
    { from: CAPITALS.COD, to: CAPITALS.UGA, label: "Réfugiés: CD → UG", color: "#c0392b", value: 0.3 },
    { from: CAPITALS.YEM, to: CAPITALS.SAU, label: "Réfugiés: YE → SA", color: "#16a085", value: 0.3 },
    { from: CAPITALS.SDN, to: CAPITALS.TCD, label: "Réfugiés: SD → TD", color: "#d35400", value: 0.4 },
    { from: CAPITALS.SDN, to: CAPITALS.EGY, label: "Réfugiés: SD → EG", color: "#d35400", value: 0.3 },
    { from: CAPITALS.CAF, to: CAPITALS.CMR, label: "Réfugiés: CF → CM", color: "#2c3e50", value: 0.3 },
    { from: CAPITALS.ETH, to: CAPITALS.SDN, label: "Réfugiés: ET → SD", color: "#e74c3c", value: 0.3 },
  ]
};

/* ------------------------------------------------------------------ */
/*  Helper: compute arcs for the current theme                        */
/* ------------------------------------------------------------------ */
function getThemeArcs(themeId: string): ArcDef[] {
  return THEME_ARCS[themeId] ?? [];
}

/* ------------------------------------------------------------------ */
/*  Polygon colouring                                                 */
/* ------------------------------------------------------------------ */
const THEME_HIGHLIGHT_ISO3: Record<string, string[]> = {
  colonisation: ["IND", "AUS", "NGA", "ZAF", "EGY", "DZA", "SEN", "VNM", "MLI", "MAR", "CIV", "GIN", "BEN", "TCD", "CMR", "MDG", "MEX", "COL", "PER", "CHL", "ARG", "BRA", "AGO", "MOZ", "COD", "IDN", "TZA", "NAM", "LBY", "SOM", "ETH", "GHA", "KEN", "SDN", "ZWE", "ZMB", "MMR", "PAK", "BGD", "CAN"],
  "traite-esclavage": ["GHA", "NG", "NGA", "SEN", "BEN", "AGO", "BRA", "COL", "SUR", "JAM", "HTI", "USA", "GIN", "MOZ", "SLE", "CIV", "TGO", "GMB", "GNB", "LBR"],
  conflits: ["IRQ", "AFG", "VNM", "UKR", "SYR", "KOR", "PRK", "DZA", "ARG", "KWT", "LBN", "JOR", "YEM"],
  "influence-contemporaine": ["JPN", "KOR", "DEU", "GBR", "ISR", "SAU", "PAK", "RUS", "IRN", "MMR", "SYR", "BLR", "SEN", "CIV", "IND", "AFG", "PHL", "AUS"],
  ressources: ["DEU", "USA", "CHN", "JPN", "GBR", "SAU", "RUS", "IRN", "AGO", "NGA", "VEN", "IDN", "AUS", "BRA", "CHL", "COD", "ARE", "QAT", "ZAF", "PER", "KAZ"],
  deplacements: ["TUR", "DEU", "IRN", "PAK", "UGA", "ETH", "KEN", "BGD", "COL", "PER", "POL", "CZE", "SAU", "TCD", "EGY", "CMR", "SDN"]
};

const THEME_DEFAULT_COLOR = "#2d4a5c";
const THEME_HIGHLIGHT_COLOR: Record<string, string> = {
  colonisation: "#b6573b",
  "traite-esclavage": "#8b1a2b",
  conflits: "#c0392b",
  "influence-contemporaine": "#1a5276",
  ressources: "#b8860b",
  deplacements: "#6c3483"
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export function Globe3D({ themeId, onHover, onSelect }: Globe3DProps) {
  const [, setRerender] = useState(0);
  const globeRef = useRef<any>(null);
  const [polygons, setPolygons] = useState<GeoJSON.FeatureCollection | null>(null);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  /* ---------- load countries GeoJSON ---------- */
  useEffect(() => {
    fetch("/data/geo/countries.geojson")
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
  const highlightedIso3 = useMemo(() => THEME_HIGHLIGHT_ISO3[themeId] ?? [], [themeId]);
  const highlightColor = THEME_HIGHLIGHT_COLOR[themeId] ?? THEME_DEFAULT_COLOR;
  const arcs = useMemo(() => getThemeArcs(themeId), [themeId]);

  /* ---------- polygon colour fn ---------- */
  const polygonCapColor = useCallback(
    (feature: any) => {
      const iso = feature?.properties?.["ISO3166-1-Alpha-3"] ??
        feature?.properties?.ISO_A3 ??
        feature?.properties?.ADM0_A3 ??
        "";
      return highlightedIso3.includes(iso) ? highlightColor : "#1a2b34";
    },
    [highlightedIso3, highlightColor]
  );

  /* ---------- polygon side colour ---------- */
  const polygonSideColor = useCallback(() => "#0f1923", []);

  /* ---------- arc label ---------- */
  const arcLabel = useCallback((arc: object) => (arc as ArcDef).label ?? "", []);

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
      const name = String(props.name ?? props.NAME ?? props.NAME_LONG ?? props.ADMIN ?? "");
      const iso3 = props["ISO3166-1-Alpha-3"] ?? props.ISO_A3 ?? props.ADM0_A3;
      onHover({
        name: name || "Territoire",
        iso3: typeof iso3 === "string" && iso3 !== "-99" ? iso3 : undefined,
        point: { x: 0, y: 0 } // replaced by screen-space in parent if needed
      });
    },
    [onHover]
  );

  const handlePolygonClick = useCallback(
    (polygon: any | null) => {
      if (!polygon) return;
      const props = polygon?.properties ?? {};
      const name = String(props.name ?? props.NAME ?? props.NAME_LONG ?? props.ADMIN ?? "");
      const iso3 = props["ISO3166-1-Alpha-3"] ?? props.ISO_A3 ?? props.ADM0_A3;
      onSelect({
        name: name || "Territoire",
        iso3: typeof iso3 === "string" && iso3 !== "-99" ? iso3 : undefined,
        properties: props
      });
    },
    [onSelect]
  );

  /* ---------- after mount, force a re-render so the dynamic Globe loads ---------- */
  useEffect(() => {
    setRerender(1);
  }, []);

  /* ---------- render ---------- */
  return (
    <div ref={containerRef} className="absolute inset-0 bg-[#07111a]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#07111a]" />

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
          polygonStrokeColor={() => "#1e3a4f"}
          polygonAltitude={0.005}
          arcsData={arcs}
          arcColor="color"
          arcAltitudeAutoScale={0.3}
          arcStroke={0.6}
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={3000}
          arcLabel={arcLabel}
          arcsTransitionDuration={800}
          onPolygonHover={handlePolygonHover}
          onPolygonClick={handlePolygonClick}
          onGlobeReady={handleGlobeReady}
          enablePointerInteraction
          atmosphereColor="#1a3a5c"
          atmosphereAltitude={0.15}
          rendererConfig={{ antialias: true, alpha: true }}
        />
      ) : null}

      {/* Loading overlay */}
      {!ready ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#07111a]/80 backdrop-blur-sm z-10 pointer-events-none">
          <div className="flex items-center gap-2 rounded-md border border-[#1e3a4f] bg-[#0d1b2a]/95 px-3 py-2 text-sm text-slate-300 shadow-sm">
            <Loader2 className="animate-spin" aria-hidden="true" />
            Chargement du globe...
          </div>
        </div>
      ) : null}

      {/* Theme indicator */}
      <div className="absolute left-4 top-4 rounded-md border border-[#1e3a4f] bg-[#0d1b2a]/90 px-3 py-2 text-xs text-slate-300 shadow-sm backdrop-blur">
        <p className="font-medium text-slate-200">Globe 3D</p>
        <p className="text-slate-400">Thème: {themeId}</p>
        <p className="text-slate-400">{arcs.length} flux affichés</p>
      </div>
    </div>
  );
}
