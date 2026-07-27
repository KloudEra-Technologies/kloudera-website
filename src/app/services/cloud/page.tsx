"use client";

import React from "react";

export default function CloudInfrastructurePage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-teal-500/30">
      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // COMPUTE WING</span>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal">
            CLOUD & GPU ARCHITECTURE
          </h1>
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
          <h2 className="text-sm font-bold text-white mt-3 uppercase">High-density datacenter environments</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cyber-panel p-6 rounded-lg border border-teal-500/20 space-y-3">
            <span className="block font-bold text-white">GPU Supercomputing Scale</span>
            <p className="text-zinc-500 leading-normal">
              We design cluster environments featuring Nvidia H100 arrays, linked with high-bandwidth InfiniBand switches to execute heavy CUDA and deep learning calculations.
            </p>
          </div>
          <div className="cyber-panel p-6 rounded-lg border border-teal-500/20 space-y-3">
            <span className="block font-bold text-white">Hybrid Cloud Sync Routing</span>
            <p className="text-zinc-500 leading-normal">
              Linking legacy local database nodes to virtualized Azure servers using secure IPSec VPN tunnels and high-performance ExpressRoute circuits.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
