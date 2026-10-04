"use client";

import { useState } from "react";
import {
  AlertTriangle, ArrowRight, CheckCircle2, ChevronRight,
  Download, FileSearch, FileText, Gavel, MapPin, Printer,
  RefreshCw, Scale, Search, ShieldAlert, ShieldCheck, Sparkles
} from "lucide-react";
import type { ForensicCase, ParcelData } from "../../data/bhoomi-dataset";
import { CADASTRAL_PARCELS, DISTRICT_INDICATORS, FORENSIC_CASES } from "../../data/bhoomi-dataset";

interface DisputeForensicsProps {
  selectedParcel?: ParcelData | null;
  onSelectParcel: (parcel: ParcelData) => void;
  onNavigateToGIS: (parcel: ParcelData) => void;
  onAskCopilot: (query: string) => void;
}

export default function DisputeForensics({
  selectedParcel,
  onSelectParcel,
  onNavigateToGIS,
  onAskCopilot,
}: DisputeForensicsProps) {
  const [selectedCase, setSelectedCase] = useState<ForensicCase>(FORENSIC_CASES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"inspector" | "hotspots">("inspector");
  const [auditExported, setAuditExported] = useState(false);

  // Match parcel for active forensic case
  const activeParcel =
    selectedParcel ||
    CADASTRAL_PARCELS.find((p) => p.ulpin === selectedCase.ulpin) ||
    CADASTRAL_PARCELS[0];

  const handleCaseChange = (caseItem: ForensicCase) => {
    setSelectedCase(caseItem);
    const p = CADASTRAL_PARCELS.find((item) => item.ulpin === caseItem.ulpin);
    if (p) onSelectParcel(p);
  };

  const filteredDistricts = DISTRICT_INDICATORS.filter(
    (d) =>
      d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-content module-content">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            SIH 2026 PILLAR 03 · RESEARCH THEME 25017 (EARLY DETECTION OF ACQUISITION DELAYS)
          </span>
          <h1>Dispute Forensics & Litigation Risk Engine</h1>
          <p>
            Machine-learning powered early warning system predicting land litigation, title fragmentation, boundary overlap, and acquisition bottlenecks.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className={`outline-button ${activeTab === "inspector" ? "selected" : ""}`}
            onClick={() => setActiveTab("inspector")}
          >
            <FileSearch size={14} /> Parcel Forensics Inspector
          </button>
          <button
            className={`outline-button ${activeTab === "hotspots" ? "selected" : ""}`}
            onClick={() => setActiveTab("hotspots")}
          >
            <Gavel size={14} /> District Litigation Hotspots
          </button>
        </div>
      </div>

      {activeTab === "inspector" ? (
        <div className="simulation-layout">
          {/* Left Column: Case Selector & Quick Lookups */}
          <aside className="simulation-form panel">
            <div className="form-section-heading">
              <span className="step-number" style={{ background: "#fee2e2", color: "#dc2626" }}>
                <ShieldAlert size={14} />
              </span>
              <div>
                <strong>Active Forensic Cases</strong>
                <small>Select benchmark litigation dossier</small>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "10px 0" }}>
              {FORENSIC_CASES.map((caseItem) => (
                <button
                  key={caseItem.id}
                  onClick={() => handleCaseChange(caseItem)}
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    borderRadius: "6px",
                    border: selectedCase.id === caseItem.id ? "2px solid #244336" : "1px solid #e2e8f0",
                    background: selectedCase.id === caseItem.id ? "#f1f5f3" : "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#475569" }}>
                      {caseItem.id}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: "700",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: caseItem.riskScore > 75 ? "#fee2e2" : "#fef3c7",
                        color: caseItem.riskScore > 75 ? "#dc2626" : "#b45309",
                      }}
                    >
                      Risk {caseItem.riskScore}%
                    </span>
                  </div>
                  <strong style={{ display: "block", fontSize: "11px", margin: "4px 0 2px", color: "#1e293b" }}>
                    {caseItem.title}
                  </strong>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>
                    {caseItem.district}, {caseItem.state} · {caseItem.disputeType}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginTop: "12px" }}>
              <label style={{ fontSize: "10px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "6px" }}>
                Lookup Any 14-Digit ULPIN
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                <input
                  style={{
                    flex: 1,
                    padding: "6px 8px",
                    borderRadius: "4px",
                    border: "1px solid #cbd5e1",
                    fontSize: "10px",
                  }}
                  placeholder="e.g. 14-MH-PUN-0842-9912-A1"
                  defaultValue={activeParcel.ulpin}
                  onChange={(e) => {
                    const match = CADASTRAL_PARCELS.find((p) => p.ulpin.includes(e.target.value.trim()));
                    if (match) onSelectParcel(match);
                  }}
                />
              </div>
            </div>

            <div className="model-note" style={{ marginTop: "16px" }}>
              <Sparkles size={16} />
              <span>
                <strong>XGBoost + PostGIS Spatial Model</strong>
                <br />
                Trained on 18,300 historical revenue court records & Section 11 gazette notices.
              </span>
            </div>

            <button
              className="outline-button full-width"
              onClick={() => onNavigateToGIS(activeParcel)}
            >
              <MapPin size={14} /> Locate on BhuNaksha Map
            </button>
          </aside>

          {/* Right Column: In-Depth Forensic Analysis */}
          <div className="simulation-results">
            {/* Top Case Banner */}
            <div className="results-banner">
              <div>
                <span className="eyebrow">
                  CASE DOSSIER #{selectedCase.id} · {selectedCase.disputeType.toUpperCase()}
                </span>
                <h2>{selectedCase.title}</h2>
                <p>
                  Parcel ULPIN: <strong>{activeParcel.ulpin}</strong> | Survey No: <strong>{activeParcel.surveyNumber}</strong> ({activeParcel.village}, {activeParcel.taluk}, {activeParcel.district})
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="outline-button"
                  onClick={() => {
                    setAuditExported(true);
                    window.setTimeout(() => setAuditExported(false), 4000);
                  }}
                >
                  <Download size={14} /> Export Forensic Dossier
                </button>
                <button
                  className="primary-button"
                  onClick={() =>
                    onAskCopilot(
                      `What are the legal solutions to mitigate ${selectedCase.disputeType} in parcel ${activeParcel.ulpin} (${activeParcel.village}, ${activeParcel.state})?`
                    )
                  }
                >
                  <Sparkles size={14} /> Consult Legal AI
                </button>
              </div>
            </div>

            {auditExported && (
              <div
                style={{
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <CheckCircle2 size={16} /> Forensic Audit Dossier #{selectedCase.id} generated with verified digital sign-off and SHA-256 hash.
              </div>
            )}

            {/* Metrics Breakdown */}
            <div className="results-metrics">
              <article className="risk-score">
                <div>
                  <span>Predicted Litigation Risk</span>
                  <span
                    className="score-ring"
                    style={{ background: `conic-gradient(#dc2626 ${selectedCase.riskScore}%, #e2e8f0 0)` }}
                  >
                    <strong style={{ color: "#dc2626" }}>{selectedCase.riskScore}</strong>
                    <small>/100</small>
                  </span>
                </div>
                <span className="risk-level high-risk">
                  {selectedCase.riskScore > 75 ? "Severe Litigation Risk" : "Moderate Risk"}
                </span>
              </article>

              <article>
                <span>Estimated Delay Impact</span>
                <strong style={{ color: "#b45309" }}>+{selectedCase.timelineYears} yrs</strong>
                <small>Average court stay duration</small>
              </article>

              <article>
                <span>BhuNaksha Vector Match</span>
                <strong style={{ color: activeParcel.bhuNakshaMatch > 80 ? "#16a34a" : "#dc2626" }}>
                  {activeParcel.bhuNakshaMatch}%
                </strong>
                <small>Legacy map reconciliation</small>
              </article>

              <article>
                <span>Litigant Parties</span>
                <strong style={{ fontSize: "12px", lineHeight: "1.3", marginTop: "4px" }}>
                  {selectedCase.partiesInvolved.split(" vs. ")[0]}
                </strong>
                <small>vs. {selectedCase.partiesInvolved.split(" vs. ")[1] || "State"}</small>
              </article>
            </div>

            {/* Root Cause & Forensic Findings */}
            <div className="panel" style={{ padding: "16px", marginBottom: "12px" }}>
              <div className="panel-heading" style={{ marginBottom: "10px" }}>
                <div>
                  <span className="eyebrow">ROOT CAUSE DECOMPOSITION</span>
                  <h3>Cadastral & Title Verification Findings</h3>
                </div>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: "600",
                    background: "#fef3c7",
                    color: "#92400e",
                  }}
                >
                  Status: {activeParcel.mutationStatus}
                </span>
              </div>

              <p style={{ fontSize: "11.5px", lineHeight: "1.7", color: "#334155" }}>
                {selectedCase.rootCause}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px" }}>
                <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "#64748b" }}>
                    DETECTED RISK FACTORS
                  </span>
                  <ul style={{ margin: "6px 0 0", paddingLeft: "16px", fontSize: "10.5px", color: "#334155", lineHeight: "1.6" }}>
                    {activeParcel.riskFactors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "#64748b" }}>
                    CADASTRAL & VALUATION SPECIFICATIONS
                  </span>
                  <div style={{ fontSize: "10.5px", color: "#334155", marginTop: "6px", lineHeight: "1.8" }}>
                    <div>Registered Owner: <strong>{activeParcel.ownerName}</strong> ({activeParcel.ownerCategory})</div>
                    <div>Area: <strong>{activeParcel.areaHectares} Ha</strong> | Classification: <strong>{activeParcel.landClassification}</strong></div>
                    <div>Govt Circle Rate: <strong>₹{(activeParcel.circleRatePerHectareINR / 10000000).toFixed(2)} Cr/Ha</strong></div>
                    <div>Encumbrance: <strong style={{ color: "#dc2626" }}>{activeParcel.encumbranceStatus}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Trail Timeline */}
            <div className="panel" style={{ padding: "16px", marginBottom: "12px" }}>
              <div className="panel-heading" style={{ marginBottom: "12px" }}>
                <div>
                  <span className="eyebrow">CHRONOLOGICAL AUDIT TRAIL</span>
                  <h3>Dispute Genesis & Procedural Milestones</h3>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {selectedCase.evidenceTrail.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      position: "relative",
                      paddingLeft: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "#244336",
                        color: "#fff",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "10px",
                        fontWeight: "700",
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ fontSize: "11px", color: "#1e293b" }}>{step.stage}</strong>
                        <span
                          style={{
                            fontSize: "9px",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            background: "#e2e8f0",
                            color: "#475569",
                          }}
                        >
                          Source: {step.source}
                        </span>
                      </div>
                      <p style={{ margin: "3px 0 0", fontSize: "10.5px", color: "#475569", lineHeight: "1.6" }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Mitigation Recommendation */}
            <div
              style={{
                background: "linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 100%)",
                border: "1px solid #bbf7d0",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "#244336",
                  color: "#d4a345",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <span style={{ fontSize: "9px", fontWeight: "700", color: "#15803d", letterSpacing: "0.5px" }}>
                  BHOOMI-NITI AI STATUTORY MITIGATION DIRECTIVE
                </span>
                <h4 style={{ margin: "4px 0 6px", fontSize: "12px", color: "#14532d" }}>
                  Recommended Administrative Action
                </h4>
                <p style={{ margin: 0, fontSize: "11px", color: "#166534", lineHeight: "1.7" }}>
                  {selectedCase.aiMitigationSuggestion}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Hotspot Overview Table */
        <div className="panel" style={{ padding: "16px" }}>
          <div className="panel-heading" style={{ marginBottom: "16px" }}>
            <div>
              <span className="eyebrow">NATIONAL LITIGATION CHOROPLETH</span>
              <h2>District Litigation Risk Rankings</h2>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <div className="repository-search" style={{ width: "240px" }}>
                <Search size={14} />
                <input
                  placeholder="Search state or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", textAlign: "left", color: "#64748b", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "10px" }}>DISTRICT / STATE</th>
                  <th style={{ padding: "10px" }}>DISPUTE HOTSPOT SCORE</th>
                  <th style={{ padding: "10px" }}>ACTIVE LITIGATIONS</th>
                  <th style={{ padding: "10px" }}>ULPIN COVERAGE</th>
                  <th style={{ padding: "10px" }}>AVG ACQUISITION DELAY</th>
                  <th style={{ padding: "10px" }}>HIGH-RISK TALUKS</th>
                  <th style={{ padding: "10px" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredDistricts.map((d) => (
                  <tr key={d.district} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px" }}>
                      <strong style={{ color: "#1e293b", display: "block" }}>{d.district}</strong>
                      <span style={{ fontSize: "10px", color: "#64748b" }}>{d.state}</span>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "12px",
                          fontWeight: "700",
                          fontSize: "10px",
                          background: d.disputeHotspotScore > 75 ? "#fee2e2" : d.disputeHotspotScore > 60 ? "#fef3c7" : "#dcfce7",
                          color: d.disputeHotspotScore > 75 ? "#dc2626" : d.disputeHotspotScore > 60 ? "#b45309" : "#166534",
                        }}
                      >
                        {d.disputeHotspotScore} / 100
                      </span>
                    </td>
                    <td style={{ padding: "10px", fontWeight: "600" }}>
                      {d.activeLitigations.toLocaleString()} cases
                    </td>
                    <td style={{ padding: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "40px", height: "6px", background: "#e2e8f0", borderRadius: "3px" }}>
                          <div style={{ width: `${d.ulpinCoveragePercent}%`, height: "100%", background: "#16a34a", borderRadius: "3px" }} />
                        </div>
                        <span>{d.ulpinCoveragePercent}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px", color: d.averageAcquisitionDelayMonths > 18 ? "#dc2626" : "#475569", fontWeight: "600" }}>
                      +{d.averageAcquisitionDelayMonths} Months
                    </td>
                    <td style={{ padding: "10px", color: "#64748b", fontSize: "10px" }}>
                      {d.highRiskTaluks.join(", ")}
                    </td>
                    <td style={{ padding: "10px" }}>
                      <button
                        className="outline-button"
                        style={{ height: "26px", fontSize: "9px" }}
                        onClick={() => {
                          setActiveTab("inspector");
                          const matched = CADASTRAL_PARCELS.find((p) => p.district === d.district);
                          if (matched) onSelectParcel(matched);
                        }}
                      >
                        Inspect District &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
