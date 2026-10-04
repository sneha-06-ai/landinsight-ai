"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  Activity, ArrowRight, CheckCircle2, ChevronRight, CircleHelp,
  Compass, Copy, Download, Eye, FileSearch, Filter, Globe2,
  Info, Layers, Layers3, MapPin, Scale, Search, Settings2,
  ShieldAlert, ShieldCheck, Sparkles
} from "lucide-react";
import type { DistrictIndicator, ParcelData } from "../../data/bhoomi-dataset";
import { CADASTRAL_PARCELS, DISTRICT_INDICATORS } from "../../data/bhoomi-dataset";

const LandMap = dynamic(() => import("../land-map"), {
  ssr: false,
  loading: () => <div className="map-loading">Loading BhuNaksha & Satellite Layers...</div>,
});

interface GISIntelligenceProps {
  selectedParcel?: ParcelData | null;
  onSelectParcel: (parcel: ParcelData) => void;
  onNavigateToForensics: (parcel: ParcelData) => void;
  onNavigateToPolicy: (parcel: ParcelData) => void;
}

export default function GISIntelligence({
  selectedParcel,
  onSelectParcel,
  onNavigateToForensics,
  onNavigateToPolicy,
}: GISIntelligenceProps) {
  const [activeLayer, setActiveLayer] = useState("Cadastral Parcels");
  const [satellite, setSatellite] = useState(true);
  const [searchULPIN, setSearchULPIN] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictIndicator>(DISTRICT_INDICATORS[0]);
  const [copied, setCopied] = useState(false);

  // Active parcel to inspect in detail
  const currentParcel = selectedParcel || CADASTRAL_PARCELS[0];

  const handleULPINSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchULPIN.trim()) return;
    const match = CADASTRAL_PARCELS.find(
      (p) =>
        p.ulpin.toLowerCase().includes(searchULPIN.trim().toLowerCase()) ||
        p.surveyNumber.includes(searchULPIN.trim())
    );
    if (match) {
      onSelectParcel(match);
      const districtMatch = DISTRICT_INDICATORS.find((d) => d.district === match.district);
      if (districtMatch) setSelectedDistrict(districtMatch);
    }
  };

  const copyULPIN = () => {
    navigator.clipboard.writeText(currentParcel.ulpin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const layersList = [
    { id: "Cadastral Parcels", label: "Cadastral Parcels (BhuNaksha)", tone: "green", desc: "Geo-referenced plot vectors & survey numbers" },
    { id: "Dispute Hotspots", label: "Dispute Hotspots & Stays", tone: "coral", desc: "ML flagged high litigation density" },
    { id: "Watershed Degradation (SRISHTI)", label: "SRISHTI-DRISHTI 30m Watershed", tone: "blue", desc: "Soil moisture & NDVI vegetation loss" },
    { id: "Climate Vulnerability", label: "Climate Vulnerability & Floodplain", tone: "gold", desc: "High hazard & riverbuffer exposure" },
    { id: "Land use", label: "Land Use & Agricultural Classification", tone: "teal", desc: "Jirayat, Bagayat & NA zoning" },
  ];

  return (
    <div className="page-content module-content gis-page">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            SIH 2026 PILLAR 05 · MULTIMODAL GIS & BHUNAKSHA CADASTRE (PERSON-PARCEL-PIXEL)
          </span>
          <h1>GIS Intelligence & Cadastral Command Center</h1>
          <p>
            Explore geo-referenced cadastral plot divisions, 14-digit Bhu-Aadhaar (ULPIN) parcel records, and multi-temporal ISRO Sentinel satellite change detection.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className={`outline-button ${satellite ? "selected" : ""}`}
            onClick={() => setSatellite(!satellite)}
          >
            <Layers3 size={14} /> {satellite ? "Satellite (ISRO/Esri)" : "Cartographic Street"}
          </button>
          <button className="outline-button" onClick={() => onNavigateToForensics(currentParcel)}>
            <FileSearch size={14} /> Run Parcel Forensics
          </button>
        </div>
      </div>

      {/* GIS Location & Search Bar */}
      <div className="gis-toolbar">
        <form onSubmit={handleULPINSearch} style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
          <div className="map-search-overlay" style={{ position: "relative", top: "auto", left: "auto", width: "320px", height: "34px" }}>
            <Search size={15} />
            <input
              placeholder="Search 14-digit ULPIN or Survey No..."
              value={searchULPIN}
              onChange={(e) => setSearchULPIN(e.target.value)}
            />
          </div>
          <button type="submit" className="outline-button" style={{ height: "34px" }}>
            Locate Parcel &rarr;
          </button>
        </form>

        <div className="gis-toolbar-actions">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "#64748b" }}>
            <span>Focus District:</span>
            <select
              style={{
                height: "30px",
                fontSize: "10px",
                borderRadius: "4px",
                border: "1px solid #cbd5e1",
                padding: "0 6px",
              }}
              value={selectedDistrict.district}
              onChange={(e) => {
                const matched = DISTRICT_INDICATORS.find((d) => d.district === e.target.value);
                if (matched) {
                  setSelectedDistrict(matched);
                  const p = CADASTRAL_PARCELS.find((parcel) => parcel.district === matched.district);
                  if (p) onSelectParcel(p);
                }
              }}
            >
              {DISTRICT_INDICATORS.map((d) => (
                <option key={d.district} value={d.district}>
                  {d.district} ({d.state})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* GIS Workspace: Map + Side Panel */}
      <div className="gis-workspace" style={{ height: "540px", gridTemplateColumns: "minmax(0, 1fr) 320px" }}>
        {/* Interactive Map */}
        <div className="gis-map">
          <LandMap
            activeLayer={activeLayer}
            satelliteView={satellite}
            selectedParcel={currentParcel}
            onSelectParcel={onSelectParcel}
            selectedDistrict={selectedDistrict.district}
            onSelectDistrict={(d) => {
              setSelectedDistrict(d);
              const p = CADASTRAL_PARCELS.find((parcel) => parcel.district === d.district);
              if (p) onSelectParcel(p);
            }}
            showParcels
            centerOverride={currentParcel.centroid}
            zoomOverride={13}
          />
          <div className="map-scale">100m BhuNaksha Grid</div>
        </div>

        {/* Right-Hand Cadastral Parcel Inspection Drawer */}
        <aside className="layer-panel" style={{ overflowY: "auto" }}>
          <div className="layer-panel-head">
            <div>
              <span style={{ fontSize: "9px", fontWeight: "700", color: "#64748b" }}>
                PERSON-PARCEL-PIXEL DOSSIER
              </span>
              <strong style={{ fontSize: "12px", color: "#1e293b" }}>
                Plot {currentParcel.surveyNumber} · {currentParcel.village}
              </strong>
            </div>
            <span
              style={{
                fontSize: "9px",
                fontWeight: "700",
                padding: "2px 6px",
                borderRadius: "4px",
                background: currentParcel.disputeRiskScore > 70 ? "#fee2e2" : "#dcfce7",
                color: currentParcel.disputeRiskScore > 70 ? "#dc2626" : "#166534",
              }}
            >
              Risk: {currentParcel.disputeRiskScore}/100
            </span>
          </div>

          {/* ULPIN Badge */}
          <div
            style={{
              margin: "10px 0",
              padding: "8px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "5px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "9px", fontWeight: "700", color: "#64748b" }}>
                BHU-AADHAAR (ULPIN)
              </span>
              <button
                onClick={copyULPIN}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "9px",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  cursor: "pointer",
                }}
              >
                {copied ? <CheckCircle2 size={12} color="#16a34a" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <code style={{ display: "block", fontSize: "10px", fontWeight: "700", color: "#1e293b", marginTop: "3px" }}>
              {currentParcel.ulpin}
            </code>
          </div>

          {/* Detailed Metadata Attributes */}
          <div style={{ fontSize: "10px", lineHeight: "1.8", color: "#334155" }}>
            <div>State / District: <strong>{currentParcel.state}, {currentParcel.district}</strong></div>
            <div>Taluk / Tehsil: <strong>{currentParcel.taluk}</strong></div>
            <div>Registered Owner: <strong>{currentParcel.ownerName}</strong></div>
            <div>Ownership Type: <strong>{currentParcel.ownerCategory}</strong></div>
            <div>Parcel Area: <strong>{currentParcel.areaHectares} Hectares</strong> ({(currentParcel.areaHectares * 2.471).toFixed(1)} Acres)</div>
            <div>Classification: <strong>{currentParcel.landClassification}</strong></div>
            <div>Govt Circle Rate: <strong>₹{(currentParcel.circleRatePerHectareINR / 10000000).toFixed(2)} Cr / Ha</strong></div>
            <div>Estimated Market Rate: <strong>₹{(currentParcel.marketRatePerHectareINR / 10000000).toFixed(2)} Cr / Ha</strong></div>
            <div>
              Mutation Status:{" "}
              <strong style={{ color: currentParcel.mutationStatus === "Certified & Clean" ? "#166534" : "#dc2626" }}>
                {currentParcel.mutationStatus}
              </strong>
            </div>
            <div>
              Encumbrance Status:{" "}
              <strong style={{ color: currentParcel.encumbranceStatus.includes("Clear") ? "#166534" : "#dc2626" }}>
                {currentParcel.encumbranceStatus}
              </strong>
            </div>
            <div>BhuNaksha Vector Match: <strong>{currentParcel.bhuNakshaMatch}%</strong></div>
            <div>Satellite NDVI Canopy: <strong>{currentParcel.satelliteNDVI}</strong></div>
          </div>

          {/* Risk Factors */}
          <div style={{ marginTop: "10px", padding: "8px", background: "#fef2f2", borderRadius: "5px", border: "1px solid #fecaca" }}>
            <span style={{ fontSize: "9px", fontWeight: "700", color: "#991b1b", display: "flex", alignItems: "center", gap: "4px" }}>
              <ShieldAlert size={12} /> CADASTRAL RISK TRIGGERS
            </span>
            <ul style={{ margin: "4px 0 0", paddingLeft: "14px", fontSize: "9.5px", color: "#7f1d1d", lineHeight: "1.5" }}>
              {currentParcel.riskFactors.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
            <button
              className="primary-button full-width"
              onClick={() => onNavigateToForensics(currentParcel)}
            >
              <FileSearch size={14} /> View Case Forensics Dossier
            </button>
            <button
              className="outline-button full-width"
              onClick={() => onNavigateToPolicy(currentParcel)}
            >
              <Activity size={14} /> Model RFCTLARR Acquisition
            </button>
          </div>

          {/* Layer Selector */}
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginTop: "14px" }}>
            <span style={{ fontSize: "9px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
              Active Geospatial Layers
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "6px" }}>
              {layersList.map((layer) => (
                <label
                  key={layer.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "9.5px",
                    color: "#334155",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                    background: activeLayer === layer.id ? "#f1f5f9" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="gisLayer"
                    checked={activeLayer === layer.id}
                    onChange={() => setActiveLayer(layer.id)}
                  />
                  <span>{layer.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* District GIS KPIs */}
      <div className="gis-stats">
        <article>
          <span>District Cadastre Monitored</span>
          <strong>
            {selectedDistrict.district} <small>({selectedDistrict.state})</small>
          </strong>
          <i>{selectedDistrict.highRiskTaluks.length} taluks in priority watch</i>
        </article>

        <article>
          <span>Digitized Parcels</span>
          <strong>{selectedDistrict.totalParcelsDigitized.toLocaleString()}</strong>
          <i>ULPIN Coverage: {selectedDistrict.ulpinCoveragePercent}%</i>
        </article>

        <article>
          <span>Dispute Hotspot Index</span>
          <strong style={{ color: selectedDistrict.disputeHotspotScore > 75 ? "#dc2626" : "#b45309" }}>
            {selectedDistrict.disputeHotspotScore} <small>/ 100</small>
          </strong>
          <i>{selectedDistrict.activeLitigations.toLocaleString()} active litigations</i>
        </article>

        <article>
          <span>Watershed & Soil Index</span>
          <strong>{selectedDistrict.watershedDegradationIndex} <small>/ 100</small></strong>
          <i>SRISHTI-DRISHTI 30m multispectral analysis</i>
        </article>
      </div>
    </div>
  );
}
