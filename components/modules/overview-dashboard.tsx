"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen,
  CalendarDays, ChevronDown, Database, FileText, Globe2, Layers3,
  MapPin, ShieldAlert, ShieldCheck, Sparkles, TrendingUp, Users
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Cell, Line,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import type { DistrictIndicator, ParcelData } from "../../data/bhoomi-dataset";
import { CADASTRAL_PARCELS, DISTRICT_INDICATORS } from "../../data/bhoomi-dataset";

const LandMap = dynamic(() => import("../land-map"), {
  ssr: false,
  loading: () => <div className="map-loading">Initializing Bhu-Aadhaar & Cadastral Layers...</div>,
});

interface OverviewDashboardProps {
  onNavigate: (view: string) => void;
  onAsk: (query: string) => void;
  onInspectParcel: (parcel: ParcelData) => void;
}

const nationalMetrics = [
  { label: "Bhu-Aadhaar (ULPIN) Issued", value: "14.28 Cr", change: "+18.4%", tone: "green", icon: Globe2, detail: "across 28 states & 8 UTs" },
  { label: "Cadastral Maps Digitized", value: "6.84 Lakh", change: "+9.2%", tone: "blue", icon: Database, detail: "BhuNaksha vector geo-referenced" },
  { label: "Active Dispute Hotspots", value: "18,306", change: "−4.8%", tone: "coral", icon: ShieldAlert, detail: "flagged by ML forensics" },
  { label: "RFCTLARR Projects Tracked", value: "2,410", change: "+12.1%", tone: "gold", icon: Activity, detail: "statutory acquisition corridors" },
  { label: "Verified Statutory Docs", value: "30,008", change: "+6.5%", tone: "teal", icon: BookOpen, detail: "indexed in Knowledge Hub" },
  { label: "Inter-Agency Network", value: "8,492", change: "+15.3%", tone: "violet", icon: Users, detail: "officials & researchers active" },
];

const trendData = [
  { month: "Jan", papers: 340, policies: 195, disputesResolved: 420 },
  { month: "Feb", papers: 390, policies: 220, disputesResolved: 480 },
  { month: "Mar", papers: 365, policies: 210, disputesResolved: 460 },
  { month: "Apr", papers: 470, policies: 275, disputesResolved: 590 },
  { month: "May", papers: 440, policies: 250, disputesResolved: 570 },
  { month: "Jun", papers: 530, policies: 310, disputesResolved: 680 },
  { month: "Jul", papers: 500, policies: 290, disputesResolved: 640 },
  { month: "Aug", papers: 610, policies: 345, disputesResolved: 790 },
  { month: "Sep", papers: 570, policies: 330, disputesResolved: 750 },
  { month: "Oct", papers: 690, policies: 385, disputesResolved: 880 },
  { month: "Nov", papers: 660, policies: 370, disputesResolved: 840 },
  { month: "Dec", papers: 760, policies: 430, disputesResolved: 950 },
];

const riskDistribution = [
  { name: "Tenure & Mutation Ambiguity", value: 38, color: "#dc2626" },
  { name: "Acquisition & RFCTLARR Delays", value: 27, color: "#ea580c" },
  { name: "Forest / Water Buffer Conflict", value: 21, color: "#d97706" },
  { name: "Cadastral Vector Distortion", value: 14, color: "#2563eb" },
];

