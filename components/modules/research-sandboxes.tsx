"use client";

import { useState } from "react";
import {
  ArrowRight, Award, BookOpen, CalendarDays, CheckCircle2,
  Database, FileCode2, FileText, Globe2, Lightbulb,
  Plus, ShieldCheck, Sparkles, Users
} from "lucide-react";
import { RESEARCH_THEMES } from "../../data/bhoomi-dataset";

interface ResearchSandboxesProps {
  onNotice: (msg: string) => void;
  onNavigateToView: (view: string) => void;
}

export default function ResearchSandboxes({ onNotice, onNavigateToView }: ResearchSandboxesProps) {
  const [selectedTheme, setSelectedTheme] = useState(RESEARCH_THEMES[0]);

  const workingGroups = [
    {
      initials: "DL",
      tone: "green",
      name: "DoLR & State Revenue Interoperability WG",
      members: "24 members",
      activity: "Bhu-Aadhaar ULPIN Luhn checksum standard · Updated 2h ago",
      status: "Active",
      leadAgency: "Department of Land Resources & NIC",
    },
    {
      initials: "SD",
      tone: "blue",
      name: "SRISHTI-DRISHTI Geospatial Analysis Cluster",
      members: "18 members",
      activity: "30m NDVI multi-temporal change detection · Updated yesterday",
      status: "Active",
      leadAgency: "NRSC / ISRO & Watershed Division",
    },
    {
      initials: "ML",
      tone: "ochre",
      name: "Multilingual AI Land Records Consortium",
      members: "12 members",
      activity: "Modi script & Halegannada OCR models · Updated 3 days ago",
      status: "Pilot Review",
      leadAgency: "IIT Madras, CDAC & DoLR",
    },
  ];

  return (
    <div className="page-content module-content">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            SIH 2026 PILLAR 06 · INTER-DEPARTMENTAL RESEARCH SANDBOXES & THEMES
          </span>
          <h1>National Land Research & Innovation Sandboxes</h1>
          <p>
            Collaborative innovation layer bridging central ministries, state revenue departments, town planning bodies, and premier academic institutions.
          </p>
        </div>
        <button
          className="primary-button"
          onClick={() => onNotice("New Research Sandbox proposal submitted for MoRD evaluation.")}
        >
          <Plus size={14} /> Create Research Sandbox
        </button>
      </div>

      {/* Featured Research Themes (from Slide 6 of SIH PPT) */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div>
            <span className="eyebrow">STATUTORY RESEARCH REFERENCES · SIH 2026 THEMES</span>
            <h2 style={{ fontSize: "16px", margin: "2px 0 0", color: "#1e293b" }}>
              Target Problem Statements & Innovation Tracks
            </h2>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
          {RESEARCH_THEMES.map((theme) => (
            <article
              key={theme.id}
              onClick={() => setSelectedTheme(theme)}
              style={{
                padding: "14px",
                borderRadius: "8px",
                border: selectedTheme.id === theme.id ? "2px solid #244336" : "1px solid #e2e8f0",
                background: selectedTheme.id === theme.id ? "#f1f6f3" : "#ffffff",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: "700",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: "#e2e8f0",
                    color: "#334155",
                  }}
                >
                  ID: {theme.id} ({theme.code})
                </span>
                <span style={{ fontSize: "9px", color: "#166534", fontWeight: "600" }}>
                  {theme.status}
                </span>
              </div>

              <h3 style={{ fontSize: "12px", margin: "8px 0 4px", color: "#1e293b", lineHeight: "1.4" }}>
                {theme.title}
              </h3>
              <small style={{ color: "#64748b", display: "block", marginBottom: "8px" }}>
                Lead: {theme.leadAgency}
              </small>

              <p style={{ fontSize: "10.5px", color: "#475569", lineHeight: "1.5", margin: "0 0 10px" }}>
                {theme.description}
              </p>

              <div style={{ borderTop: "1px solid #edf2f7", paddingTop: "8px", fontSize: "9.5px", color: "#0f766e", fontWeight: "600" }}>
                {theme.metrics}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Selected Theme Deep-Dive Banner */}
      <div
        className="panel"
        style={{
          padding: "18px",
          background: "linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)",
          marginBottom: "18px",
          border: "1px solid #cbd5e1",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span className="eyebrow">ACTIVE SANDBOX WORKSPACE #{selectedTheme.id}</span>
            <h2 style={{ fontSize: "18px", margin: "4px 0", color: "#0f172a" }}>
              {selectedTheme.title}
            </h2>
            <p style={{ fontSize: "11px", color: "#475569", maxWidth: "600px" }}>
              {selectedTheme.description}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {selectedTheme.id === "25017" && (
              <button className="primary-button" onClick={() => onNavigateToView("forensics")}>
                Launch Delay Predictor &rarr;
              </button>
            )}
            {selectedTheme.id === "26019" && (
              <button className="primary-button" onClick={() => onNavigateToView("simulation")}>
                Open Policy Digital Twin &rarr;
              </button>
            )}
            {selectedTheme.id === "26015" && (
              <button className="primary-button" onClick={() => onNavigateToView("gis")}>
                View SRISHTI Satellite Layers &rarr;
              </button>
            )}
            <button
              className="outline-button"
              onClick={() => onNotice(`Sandbox documentation and code repositories for ${selectedTheme.code} opened.`)}
            >
              <FileCode2 size={14} /> Open Code & Model Repo
            </button>
          </div>
        </div>
      </div>

      {/* Inter-Departmental Collaboration Working Groups */}
      <div className="panel" style={{ padding: "16px", marginBottom: "18px" }}>
        <div className="panel-heading" style={{ marginBottom: "14px" }}>
          <div>
            <span className="eyebrow">INTER-AGENCY COORDINATION</span>
            <h2>Active Ministerial Working Groups</h2>
          </div>
        </div>

        <div className="team-list">
          {workingGroups.map((wg) => (
            <article className="team-row" key={wg.name}>
              <span className={`team-avatar ${wg.tone}`}>{wg.initials}</span>
              <div className="team-info">
                <strong>{wg.name}</strong>
                <span>{wg.activity}</span>
              </div>
              <span className="team-members">
                <Users size={14} /> {wg.members}
              </span>
              <span className="team-status">
                <i /> {wg.status}
              </span>
              <button
                className="outline-button"
                onClick={() => onNotice(`Entering secure workspace for ${wg.name}.`)}
              >
                Enter Sandbox &rarr;
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
