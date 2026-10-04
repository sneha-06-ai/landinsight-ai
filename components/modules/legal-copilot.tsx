"use client";

import { useState } from "react";
import {
  BookOpen, Check, Copy, Globe2, Languages,
  MessageSquare, Scale, Send, ShieldCheck, Sparkles
} from "lucide-react";
import type { LegalFAQResponse } from "../../data/bhoomi-dataset";
import { LEGAL_COPILOT_KNOWLEDGE } from "../../data/bhoomi-dataset";

interface LegalCopilotProps {
  initialQuery?: string;
  onNavigateToRepository: () => void;
}

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  legalData?: LegalFAQResponse;
}

let messageSeq = 1;

export default function LegalCopilot({ initialQuery = "", onNavigateToRepository }: LegalCopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "copilot",
      text: "Namaste! I am the Bhoomi-Niti Statutory & Legal Knowledge Assistant. I specialize in Indian land governance statutes including the RFCTLARR Act 2013, State Revenue Codes (MLRC, UP Revenue Code, KLR Act), DILRMP Guidelines, Bhu-Aadhaar (ULPIN) standards, and the Forest Rights Act 2006. How can I assist your review today?",
      timestamp: "Just now",
    },
  ]);

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [hindiMode, setHindiMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const predefinedQueries = [
    "How is land acquisition compensation calculated under RFCTLARR Act 2013?",
    "What is Bhu-Aadhaar (ULPIN) and how does it prevent duplicate land transactions?",
    "What are the legal grounds for challenging a contested mutation in agricultural land?",
    "How does the Forest Rights Act (FRA 2006) interact with infrastructure land acquisition?",
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    messageSeq += 1;
    const currentSeq = messageSeq;

    const userMsg: Message = {
      id: `user-${currentSeq}`,
      sender: "user",
      text: text.trim(),
      timestamp: "Today",
    };

    const lower = text.toLowerCase();
    const match =
      LEGAL_COPILOT_KNOWLEDGE.find(
        (item) =>
          item.query.toLowerCase().includes("compensation") &&
          (lower.includes("rfctlarr") || lower.includes("compensation") || lower.includes("solatium"))
      ) ||
      LEGAL_COPILOT_KNOWLEDGE.find(
        (item) =>
          item.query.toLowerCase().includes("ulpin") &&
          (lower.includes("ulpin") || lower.includes("bhu-aadhaar") || lower.includes("bhu aadhaar"))
      ) ||
      LEGAL_COPILOT_KNOWLEDGE.find(
        (item) =>
          item.query.toLowerCase().includes("mutation") &&
          (lower.includes("mutation") || lower.includes("ferfar") || lower.includes("namantaran"))
      ) ||
      LEGAL_COPILOT_KNOWLEDGE.find(
        (item) =>
          item.query.toLowerCase().includes("forest") &&
          (lower.includes("forest") || lower.includes("fra") || lower.includes("tribal"))
      ) ||
      LEGAL_COPILOT_KNOWLEDGE[0];

    const copilotMsg: Message = {
      id: `copilot-${currentSeq + 1}`,
      sender: "copilot",
      text: `Analysis generated citing ${match.statute} (${match.section}): ${match.officialTextSummary}`,
      timestamp: "Today",
      legalData: match,
    };

    setMessages((prev) => [...prev, userMsg, copilotMsg]);
    setInputQuery("");
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="page-content module-content copilot-page">
      {/* Heading */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            SIH 2026 PILLAR 04 · MULTILINGUAL RAG LEGAL ASSISTANT & STATUTE RETRIEVAL
          </span>
          <h1>Statutory Land Law & RAG Legal Copilot</h1>
          <p>
            Evidence-grounded semantic retrieval across RFCTLARR 2013, state tenancy laws, DILRMP circulars, and Supreme Court land precedents.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            className={`outline-button ${hindiMode ? "selected" : ""}`}
            onClick={() => setHindiMode(!hindiMode)}
          >
            <Languages size={14} /> {hindiMode ? "भाषा: हिन्दी (Hindi)" : "Language: English"}
          </button>
          <span className="available-badge">
            <i /> 30,008 Statutory Records Indexed
          </span>
        </div>
      </div>

      <div className="copilot-main" style={{ gridTemplateColumns: "minmax(0, 1fr) 280px" }}>
        {/* Chat Thread */}
        <div className="copilot-thread" style={{ display: "flex", flexDirection: "column", height: "620px" }}>
          <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
            <div className="thread-date">
              <span /> BHOOMI-NITI RAG ORCHESTRATOR · VERIFIED STATUTORY BENCHMARK <span />
            </div>

            {messages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: "16px" }}>
                {msg.sender === "user" ? (
                  <div className="user-message">
                    <strong>{msg.text}</strong>
                    <span style={{ display: "block", fontSize: "8px", color: "#64748b", marginTop: "4px", textAlign: "right" }}>
                      {msg.timestamp}
                    </span>
                  </div>
                ) : (
                  <div className="copilot-message" style={{ maxWidth: "100%" }}>
                    <div className="copilot-message-head">
                      <span className="assistant-icon">
                        <Sparkles size={14} />
                      </span>
                      <strong>Bhoomi-Niti Legal AI</strong>
                      <span style={{ fontSize: "9px", color: "#94a3b8" }}>{msg.timestamp}</span>
                    </div>

                    <p style={{ fontSize: "11px", lineHeight: "1.7", color: "#334155" }}>
                      {msg.text}
                    </p>

                    {msg.legalData && (
                      <div
                        style={{
                          marginTop: "12px",
                          border: "1px solid #cbd5e1",
                          borderRadius: "8px",
                          background: "#f8fafc",
                          padding: "14px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "10px" }}>
                          <div>
                            <span style={{ fontSize: "9px", fontWeight: "700", color: "#b45309", textTransform: "uppercase" }}>
                              {msg.legalData.category}
                            </span>
                            <h4 style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#1e293b" }}>
                              {msg.legalData.statute} — {msg.legalData.section}
                            </h4>
                          </div>
                          <button
                            className="outline-button"
                            style={{ height: "26px", fontSize: "9px" }}
                            onClick={() => copyText(msg.id, JSON.stringify(msg.legalData, null, 2))}
                          >
                            {copiedId === msg.id ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                            {copiedId === msg.id ? "Copied" : "Copy Brief"}
                          </button>
                        </div>

                        {hindiMode && (
                          <div style={{ background: "#fef3c7", padding: "8px 10px", borderRadius: "5px", fontSize: "10.5px", color: "#92400e", marginBottom: "10px", lineHeight: "1.6" }}>
                            <strong>हिन्दी सारांश (Hindi Brief):</strong> यह वैधानिक प्रावधान भू-अधिग्रहण में अनिवार्य सोलेशियम (100% अतिरिक्त प्रतिकर) एवं पुनर्वास पैकेज प्रदान करता है। इसका अनुपालन न होने पर उच्च न्यायालय द्वारा स्थगनादेश जारी किया जाता है।
                          </div>
                        )}

                        <div style={{ marginBottom: "10px" }}>
                          <span style={{ fontSize: "9.5px", fontWeight: "700", color: "#0f766e" }}>
                            ADMINISTRATIVE GOVERNANCE IMPLICATION:
                          </span>
                          <p style={{ margin: "3px 0 0", fontSize: "10.5px", color: "#334155", lineHeight: "1.6" }}>
                            {msg.legalData.governanceImplication}
                          </p>
                        </div>

                        <div style={{ marginBottom: "10px" }}>
                          <span style={{ fontSize: "9.5px", fontWeight: "700", color: "#475569" }}>
                            MANDATORY REVENUE WORKFLOW:
                          </span>
                          <ol style={{ margin: "4px 0 0", paddingLeft: "16px", fontSize: "10px", color: "#334155", lineHeight: "1.6" }}>
                            {msg.legalData.recommendedWorkflow.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        <div>
                          <span style={{ fontSize: "9.5px", fontWeight: "700", color: "#64748b" }}>
                            APPLICABLE JUDICIAL PRECEDENTS:
                          </span>
                          <ul style={{ margin: "4px 0 0", paddingLeft: "16px", fontSize: "9.5px", color: "#475569", lineHeight: "1.5" }}>
                            {msg.legalData.applicablePrecedents.map((prec, idx) => (
                              <li key={idx}>
                                <em>{prec}</em>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Preset Buttons */}
          <div style={{ padding: "8px 0", borderTop: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "9px", fontWeight: "700", color: "#64748b", display: "block", marginBottom: "4px" }}>
              SUGGESTED STATUTORY INQUIRIES:
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {predefinedQueries.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  style={{
                    padding: "4px 8px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    fontSize: "9px",
                    color: "#334155",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {q} &rarr;
                </button>
              ))}
            </div>
          </div>

          {/* Composer Form */}
          <form
            className="copilot-large-composer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputQuery);
            }}
          >
            <textarea
              placeholder="Ask about RFCTLARR 2013 compensation, Bhu-Aadhaar ULPIN generation, MLRC mutation rules..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputQuery);
                }
              }}
            />
            <div>
              <span>
                <ShieldCheck size={14} /> Citations verified against Gazette notifications & acts
              </span>
              <button className="primary-button" type="submit">
                Submit Legal Query <Send size={14} />
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar: Legal Reference Shelf */}
        <aside className="copilot-side">
          <span className="eyebrow">STATUTORY REPOSITORY</span>

          <article className="tool-card">
            <span><Scale size={16} /></span>
            <div>
              <strong>RFCTLARR Act, 2013</strong>
              <p>Section 26 to 31 compensation & mandatory solatium formulas.</p>
            </div>
          </article>

          <article className="tool-card">
            <span><Globe2 size={16} /></span>
            <div>
              <strong>Bhu-Aadhaar (ULPIN)</strong>
              <p>14-digit centroid geohash standard with Luhn checksum.</p>
            </div>
          </article>

          <article className="tool-card">
            <span><MessageSquare size={16} /></span>
            <div>
              <strong>State Land Revenue Codes</strong>
              <p>Maharashtra LRC 1966, UP Code 2006, Karnataka LRA 1964.</p>
            </div>
          </article>

          <article className="tool-card">
            <span><BookOpen size={16} /></span>
            <div>
              <strong>Forest Rights Act (FRA 2006)</strong>
              <p>Section 4(5) protection for tribal & forest dwellers.</p>
            </div>
          </article>

          <button
            className="outline-button full-width"
            onClick={onNavigateToRepository}
            style={{ marginTop: "10px" }}
          >
            <BookOpen size={14} /> Open Full Knowledge Hub &rarr;
          </button>
        </aside>
      </div>
    </div>
  );
}
