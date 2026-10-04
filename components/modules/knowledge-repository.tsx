"use client";

import { useState } from "react";
import {
  BookOpen, Check, CheckCircle2, ChevronLeft, ChevronRight,
  Database, Download, Eye, FileText, Filter, Globe2,
  Lock, Search, Settings2, ShieldCheck, Sparkles, Upload, X
} from "lucide-react";
import type { KnowledgeDocument } from "../../data/bhoomi-dataset";
import { KNOWLEDGE_DOCUMENTS } from "../../data/bhoomi-dataset";

interface KnowledgeRepositoryProps {
  onAskCopilot: (query: string) => void;
  onNotice: (msg: string) => void;
}

export default function KnowledgeRepository({ onAskCopilot, onNotice }: KnowledgeRepositoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScheme, setSelectedScheme] = useState("All Schemes");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [previewDoc, setPreviewDoc] = useState<KnowledgeDocument | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const schemeOptions = [
    "All Schemes",
    "RFCTLARR 2013",
    "DILRMP",
    "Bhu-Aadhaar (ULPIN)",
    "SRISHTI-DRISHTI",
    "SVAMITVA",
    "Forest Rights Act",
  ];

  const categoryOptions = [
    "All Categories",
    "Statutory Act",
    "DILRMP Guideline",
    "Policy Brief",
    "Geospatial Dataset",
  ];

  const filteredDocs = KNOWLEDGE_DOCUMENTS.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.authorOrMinistry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesScheme =
      selectedScheme === "All Schemes" || doc.schemeTag === selectedScheme;
    const matchesCategory =
      selectedCategory === "All Categories" || doc.category === selectedCategory;
    return matchesSearch && matchesScheme && matchesCategory;
  });

  const handleDownload = (doc: KnowledgeDocument) => {
    setDownloadingId(doc.id);
    setTimeout(() => {
      setDownloadingId(null);
      onNotice(`Official Gazetted copy of "${doc.title.slice(0, 40)}..." downloaded.`);
    }, 1500);
  };

  return (
    <div className="page-content module-content">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            SIH 2026 PILLAR 01 · NATIONAL REPOSITORY & CENTRAL EVIDENCE VAULT
          </span>
          <h1>National Land Knowledge & Statutory Hub</h1>
          <p>
            Central repository of verified land statutes, DILRMP manuals, SVAMITVA technical standards, RFCTLARR guidelines, and spatial datasets.
          </p>
        </div>
        <button
          className="primary-button"
          onClick={() => onNotice("Secure upload gateway opened for authorized departmental submissions.")}
        >
          <Upload size={14} /> Upload Gazette / Circular
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="repository-summary">
        <div>
          <strong>30,008</strong>
          <span>Indexed Statutory & Research Records</span>
        </div>
        <div>
          <strong>28 States & 8 UTs</strong>
          <span>Revenue Codes Geo-Catalogued</span>
        </div>
        <div>
          <strong>98.4%</strong>
          <span>Metadata Verification Completeness</span>
        </div>
        <div className="repository-sync">
          <i className="secure-dot" /> Connected to Gazette of India & State Portals
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="repository-toolbar" style={{ flexWrap: "wrap", gap: "10px" }}>
        <div className="repository-search" style={{ minWidth: "280px" }}>
          <Search size={15} />
          <input
            placeholder="Search by act, section, circular keyword, or ministry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          aria-label="Filter by national scheme"
          value={selectedScheme}
          onChange={(e) => setSelectedScheme(e.target.value)}
        >
          {schemeOptions.map((sch) => (
            <option key={sch}>{sch}</option>
          ))}
        </select>

        <select
          aria-label="Filter by document category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categoryOptions.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Document Records Table */}
      <div className="repository-table">
        <div className="table-heading" style={{ gridTemplateColumns: "minmax(280px, 1.8fr) 130px 140px 90px 110px 100px" }}>
          <span>DOCUMENT TITLE & DETAILS</span>
          <span>SCHEME / STATUTE</span>
          <span>CATEGORY</span>
          <span>YEAR</span>
          <span>ACCESS TIER</span>
          <span style={{ textAlign: "right" }}>ACTIONS</span>
        </div>

        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc, idx) => (
            <article
              className="resource-row"
              key={doc.id}
              style={{ gridTemplateColumns: "minmax(280px, 1.8fr) 130px 140px 90px 110px 100px", padding: "12px 14px" }}
            >
              <div className="resource-title">
                <span className={`resource-icon icon-${idx % 4}`}>
                  <FileText size={16} />
                </span>
                <div>
                  <strong style={{ fontSize: "11px", color: "#1e293b", lineHeight: "1.4" }}>
                    {doc.title}
                  </strong>
                  <small style={{ color: "#64748b" }}>{doc.authorOrMinistry}</small>
                  {doc.keyClausesCited && (
                    <div className="tag-list" style={{ marginTop: "4px" }}>
                      {doc.keyClausesCited.slice(0, 2).map((clause) => (
                        <i key={clause}>{clause}</i>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <span className="resource-type" style={{ fontWeight: "600", color: "#244336" }}>
                {doc.schemeTag || "National"}
              </span>

              <span className="resource-type">{doc.category}</span>
              <span className="resource-year">{doc.year}</span>

              <span>
                <i className={`access-pill ${doc.accessLevel === "Open Public" ? "verified" : ""}`}>
                  {doc.accessLevel}
                </i>
              </span>

              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                <button
                  className="icon-button"
                  title="Preview document details"
                  onClick={() => setPreviewDoc(doc)}
                >
                  <Eye size={15} />
                </button>
                <button
                  className="icon-button download-button"
                  title="Download gazetted PDF"
                  onClick={() => handleDownload(doc)}
                >
                  {downloadingId === doc.id ? <Check size={14} color="#16a34a" /> : <Download size={15} />}
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <Search size={24} />
            <strong>No matching statutory or research records found</strong>
            <span>Try broadening your search term or selecting All Schemes.</span>
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      <div className="pagination">
        <span>
          Showing <strong>1–{filteredDocs.length}</strong> of 30,008 statutory records
        </span>
        <div>
          <button className="icon-button" disabled title="Previous page">
            <ChevronLeft size={16} />
          </button>
          <button className="page-number active">1</button>
          <button className="page-number">2</button>
          <button className="page-number">3</button>
          <span>…</span>
          <button className="page-number">4001</button>
          <button className="icon-button" title="Next page">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Document Detail Preview Modal */}
      {previewDoc && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            display: "grid",
            placeItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "10px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #e2e8f0", paddingBottom: "14px", marginBottom: "14px" }}>
              <div>
                <span style={{ fontSize: "9.5px", fontWeight: "700", color: "#166534", textTransform: "uppercase" }}>
                  {previewDoc.category} · {previewDoc.schemeTag}
                </span>
                <h2 style={{ fontSize: "16px", color: "#1e293b", margin: "4px 0 2px" }}>
                  {previewDoc.title}
                </h2>
                <small style={{ color: "#64748b" }}>{previewDoc.authorOrMinistry} ({previewDoc.year})</small>
              </div>
              <button
                className="icon-button"
                onClick={() => setPreviewDoc(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: "11.5px", lineHeight: "1.7", color: "#334155", marginBottom: "16px" }}>
              <h4 style={{ fontSize: "12px", color: "#0f172a", margin: "0 0 6px" }}>Summary & Governance Purpose</h4>
              <p>{previewDoc.summary}</p>
            </div>

            {previewDoc.keyClausesCited && (
              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "6px", marginBottom: "16px", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "10px", fontWeight: "700", color: "#475569" }}>
                  KEY STATUTORY CLAUSES & SECTIONS:
                </span>
                <ul style={{ margin: "6px 0 0", paddingLeft: "16px", fontSize: "11px", color: "#1e293b", lineHeight: "1.6" }}>
                  {previewDoc.keyClausesCited.map((clause, idx) => (
                    <li key={idx}><strong>{clause}</strong></li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "10.5px", color: "#475569", marginBottom: "20px" }}>
              <div>Geographical Scope: <strong>{previewDoc.stateScope}</strong></div>
              <div>Digital File Size: <strong>{previewDoc.downloadSizeMB} MB (PDF)</strong></div>
              <div>Citations in Decisions: <strong>{previewDoc.citationCount}</strong></div>
              <div>Access Classification: <strong>{previewDoc.accessLevel}</strong></div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #e2e8f0", paddingTop: "14px" }}>
              <button
                className="outline-button"
                onClick={() => {
                  setPreviewDoc(null);
                  onAskCopilot(`Explain key clauses of ${previewDoc.title} and how they apply to land administration.`);
                }}
              >
                <Sparkles size={14} /> Ask AI Copilot About This Act
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
              >
                <Download size={14} /> Download Official Gazette
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
