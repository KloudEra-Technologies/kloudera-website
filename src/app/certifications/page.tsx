"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { KloudEraLogo } from "@/components/KloudEraLogo";
import { InlineText, useEditor } from "@/components/editor";

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

  const addCert = () => {
    const updated = [
      ...certificationsList,
      {
        title: "Certification Name",
        description: "Short description of this certification or standard.",
        imageUrl: "",
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

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="border-b border-blue-900/30 bg-[#060b18]/80 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/">
            <KloudEraLogo className="h-8 w-auto text-blue-400" />
          </Link>
          <div className="h-4 w-[1px] bg-blue-900/60 hidden sm:block" />
          <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase hidden sm:block">
            COMPLIANCE &amp; GOVERNANCE DECK
          </span>
        </div>

        <Link
          href="/"
          className="mt-4 sm:mt-0 px-4 py-1.5 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] tracking-wider rounded-full hover:bg-cyan-500/10 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>←</span>
          <span>RETURN TO HOME</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 py-12 space-y-12">
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
            fallback="Security Compliance &amp; Global Standards"
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
        {certificationsList.length === 0 && !isEditActive && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-950/30 border border-emerald-800/30 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-emerald-800" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <p className="text-slate-500 font-mono text-sm">No certifications added yet.</p>
            <p className="text-slate-600 text-xs font-mono">Use editor mode (Ctrl+Shift+E) to add certification cards.</p>
          </div>
        )}

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {certificationsList.map((cert: any, idx: number) => (
            <CertCard
              key={idx}
              cert={cert}
              idx={idx}
              isEditActive={isEditActive}
              onDelete={() => deleteCert(idx)}
              onImageUpload={(file) => handleImageUpload(idx, file)}
              onTitleChange={(val) => {
                const updated = [...certificationsList];
                updated[idx] = { ...updated[idx], title: val };
                updateNestedValue(["certifications", "items"], updated);
              }}
              onDescChange={(val) => {
                const updated = [...certificationsList];
                updated[idx] = { ...updated[idx], description: val };
                updateNestedValue(["certifications", "items"], updated);
              }}
            />
          ))}

          {/* Add Card Button */}
          {isEditActive && (
            <button
              onClick={addCert}
              className="rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-950/10 hover:bg-emerald-900/20 hover:border-emerald-400 flex flex-col items-center justify-center gap-3 transition-all min-h-[260px] font-mono text-emerald-400 group"
            >
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-500/50 group-hover:border-emerald-400 flex items-center justify-center transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Add Certification</span>
            </button>
          )}
        </div>
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

  React.useEffect(() => {
    setTitleVal(cert.title || "");
    setDescVal(cert.description || "");
  }, [cert.title, cert.description]);

  return (
    <div className="rounded-2xl border border-blue-900/40 bg-gradient-to-b from-[#090e1a] to-[#030712] overflow-hidden flex flex-col hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5 relative group">
      {/* Delete Button */}
      {isEditActive && (
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
          title="Remove certification"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Image Area */}
      <div className="relative w-full bg-[#060c18] flex items-center justify-center overflow-hidden" style={{ minHeight: "180px" }}>
        {cert.imageUrl ? (
          <img
            src={cert.imageUrl}
            alt={cert.title || "Certification badge"}
            className="w-full h-full object-contain p-4"
            style={{ maxHeight: "180px" }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-emerald-900 gap-2 py-10 px-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-[10px] font-mono text-emerald-900/60 tracking-wider">NO BADGE IMAGE</span>
          </div>
        )}

        {/* Edit overlay: click to upload */}
        {isEditActive && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(file);
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 text-white text-xs font-bold font-mono"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span>Upload Badge</span>
            </button>
          </>
        )}
      </div>

      {/* Description Box */}
      <div className="p-4 flex flex-col gap-1.5 flex-1 border-t border-blue-900/30">
        {/* Title */}
        {editingTitle && isEditActive ? (
          <input
            autoFocus
            className="bg-[#0a1020] text-white text-sm font-bold w-full rounded px-2 py-1 outline-none border border-emerald-500/50 focus:border-emerald-400"
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            onBlur={() => { setEditingTitle(false); onTitleChange(titleVal); }}
            onKeyDown={(e) => { if (e.key === "Enter") { setEditingTitle(false); onTitleChange(titleVal); } }}
          />
        ) : (
          <p
            className={`text-sm font-bold text-white ${isEditActive ? "cursor-text hover:text-emerald-300 transition-colors" : ""}`}
            title={isEditActive ? "Click to edit title" : undefined}
            onClick={() => isEditActive && setEditingTitle(true)}
          >
            {cert.title || "Certification Name"}
          </p>
        )}

        {/* Description */}
        {editingDesc && isEditActive ? (
          <textarea
            autoFocus
            className="bg-[#0a1020] text-slate-300 text-xs w-full rounded px-2 py-1 outline-none border border-emerald-500/50 focus:border-emerald-400 resize-none"
            rows={3}
            value={descVal}
            onChange={(e) => setDescVal(e.target.value)}
            onBlur={() => { setEditingDesc(false); onDescChange(descVal); }}
          />
        ) : (
          <p
            className={`text-xs text-slate-400 leading-relaxed line-clamp-3 ${isEditActive ? "cursor-text hover:text-slate-300 transition-colors" : ""}`}
            title={isEditActive ? "Click to edit description" : undefined}
            onClick={() => isEditActive && setEditingDesc(true)}
          >
            {cert.description || (isEditActive ? "Click to add a description" : "")}
          </p>
        )}
      </div>
    </div>
  );
}
