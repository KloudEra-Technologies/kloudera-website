"use client";

import React, { useState, useEffect, useRef } from "react";
import { InlineText, useEditor } from "@/components/editor";
import { BgAnimation } from "@/components/BgAnimation";
import { ReturnButton } from "@/components/ReturnButton";
import { PartnerLogo } from "@/components/FallbackLogo";

export default function PartnersPage() {
  const [partnersData, setPartnersData] = useState<any>(null);
  const [localPreviews, setLocalPreviews] = useState<Record<number, string>>({});
  const { isEditMode: isEditActive, updateNestedValue, siteData, authToken } = useEditor();

  useEffect(() => {
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.partners) {
          setPartnersData(data.partners);
        }
      })
      .catch(console.error);
  }, []);

  // Use siteData first (live edits), then fetched DB data, then empty array
  const partnersList: any[] = siteData?.partners?.featured || partnersData?.featured || [];

  const ALL_FOLDER_PARTNER_NAMES = [
    "6Clicks", "AWS", "AccuKnox", "Acronis", "Adani Connex", "Apple", "Arcon", "Arctic Wolf",
    "AvePoint", "Axidian", "BeyondTrust", "Bit Defender", "Black Kite", "Briskinfosec", "Checkpoint",
    "Claroty", "CloudBlue", "Collibra", "Colt", "CrossCipher", "Crowdstike", "Cybrovate", "Data  Samudra",
    "DataDog", "Databricks", "Dell", "Digital Ocean", "ESET", "Elastic", "Exabeam", "Flexera", "ForcePoint",
    "Forescout", "Fortinet", "GCP", "Gensys", "HCL Softwares", "HP", "HPE", "Heimdal", "IBM", "Infoblox",
    "Ingram", "Invicti", "Ishan Technologies", "Jump Cloud", "Juniper", "Kratikal", "LogRythm", "Manage Engine",
    "Mend.io", "Microsoft", "MongoDB", "NAKIVO", "NinjaOne", "Nozomi", "Nvidia", "NxtGen Cloud Technologies Pvt. Ltd.",
    "Open Text", "Perforce", "Pi DC", "Proofpoint", "QS Solution", "Qualys", "Quest", "RP InfoTech", "RSA",
    "Radware", "Rapid 7", "RasInfoTech", "Red Hat", "Rubrik", "Sales force", "Sattrix", "ScaleFusion", "Seceon",
    "Securonix", "Sentinel  ONE", "ServiceNow", "SnapLogic", "SnowFlake", "Solarwinds", "Sonicwall", "Sophos",
    "Sprinto", "Superna", "SysDog", "TS Plus", "Tally", "Tanim", "TeamViewer", "Tenable", "Trellix", "Turbo 360",
    "UI Path", "Veeam", "Web Werks", "Xurrent", "Zabbix", "Zendesk", "Zoho Directory", "Zoho", "Zoom", "Zscaler",
    "ctrls-datacenters-ltd-logo", "sify"
  ];

  // Filter out partners already rendered in Section 1 (Strategic Partners) to avoid duplicates
  const alliancesList = ALL_FOLDER_PARTNER_NAMES.filter(name => {
    const lowerName = name.toLowerCase();
    return !partnersList.some(p => {
      const pNameLower = (p.name || "").toLowerCase();
      return pNameLower.includes(lowerName) || lowerName.includes(pNameLower);
    });
  });

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
    const partner = partnersList[idx];
    const partnerName = partner?.name || "Partner";
    const cleanName = partnerName.trim().replace(/\s+/g, "");
    
    // Determine file extension
    let ext = "png";
    const mimeType = file.type || "image/png";
    if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = "jpg";
    else if (mimeType.includes("svg")) ext = "svg";
    else if (mimeType.includes("webp")) ext = "webp";
    else if (mimeType.includes("avif")) ext = "avif";
    else if (mimeType.includes("gif")) ext = "gif";

    const predictedUrl = `/partners/${cleanName}.${ext}`;

    // Set local preview instantly
    const tempPreviewUrl = URL.createObjectURL(file);
    setLocalPreviews((prev) => ({ ...prev, [idx]: tempPreviewUrl }));

    // Set permanent URL path instantly so it is safe to publish immediately
    const updated = [...partnersList];
    updated[idx] = { ...updated[idx], logoUrl: predictedUrl };
    updateNestedValue(["partners", "featured"], updated);

    const token = authToken || "";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);
    formData.append("partnerName", partnerName);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "x-developer-token": token },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        // Confirm final URL
        const finalUpdated = [...partnersList];
        finalUpdated[idx] = { ...finalUpdated[idx], logoUrl: data.url };
        updateNestedValue(["partners", "featured"], finalUpdated);
      } else {
        alert(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      alert("Network error during image upload. Please try again.");
      console.error("Image upload failed", err);
    }
  };

  const promoteAllianceToFeatured = (allianceName: string, action: (newIdx: number) => void) => {
    const promotedPartner = {
      name: allianceName,
      tagline: "Collaborative systems partnership and integrated threat-shield security intelligence analytics node.",
      logoUrl: "",
      logoColor: "#06b6d4"
    };
    const updated = [...partnersList, promotedPartner];
    updateNestedValue(["partners", "featured"], updated);
    action(updated.length - 1);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans relative overflow-hidden">
      <BgAnimation variant="partners" />

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
          <ReturnButton />
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
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 pb-20 space-y-16">

        {/* Section 1: Strategic Partners */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="h-5 w-1 rounded-full bg-teal-500" />
            <h3 className="text-sm font-bold text-teal-400 font-mono tracking-widest uppercase">STRATEGIC TECHNOLOGY PARTNERS</h3>
          </div>

          {partnersList.length === 0 && !isEditActive && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <p className="text-zinc-500 font-mono text-sm">No partners added yet.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partnersList.map((partner: any, idx: number) => (
              <PartnerCard
                key={idx}
                partner={partner}
                idx={idx}
                isEditActive={isEditActive}
                localPreviewUrl={localPreviews[idx]}
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
        </div>

        {/* Section 2: Global Alliance Network */}
        {alliancesList.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="h-5 w-1 rounded-full bg-cyan-500" />
              <h3 className="text-sm font-bold text-cyan-400 font-mono tracking-widest uppercase">GLOBAL ALLIANCE NETWORK</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {alliancesList.map((allianceName: string, idx: number) => {
                const partnerObj = {
                  name: allianceName,
                  tagline: "Collaborative systems partnership and integrated threat-shield security intelligence analytics node."
                };
                return (
                  <PartnerCard
                    key={`alliance-${idx}`}
                    partner={partnerObj}
                    idx={idx + 100}
                    isEditActive={isEditActive}
                    onDelete={() => {}}
                    onImageUpload={(file) => promoteAllianceToFeatured(allianceName, (newIdx) => handleImageUpload(newIdx, file))}
                    onNameChange={(val) => promoteAllianceToFeatured(allianceName, (newIdx) => {
                      const promotedObj = {
                        name: val,
                        tagline: "Collaborative systems partnership and integrated threat-shield security intelligence analytics node.",
                        logoUrl: "",
                        logoColor: "#06b6d4"
                      };
                      const finalUpdated = [...partnersList, promotedObj];
                      updateNestedValue(["partners", "featured"], finalUpdated);
                    })}
                    onTaglineChange={(val) => promoteAllianceToFeatured(allianceName, (newIdx) => {
                      const promotedObj = {
                        name: allianceName,
                        tagline: val,
                        logoUrl: "",
                        logoColor: "#06b6d4"
                      };
                      const finalUpdated = [...partnersList, promotedObj];
                      updateNestedValue(["partners", "featured"], finalUpdated);
                    })}
                  />
                );
              })}
            </div>
          </div>
        )}

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
  localPreviewUrl?: string;
}

function PartnerCard({
  partner,
  idx,
  isEditActive,
  onDelete,
  onImageUpload,
  onNameChange,
  onTaglineChange,
  localPreviewUrl,
}: PartnerCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingName, setEditingName] = useState(false);
  const [editingTagline, setEditingTagline] = useState(false);
  const [nameVal, setNameVal] = useState(partner.name || "");
  const [taglineVal, setDescVal] = useState(partner.tagline || "");
  const [isFlipped, setIsFlipped] = useState(false);

  React.useEffect(() => {
    setNameVal(partner.name || "");
    setDescVal(partner.tagline || "");
  }, [partner.name, partner.tagline]);

  return (
    <div
      className={`${isEditActive ? "" : "flip-card"} relative group`}
      style={{ minHeight: "260px" }}
    >
      <div 
        className="flip-inner w-full h-full absolute inset-0"
        style={isEditActive && isFlipped ? { transform: "rotateY(180deg)" } : {}}
      >
        {/* Front */}
        <div className="flip-front absolute inset-0 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 flex flex-col">
          {/* Flip Manual Button */}
          {isEditActive && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsFlipped(true); }}
              className="absolute bottom-3 right-3 z-30 px-2 py-0.5 bg-teal-500/80 hover:bg-teal-400 text-black text-[9px] font-bold font-mono rounded shadow transition-all"
            >
              EDIT DETAILS 🔄
            </button>
          )}
          {/* Delete Button */}
          {isEditActive && (
            <button
              onClick={onDelete}
              className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
              title="Remove partner"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Image Area */}
          <div className="relative w-full bg-zinc-950/80 flex items-center justify-center overflow-hidden" style={{ minHeight: "180px" }}>
            <PartnerLogo name={partner.name || ""} customLogoUrl={localPreviewUrl || partner.logoUrl} />

            {isEditActive && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onImageUpload(file);
                    }
                    e.target.value = ""; // Reset value to allow uploading same file again
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

          {/* Description / Name Box */}
          <div className="p-4 flex flex-col gap-1 border-t border-zinc-800 bg-zinc-900/60">
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
                onClick={() => isEditActive && setEditingName(true)}
              >
                {partner.name || "Partner Name"}
              </p>
            )}
            <p className="text-[9px] font-mono text-cyan-400 mt-1 tracking-widest">HOVER TO VIEW DETAILS →</p>
          </div>
        </div>

        {/* Back */}
        <div className="flip-back absolute inset-0 rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#0a1420] to-zinc-950 overflow-hidden flex flex-col p-5 justify-center">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-6 rounded-full bg-cyan-500" />
              <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">System Partner</span>
            </div>
            <p className="text-sm font-bold text-white">{partner.name || "Partner Name"}</p>
            {editingTagline && isEditActive ? (
              <textarea
                autoFocus
                className="bg-zinc-900 text-slate-300 text-xs w-full rounded px-2 py-1 outline-none border border-teal-500/50 focus:border-teal-400 resize-none"
                rows={4}
                value={taglineVal}
                onChange={(e) => setDescVal(e.target.value)}
                onBlur={() => {
                  setEditingTagline(false);
                  onTaglineChange(taglineVal);
                }}
              />
            ) : (
              <p
                className={`text-xs text-slate-400 leading-relaxed ${isEditActive ? "cursor-text hover:text-slate-300 transition-colors" : ""}`}
                onClick={() => isEditActive && setEditingTagline(true)}
              >
                {partner.tagline || (isEditActive ? "Click to add description" : "No description provided.")}
              </p>
            )}
            <div className="pt-2 border-t border-cyan-900/40 flex items-center justify-between text-[9px] font-mono text-cyan-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span>AUTHENTICATED STRATEGIC ALLIANCE</span>
              </div>
              {isEditActive && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsFlipped(false); }}
                  className="px-2 py-0.5 bg-teal-500/80 hover:bg-teal-400 text-black text-[9px] font-bold font-mono rounded shadow transition-all"
                >
                  SHOW FRONT 🔄
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
