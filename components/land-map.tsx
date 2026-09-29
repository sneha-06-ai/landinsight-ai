"use client";

import { CircleMarker, MapContainer, TileLayer, Tooltip, ZoomControl } from "react-leaflet";

const locations = [
  { name: "Delhi NCR", position: [28.61, 77.21] as [number, number], risk: 82 },
  { name: "Jaipur", position: [26.91, 75.79] as [number, number], risk: 68 },
  { name: "Ahmedabad", position: [23.02, 72.57] as [number, number], risk: 54 },
  { name: "Mumbai", position: [19.08, 72.88] as [number, number], risk: 72 },
  { name: "Pune", position: [18.52, 73.86] as [number, number], risk: 62 },
  { name: "Hyderabad", position: [17.38, 78.48] as [number, number], risk: 43 },
  { name: "Bengaluru", position: [12.97, 77.59] as [number, number], risk: 38 },
  { name: "Chennai", position: [13.08, 80.27] as [number, number], risk: 55 },
  { name: "Bhubaneswar", position: [20.3, 85.82] as [number, number], risk: 78 },
  { name: "Kolkata", position: [22.57, 88.36] as [number, number], risk: 76 },
  { name: "Guwahati", position: [26.14, 91.74] as [number, number], risk: 87 },
  { name: "Lucknow", position: [26.85, 80.95] as [number, number], risk: 65 },
  { name: "Bhopal", position: [23.26, 77.41] as [number, number], risk: 48 },
];

export default function LandMap({ activeLayer, satelliteView, compact = false }: { activeLayer: string; satelliteView: boolean; compact?: boolean }) {
  const colorFor = (risk: number) => risk > 75 ? "#d96b4b" : risk > 55 ? "#d6a84b" : "#447d69";
  return <MapContainer
    center={[22.6, 79.1]}
    zoom={compact ? 4 : 4.5}
    minZoom={3}
    maxZoom={12}
    scrollWheelZoom={!compact}
    zoomControl={false}
    className={`land-map${compact ? " compact-map" : ""}`}
    aria-label={`India map showing ${activeLayer}`}
  >
    {satelliteView
      ? <TileLayer attribution="Tiles &copy; Esri" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      : <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />}
    <ZoomControl position="topleft" />
    {locations.map((location) => <CircleMarker
      key={location.name}
      center={location.position}
      radius={compact ? 6 : 8}
      pathOptions={{ color: "#ffffff", weight: 2, fillColor: colorFor(location.risk), fillOpacity: 0.86 }}
    ><Tooltip direction="top" offset={[0, -5]}><strong>{location.name}</strong><br />{activeLayer}: {location.risk}/100</Tooltip></CircleMarker>)}
  </MapContainer>;
}