"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { KloudEraLogo } from "@/components/KloudEraLogo";

export default function CertificationsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((d) => {
        if (d.certifications) setData(d.certifications);
      })
      .catch((err) => console.error("Failed to load certifications data", err));
  }, []);

  const title = data?.title || "Security Compliance & Global Standards";
  const intro = data?.intro || "Kloudera operates under audited global security frameworks, data privacy laws, and quality management protocols.";
  const items = data?.items || [];

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
            COMPLIANCE & GOVERNANCE DECK
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
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1 text-xs font-mono font-bold tracking-wider text-emerald-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AUDITED COMPLIANCE STANDARDS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase glow-text-teal">
            {title}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {intro}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((cert: any, idx: number) => (
            <div
              key={idx}
              className="group rounded-2xl border border-blue-900/40 bg-gradient-to-b from-[#090e1a] to-[#030712] p-6 space-y-4 shadow-xl hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-blue-900/30 pb-3">
                  <span className="text-sm font-extrabold font-mono text-emerald-400">
                    🛡️ {cert.code}
                  </span>
                  <span className="text-[8.5px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {cert.status || "ACTIVE"}
                  </span>
                </div>

                <h2 className="text-base font-bold text-white font-mono group-hover:text-emerald-300 transition-colors">
                  {cert.title}
                </h2>

                <p className="text-[11px] font-mono text-slate-400 font-semibold">
                  Issuing Authority: <span className="text-slate-200">{cert.issuer}</span>
                </p>

                <p className="text-slate-400 text-xs leading-relaxed">
                  {cert.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-blue-950 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                <span>AUDITED & VERIFIED</span>
                <span>✔</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
