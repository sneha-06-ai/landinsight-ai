"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BookOpen,
  Building2, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Clock3, CloudSun, Compass, Database, Download, Eye, FileSearch,
  FileText, Filter, Gavel, Globe2, Layers, Layers3, Leaf, Lightbulb, LogIn,
  Map, MapPin, Menu, MessageSquare, MoreHorizontal, Plus, Scale, Search, Send, Settings2,
  ShieldAlert, ShieldCheck, Sparkles, TrendingUp, Upload, Users, X
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart,
  Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

import LandMap from "../components/land-map";
import OverviewDashboard from "../components/modules/overview-dashboard";
import DisputeForensics from "../components/modules/dispute-forensics";
import PolicyTwin from "../components/modules/policy-twin";
import GISIntelligence from "../components/modules/gis-intelligence";
import LegalCopilot from "../components/modules/legal-copilot";
import KnowledgeRepository from "../components/modules/knowledge-repository";
import ResearchSandboxes from "../components/modules/research-sandboxes";

import type { DistrictIndicator, ParcelData } from "../data/bhoomi-dataset";
import {
  CADASTRAL_PARCELS, DISTRICT_INDICATORS, FORENSIC_CASES,
  KNOWLEDGE_DOCUMENTS, LEGAL_COPILOT_KNOWLEDGE, RESEARCH_THEMES
} from "../data/bhoomi-dataset";

type View =
  | "dashboard"
  | "forensics"
  | "simulation"
  | "gis"
  | "copilot"
  | "repository"
  | "twin"
  | "analytics"
  | "sandboxes";

type Role =
  | "Super Admin"
  | "Government Official"
  | "Revenue Collector / SDO"
  | "Researcher / Urban Planner"
  | "Public Citizen";

const navGroups: {
  group: string;
  items: { key: View; label: string; icon: typeof Compass; badge?: string }[];
}[] = [
    {
      group: "Core Governance",
      items: [
        { key: "dashboard", label: "National Overview", icon: Compass },
        { key: "forensics", label: "Dispute Forensics", icon: ShieldAlert, badge: "ML Risk" },
        { key: "simulation", label: "Policy Digital Twin", icon: Activity, badge: "RFCTLARR" },
        { key: "gis", label: "GIS Cadastre Center", icon: Map, badge: "BhuNaksha" },
      ],
    },
    {
      group: "Intelligence & Law",
      items: [
        { key: "copilot", label: "Statutory RAG Copilot", icon: Sparkles, badge: "AI Law" },
        { key: "repository", label: "Knowledge Hub", icon: BookOpen, badge: "30k Docs" },
        { key: "twin", label: "Land Growth Twin", icon: Globe2 },
        { key: "analytics", label: "Decision Analytics", icon: TrendingUp },
      ],
    },
    {
      group: "Collaborative Research",
      items: [
        { key: "sandboxes", label: "SIH Research Sandboxes", icon: Users, badge: "5 Themes" },
      ],
    },
  ];

const roles: Role[] = [
  "Super Admin",
  "Government Official",
  "Revenue Collector / SDO",
  "Researcher / Urban Planner",
  "Public Citizen",
];

