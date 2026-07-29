"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { KloudEraLogo } from "@/components/KloudEraLogo";
import { InlineText, InlineImage, useEditor } from "@/components/editor";

export default function ClientelesPage() {
  const [data, setData] = useState<any>(null);

  let editorContext: any;
  try {
    editorContext = useEditor();
  } catch (e) {
    editorContext = { isEditMode: false, siteData: null, updateNestedValue: () => {} };
  }
  const { isEditMode: isEditActive, updateNestedValue, siteData } = editorContext;

  useEffect(() => {
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((d) => {
        if (d.clienteles) setData(d.clienteles);
      })
      .catch((err) => console.error("Failed to load clienteles data", err));
  }, []);

  const clientelesList = siteData?.clienteles?.items || data?.items || [
    { name: "IndiaCapital", sector: "FinTech", category: "FINANCIAL SERVICES", logoType: "indiacapital", desc: "Enterprise financial technology and capital management solutions." },
    { name: "Fin Chikitsak", sector: "FinTech", category: "FINANCIAL WELLNESS", logoType: "finchikitsak", desc: "Comprehensive financial wellness and advisory platform." },
    { name: "gleeds", sector: "Construction Consultancy", category: "GLOBAL INFRASTRUCTURE", logoType: "gleeds", desc: "International property and construction management consultancy." },
    { name: "StatusNeo", sector: "MNC IT", category: "ENTERPRISE IT CONSULTING", logoType: "statusneo", desc: "Global digital transformation and enterprise IT consultancy." },
    { name: "SIT PUNE", sector: "Academic Institution", category: "EDUCATION & RESEARCH", logoType: "sitpune", desc: "Premier engineering and technological research institute." }
  ];

  const addClientele = () => {
    const updated = [...clientelesList];
    updated.push({
      name: "New Clientele",
      sector: "FinTech",
      category: "SERVICES",
      logoType: "/logo.png",
      desc: "Double click to edit details."
    });
    updateNestedValue(["clienteles", "items"], updated);
  };

  const deleteClientele = (idx: number) => {
    const updated = [...clientelesList];
    updated.splice(idx, 1);
    updateNestedValue(["clienteles", "items"], updated);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/">
            <KloudEraLogo className="h-8 w-auto text-blue-400" />
          </Link>
          <div className="h-4 w-[1px] bg-blue-900/60 hidden sm:block" />
          <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase hidden sm:block">
            GLOBAL CLIENTELE PORTFOLIO
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
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 py-16 space-y-12">
        {/* Title */}
        <div className="text-center space-y-4">
          <InlineText 
            as="h1" 
            className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase"
            path={["clienteles", "title"]}
            fallback="Our Clienteles"
          />
          <InlineText 
            as="p" 
            multiline
            className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-mono"
            path={["clienteles", "intro"]}
            fallback="Trusted by fintech pioneers, global infrastructure consultancies, IT enterprise leaders, and academic research institutions."
          />
        </div>

        {/* Clientele Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
          {clientelesList.map((item: any, idx: number) => {
            const hasCustomImage = item.logoType && (
              item.logoType.startsWith("data:") || 
              item.logoType.includes("/") || 
              item.logoType.startsWith("http")
            );

            return (
              <div 
                key={idx} 
                className="rounded-xl bg-white p-8 shadow-2xl flex flex-col items-center justify-between h-56 hover:scale-105 transition-all border border-slate-100 relative text-black"
              >
                {/* Delete Button */}
                {isEditActive && (
                  <button
                    onClick={() => deleteClientele(idx)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-all z-10 font-bold text-xs"
                    title="Delete card"
                  >
                    ✕
                  </button>
                )}

                <div className="flex flex-col items-center justify-center h-full w-full overflow-hidden">
                  {isEditActive || hasCustomImage ? (
                    <div className="h-16 w-full flex items-center justify-center overflow-hidden relative">
                      <InlineImage 
                        path={["clienteles", "items", String(idx), "logoType"]} 
                        fallback={hasCustomImage ? item.logoType : "/logo.png"} 
                        className="h-full w-auto max-h-16"
                        alt={item.name}
                      />
                    </div>
                  ) : (
                    // Fallback to custom layouts based on name
                    (() => {
                      const nameLower = item.name.toLowerCase();
                      if (nameLower.includes("indiacapital")) {
                        return (
                          <div className="bg-[#0b1b1f] text-white px-6 py-3 rounded-xl flex items-center gap-3 border border-slate-800 shadow-sm">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 via-emerald-400 to-indigo-500 flex items-center justify-center text-xs font-bold">
                              ❖
                            </div>
                            <span className="font-bold text-lg tracking-tight font-sans">IndiaCapital</span>
                          </div>
                        );
                      }
                      if (nameLower.includes("chikitsak")) {
                        return (
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-emerald-700 font-extrabold text-2xl tracking-tighter">
                              <span>F</span>
                              <span className="text-emerald-500">C</span>
                            </div>
                            <span className="font-bold text-base text-emerald-950 tracking-wider block">FIN CHIKITSAK</span>
                            <span className="text-[10px] text-emerald-700 font-serif italic block mt-0.5">Be Financially Fit</span>
                          </div>
                        );
                      }
                      if (nameLower.includes("gleeds")) {
                        return (
                          <span className="font-sans text-4xl font-extrabold text-slate-900 tracking-tight">gleeds</span>
                        );
                      }
                      if (nameLower.includes("statusneo")) {
                        return (
                          <div className="flex items-center text-3xl font-sans text-slate-900">
                            <span className="font-normal">Status</span>
                            <span className="font-extrabold">Neo</span>
                            <span className="w-3 h-3 rounded-full bg-amber-400 ml-0.5" />
                          </div>
                        );
                      }
                      if (nameLower.includes("sit pune")) {
                        return (
                          <div className="bg-[#1a1a1a] p-4 rounded-xl flex items-center gap-3 text-red-500 border border-slate-700 shadow-md">
                            <div className="w-9 h-9 rounded bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 text-sm font-bold">
                              🌐
                            </div>
                            <div className="text-left">
                              <span className="text-sm font-bold text-white block">SIT PUNE</span>
                              <span className="text-[8px] text-red-400 font-serif block">वसुधैव कुटुम्बकम्</span>
                            </div>
                          </div>
                        );
                      }
                      
                      // Generic fallback card for any other added clientele
                      return (
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center gap-2.5 text-slate-700 shadow-sm">
                          <span className="text-base">💼</span>
                          <span className="font-bold text-sm uppercase tracking-wide">{item.name}</span>
                        </div>
                      );
                    })()
                  )}
                </div>
                
                <div className="text-center space-y-2 mt-6 w-full">
                  <div className="flex justify-between items-center w-full mb-1">
                    <InlineText as="span" className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded" path={["clienteles", "items", String(idx), "sector"]} fallback={item.sector} />
                    <InlineText as="span" className="text-[9px] font-bold text-blue-500 uppercase tracking-widest" path={["clienteles", "items", String(idx), "category"]} fallback={item.category} />
                  </div>
                  <InlineText as="h3" className="text-lg font-black text-slate-800 tracking-tight" path={["clienteles", "items", String(idx), "name"]} fallback={item.name} />
                  <InlineText as="p" multiline className="text-xs text-slate-500 leading-relaxed" path={["clienteles", "items", String(idx), "desc"]} fallback={item.desc} />
                </div>
              </div>
            );
          })}

          {/* Add New Clientele Card */}
          {isEditActive && (
            <button
              onClick={addClientele}
              className="rounded-xl border-2 border-dashed border-teal-500/40 bg-zinc-950/20 hover:bg-teal-500/5 hover:border-teal-500 p-8 flex flex-col items-center justify-center space-y-2 transition-all h-56 font-bold text-teal-400 uppercase tracking-widest text-xs"
            >
              <span>➕</span>
              <span>Add New Clientele</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
