"use client";

import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-teal-500/30">
      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // LEGAL LAYER</span>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal">
            TERMS OF SERVICE
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
      <main className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6 py-12 font-mono text-xs leading-relaxed text-zinc-400">
        <h2 className="text-sm font-bold text-white uppercase">System Terms & Agreement</h2>
        <p>
          By interacting with the Kloudera Technologies virtual command center and reserving calendar slots, you agree to comply with standard acceptable use policies.
        </p>
        <p>
          Intrusion attempts, packet flooding, or double-booking spoof attempts are logged in our system audit tables and will result in connection bans.
        </p>
      </main>
    </div>
  );
}