const quickCopilotQuestions = [
  "How is land acquisition compensation calculated under RFCTLARR Act 2013?",
  "What is Bhu-Aadhaar (ULPIN) and how does it prevent duplicate land transactions?",
  "What are the legal grounds for challenging a contested mutation in agricultural land?",
  "How does the Forest Rights Act (FRA 2006) interact with infrastructure land acquisition?",
];

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [role, setRole] = useState<Role>("Government Official");
  const [roleMenu, setRoleMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [notice, setNotice] = useState("");

  // Shared active cadastral parcel
  const [selectedParcel, setSelectedParcel] = useState<ParcelData>(CADASTRAL_PARCELS[0]);

  // Persistent Assistant State
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantResponse, setAssistantResponse] = useState<typeof LEGAL_COPILOT_KNOWLEDGE[0] | null>(null);

  // Digital Twin state
  const [twinYear, setTwinYear] = useState(2025);

  const navigate = (target: View) => {
    setView(target);
    setMobileMenu(false);
    setGlobalSearch("");
  };

  const handleInspectParcel = (parcel: ParcelData) => {
    setSelectedParcel(parcel);
    setView("gis");
    setNotice(`Loaded Cadastral Parcel ULPIN: ${parcel.ulpin} (${parcel.village}, ${parcel.district})`);
    setTimeout(() => setNotice(""), 3500);
  };

  const handleNavigateToForensics = (parcel: ParcelData) => {
    setSelectedParcel(parcel);
    setView("forensics");
  };

  const handleNavigateToPolicy = (parcel: ParcelData) => {
    setSelectedParcel(parcel);
    setView("simulation");
  };

  const handleAskLegal = (queryText: string) => {
    setAssistantQuery(queryText);
    const matched =
      LEGAL_COPILOT_KNOWLEDGE.find(
        (f) =>
          queryText.toLowerCase().includes("rfctlarr") ||
          queryText.toLowerCase().includes("compensation") ||
          queryText.toLowerCase().includes("solatium")
      ) ||
      LEGAL_COPILOT_KNOWLEDGE.find(
        (f) =>
          queryText.toLowerCase().includes("ulpin") ||
          queryText.toLowerCase().includes("bhu-aadhaar") ||
          queryText.toLowerCase().includes("bhu aadhaar")
      ) ||
      LEGAL_COPILOT_KNOWLEDGE.find(
        (f) =>
          queryText.toLowerCase().includes("mutation") ||
          queryText.toLowerCase().includes("ferfar")
      ) ||
      LEGAL_COPILOT_KNOWLEDGE[0];

    setAssistantResponse(matched);
    setAssistantOpen(true);
  };

  const handleAssistantSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (assistantQuery.trim()) {
      handleAskLegal(assistantQuery.trim());
    }
  };

  // Global search filtering across parcels, cases, and documents
  const filteredSearchResults = globalSearch.trim()
    ? {
      parcels: CADASTRAL_PARCELS.filter(
        (p) =>
          p.ulpin.toLowerCase().includes(globalSearch.toLowerCase()) ||
          p.surveyNumber.toLowerCase().includes(globalSearch.toLowerCase()) ||
          p.village.toLowerCase().includes(globalSearch.toLowerCase()) ||
          p.ownerName.toLowerCase().includes(globalSearch.toLowerCase())
      ),
      documents: KNOWLEDGE_DOCUMENTS.filter(
        (d) =>
          d.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
          d.category.toLowerCase().includes(globalSearch.toLowerCase()) ||
          d.schemeTag?.toLowerCase().includes(globalSearch.toLowerCase())
      ),
      cases: FORENSIC_CASES.filter(
        (c) =>
          c.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
          c.disputeType.toLowerCase().includes(globalSearch.toLowerCase()) ||
          c.district.toLowerCase().includes(globalSearch.toLowerCase())
      ),
    }
    : null;

  return (
    <div className={`app-shell${dark ? " theme-dark" : ""}`}>
      {/* Mobile scrim overlay */}
      {mobileMenu && (
        <button
          className="mobile-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside className={`sidebar${mobileMenu ? " sidebar-open" : ""}`}>
        {/* Brand Lockup */}
        <a
          className="brand-lockup"
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            navigate("dashboard");
          }}
        >
          <span className="brand-mark" style={{ borderColor: "#d97706" }}>
            <span style={{ background: "#16a34a" }} />
          </span>
          <span>
            <strong style={{ fontSize: "17px", letterSpacing: "0.2px" }}>
              bhoomi<span style={{ color: "#d97706" }}>.niti</span>
            </strong>
            <small style={{ color: "#86efac", fontSize: "9px" }}>
              National Evidence & Land Layer · SIH 2026
            </small>
          </span>
        </a>

        {/* Workspace Switcher */}
        <div className="workspace-switcher">
          <span className="workspace-avatar" style={{ background: "#244336", color: "#d97706", fontWeight: "bold" }}>
            IN
          </span>
          <span>
            <strong>DoLR National Hub</strong>
            <small>Problem ID: 26019 · Neural Minds</small>
          </span>
          <ChevronDown size={14} />
        </div>

        {/* Primary Navigation */}
        <nav className="primary-nav" aria-label="Main navigation">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.group}>
              <p className="nav-group-label">{group.group}</p>
              {group.items.map(({ key, label, icon: Icon, badge }) => (
                <button
                  key={key}
                  className={`nav-link${view === key ? " active" : ""}`}
                  onClick={() => navigate(key)}
                >
                  <Icon size={16} strokeWidth={1.8} />
                  <span>{label}</span>
                  {badge && (
                    <span
                      style={{
                        padding: "2px 5px",
                        borderRadius: "3px",
                        background: view === key ? "#244336" : "#2d4c3c",
                        color: "#fef08a",
                        fontSize: "7.5px",
                        fontWeight: "700",
                        letterSpacing: "0.4px",
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="sidebar-bottom">
          <div className="secure-note">
            <ShieldCheck size={16} />
            <span>Govt of India · PostGIS Encrypted</span>
            <i className="secure-dot" />
          </div>

          <div className="sidebar-user">
            <div className="user-avatar" style={{ background: "#244336", color: "#fef08a" }}>
              NM
            </div>
            <div className="user-meta">
              <strong>Team Neural Minds</strong>
              <small>{role}</small>
            </div>
            <button
              className="icon-button user-menu-button"
              title="Switch role"
              onClick={() => setRoleMenu(!roleMenu)}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>

          {roleMenu && (
            <div className="role-menu">
              <p>Simulate Access As</p>
              {roles.map((item) => (
                <button
                  key={item}
                  className={role === item ? "selected" : ""}
                  onClick={() => {
                    setRole(item);
                    setRoleMenu(false);
                    setNotice(`Switched active view role to: ${item}`);
                    setTimeout(() => setNotice(""), 3000);
                  }}
                >
                  {item}
                  {role === item && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Column */}
      <main className="main-column">
        {/* Topbar */}
        <header className="topbar">
          <button
            className="icon-button mobile-menu-button"
            aria-label="Open navigation"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={19} />
          </button>

          <div className="breadcrumbs">
            <span>Bhoomi-Niti</span>
            <ChevronRight size={14} />
            <strong>
              {view === "dashboard" && "National Land Overview"}
              {view === "forensics" && "Dispute Forensics Workspace"}
              {view === "simulation" && "Policy Digital Twin & RFCTLARR"}
              {view === "gis" && "GIS Cadastral Center"}
              {view === "copilot" && "Statutory RAG Legal Copilot"}
              {view === "repository" && "National Knowledge Hub"}
              {view === "twin" && "Land Growth Twin"}
              {view === "analytics" && "Decision Intelligence"}
              {view === "sandboxes" && "SIH Research Sandboxes"}
            </strong>
          </div>

          <div className="topbar-actions">
            {/* Global Search Bar */}
            <div className="global-search" style={{ width: "min(320px, 30vw)" }}>
              <Search size={15} />
              <input
                aria-label="Search everything"
                placeholder="Search ULPIN, survey no, act, case..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
              <kbd>⌘ K</kbd>

              {filteredSearchResults && (
                <div className="search-results" style={{ width: "380px" }}>
                  <small>SEARCH RESULTS ACROSS PLATFORM</small>

                  {/* Parcels */}
                  {filteredSearchResults.parcels.length > 0 && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ fontSize: "8.5px", fontWeight: "700", color: "#64748b" }}>
                        CADASTRAL PARCELS
                      </span>
                      {filteredSearchResults.parcels.slice(0, 2).map((p) => (
                        <button
                          key={p.ulpin}
                          onClick={() => {
                            handleInspectParcel(p);
                            setGlobalSearch("");
                          }}
                        >
                          <MapPin size={13} color="#16a34a" />
                          <span>
                            Plot {p.surveyNumber} ({p.village}) · ULPIN: {p.ulpin.slice(0, 16)}...
                          </span>
                          <ArrowUpRight size={13} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Cases */}
                  {filteredSearchResults.cases.length > 0 && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ fontSize: "8.5px", fontWeight: "700", color: "#64748b" }}>
                        DISPUTE FORENSICS CASES
                      </span>
                      {filteredSearchResults.cases.slice(0, 2).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            const p = CADASTRAL_PARCELS.find((item) => item.ulpin === c.ulpin);
                            if (p) setSelectedParcel(p);
                            setView("forensics");
                            setGlobalSearch("");
                          }}
                        >
                          <ShieldAlert size={13} color="#dc2626" />
                          <span>
                            {c.id}: {c.title.slice(0, 32)}...
                          </span>
                          <ArrowUpRight size={13} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Documents */}
                  {filteredSearchResults.documents.length > 0 && (
                    <div>
                      <span style={{ fontSize: "8.5px", fontWeight: "700", color: "#64748b" }}>
                        STATUTES & REVENUE CODES
                      </span>
                      {filteredSearchResults.documents.slice(0, 2).map((d) => (
                        <button
                          key={d.id}
                          onClick={() => {
                            setView("repository");
                            setGlobalSearch("");
                          }}
                        >
                          <BookOpen size={13} color="#2563eb" />
                          <span>{d.title.slice(0, 36)}...</span>
                          <ArrowUpRight size={13} />
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredSearchResults.parcels.length === 0 &&
                    filteredSearchResults.cases.length === 0 &&
                    filteredSearchResults.documents.length === 0 && (
                      <p style={{ margin: "6px 0", fontSize: "10px", color: "#64748b" }}>
                        No direct match. Try asking the AI Legal Copilot.
                      </p>
                    )}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              className="icon-button theme-toggle"
              title={dark ? "Switch to light theme" : "Switch to dark theme"}
              onClick={() => setDark(!dark)}
            >
              <span className="theme-glyph">{dark ? "☼" : "◐"}</span>
            </button>

            {/* Notification Popover */}
            <div className="notification-wrap">
              <button
                className="icon-button"
                title="Notifications"
                onClick={() => setNotifications(!notifications)}
              >
                <Bell size={17} />
                <i />
              </button>
              {notifications && (
                <div className="notification-popover" style={{ width: "320px" }}>
                  <strong>DoLR National Alerts & Signals</strong>
                  <p>
                    <i className="notification-mark" style={{ background: "#dc2626" }} />
                    High dispute risk (84%) flagged in Pune Hinjawadi Ring Road acquisition
                  </p>
                  <p>
                    <i className="notification-mark amber" />
                    SRISHTI-DRISHTI 30m composite updated for Vidarbha & Odisha districts
                  </p>
                  <p>
                    <i className="notification-mark" style={{ background: "#16a34a" }} />
                    DILRMP cadastral vectorization completed in 42,000 villages in UP
                  </p>
                  <small>Real-time sync from DoLR Central Portal</small>
                </div>
              )}
            </div>

            {/* Login / Auth Portal link */}
            <Link className="portal-entry" href="/login" title="Open Official Gateway">
              <LogIn size={15} />
              <span>Official Gateway</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <div className="content-scroll">
          {view === "dashboard" && (
            <OverviewDashboard
              onNavigate={(v) => navigate(v as View)}
              onAsk={handleAskLegal}
              onInspectParcel={handleInspectParcel}
            />
          )}

          {view === "forensics" && (
            <DisputeForensics
              selectedParcel={selectedParcel}
              onSelectParcel={(p) => setSelectedParcel(p)}
              onNavigateToGIS={handleInspectParcel}
              onAskCopilot={handleAskLegal}
            />
          )}

          {view === "simulation" && (
            <PolicyTwin onAskCopilot={handleAskLegal} />
          )}

          {view === "gis" && (
            <GISIntelligence
              selectedParcel={selectedParcel}
              onSelectParcel={(p) => setSelectedParcel(p)}
              onNavigateToForensics={handleNavigateToForensics}
              onNavigateToPolicy={handleNavigateToPolicy}
            />
          )}

          {view === "copilot" && (
            <LegalCopilot
              initialQuery={assistantQuery}
              onNavigateToRepository={() => navigate("repository")}
            />
          )}

          {view === "repository" && (
            <KnowledgeRepository
              onAskCopilot={handleAskLegal}
              onNotice={(msg) => {
                setNotice(msg);
                setTimeout(() => setNotice(""), 3500);
              }}
            />
          )}

          {view === "sandboxes" && (
            <ResearchSandboxes
              onNotice={(msg) => {
                setNotice(msg);
                setTimeout(() => setNotice(""), 3500);
              }}
              onNavigateToView={(v) => navigate(v as View)}
            />
          )}

          {view === "twin" && (
            <TwinView year={twinYear} setYear={setTwinYear} onNavigateToGIS={() => navigate("gis")} />
          )}

          {view === "analytics" && <AnalyticsView onNavigateToForensics={() => navigate("forensics")} />}
        </div>
      </main>

      {/* Persistent Copilot Rail */}
      {assistantOpen ? (
        <aside className="assistant-rail">
          <div className="assistant-head">
            <div className="assistant-title">
              <span className="assistant-icon">
                <Sparkles size={16} />
              </span>
              <span>
                <strong>Statutory Legal AI</strong>
                <small>RFCTLARR · DILRMP · RoR</small>
              </span>
            </div>
            <button
              className="icon-button"
              title="Close copilot panel"
              onClick={() => setAssistantOpen(false)}
            >
              <X size={17} />
            </button>
          </div>

          <div className="assistant-context">
            <i className="live-dot" /> 30,008 STATUTES INDEXED · VERIFIED SOURCE
          </div>

          <div className="assistant-body">
            <div className="assistant-welcome">
              <span className="welcome-spark">🇮🇳</span>
              <h2>Bhoomi-Niti AI</h2>
              <p>Ask statutory land questions, calculate acquisition awards, or inspect mutation rules.</p>
            </div>

            {assistantResponse ? (
              <div className="copilot-response">
                <div className="response-label">
                  <Sparkles size={13} />
                  <span>{assistantResponse.statute} ({assistantResponse.section})</span>
                </div>
                <p className="response-query">{assistantQuery}</p>
                <p style={{ fontSize: "10.5px", lineHeight: "1.6", color: "#334155" }}>
                  {assistantResponse.officialTextSummary}
                </p>

                <div style={{ marginTop: "10px", padding: "8px", background: "#f8fafc", borderRadius: "5px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "9px", fontWeight: "700", color: "#166534" }}>
                    ADMINISTRATIVE DIRECTIVE:
                  </span>
                  <p style={{ margin: "2px 0 0", fontSize: "10px", color: "#334155" }}>
                    {assistantResponse.governanceImplication}
                  </p>
                </div>

                <div className="response-actions" style={{ marginTop: "10px" }}>
                  <button onClick={() => navigate("copilot")}>
                    <MessageSquare size={13} /> Open Full Copilot
                  </button>
                  <button onClick={() => navigate("repository")}>
                    <BookOpen size={13} /> View Cited Act
                  </button>
                </div>
              </div>
            ) : (
              <div className="assistant-suggestions">
                <span className="suggestion-label">START WITH A STATUTORY INQUIRY</span>
                {quickCopilotQuestions.map((q) => (
                  <button key={q} onClick={() => handleAskLegal(q)}>
                    <span>{q}</span>
                    <ArrowUpRight size={14} />
                  </button>
                ))}
              </div>
            )}

            <div className="assistant-insight" style={{ marginTop: "16px" }}>
              <div className="insight-heading">
                <span className="insight-bulb">
                  <Lightbulb size={14} />
                </span>
                <span>PROACTIVE ALERT</span>
              </div>
              <p style={{ fontSize: "10px", lineHeight: "1.6", color: "#334155" }}>
                Section 11 RFCTLARR notice in <strong>Pune Ring Road</strong> requires 100% Solatium escrow to avoid pending injunction under Section 85 partition suit.
              </p>
              <button className="text-link" onClick={() => navigate("forensics")}>
                Inspect Case Dossier <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <form className="assistant-composer" onSubmit={handleAssistantSubmit}>
            <textarea
              aria-label="Ask the research copilot"
              placeholder="Ask about RFCTLARR solatium, ULPIN rules, court stays..."
              value={assistantQuery}
              onChange={(e) => setAssistantQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <div className="composer-footer">
              <button
                type="button"
                title="Open full copilot"
                onClick={() => navigate("copilot")}
              >
                <Plus size={16} />
              </button>
              <span>Answers cite official statutes</span>
              <button className="send-button" type="submit" aria-label="Send question">
                <Send size={15} />
              </button>
            </div>
          </form>
        </aside>
      ) : (
        <button
          className="assistant-launcher"
          title="Open Statutory Copilot"
          onClick={() => setAssistantOpen(true)}
          style={{ background: "#244336", boxShadow: "0 6px 20px rgba(36, 67, 54, 0.4)" }}
        >
          <Sparkles size={17} />
          <span>Legal AI</span>
        </button>
      )}

      {/* Floating Toast Notification */}
      {notice && (
        <div className="toast-message">
          <Check size={15} />
          {notice}
          <button aria-label="Dismiss notice" onClick={() => setNotice("")}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// Digital Twin View
function TwinView({
  year,
  setYear,
  onNavigateToGIS,
}: {
  year: number;
  setYear: (y: number) => void;
  onNavigateToGIS: () => void;
}) {
  const degradation = Math.max(3.1, 8.6 - (year - 2025) * 0.39).toFixed(1);
  return (
    <div className="page-content module-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">NATIONAL LAND GOVERNANCE DIGITAL TWIN</span>
          <h1>A Living Multi-Decadal Model of India&apos;s Land</h1>
          <p>
            Connect land cover, demographic pressure, climate resilience, and infrastructure corridors in an evolving simulation.
          </p>
        </div>
        <button className="outline-button" onClick={onNavigateToGIS}>
          <Layers size={14} /> Open Live BhuNaksha GIS
        </button>
      </div>

      <section className="twin-hero panel">
        <div className="twin-hero-copy">
          <span className="eyebrow">
            NATIONAL LAND TWIN <i className="live-dot" /> MULTI-SECTOR SIMULATOR
          </span>
          <h2>
            See the cadastre.<br />
            <em>Model what&apos;s next.</em>
          </h2>
          <p>
            Simulate 2025–2040 urban growth, agricultural land conversion, and climate stress across 742 districts.
          </p>
          <div className="twin-hero-meta">
            <span><Map size={14} /> 742 Districts Modeled</span>
            <span><Clock3 size={14} /> Baseline: FY 2025–26</span>
          </div>
        </div>
        <div className="twin-visual">
          <LandMap activeLayer="Climate vulnerability" satelliteView={false} compact />
          <div className="twin-visual-label">
            <span>PROJECTED EXPANSION</span>
            <strong>+{((year - 2025) * 1.7).toFixed(1)}%</strong>
            <small>Urban footprint by {year}</small>
          </div>
        </div>
      </section>

      {/* Time Horizon Slider */}
      <div className="timeline-panel panel">
        <div className="timeline-head">
          <div>
            <span className="eyebrow">TIME HORIZON SIMULATION</span>
            <h2>Move Through the Projection Model</h2>
          </div>
          <span className="year-readout">
            {year}
            <small>MODEL YEAR</small>
          </span>
        </div>
        <div className="timeline-control">
          <button
            className="icon-button"
            onClick={() => setYear(Math.max(2025, year - 1))}
            aria-label="Previous year"
          >
            <ChevronLeft size={17} />
          </button>
          <input
            aria-label="Forecast year slider"
            type="range"
            min="2025"
            max="2040"
            step="5"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
          <button
            className="icon-button"
            onClick={() => setYear(Math.min(2040, year + 1))}
            aria-label="Next year"
          >
            <ChevronRight size={17} />
          </button>
        </div>
        <div className="timeline-ticks">
          {[2025, 2030, 2035, 2040].map((item) => (
            <button
              key={item}
              className={year === item ? "current" : ""}
              onClick={() => setYear(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="twin-metrics">
        <article>
          <span><Building2 size={15} /> Urban Expansion</span>
          <strong>+{((year - 2025) * 1.7).toFixed(1)}%</strong>
          <small>Projected built-up corridor</small>
        </article>
        <article>
          <span><Leaf size={15} /> Land Degradation</span>
          <strong>{degradation}%</strong>
          <small>Soil restoration targets</small>
        </article>
        <article>
          <span><CloudSun size={15} /> Climate Hazard Exposure</span>
          <strong>{Math.min(68, 31 + (year - 2025) * 2)}%</strong>
          <small>Population in vulnerable flood zones</small>
        </article>
        <article>
          <span><Users size={15} /> Peri-Urban Demand</span>
          <strong>+{((year - 2025) * 1.2).toFixed(1)}%</strong>
          <small>Housing & commercial zoning pressure</small>
        </article>
      </div>
    </div>
  );
}

// Decision Analytics View
function AnalyticsView({ onNavigateToForensics }: { onNavigateToForensics: () => void }) {
  const statesRisk = [
    { state: "Maharashtra", disputeScore: 78, digitized: 94 },
    { state: "Karnataka", disputeScore: 89, digitized: 91 },
    { state: "Uttar Pradesh", disputeScore: 74, digitized: 88 },
    { state: "Odisha", disputeScore: 82, digitized: 84 },
    { state: "Assam", disputeScore: 85, digitized: 76 },
    { state: "Rajasthan", disputeScore: 62, digitized: 92 },
  ];

  return (
    <div className="page-content module-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">NATIONAL DECISION INTELLIGENCE</span>
          <h1>Cross-State Land Governance Analytics</h1>
          <p>
            Multi-dimensional telemetry tracking ULPIN rollouts, dispute settlement velocity, and acquisition delays.
          </p>
        </div>
        <button className="primary-button" onClick={onNavigateToForensics}>
          <ShieldAlert size={14} /> Open Dispute Forensics
        </button>
      </div>

      <div className="analytics-summary">
        <article>
          <span>National Dispute Settlement Rate</span>
          <strong style={{ color: "#166534" }}>72.6%</strong>
          <small className="positive-note">
            <ArrowUpRight size={13} /> +5.8 pts YoY
          </small>
        </article>
        <article>
          <span>High-Priority Litigation Districts</span>
          <strong style={{ color: "#dc2626" }}>86</strong>
          <small style={{ color: "#dc2626" }}>Requires mediation intervention</small>
        </article>
        <article>
          <span>Average Acquisition Delay</span>
          <strong style={{ color: "#b45309" }}>18.4 Mo</strong>
          <small>Target: &lt;12 months under RFCTLARR</small>
        </article>
        <article>
          <span>ULPIN Cadastral Accuracy</span>
          <strong>96.2%</strong>
          <small className="positive-note">BhuNaksha DGPS verified</small>
        </article>
      </div>

      <div className="panel" style={{ padding: "16px", marginTop: "14px" }}>
        <div className="panel-heading" style={{ marginBottom: "14px" }}>
          <div>
            <span className="eyebrow">STATE-WISE DISPUTE DENSITY VS CADASTRAL DIGITIZATION</span>
            <h2>State Comparative Benchmarks</h2>
          </div>
        </div>

        <div style={{ height: "240px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statesRisk} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="state" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="disputeScore" name="Litigation Hotspot Score" fill="#dc2626" radius={[4, 4, 0, 0]} />
              <Bar dataKey="digitized" name="ULPIN Digitization %" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}