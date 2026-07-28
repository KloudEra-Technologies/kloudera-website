"use client";

import React from "react";
import { CalendarScheduler } from "@/components/CalendarScheduler";
import { InlineText } from "@/components/editor";

export default function BookMeetingPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-teal-500/30">
      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-teal-500 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // CALENDAR INTEGRATOR</span>
          <InlineText as="h1" className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal" path={["book-meeting", "title"]} fallback="BOOK A CONSULTATION" />
        </div>

        <div className="flex gap-4 mt-4 sm:mt-0 items-center font-mono">
          <div className="text-right">
            <span className="text-[9px] text-zinc-500 block">SCHEDULER_DAEMON</span>
            <span className="text-xs text-teal-400 font-bold">ONLINE // ZERO_OVERLAP</span>
          </div>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-1.5 border border-teal-500/30 text-teal-400 text-[10px] tracking-wider rounded hover:bg-teal-500/10 cursor-none transition-all"
          >
            DISCONNECT
          </button>
        </div>
      </header>

      {/* Content wrapper */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col justify-center py-12">
        <div className="text-center max-w-xl mx-auto mb-8 font-mono">
          <span className="text-[9px] font-bold text-teal-400 tracking-widest uppercase bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/10">
            ENTERPRISE MEETING DISPATCH
          </span>
          <InlineText as="h2" className="text-md font-bold text-white mt-3 uppercase" path={["book-meeting", "heading"]} fallback="Sync with our Cloud & Security Advisors" />
          <InlineText as="p" multiline className="text-zinc-500 text-[10.5px] mt-2 leading-relaxed" path={["book-meeting", "desc"]} fallback="Select your timezone, consultation length, and an open slot. Double-booking prevention and 15-minute buffers are enforced automatically." />
        </div>

        <CalendarScheduler />
      </main>
    </div>
  );
}
