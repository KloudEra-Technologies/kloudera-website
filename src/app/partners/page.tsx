"use client";

import React, { useState, useEffect, useRef } from "react";
import { InlineText, useEditor } from "@/components/editor";

export default function PartnersPage() {
  const [partnersData, setPartnersData] = useState<any>(null);
  const { isEditMode: isEditActive, updateNestedValue, siteData } = useEditor();

  useEffect(() => {
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.partners) {
          setPartnersData(data.partners);
        }
      })
      .catch((err) => console.error("Failed to load partners database", err));
  }, []);

  // Use siteData first (live edits), then fetched DB data, then empty array
  const partnersList: any[] = siteData?.partners?.featured || partnersData?.featured || [];

  const addPartner = () => {
    const updated = [
      ...partnersList,
      {
        name: "Partner Name",
        tagline: "Short description of the partnership",
        logoUrl: "",
        logoColor: "#14b8a6",
      },
    ];
    updateNestedValue(["partners", "featured"], updated);
  };

  const deletePartner = (idx: number) => {
    const updated = [...partnersList];
    updated.splice(idx, 1);
    updateNestedValue(["partners", "featured"], updated);
  };

  const handleImageUpload = async (
    idx: number,
    file: File
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        const updated = [...partnersList];
        updated[idx] = { ...updated[idx], logoUrl: data.url };
        updateNestedValue(["partners", "featured"], updated);
      }
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">

      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/80 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md sticky top-0 z-20">
        <div className="font-mono">
          <InlineText
            as="span"
            className="text-[10px] font-bold text-teal-400 tracking-widest uppercase"
            path={["partners", "tagline"]}
            fallback="KLOUDERA TECHNOLOGIES // GLOBAL ECOSYSTEM"
          />
          <InlineText
            as="h1"
            className="text-xl font-bold tracking-widest text-white uppercase mt-1"
            path={["partners", "title"]}
            fallback="OUR STRATEGIC PARTNERS"
          />
        </div>

        <div className="flex gap-3 mt-4 sm:mt-0 items-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-1.5 border border-teal-500/30 text-teal-400 text-[11px] font-mono tracking-wider rounded hover:bg-teal-500/10 transition-all"
          >
            ← BACK TO HOME
          </button>
        </div>
      </header>

      {/* Page intro */}
      <div className="text-center py-16 px-6 max-w-2xl mx-auto space-y-4">
        <span className="inline-block text-[9px] font-bold text-teal-400 tracking-widest uppercase bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 font-mono">
          INTEGRATED PARTNER NETWORK
        </span>
        <InlineText
          as="h2"
          className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3"
          path={["partners", "introTitle"]}
          fallback="Our Technology Partners"
        />
        <InlineText
          as="p"
          multiline
          className="text-zinc-400 text-sm leading-relaxed"
          path={["partners", "introDesc"]}
          fallback="We work with world-class technology partners to deliver secure, scalable, and future-ready enterprise solutions."
        />
      </div>

      {/* Partners Grid */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 pb-20">

        {partnersList.length === 0 && !isEditActive && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <p className="text-zinc-500 font-mono text-sm">No partners added yet.</p>
            <p className="text-zinc-600 text-xs font-mono">Use editor mode (Ctrl+Shift+E) to add partner cards.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {partnersList.map((partner: any, idx: number) => (
            <PartnerCard
              key={idx}
              partner={partner}
              idx={idx}
              isEditActive={isEditActive}
              onDelete={() => deletePartner(idx)}
              onImageUpload={(file) => handleImageUpload(idx, file)}
              onNameChange={(val) => {
                const updated = [...partnersList];
                updated[idx] = { ...updated[idx], name: val };
                updateNestedValue(["partners", "featured"], updated);
              }}
              onTaglineChange={(val) => {
                const updated = [...partnersList];
                updated[idx] = { ...updated[idx], tagline: val };
                updateNestedValue(["partners", "featured"], updated);
              }}
            />
          ))}

          {/* Add Card Button — only in edit mode */}
          {isEditActive && (
            <button
              onClick={addPartner}
              className="rounded-2xl border-2 border-dashed border-teal-500/40 bg-zinc-950/20 hover:bg-teal-500/5 hover:border-teal-500 flex flex-col items-center justify-center gap-3 transition-all min-h-[260px] font-mono text-teal-400 group"
            >
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-teal-500/50 group-hover:border-teal-400 flex items-center justify-center transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Add Partner</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

// ----- Partner Card Component -----

interface PartnerCardProps {
  partner: any;
  idx: number;
  isEditActive: boolean;
  onDelete: () => void;
  onImageUpload: (file: File) => void;
  onNameChange: (val: string) => void;
  onTaglineChange: (val: string) => void;
}

function PartnerCard({
  partner,
  idx,
  isEditActive,
  onDelete,
  onImageUpload,
  onNameChange,
  onTaglineChange,
}: PartnerCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingName, setEditingName] = useState(false);
  const [editingTagline, setEditingTagline] = useState(false);
  const [nameVal, setNameVal] = useState(partner.name || "");
  const [taglineVal, setTaglineVal] = useState(partner.tagline || "");

  // Keep local state in sync when partner data updates from above
  React.useEffect(() => {
    setNameVal(partner.name || "");
    setTaglineVal(partner.tagline || "");
  }, [partner.name, partner.tagline]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden flex flex-col hover:border-teal-500/30 transition-all hover:shadow-lg hover:shadow-teal-500/5 relative group">
      {/* Delete Button */}
      {isEditActive && (
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
          title="Remove partner"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Image Area — large, covers most of the card */}
      <div
        className="relative w-full bg-zinc-950 flex items-center justify-center overflow-hidden"
        style={{ minHeight: "180px" }}
      >
        {partner.logoUrl ? (
          <img
            src={partner.logoUrl}
            alt={partner.name || "Partner logo"}
            className="w-full h-full object-contain p-4"
            style={{ maxHeight: "180px" }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-600 gap-2 py-10 px-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
            </svg>
            <span className="text-[10px] font-mono text-zinc-700 tracking-wider">NO IMAGE</span>
          </div>
        )}

        {/* Edit Overlay: click to upload */}
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
              <span>Upload Logo</span>
            </button>
          </>
        )}
      </div>

      {/* Description Box */}
      <div className="p-4 flex flex-col gap-1 flex-1 border-t border-zinc-800">
        {/* Partner Name */}
        {editingName && isEditActive ? (
          <input
            autoFocus
            className="bg-zinc-800 text-white text-sm font-bold w-full rounded px-2 py-1 outline-none border border-teal-500/50 focus:border-teal-400"
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            onBlur={() => {
              setEditingName(false);
              onNameChange(nameVal);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditingName(false);
                onNameChange(nameVal);
              }
            }}
          />
        ) : (
          <p
            className={`text-sm font-bold text-white truncate ${isEditActive ? "cursor-text hover:text-teal-300 transition-colors" : ""}`}
            title={isEditActive ? "Click to edit name" : undefined}
            onClick={() => isEditActive && setEditingName(true)}
          >
            {partner.name || "Partner Name"}
          </p>
        )}

        {/* Partner Tagline / Description */}
        {editingTagline && isEditActive ? (
          <textarea
            autoFocus
            className="bg-zinc-800 text-zinc-300 text-xs w-full rounded px-2 py-1 outline-none border border-teal-500/50 focus:border-teal-400 resize-none"
            rows={3}
            value={taglineVal}
            onChange={(e) => setTaglineVal(e.target.value)}
            onBlur={() => {
              setEditingTagline(false);
              onTaglineChange(taglineVal);
            }}
          />
        ) : (
          <p
            className={`text-xs text-zinc-400 leading-relaxed line-clamp-3 ${isEditActive ? "cursor-text hover:text-zinc-300 transition-colors" : ""}`}
            title={isEditActive ? "Click to edit description" : undefined}
            onClick={() => isEditActive && setEditingTagline(true)}
          >
            {partner.tagline || "Click to add a description"}
          </p>
        )}
      </div>
    </div>
  );
}
