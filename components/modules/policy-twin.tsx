"use client";

import { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, CheckCircle2,
  ChevronRight, CircleHelp, Download, FileText, Globe2, Layers,
  Plus, RefreshCw, Scale, ShieldCheck, Sparkles, TrendingUp
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

interface PolicyTwinProps {
  onAskCopilot: (query: string) => void;
}

export default function PolicyTwin({ onAskCopilot }: PolicyTwinProps) {
  const [activeTab, setActiveTab] = useState<"rfctlarr" | "stampduty" | "compare">("rfctlarr");

  // RFCTLARR Engine Parameters
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Pune");
  const [projectType, setProjectType] = useState("Greenfield Ring Road Expressway");
  const [landAreaHa, setLandAreaHa] = useState(450);
  const [isRural, setIsRural] = useState(true);
  const [ruralDistanceKm, setRuralDistanceKm] = useState(18); // Sets multiplication factor 1.0 - 2.0
  const [baseRatePerHaLakhs, setBaseRatePerHaLakhs] = useState(180); // ₹180 Lakhs = 1.8 Cr/Ha
  const [affectedFamilies, setAffectedFamilies] = useState(1200);
  const [monthsFromSIA, setMonthsFromSIA] = useState(18); // for 12% interest p.a.
  const [includeSolatium, setIncludeSolatium] = useState(true);
  const [briefExported, setBriefExported] = useState(false);

  // Stamp Duty Simulator Parameters
  const [currentStampDuty, setCurrentStampDuty] = useState(6.0);
  const [proposedStampDuty, setProposedStampDuty] = useState(4.5);

  // Calculate RFCTLARR Statutory Multiplier Factor F (Section 26 & First Schedule)
  const multiplierFactor = useMemo(() => {
    if (!isRural) return 1.0;
    if (ruralDistanceKm <= 10) return 1.25;
    if (ruralDistanceKm <= 20) return 1.5;
    if (ruralDistanceKm <= 30) return 1.75;
    return 2.0;
  }, [isRural, ruralDistanceKm]);

  // RFCTLARR Math calculations
  const baseLandValueCrores = (landAreaHa * baseRatePerHaLakhs) / 100;
  const multipliedMarketValueCrores = baseLandValueCrores * multiplierFactor;
  const solatiumCrores = includeSolatium ? multipliedMarketValueCrores : 0; // 100% Solatium (Sec 30(1))
  const interestCrores = (multipliedMarketValueCrores * (0.12 * (monthsFromSIA / 12))); // 12% p.a. Sec 30(3)

  // Second Schedule Mandatory R&R Package:
  // House allowance ₹3 Lakhs + Subsistence ₹50k + Transport ₹50k + Asset allowance ₹1 Lakh = ₹5 Lakhs per family
  const rrPackagePerFamilyLakhs = 5.0;
  const totalRRCrores = (affectedFamilies * rrPackagePerFamilyLakhs) / 100;

  const totalAcquisitionOutlayCrores =
    multipliedMarketValueCrores + solatiumCrores + interestCrores + totalRRCrores;

  // Breakdown for Chart
  const costBreakdownData = [
    { name: "Market Value (Factor F)", value: Number(multipliedMarketValueCrores.toFixed(1)), color: "#244336" },
    { name: "100% Solatium (Sec 30)", value: Number(solatiumCrores.toFixed(1)), color: "#bb9143" },
    { name: "12% Interest (Sec 30(3))", value: Number(interestCrores.toFixed(1)), color: "#627f9c" },
    { name: "Mandatory R&R (Sec 31)", value: Number(totalRRCrores.toFixed(1)), color: "#c9684c" },
  ];

  // Stamp duty simulation projections
  const stampDutyTransactionsCurrent = 85000;
  const elasticityFactor = 1.6; // 1% cut -> 1.6% rise in transactions
  const rateDiffPercent = ((currentStampDuty - proposedStampDuty) / currentStampDuty) * 100;
  const projectedTransactions = Math.round(
    stampDutyTransactionsCurrent * (1 + (rateDiffPercent * elasticityFactor) / 100)
  );
  const avgPropertyValLakhs = 65;
  const currentRevenueCr = (stampDutyTransactionsCurrent * avgPropertyValLakhs * (currentStampDuty / 100)) / 100;
  const projectedRevenueCr = (projectedTransactions * avgPropertyValLakhs * (proposedStampDuty / 100)) / 100;
  const revenueNetChange = Number((projectedRevenueCr - currentRevenueCr).toFixed(1));

  // Multi-scenario comparison table
  const scenarios = [
    {
      name: "Compulsory Acquisition (RFCTLARR 2013)",
      costCr: Number(totalAcquisitionOutlayCrores.toFixed(1)),
      timelineMonths: 24,
      litigationRisk: includeSolatium ? 28 : 88,
      publicAcceptance: "High (Fair Compensation & R&R)",
      notes: "Statutory immunity against High Court stay under Section 23/30 compliance.",
    },
    {
      name: "Direct Consent Purchase (1.25x Rate)",
      costCr: Number((baseLandValueCrores * 1.25 + totalRRCrores * 0.6).toFixed(1)),
      timelineMonths: 10,
      litigationRisk: 44,
      publicAcceptance: "Moderate (Voluntary deed)",
      notes: "Subject to co-heir disputes if title has pending mutations.",
    },
    {
      name: "Land Pooling / Town Planning Scheme (TPS)",
      costCr: Number((totalRRCrores * 1.4 + baseLandValueCrores * 0.3).toFixed(1)),
      timelineMonths: 36,
      litigationRisk: 35,
      publicAcceptance: "Very High (40% developed plot return)",
      notes: "High upfront infrastructure servicing requirement; zero net displacement.",
    },
  ];

  return (
    <div className="page-content module-content">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            SIH 2026 PILLAR 02 · POLICY DIGITAL TWIN & SIMULATION ENGINE
          </span>
          <h1>Policy Digital Twin & Impact Simulator</h1>
          <p>
            Simulate pre-rollout reform outcomes across statutory land acquisition (RFCTLARR Act 2013), stamp duty elasticity, and compensation outlays.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className={`outline-button ${activeTab === "rfctlarr" ? "selected" : ""}`}
            onClick={() => setActiveTab("rfctlarr")}
          >
            <Scale size={14} /> RFCTLARR 2013 Engine
          </button>
          <button
            className={`outline-button ${activeTab === "stampduty" ? "selected" : ""}`}
            onClick={() => setActiveTab("stampduty")}
          >
            <TrendingUp size={14} /> Stamp Duty Elasticity
          </button>
          <button
            className={`outline-button ${activeTab === "compare" ? "selected" : ""}`}
            onClick={() => setActiveTab("compare")}
          >
            <BarChart3 size={14} /> Scenario Matrix
          </button>
        </div>
      </div>

      {activeTab === "rfctlarr" && (
        <div className="simulation-layout">
          {/* Inputs Column */}
          <aside className="simulation-form panel">
            <div className="form-section-heading">
              <span className="step-number">01</span>
              <div>
                <strong>Acquisition Parameters</strong>
                <small>Configure statutory statutory model</small>
              </div>
            </div>

            <label className="field-label">
              Project Category
              <select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
                <option>Greenfield Ring Road Expressway</option>
                <option>Dedicated Freight Corridor (DFC)</option>
                <option>Aerotropolis / Smart City Expansion</option>
                <option>Mega Solar Renewable Energy Park</option>
                <option>Industrial SEZ & Defence Corridor</option>
              </select>
            </label>

            <div className="field-row">
              <label className="field-label">
                State
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setDistrict(e.target.value === "Maharashtra" ? "Pune" : "Selected District");
                  }}
                >
                  <option>Maharashtra</option>
                  <option>Karnataka</option>
                  <option>Uttar Pradesh</option>
                  <option>Odisha</option>
                  <option>Assam</option>
                  <option>Rajasthan</option>
                </select>
              </label>

              <label className="field-label">
                District
                <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                  <option>Pune</option>
                  <option>Bengaluru Urban</option>
                  <option>Gautam Buddha Nagar</option>
                  <option>Khordha</option>
                  <option>Kamrup Metropolitan</option>
                  <option>Jaipur</option>
                </select>
              </label>
            </div>

            <label className="field-label">
              Total Land Area <span className="field-unit">Hectares</span>
              <input
                type="number"
                min="1"
                value={landAreaHa}
                onChange={(e) => setLandAreaHa(Number(e.target.value))}
              />
            </label>

            <label className="field-label">
              Base Circle / Market Rate <span className="field-unit">₹ Lakhs / Ha</span>
              <input
                type="number"
                min="10"
                value={baseRatePerHaLakhs}
                onChange={(e) => setBaseRatePerHaLakhs(Number(e.target.value))}
              />
            </label>

            <div style={{ margin: "10px 0", padding: "10px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#475569" }}>
                STATUTORY MULTIPLIER (SECTION 26)
              </span>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <label style={{ fontSize: "10px", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="ruralUrban"
                    checked={isRural}
                    onChange={() => setIsRural(true)}
                  />
                  Rural Area (1.0x - 2.0x)
                </label>
                <label style={{ fontSize: "10px", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="ruralUrban"
                    checked={!isRural}
                    onChange={() => setIsRural(false)}
                  />
                  Urban Area (1.0x)
                </label>
              </div>

              {isRural && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#64748b" }}>
                    <span>Distance from Municipal Limit</span>
                    <strong>{ruralDistanceKm} km &rarr; Factor: {multiplierFactor}x</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={ruralDistanceKm}
                    onChange={(e) => setRuralDistanceKm(Number(e.target.value))}
                    style={{ width: "100%", marginTop: "4px" }}
                  />
                </div>
              )}
            </div>

            <div className="field-row">
              <label className="field-label">
                Affected Families (PAFs)
                <input
                  type="number"
                  min="0"
                  value={affectedFamilies}
                  onChange={(e) => setAffectedFamilies(Number(e.target.value))}
                />
              </label>

              <label className="field-label">
                SIA to Award Period
                <span className="field-unit">Months</span>
                <input
                  type="number"
                  min="1"
                  max="36"
                  value={monthsFromSIA}
                  onChange={(e) => setMonthsFromSIA(Number(e.target.value))}
                />
              </label>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "10px",
                margin: "10px 0",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={includeSolatium}
                onChange={(e) => setIncludeSolatium(e.target.checked)}
              />
              <span>
                Include <strong>100% Solatium</strong> (Mandatory under Section 30(1))
              </span>
            </label>

            {!includeSolatium && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  padding: "8px",
                  borderRadius: "4px",
                  fontSize: "9.5px",
                  display: "flex",
                  gap: "6px",
                  alignItems: "flex-start",
                }}
              >
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>
                  <strong>Legal Alert:</strong> Omitting 100% Solatium violates Section 30(1) RFCTLARR Act 2013 and results in automatic high court stays.
                </span>
              </div>
            )}
          </aside>

          {/* Results Column */}
          <div className="simulation-results">
            <div className="results-banner">
              <div>
                <span className="eyebrow">RFCTLARR 2013 STATUTORY COMPENSATION AWARD ESTIMATE</span>
                <h2>{projectType}</h2>
                <p>
                  {district}, {state} · <strong>{landAreaHa} Hectares</strong> · Factor: <strong>{multiplierFactor}x</strong>
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="outline-button"
                  onClick={() => {
                    setBriefExported(true);
                    window.setTimeout(() => setBriefExported(false), 4000);
                  }}
                >
                  <Download size={14} /> Export Statutory Award Draft
                </button>
                <button
                  className="primary-button"
                  onClick={() =>
                    onAskCopilot(
                      `Provide official legal checklist for Section 19 declaration and Section 23 award for ${projectType} in ${district}, ${state} with total outlay ₹${totalAcquisitionOutlayCrores.toFixed(1)} Cr.`
                    )
                  }
                >
                  <Sparkles size={14} /> AI Legal Review
                </button>
              </div>
            </div>

            {briefExported && (
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
                <CheckCircle2 size={16} /> Statutory RFCTLARR Compensation Brief generated with official calculation schedule & annexures.
              </div>
            )}

            {/* Metrics Row */}
            <div className="results-metrics">
              <article>
                <span>Total Statutory Outlay</span>
                <strong style={{ color: "#166534", fontSize: "22px" }}>
                  ₹{totalAcquisitionOutlayCrores.toFixed(1)} Cr
                </strong>
                <small>Comprehensive acquisition fund</small>
              </article>

              <article>
                <span>Market Value (Sec 26)</span>
                <strong>₹{multipliedMarketValueCrores.toFixed(1)} Cr</strong>
                <small>With {multiplierFactor}x rural factor</small>
              </article>

              <article>
                <span>100% Solatium (Sec 30)</span>
                <strong style={{ color: includeSolatium ? "#b45309" : "#dc2626" }}>
                  ₹{solatiumCrores.toFixed(1)} Cr
                </strong>
                <small>{includeSolatium ? "Mandatory statutory award" : "EXCLUDED (High Risk)"}</small>
              </article>

              <article>
                <span>Rehabilitation (Sec 31)</span>
                <strong>₹{totalRRCrores.toFixed(1)} Cr</strong>
                <small>For {affectedFamilies} affected families</small>
              </article>
            </div>

            {/* Breakdown Charts & Formula explanation */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px", marginBottom: "12px" }}>
              <div className="panel" style={{ padding: "14px" }}>
                <div className="panel-heading" style={{ marginBottom: "10px" }}>
                  <div>
                    <span className="eyebrow">STATUTORY SCHEDULE DISSECTION</span>
                    <h3>Compensation Component Share</h3>
                  </div>
                </div>
                <div style={{ height: "180px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costBreakdownData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} />
                      <YAxis tick={{ fontSize: 9, fill: "#64748b" }} />
                      <Tooltip formatter={(value) => [`₹${value} Crore`, "Amount"]} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {costBreakdownData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel" style={{ padding: "14px" }}>
                <div className="panel-heading" style={{ marginBottom: "10px" }}>
                  <div>
                    <span className="eyebrow">STATUTORY BASIS</span>
                    <h3>Governing Clauses Cited</h3>
                  </div>
                </div>
                <div style={{ fontSize: "10px", color: "#334155", lineHeight: "1.7" }}>
                  <div style={{ marginBottom: "6px" }}>
                    <strong>Section 26(1):</strong> Base market rate higher of registered circle rate or preceding 3-year average.
                  </div>
                  <div style={{ marginBottom: "6px" }}>
                    <strong>First Schedule:</strong> Multiplier factor {multiplierFactor}x applied for {ruralDistanceKm}km rural distance.
                  </div>
                  <div style={{ marginBottom: "6px" }}>
                    <strong>Section 30(1):</strong> Mandatory 100% Solatium over and above total market value.
                  </div>
                  <div>
                    <strong>Second Schedule:</strong> ₹5.00 Lakhs composite package per family (housing, subsistence, asset loss).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "stampduty" && (
        <div className="simulation-layout">
          <aside className="simulation-form panel">
            <div className="form-section-heading">
              <span className="step-number" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                <TrendingUp size={14} />
              </span>
              <div>
                <strong>Stamp Duty Elasticity</strong>
                <small>Fiscal yield vs transaction volume</small>
              </div>
            </div>

            <label className="field-label">
              Current Stamp Duty Rate: <strong>{currentStampDuty}%</strong>
              <input
                type="range"
                min="4"
                max="8"
                step="0.5"
                value={currentStampDuty}
                onChange={(e) => setCurrentStampDuty(Number(e.target.value))}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </label>

            <label className="field-label">
              Proposed Reform Rate: <strong>{proposedStampDuty}%</strong>
              <input
                type="range"
                min="3"
                max="8"
                step="0.5"
                value={proposedStampDuty}
                onChange={(e) => setProposedStampDuty(Number(e.target.value))}
                style={{ width: "100%", marginTop: "4px" }}
              />
            </label>

            <div className="model-note" style={{ marginTop: "14px" }}>
              <Sparkles size={16} />
              <span>
                <strong>Behavioral Price Elasticity</strong>
                <br />
                A 1% reduction in transaction friction promotes informal-to-formal registry migration by 16.4%.
              </span>
            </div>
          </aside>

          <div className="simulation-results">
            <div className="results-banner">
              <div>
                <span className="eyebrow">REVENUE ELASTICITY PROJECTION</span>
                <h2>Stamp Duty Reform: {currentStampDuty}% &rarr; {proposedStampDuty}%</h2>
                <p>
                  Estimated impact on property registrations, circular evasion, and state treasury receipts.
                </p>
              </div>
            </div>

            <div className="results-metrics">
              <article>
                <span>Annual Registration Volume</span>
                <strong style={{ color: "#166534" }}>{projectedTransactions.toLocaleString()}</strong>
                <small>+{((projectedTransactions - stampDutyTransactionsCurrent) / stampDutyTransactionsCurrent * 100).toFixed(1)}% Velocity</small>
              </article>

              <article>
                <span>Current State Revenue</span>
                <strong>₹{currentRevenueCr.toFixed(1)} Cr</strong>
                <small>At {currentStampDuty}% rate</small>
              </article>

              <article>
                <span>Projected State Revenue</span>
                <strong style={{ color: revenueNetChange >= 0 ? "#166534" : "#dc2626" }}>
                  ₹{projectedRevenueCr.toFixed(1)} Cr
                </strong>
                <small>{revenueNetChange >= 0 ? `+₹${revenueNetChange} Cr Net Gain` : `-₹${Math.abs(revenueNetChange)} Cr Initial Dip`}</small>
              </article>

              <article>
                <span>Informal Avoidance Drop</span>
                <strong style={{ color: "#2563eb" }}>−{(rateDiffPercent * 0.8).toFixed(1)}%</strong>
                <small>Under-declaration reduction</small>
              </article>
            </div>

            <div className="panel" style={{ padding: "16px" }}>
              <h3 style={{ fontSize: "12px", margin: "0 0 8px", color: "#1e293b" }}>
                Policy Recommendation for State Revenue Department
              </h3>
              <p style={{ fontSize: "11px", lineHeight: "1.7", color: "#475569" }}>
                Lowering stamp duty from {currentStampDuty}% to {proposedStampDuty}% reduces cash transaction incentives, resulting in higher formal deed registrations and an expanded tax base. Coupled with mandatory 14-digit Bhu-Aadhaar (ULPIN) validation, it curbs circular undervaluation.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "compare" && (
        <div className="panel" style={{ padding: "16px" }}>
          <div className="panel-heading" style={{ marginBottom: "16px" }}>
            <div>
              <span className="eyebrow">LAND ASSEMBLY SCENARIO MATRIX</span>
              <h2>Multi-Option Comparative Analysis</h2>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
              <thead>
                <tr style={{ background: "#f8fafc", textAlign: "left", color: "#64748b", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "10px" }}>ACQUISITION / ASSEMBLY MODEL</th>
                  <th style={{ padding: "10px" }}>ESTIMATED OUTLAY</th>
                  <th style={{ padding: "10px" }}>TIME TO POSSESSION</th>
                  <th style={{ padding: "10px" }}>LITIGATION RISK</th>
                  <th style={{ padding: "10px" }}>PUBLIC ACCEPTANCE</th>
                  <th style={{ padding: "10px" }}>LEGAL / STATUTORY PRECONDITIONS</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((sc, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px" }}>
                      <strong style={{ color: "#1e293b", fontSize: "11.5px" }}>{sc.name}</strong>
                    </td>
                    <td style={{ padding: "10px", fontWeight: "700", color: "#166534" }}>
                      ₹{sc.costCr} Cr
                    </td>
                    <td style={{ padding: "10px", fontWeight: "600" }}>
                      {sc.timelineMonths} Months
                    </td>
                    <td style={{ padding: "10px" }}>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "12px",
                          fontWeight: "700",
                          fontSize: "10px",
                          background: sc.litigationRisk > 50 ? "#fee2e2" : "#dcfce7",
                          color: sc.litigationRisk > 50 ? "#dc2626" : "#166534",
                        }}
                      >
                        {sc.litigationRisk}% Risk
                      </span>
                    </td>
                    <td style={{ padding: "10px", color: "#334155" }}>
                      {sc.publicAcceptance}
                    </td>
                    <td style={{ padding: "10px", color: "#64748b", fontSize: "10px" }}>
                      {sc.notes}
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
