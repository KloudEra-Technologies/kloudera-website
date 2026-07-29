"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { KloudEraLogo } from "@/components/KloudEraLogo";
import { InlineText, InlineImage, useEditor } from "@/components/editor";

export default function AchievementsPage() {
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
        if (d.achievements) setData(d.achievements);
      })
      .catch((err) => console.error("Failed to load achievements data", err));
  }, []);

  const achievementsData = siteData?.achievements || data || {};
  const achievementsList = achievementsData.items || [
    {
      name: "MSME Certified Enterprise",
      category: "GOVERNMENT ACCREDITATION",
      tagline: "सूक्ष्म , लघु एवं मध्यम उद्यम",
      desc: "Certified enterprise under the Ministry of Micro, Small & Medium Enterprises, Government of India.",
      logoUrl: ""
    },
    {
      name: "#startupindia Recognized Venture",
      category: "DPIIT RECOGNITION",
      tagline: "DPIIT Recognized Startup",
      desc: "Recognized technology venture by the Department for Promotion of Industry and Internal Trade (DPIIT), Govt. of India.",
      logoUrl: ""
    }
  ];

  const addAchievement = () => {
    const updated = [...achievementsList];
    updated.push({
      name: "New Achievement",
      category: "ACCREDITATION",
      tagline: "Certification Subtitle",
      desc: "Double click to edit details.",
      logoUrl: ""
    });
    updateNestedValue(["achievements", "items"], updated);
  };

  const deleteAchievement = (idx: number) => {
    const updated = [...achievementsList];
    updated.splice(idx, 1);
    updateNestedValue(["achievements", "items"], updated);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/">
            <KloudEraLogo className="h-8 w-auto text-blue-400" />
          </Link>
          <div className="h-4 w-[1px] bg-blue-900/60 hidden sm:block" />
          <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase hidden sm:block">
            ACCREDITATION & GOVERNMENT RECOGNITIONS
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
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 py-16 space-y-12">
        {/* Title */}
        <div className="text-center space-y-4">
          <InlineText 
            as="h1" 
            className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase"
            path={["achievements", "title"]} 
            fallback="Our Achievements"
          />
          <InlineText 
            as="p" 
            multiline
            className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-mono"
            path={["achievements", "description"]}
            fallback="Kloudera Technologies is officially registered, accredited, and recognized under national technology initiatives by the Government of India."
          />
        </div>

        {/* Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          {achievementsList.map((item: any, idx: number) => {
            const hasCustomImage = item.logoUrl && (
              item.logoUrl.startsWith("data:") || 
              item.logoUrl.includes("/") || 
              item.logoUrl.startsWith("http")
            );

            return (
              <div 
                key={idx} 
                className="rounded-3xl border border-blue-900/40 bg-white p-10 text-center flex flex-col items-center justify-between space-y-6 shadow-2xl hover:scale-105 transition-all relative text-black"
              >
                {/* Delete Button */}
                {isEditActive && (
                  <button
                    onClick={() => deleteAchievement(idx)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-all z-10 font-bold"
                    title="Delete card"
                  >
                    ✕
                  </button>
                )}

                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-center gap-4">
                    {isEditActive || hasCustomImage ? (
                      <div className="h-16 w-full flex items-center justify-center overflow-hidden relative border border-dashed border-teal-500/20 rounded">
                        <InlineImage 
                          path={["achievements", "items", String(idx), "logoUrl"]} 
                          fallback={hasCustomImage ? item.logoUrl : "/logo.png"} 
                          className="h-full w-auto max-h-16 object-contain"
                          alt={item.name}
                        />
                      </div>
                    ) : (
                      // Fallback shapes
                      (() => {
                        const nameLower = item.name.toLowerCase();
                        if (nameLower.includes("msme")) {
                          return (
                            <>
                              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-600 font-extrabold text-2xl shrink-0">
                                🇮🇳
                              </div>
                              <div className="text-left">
                                <span className="text-4xl font-black tracking-tight text-red-600 font-sans block">MSME</span>
                                <InlineText as="span" className="text-xs text-slate-800 font-bold block leading-tight" path={["achievements", "msme", "title_hi"]} fallback="सूक्ष्म , लघु एवं मध्यम उद्यम" />
                                <InlineText as="span" className="text-[9px] text-slate-500 font-mono block" path={["achievements", "msme", "title_en"]} fallback="MICRO, SMALL & MEDIUM ENTERPRISES" />
                              </div>
                            </>
                          );
                        }
                        if (nameLower.includes("startup")) {
                          return (
                            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight font-sans">
                              <span className="text-orange-500">#startup</span>
                              <span className="text-cyan-500">ind</span>
                              <span className="text-yellow-500">i</span>
                              <span className="text-emerald-500 border-b-4 border-emerald-500 inline-block pb-0.5">a</span>
                            </div>
                          );
                        }
                        return (
                          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                            🏆
                          </div>
                        );
                      })()
                    )}
                  </div>
                  
                  <InlineText 
                    as="p" 
                    multiline
                    className="text-slate-600 text-xs leading-relaxed max-w-xs mx-auto pt-2 block" 
                    path={["achievements", "items", String(idx), "desc"]} 
                    fallback={item.desc} 
                  />
                </div>

                <div className="w-full flex flex-col items-center gap-2">
                  <InlineText 
                    as="span" 
                    className="text-xs font-mono font-bold uppercase text-blue-900 bg-blue-50 px-5 py-1.5 rounded-full border border-blue-200"
                    path={["achievements", "items", String(idx), "category"]}
                    fallback={item.category}
                  />
                  <InlineText 
                    as="h3" 
                    className="text-base font-extrabold text-slate-800 tracking-tight block"
                    path={["achievements", "items", String(idx), "name"]}
                    fallback={item.name}
                  />
                </div>
              </div>
            );
          })}

          {/* Add New Achievement Card */}
          {isEditActive && (
            <button
              onClick={addAchievement}
              className="rounded-3xl border-2 border-dashed border-teal-500/40 bg-zinc-950/25 hover:bg-teal-500/5 hover:border-teal-500 p-10 flex flex-col items-center justify-center space-y-2 transition-all min-h-[260px] font-bold text-teal-400 uppercase tracking-widest text-xs"
            >
              <span>➕</span>
              <span>Add New Achievement</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
