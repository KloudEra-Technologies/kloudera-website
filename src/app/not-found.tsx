"use client";

import React from "react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 flex items-center justify-center font-mono select-none overflow-hidden">
      <div className="absolute inset-0 pointer-events-none cyber-grid animate-grid-flow opacity-10" />

      <div className="relative z-10 w-full max-w-sm p-8 rounded-lg border border-rose-500/20 bg-black/85 backdrop-blur-md shadow-[0_0_40px_rgba(244,63,94,0.1)] text-center">
        <div className="h-12 w-12 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-bold flex items-center justify-center rounded-full mx-auto mb-4 animate-pulse">
          !
        </div>
        
        <h1 className="text-sm font-bold text-white uppercase tracking-wider mb-2">ROUTE EXCEPTION: 404</h1>
        <p className="text-zinc-500 text-[10px] leading-relaxed mb-6 uppercase">
          The requested coordinate subnet does not exist or has been locked by secure firewalls.
        </p>

        <button
          onClick={() => window.location.href = "/"}
          className="w-full py-2.5 bg-rose-500 hover:bg-rose-400 text-black text-xs font-bold rounded cursor-none transition-all uppercase tracking-wider"
        >
          Return to Core HQ
        </button>
      </div>
    </main>
  );
}