export default function OverviewDashboard({ onNavigate, onAsk, onInspectParcel }: OverviewDashboardProps) {
  const [mapLayer, setMapLayer] = useState("Disputes");
  const [satellite, setSatellite] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictIndicator | null>(DISTRICT_INDICATORS[0]);

  return (
    <div className="page-content dashboard-content">
      {/* Top Banner / Welcome Row */}
      <div className="welcome-row">
        <div>
          <span className="eyebrow">
            MINISTRY OF RURAL DEVELOPMENT (DoLR) <i className="eyebrow-dot">•</i> PME DIVISION · PROBLEM ID: 26019
          </span>
          <h1>
            Bhoomi-Niti National Land Intelligence <span className="wave">🇮🇳</span>
          </h1>
          <p>
            Unified digital layer connecting research, policy experimentation, legal knowledge, and geospatial evidence for evidence-based land governance.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="outline-button" onClick={() => onNavigate("twin")}>
            <Globe2 size={14} /> Open Digital Twin
          </button>
          <button className="primary-button" onClick={() => onNavigate("simulation")}>
            <Activity size={14} /> RFCTLARR Simulator
          </button>
        </div>
      </div>

      {/* Hero Search Bar */}
      <form
        className="hero-search"
        onSubmit={(e) => {
          e.preventDefault();
          const query = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value;
          if (query.trim()) onAsk(query);
        }}
      >
        <span className="hero-search-icon">
          <Sparkles size={18} />
        </span>
        <input
          name="search"
          placeholder="Ask statutory question, search 14-digit ULPIN, or query 30,000+ national records..."
        />
        <kbd>↵ Enter</kbd>
        <button type="submit">
          Ask Legal AI <ArrowRight size={14} />
        </button>
      </form>

      {/* National Metrics Grid */}
      <section className="metrics-grid" aria-label="Platform metrics">
        {nationalMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article className="metric-card" key={metric.label}>
              <div className="metric-top">
                <span>{metric.label}</span>
                <span className={`metric-icon ${metric.tone}`}>
                  <Icon size={16} strokeWidth={1.8} />
                </span>
              </div>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-foot">
                <span className={metric.change.startsWith("−") ? "metric-change down" : "metric-change"}>
                  {metric.change.startsWith("−") ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                  {metric.change}
                </span>
                <span>{metric.detail}</span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* National Land Pulse Map */}
        <section className="panel map-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">NATIONAL LAND PULSE · PERSON-PARCEL-PIXEL</span>
              <h2>Geospatial Evidence & Cadastral Overlay</h2>
            </div>
            <button
              className="icon-button panel-more"
              title="Open full GIS intelligence center"
              onClick={() => onNavigate("gis")}
            >
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="map-toolbar">
            <div className="layer-pills">
              {["Disputes", "Land use", "Climate risk", "Watershed Degradation (SRISHTI)"].map((layer) => (
                <button
                  key={layer}
                  className={mapLayer === layer ? "selected" : ""}
                  onClick={() => setMapLayer(layer)}
                >
                  {layer}
                </button>
              ))}
            </div>
            <button
              className={`map-mode${satellite ? " selected" : ""}`}
              onClick={() => setSatellite(!satellite)}
            >
              <Layers3 size={14} />
              {satellite ? "Satellite (ISRO/Esri)" : "Vector Map"}
            </button>
          </div>

          <div className="dashboard-map">
            <LandMap
              activeLayer={mapLayer}
              satelliteView={satellite}
              compact
              selectedDistrict={selectedDistrict?.district}
              onSelectDistrict={(d) => setSelectedDistrict(d)}
              onSelectParcel={(parcel) => onInspectParcel(parcel)}
              showParcels
            />
          </div>

          <div className="map-caption">
            <span>
              <i className="legend-dot high" /> High Litigation / Risk (&gt;75)
            </span>
            <span>
              <i className="legend-dot medium" /> Moderate / Watch Area
            </span>
            <span>
              <i className="legend-dot low" /> Certified / Low Risk
            </span>
            <button onClick={() => onNavigate("gis")}>
              Launch Full GIS Workspace <ArrowRight size={13} />
            </button>
          </div>
        </section>

        {/* Knowledge Momentum & Dispute Resolution Trend */}
        <section className="panel trend-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">KNOWLEDGE & ENFORCEMENT MOMENTUM</span>
              <h2>Resolution Velocity & Citations</h2>
            </div>
            <button className="select-quiet">
              FY 2025–26 <ChevronDown size={13} />
            </button>
          </div>

          <div className="chart-key">
            <span>
              <i className="key-dot green" /> Research Citations
            </span>
            <span>
              <i className="key-dot ochre" /> Policy Directives
            </span>
            <span>
              <i style={{ width: "7px", height: "7px", borderRadius: "2px", background: "#2563eb", display: "inline-block" }} />
              Disputes Resolved
            </span>
          </div>

          <div className="trend-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 14, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="paperFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4b806b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4b806b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e9ece6" strokeDasharray="3 4" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#92978e", fontSize: 10 }} interval={1} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#92978e", fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="papers" name="Research Citations" stroke="#447d69" strokeWidth={2.2} fill="url(#paperFill)" />
                <Line type="monotone" dataKey="policies" name="Policy Directives" stroke="#c79d45" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="disputesResolved" name="Disputes Resolved" stroke="#2563eb" strokeWidth={2} dot={false} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-summary">
            <span>
              <strong>8,240</strong> dispute resolutions expedited this year
            </span>
            <span className="positive-note">
              <TrendingUp size={13} /> 16.4% YoY Improvement
            </span>
          </div>
        </section>

        {/* Risk Distribution Donut */}
        <section className="panel risk-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">ML FORENSICS WATCHLIST</span>
              <h2>Litigation Risk Distribution</h2>
            </div>
            <button className="text-link" onClick={() => onNavigate("forensics")}>
              Forensics Desk <ArrowRight size={13} />
            </button>
          </div>

          <div className="risk-content">
            <div className="risk-donut">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    dataKey="value"
                    innerRadius={46}
                    outerRadius={64}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {riskDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-label">
                <strong>18.3k</strong>
                <span>Cases Analyzed</span>
              </div>
            </div>

            <div className="risk-legend">
              {riskDistribution.map((item) => (
                <div key={item.name}>
                  <i style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="risk-foot">
            <span>
              <i className="pulse-dot" /> 86 districts flagged for proactive mediation
            </span>
            <button onClick={() => onNavigate("forensics")}>Run Parcel Diagnostics</button>
          </div>
        </section>

        {/* Featured Cadastral Parcels / Active Audits */}
        <section className="panel focus-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">HIGH-PRIORITY CADASTRAL PARCELS</span>
              <h2>Active Case Audits & Corridors</h2>
            </div>
            <button className="text-link" onClick={() => onNavigate("forensics")}>
              View All Audits <ArrowRight size={13} />
            </button>
          </div>

          {CADASTRAL_PARCELS.slice(0, 3).map((parcel) => (
            <button
              key={parcel.ulpin}
              className="focus-item"
              onClick={() => onInspectParcel(parcel)}
              style={{ width: "100%", textAlign: "left", cursor: "pointer" }}
            >
              <span className={`focus-file ${parcel.disputeRiskScore > 70 ? "coral" : "ochre"}`}>
                <FileText size={17} />
              </span>
              <span className="focus-copy">
                <strong>
                  {parcel.surveyNumber} ({parcel.village}, {parcel.district}) · ULPIN: {parcel.ulpin}
                </strong>
                <small>
                  {parcel.ownerName} · {parcel.areaHectares} Ha · {parcel.mutationStatus}
                </small>
              </span>
              <span className={`focus-status ${parcel.disputeRiskScore > 70 ? "high-risk" : "done"}`}>
                Risk {parcel.disputeRiskScore}/100
              </span>
            </button>
          ))}
        </section>
      </div>

      {/* Footer Disclaimer */}
      <footer className="page-footer">
        <span>
          <ShieldCheck size={14} /> Bhoomi-Niti · Team Neural Minds · Smart India Hackathon 2026 · Problem ID: 26019
        </span>
        <span>
          Person-Parcel-Pixel Framework · Synchronized with State Revenue Databases <i className="secure-dot" />
        </span>
      </footer>
    </div>
  );
}
