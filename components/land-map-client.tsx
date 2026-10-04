"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, Polygon, Popup, TileLayer, Tooltip, useMap, ZoomControl } from "react-leaflet";
import type { DistrictIndicator, ParcelData } from "../data/bhoomi-dataset";
import { CADASTRAL_PARCELS, DISTRICT_INDICATORS } from "../data/bhoomi-dataset";

export interface LandMapProps {
  activeLayer: string;
  satelliteView: boolean;
  compact?: boolean;
  selectedParcel?: ParcelData | null;
  onSelectParcel?: (parcel: ParcelData) => void;
  selectedDistrict?: string | null;
  onSelectDistrict?: (district: DistrictIndicator) => void;
  showParcels?: boolean;
  centerOverride?: [number, number];
  zoomOverride?: number;
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

export default function LandMapClient({
  activeLayer,
  satelliteView,
  compact = false,
  selectedParcel,
  onSelectParcel,
  selectedDistrict,
  onSelectDistrict,
  showParcels = true,
  centerOverride,
  zoomOverride,
}: LandMapProps) {
  const defaultCenter: [number, number] = centerOverride || (selectedParcel ? selectedParcel.centroid : [22.4, 79.2]);
  const defaultZoom = zoomOverride || (compact ? 4 : selectedParcel ? 13 : 4.5);

  const getDistrictRiskColor = (indicator: DistrictIndicator) => {
    if (activeLayer === "Dispute Hotspots" || activeLayer === "Disputes") {
      return indicator.disputeHotspotScore > 75 ? "#d94c4c" : indicator.disputeHotspotScore > 60 ? "#d99b3b" : "#448d68";
    }
    if (activeLayer === "Climate Vulnerability" || activeLayer === "Climate risk") {
      return indicator.climateExposureIndex > 75 ? "#c74f36" : indicator.climateExposureIndex > 55 ? "#dfab41" : "#3d8573";
    }
    if (activeLayer === "Watershed Degradation (SRISHTI)") {
      return indicator.watershedDegradationIndex > 70 ? "#b85c38" : indicator.watershedDegradationIndex > 50 ? "#d4a443" : "#387d85";
    }
    return indicator.landUseRiskIndex > 70 ? "#d96b4b" : indicator.landUseRiskIndex > 55 ? "#d6a84b" : "#447d69";
  };

  const getParcelColor = (parcel: ParcelData) => {
    if (selectedParcel?.ulpin === parcel.ulpin) return "#2563eb";
    if (parcel.disputeRiskScore > 75) return "#dc2626";
    if (parcel.disputeRiskScore > 50) return "#f59e0b";
    return "#10b981";
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      minZoom={3}
      maxZoom={17}
      scrollWheelZoom={!compact}
      zoomControl={false}
      className={`land-map${compact ? " compact-map" : ""}`}
      aria-label={`Bhoomi-Niti Map showing ${activeLayer}`}
    >
      {satelliteView ? (
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={18}
        />
      ) : (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />
      )}

      <ZoomControl position="topleft" />

      {centerOverride && <MapController center={centerOverride} zoom={zoomOverride || defaultZoom} />}

      {/* District / National Indicators */}
      {DISTRICT_INDICATORS.map((district) => {
        const isSelected = selectedDistrict === district.district;
        const color = getDistrictRiskColor(district);
        return (
          <CircleMarker
            key={district.district}
            center={district.coordinates}
            radius={isSelected ? 11 : compact ? 7 : 9}
            pathOptions={{
              color: isSelected ? "#ffffff" : "#ffffff",
              weight: isSelected ? 3 : 1.5,
              fillColor: color,
              fillOpacity: 0.88,
            }}
            eventHandlers={{
              click: () => onSelectDistrict && onSelectDistrict(district),
            }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              <div style={{ padding: "3px 6px", fontSize: "11px", lineHeight: "1.4" }}>
                <strong>{district.district} ({district.state})</strong>
                <br />
                <span style={{ color: "#666" }}>Layer: {activeLayer}</span>
                <br />
                <strong>Dispute Score: {district.disputeHotspotScore}/100</strong>
                <br />
                <span>ULPIN Digitized: {district.ulpinCoveragePercent}%</span>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}

      {/* Cadastral Parcel Polygons (BhuNaksha layer) */}
      {showParcels &&
        CADASTRAL_PARCELS.map((parcel) => {
          const isSelected = selectedParcel?.ulpin === parcel.ulpin;
          const color = getParcelColor(parcel);

          return (
            <Polygon
              key={parcel.ulpin}
              positions={parcel.polygon}
              pathOptions={{
                color: isSelected ? "#1d4ed8" : color,
                weight: isSelected ? 3.5 : 2,
                fillColor: color,
                fillOpacity: isSelected ? 0.65 : 0.35,
                dashArray: parcel.mutationStatus === "Certified & Clean" ? undefined : "4, 4",
              }}
              eventHandlers={{
                click: () => onSelectParcel && onSelectParcel(parcel),
              }}
            >
              <Popup>
                <div style={{ minWidth: "220px", fontSize: "11px", padding: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "9px", fontWeight: "bold", background: "#f1f5f9", padding: "2px 5px", borderRadius: "3px" }}>
                      ULPIN: {parcel.ulpin}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: "bold",
                        color: parcel.disputeRiskScore > 70 ? "#dc2626" : "#16a34a",
                      }}
                    >
                      Risk: {parcel.disputeRiskScore}/100
                    </span>
                  </div>
                  <strong style={{ fontSize: "12px", display: "block", color: "#1e293b" }}>
                    Plot {parcel.surveyNumber} ({parcel.village}, {parcel.district})
                  </strong>
                  <div style={{ margin: "5px 0", color: "#475569" }}>
                    <div>Owner: <strong>{parcel.ownerName}</strong></div>
                    <div>Area: <strong>{parcel.areaHectares} Ha</strong> ({parcel.landClassification})</div>
                    <div>Mutation: <strong>{parcel.mutationStatus}</strong></div>
                    <div>Status: <strong>{parcel.encumbranceStatus}</strong></div>
                  </div>
                  {onSelectParcel && (
                    <button
                      onClick={() => onSelectParcel(parcel)}
                      style={{
                        width: "100%",
                        padding: "5px 8px",
                        marginTop: "4px",
                        background: "#244336",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "10px",
                      }}
                    >
                      Inspect Parcel Forensics &rarr;
                    </button>
                  )}
                </div>
              </Popup>
            </Polygon>
          );
        })}
    </MapContainer>
  );
}
