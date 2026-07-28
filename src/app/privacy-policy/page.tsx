"use client";

import React from "react";
import { InlineText } from "@/components/editor";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-teal-500/30">
      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // LEGAL LAYER</span>
          <InlineText as="h1" className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal" path={["privacy-policy", "title"]} fallback="PRIVACY POLICY" />
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
        <InlineText as="h2" className="text-sm font-bold text-white uppercase" path={["privacy-policy", "heading"]} fallback="Data Privacy Telemetry Agreement" />
        <InlineText as="p" multiline path={["privacy-policy", "p1"]} fallback="At Kloudera Technologies, we prioritize data privacy and enforce strict cybersecurity practices to protect all client logs, meeting booking information, and career applications." />
        <InlineText as="p" multiline path={["privacy-policy", "p2"]} fallback="Your personal data is encrypted at rest in our MySQL databases using TLS protocols. We do not transmit or sell lead payloads to third-party ad matrices." />
      </main>
    </div>
  );
}
