"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { KloudEraLogo } from "@/components/KloudEraLogo";

export default function ProductsPage() {
  const [productsData, setProductsData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/website-content")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProductsData(data.products);
        }
      })
      .catch((err) => console.error("Failed to load products data", err));
  }, []);

  const title = productsData?.title || "Kloudera Software & Infrastructure Product Suite";
  const intro = productsData?.intro || "Proprietary enterprise cybersecurity, AI compute management, and cloud governance products engineered for high-stakes resilience.";
  const items = productsData?.items || [];

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
            SOFTWARE & HARDWARE PRODUCT SUITE
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
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/60 px-4 py-1 text-xs font-mono font-bold tracking-wider text-amber-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span>🛠️ WORK IN PROGRESS — UNDER ACTIVE DEVELOPMENT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase glow-text-teal">
            {title}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {intro}
          </p>
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-200/90 text-xs font-mono max-w-xl mx-auto">
            ⚡ Notice: Products in this suite are currently in private enterprise testing & hardware staging. Full commercial launch scheduled soon.
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((prod: any, idx: number) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-blue-900/40 bg-gradient-to-b from-[#090e1a] via-[#050811] to-[#030712] p-6 sm:p-8 space-y-6 shadow-xl hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300"
            >
              <div className="flex justify-between items-start gap-4 border-b border-blue-900/30 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 block mb-1">
                    // {prod.category || "ENTERPRISE"}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                    {prod.name}
                  </h2>
                </div>
                <span className="text-[9px] font-mono font-extrabold uppercase bg-cyan-950/80 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30 shrink-0">
                  {prod.badge || "FEATURED"}
                </span>
              </div>

              <p className="text-cyan-200/90 text-xs font-mono font-semibold">
                {prod.tagline}
              </p>

              <p className="text-slate-400 text-xs leading-relaxed">
                {prod.desc}
              </p>

              {/* Feature Highlights */}
              {prod.features && (
                <div className="space-y-2 pt-2 border-t border-blue-950">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
                    CAPABILITY HIGHLIGHTS:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10.5px]">
                    {prod.features.map((feat: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-center gap-2 text-slate-300">
                        <span className="text-cyan-400 text-xs">✔</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>REQUEST PRODUCT DEMO</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
