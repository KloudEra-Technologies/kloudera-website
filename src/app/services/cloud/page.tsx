"use client";

import React from "react";
import { InlineText } from "@/components/editor";

export default function CloudInfrastructurePage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-teal-500/30">
      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // COMPUTE WING</span>
          <InlineText as="h1" className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal" path={["services", "cloud", "title"]} fallback="CLOUD & GPU ARCHITECTURE" />
        </div>

        <button
          onClick={() => window.location.href = "/"}
          className="mt-4 sm:mt-0 px-4 py-1.5 border border-teal-500/30 text-teal-400 font-mono text-[10px] tracking-wider rounded hover:bg-teal-500/10 cursor-none transition-all"
        >
          DISCONNECT
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-12 py-12 font-mono text-xs">
        <div className="max-w-xl mx-auto mb-8 text-center">
          <span className="text-[8px] font-bold text-teal-400 tracking-widest uppercase bg-teal-500/10 px-2 py-1 rounded border border-teal-500/10">
            COMPUTE INFRASTRUCTURE
          </span>
          <InlineText as="h2" className="text-sm font-bold text-white mt-3 uppercase" path={["services", "cloud", "heading"]} fallback="High-density datacenter environments" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cyber-panel p-6 rounded-lg border border-teal-500/20 space-y-3">
            <InlineText as="span" className="block font-bold text-white" path={["services", "cloud", "boxes", "0", "title"]} fallback="GPU Supercomputing Scale" />
            <InlineText as="p" multiline className="text-zinc-500 leading-normal" path={["services", "cloud", "boxes", "0", "desc"]} fallback="We design cluster environments featuring Nvidia H100 arrays, linked with high-bandwidth InfiniBand switches to execute heavy CUDA and deep learning calculations." />
          </div>
          <div className="cyber-panel p-6 rounded-lg border border-teal-500/20 space-y-3">
            <InlineText as="span" className="block font-bold text-white" path={["services", "cloud", "boxes", "1", "title"]} fallback="Hybrid Cloud Sync Routing" />
            <InlineText as="p" multiline className="text-zinc-500 leading-normal" path={["services", "cloud", "boxes", "1", "desc"]} fallback="Linking legacy local database nodes to virtualized Azure servers using secure IPSec VPN tunnels and high-performance ExpressRoute circuits." />
          </div>
        </div>
      </main>
    </div>
  );
}
