"use client";

import dynamic from "next/dynamic";
import type { LandMapProps } from "./land-map-client";

const LandMapClient = dynamic(() => import("./land-map-client"), {
  ssr: false,
  loading: () => (
    <div className="map-loading" style={{ display: "grid", placeItems: "center", minHeight: "220px", background: "#f1f5f3", color: "#475569", fontSize: "11px" }}>
      <span>Loading Bhu-Aadhaar & Cadastral Geospatial Layers...</span>
    </div>
  ),
});

export default function LandMap(props: LandMapProps) {
  return <LandMapClient {...props} />;
}