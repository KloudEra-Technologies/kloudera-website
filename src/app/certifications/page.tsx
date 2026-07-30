"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { KloudEraLogo } from "@/components/KloudEraLogo";
import { InlineText, useEditor } from "@/components/editor";

// Fisher-Yates shuffle — deterministic once called on mount
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Group certs by their category field
function groupByCategory(items: any[]): Record<string, any[]> {
  const grouped: Record<string, any[]> = {};
  for (const item of items) {
    const cat = item.category || "General";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }
  return grouped;
}

export default function CertificationsPage() {
  const [data, setData] = useState<any>(null);

  let editorContext: any;
  try {
    editorContext = useEditor();
  } catch (e) {
    editorContext = { isEditMode: false, siteData: null, updateNestedValue: () => {}, authToken: null };
  }
  const { isEditMode: isEditActive, updateNestedValue, siteData, authToken } = editorContext;

  useEffect(() => {
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((d) => {
        if (d.certifications) setData(d.certifications);
      })
      .catch((err) => console.error("Failed to load certifications data", err));
  }, []);

  const certificationsList: any[] = siteData?.certifications?.items || data?.items || [];
  // Sub-sections: array of category names user has defined
  const subSections: string[] = siteData?.certifications?.subSections || data?.subSections || ["General"];

  const [newSectionName, setNewSectionName] = useState("");
  const [addingSectionIdx, setAddingSectionIdx] = useState<number | null>(null);

  // — Section management —
  const addSubSection = () => {
    const name = newSectionName.trim() || `Section ${subSections.length + 1}`;
    const updated = [...subSections, name];
    updateNestedValue(["certifications", "subSections"], updated);
    setNewSectionName("");
    setAddingSectionIdx(null);
  };

  const deleteSubSection = (sectionName: string) => {
    // Remove section + all its certs
    const updatedSections = subSections.filter((s) => s !== sectionName);
    const updatedItems = certificationsList.filter((c) => (c.category || "General") !== sectionName);
    updateNestedValue(["certifications", "subSections"], updatedSections);
    updateNestedValue(["certifications", "items"], updatedItems);
  };

  // — Cert management —
  const addCert = (category: string) => {
    const updated = [
      ...certificationsList,
      {
        title: "Certification Name",
        description: "Short description of this certification or standard.",
        imageUrl: "",
        category,
      },
    ];
    updateNestedValue(["certifications", "items"], updated);
  };

  const deleteCert = (idx: number) => {
    const updated = [...certificationsList];
    updated.splice(idx, 1);
    updateNestedValue(["certifications", "items"], updated);
  };

  const handleImageUpload = async (idx: number, file: File) => {
    const token = authToken || "";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);
    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "x-developer-token": token },
        body: formData,
      });
      const result = await res.json();
      if (res.ok && result.url) {
        const updated = [...certificationsList];
        updated[idx] = { ...updated[idx], imageUrl: result.url };
        updateNestedValue(["certifications", "items"], updated);
      } else {
        alert(`Upload failed: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      alert("Network error during image upload. Please try again.");
      console.error("Image upload failed", err);
    }
  };

  const grouped = groupByCategory(certificationsList);
  const totalCerts = certificationsList.length;

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 relative overflow-hidden">

      {/* Floating shield bg decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-[0.04] text-emerald-400"
            style={{
              left: `${[8, 22, 42, 60, 75, 90][i]}%`,
              top: `${[15, 55, 30, 70, 20, 60][i]}%`,
              fontSize: `${[80, 50, 120, 60, 90, 45][i]}px`,
              animation: `float-up-cert ${[18, 14, 22, 16, 20, 12][i]}s ${[0, 3, 6, 2, 8, 4][i]}s linear infinite`,
            }}
          >
            🛡
          </div>
        ))}
      </div>
      <style>{`
        @keyframes float-up-cert {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.06; }
          90% { opacity: 0.04; }
          100% { transform: translateY(-80vh) rotate(20deg); opacity: 0; }
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-blue-900/30 bg-[#060b18]/90 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/">
            <KloudEraLogo className="h-8 w-auto text-blue-400" />
          </Link>
          <div className="h-4 w-[1px] bg-blue-900/60 hidden sm:block" />
          <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase hidden sm:block">
            COMPLIANCE &amp; GOVERNANCE DECK
          </span>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full">
            {totalCerts} CERTIFIED STANDARDS
          </span>
          <Link
            href="/"
            className="px-4 py-1.5 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] tracking-wider rounded-full hover:bg-cyan-500/10 transition-all flex items-center gap-2"
          >
            <span>←</span>
            <span>RETURN TO HOME</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 py-12 space-y-16 relative z-10">

        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1 text-xs font-mono font-bold tracking-wider text-emerald-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AUDITED COMPLIANCE STANDARDS</span>
          </div>
          <InlineText
            as="h1"
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase"
            path={["certifications", "title"]}
            fallback="Security Compliance & Global Standards"
          />
          <InlineText
            as="p"
            multiline
            className="text-slate-400 text-sm sm:text-base leading-relaxed"
            path={["certifications", "intro"]}
            fallback="Kloudera operates under audited global security frameworks, data privacy laws, and quality management protocols."
          />
        </div>

        {/* Empty state */}
        {totalCerts === 0 && !isEditActive && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-950/30 border border-emerald-800/30 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-emerald-800" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <p className="text-slate-500 font-mono text-sm">No certifications added yet.</p>
            <p className="text-slate-600 text-xs font-mono">Use editor mode (Ctrl+Shift+E) to add sub-sections and certification cards.</p>
          </div>
        )}

        {/* Sub-sections */}
        {subSections.map((sectionName) => {
          const sectionCerts = grouped[sectionName] || [];
          const sectionCertIndices = certificationsList
            .map((c, i) => ({ c, i }))
            .filter(({ c }) => (c.category || "General") === sectionName)
            .map(({ i }) => i);

          if (sectionCerts.length === 0 && !isEditActive) return null;

          return (
            <div key={sectionName} className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-emerald-500" />
                  <h2 className="text-sm font-bold text-emerald-300 font-mono tracking-widest uppercase">{sectionName}</h2>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-900/40">
                    {sectionCerts.length} badge{sectionCerts.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {isEditActive && (
                  <button
                    onClick={() => deleteSubSection(sectionName)}
                    className="text-xs font-mono text-red-500 hover:text-red-400 border border-red-900/40 hover:border-red-500/40 px-3 py-1 rounded-full transition-all"
                  >
                    Delete Section
                  </button>
                )}
              </div>

              {/* Certs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sectionCertIndices.map((realIdx) => {
                  const cert = certificationsList[realIdx];
                  return (
                    <CertCard
                      key={realIdx}
                      cert={cert}
                      idx={realIdx}
                      isEditActive={isEditActive}
                      onDelete={() => deleteCert(realIdx)}
                      onImageUpload={(file) => handleImageUpload(realIdx, file)}
                      onTitleChange={(val) => {
                        const updated = [...certificationsList];
                        updated[realIdx] = { ...updated[realIdx], title: val };
                        updateNestedValue(["certifications", "items"], updated);
                      }}
                      onDescChange={(val) => {
                        const updated = [...certificationsList];
                        updated[realIdx] = { ...updated[realIdx], description: val };
                        updateNestedValue(["certifications", "items"], updated);
                      }}
                    />
                  );
                })}

                {/* Add Card Button for this section */}
                {isEditActive && (
                  <button
                    onClick={() => addCert(sectionName)}
                    className="rounded-2xl border-2 border-dashed border-emerald-500/20 bg-emerald-950/5 hover:bg-emerald-900/20 hover:border-emerald-400/40 flex flex-col items-center justify-center gap-3 transition-all min-h-[200px] font-mono text-emerald-500 group"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-emerald-500/40 group-hover:border-emerald-400 flex items-center justify-center transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Add to {sectionName}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Sub-Section button */}
        {isEditActive && (
          <div className="border-t border-blue-900/30 pt-8 flex flex-col items-center gap-4">
            {addingSectionIdx !== null ? (
              <div className="flex items-center gap-3">
                <input
                  autoFocus
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSubSection()}
                  placeholder="e.g. ISO Standards, Data Privacy..."
                  className="bg-zinc-900 border border-emerald-500/40 text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-emerald-400 w-64 font-mono"
                />
                <button
                  onClick={addSubSection}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all font-mono"
                >
                  Create
                </button>
                <button
                  onClick={() => { setAddingSectionIdx(null); setNewSectionName(""); }}
                  className="px-4 py-2 border border-zinc-700 text-zinc-400 text-xs rounded-lg hover:border-zinc-500 transition-all font-mono"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingSectionIdx(0)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-emerald-500/30 hover:border-emerald-400 text-emerald-400 rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all hover:bg-emerald-900/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add New Sub-Section
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ----- Cert Card Component -----

interface CertCardProps {
  cert: any;
  idx: number;
  isEditActive: boolean;
  onDelete: () => void;
  onImageUpload: (file: File) => void;
  onTitleChange: (val: string) => void;
  onDescChange: (val: string) => void;
}

function CertCard({ cert, idx, isEditActive, onDelete, onImageUpload, onTitleChange, onDescChange }: CertCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [titleVal, setTitleVal] = useState(cert.title || "");
  const [descVal, setDescVal] = useState(cert.description || "");
  const [flipped, setFlipped] = useState(false);

  React.useEffect(() => {
    setTitleVal(cert.title || "");
    setDescVal(cert.description || "");
  }, [cert.title, cert.description]);

  return (
    <>
      <style>{`
        .cert-card-inner { transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); transform-style: preserve-3d; }
        ${!isEditActive ? '.cert-card-wrap:hover .cert-card-inner { transform: rotateY(180deg); }' : ''}
        .cert-card-front, .cert-card-back { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .cert-card-back { transform: rotateY(180deg); }
      `}</style>
      <div
        className="cert-card-wrap relative group"
        style={{ perspective: "1000px", minHeight: "240px" }}
      >
        <div 
          className="cert-card-inner w-full h-full absolute inset-0"
          style={isEditActive && flipped ? { transform: "rotateY(180deg)" } : {}}
        >
          {/* Front */}
          <div className="cert-card-front absolute inset-0 rounded-2xl border border-blue-900/40 bg-gradient-to-b from-[#090e1a] to-[#030712] overflow-hidden flex flex-col">
            {/* Flip Manual Button */}
            {isEditActive && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFlipped(true); }}
                className="absolute bottom-3 right-3 z-30 px-2 py-0.5 bg-emerald-500/80 hover:bg-emerald-400 text-black text-[9px] font-bold font-mono rounded shadow transition-all"
              >
                EDIT DETAILS 🔄
              </button>
            )}
            {/* Delete button */}
            {isEditActive && (
              <button
                onClick={onDelete}
                className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {/* Image Area */}
            <div className="relative w-full bg-[#060c18] flex items-center justify-center overflow-hidden" style={{ minHeight: "160px" }}>
              {cert.imageUrl ? (
                <img src={cert.imageUrl} alt={cert.title || "Cert"} className="w-full h-full object-contain p-4" style={{ maxHeight: "160px" }} />
              ) : (
                <div className="flex flex-col items-center justify-center text-emerald-900 gap-2 py-8 px-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-[9px] font-mono text-emerald-900/60 tracking-wider">NO BADGE IMAGE</span>
                </div>
              )}
              {isEditActive && (
                <>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onImageUpload(f); }} />
                  <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 text-white text-xs font-bold font-mono">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload Badge
                  </button>
                </>
              )}
            </div>
            {/* Title */}
            <div className="p-4 border-t border-blue-900/30">
              {editingTitle && isEditActive ? (
                <input autoFocus className="bg-[#0a1020] text-white text-sm font-bold w-full rounded px-2 py-1 outline-none border border-emerald-500/50" value={titleVal} onChange={(e) => setTitleVal(e.target.value)} onBlur={() => { setEditingTitle(false); onTitleChange(titleVal); }} onKeyDown={(e) => { if (e.key === "Enter") { setEditingTitle(false); onTitleChange(titleVal); } }} />
              ) : (
                <p className={`text-sm font-bold text-white leading-tight ${isEditActive ? "cursor-text hover:text-emerald-300" : ""}`} onClick={() => isEditActive && setEditingTitle(true)}>
                  {cert.title || "Certification Name"}
                </p>
              )}
              <p className="text-[9px] font-mono text-emerald-600 mt-1 tracking-widest">HOVER TO VIEW DETAILS →</p>
            </div>
          </div>

          {/* Back */}
          <div className="cert-card-back absolute inset-0 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/60 to-[#030712] overflow-hidden flex flex-col p-5 justify-center">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-1 w-6 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-mono text-emerald-400 tracking-widest uppercase">Details</span>
              </div>
              <p className="text-sm font-bold text-white">{cert.title || "Certification Name"}</p>
              {editingDesc && isEditActive ? (
                <textarea autoFocus className="bg-[#0a1020] text-slate-300 text-xs w-full rounded px-2 py-1 outline-none border border-emerald-500/50 resize-none" rows={4} value={descVal} onChange={(e) => setDescVal(e.target.value)} onBlur={() => { setEditingDesc(false); onDescChange(descVal); }} />
              ) : (
                <p className={`text-xs text-slate-400 leading-relaxed ${isEditActive ? "cursor-text hover:text-slate-300" : ""}`} onClick={() => isEditActive && setEditingDesc(true)}>
                  {cert.description || (isEditActive ? "Click to add description" : "No description provided.")}
                </p>
              )}
              <div className="pt-2 border-t border-emerald-900/40 flex items-center justify-between text-[9px] font-mono text-emerald-500">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span>AUDITED &amp; VERIFIED</span>
                </div>
                {isEditActive && (
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFlipped(false); }}
                    className="px-2 py-0.5 bg-emerald-500/80 hover:bg-emerald-400 text-black text-[9px] font-bold font-mono rounded shadow transition-all"
                  >
                    SHOW FRONT 🔄
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
