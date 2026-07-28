"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { KloudEraLogo } from "@/components/KloudEraLogo";

export default function AchievementsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((d) => {
        if (d.achievements) setData(d.achievements);
      })
      .catch((err) => console.error("Failed to load achievements data", err));
  }, []);

  const title = data?.title || "Our Achievements";

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
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase">
            Our <span className="text-blue-500">{title.replace("Our ", "")}</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-mono">
            Kloudera Technologies is officially registered, accredited, and recognized under national technology initiatives by the Government of India.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          {/* MSME Card */}
          <div className="rounded-3xl border border-blue-900/40 bg-white p-10 text-center flex flex-col items-center justify-between space-y-6 shadow-2xl hover:scale-105 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-600 font-extrabold text-2xl">
                  🇮🇳
                </div>
                <div className="text-left">
                  <span className="text-4xl font-black tracking-tight text-red-600 font-sans block">MSME</span>
                  <span className="text-xs text-slate-800 font-bold block leading-tight">सूक्ष्म , लघु एवं मध्यम उद्यम</span>
                  <span className="text-[9px] text-slate-500 font-mono block">MICRO, SMALL & MEDIUM ENTERPRISES</span>
                </div>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed max-w-xs mx-auto pt-2">
                Certified enterprise under the Ministry of Micro, Small & Medium Enterprises, Government of India.
              </p>
            </div>
            <span className="text-xs font-mono font-bold uppercase text-blue-900 bg-blue-50 px-5 py-1.5 rounded-full border border-blue-200">
              Government of India Certified
            </span>
          </div>

          {/* #startupindia Card */}
          <div className="rounded-3xl border border-blue-900/40 bg-white p-10 text-center flex flex-col items-center justify-between space-y-6 shadow-2xl hover:scale-105 transition-all">
            <div className="space-y-4">
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight font-sans">
                <span className="text-orange-500">#startup</span>
                <span className="text-cyan-500">ind</span>
                <span className="text-yellow-500">i</span>
                <span className="text-emerald-500 border-b-4 border-emerald-500 inline-block pb-0.5">a</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed max-w-xs mx-auto pt-2">
                Recognized technology venture by the Department for Promotion of Industry and Internal Trade (DPIIT), Govt. of India.
              </p>
            </div>
            <span className="text-xs font-mono font-bold uppercase text-orange-900 bg-orange-50 px-5 py-1.5 rounded-full border border-orange-200">
              DPIIT Recognized Startup
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
