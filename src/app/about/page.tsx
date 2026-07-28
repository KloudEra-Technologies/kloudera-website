"use client";

import React, { useState, useEffect } from "react";
import { getImageStyle, getCleanImageUrl } from "@/lib/imageHelper";
import { InlineText, InlineImage } from "@/components/editor";

const DEFAULT_WHY_CHOOSE_US = [
  {
    title: "Favourable terms",
    desc: "Each project we work on is tailored to the particular client's exact needs, not the other way around."
  },
  {
    title: "Quality for value",
    desc: "Our motto is to provide only the highest quality to our clients, no matter the circumstances."
  },
  {
    title: "Global experience",
    desc: "We have worked with multinational companies, as well as smaller businesses from all continents."
  },
  {
    title: "High standards",
    desc: "We take data seriously, meaning that we only deliver work that we can be proud of."
  }
];

const DEFAULT_TEAM = [
  {
    name: "Ratnesh Pandey",
    role: "CEO | Co-Founder | vCISO | Director",
    initials: "RP"
  },
  {
    name: "Deepa",
    role: "Director | Co-Founder | CHRO",
    initials: "D"
  },
  {
    name: "Utkarsh",
    role: "Sr. Cyber Security SME | Partner Success Mgr",
    initials: "U"
  }
];

export default function AboutPage() {
  const [whyChooseUs, setWhyChooseUs] = useState<any[]>(DEFAULT_WHY_CHOOSE_US);
  const [team, setTeam] = useState<any[]>(DEFAULT_TEAM);

  useEffect(() => {
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("API load failed");
      })
      .then(data => {
        if (data && data.about) {
          if (data.about.whyChooseUs) setWhyChooseUs(data.about.whyChooseUs);
          if (data.about.team) setTeam(data.about.team);
        }
      })
      .catch(err => console.log("Using fallback static copy:", err.message));
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-teal-500/30">
      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // LAB_CORE</span>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal">
            ABOUT OUR ENTERPRISE
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
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-16 py-12 font-mono text-xs">
        
        {/* Our Mission */}
        <section className="p-6 rounded-xl border border-blue-500/20 bg-slate-900/60 space-y-4 shadow-xl backdrop-blur-xl">
          <span className="text-[9px] font-bold text-cyan-400 tracking-widest uppercase">OUR MISSION</span>
          <InlineText as="h2" className="text-sm font-bold text-white uppercase" path={["about", "missionTitle"]} fallback="Innovative IT Solutions & Cloud Technology" />
          <InlineText 
            as="p" 
            multiline
            className="text-slate-300 leading-relaxed text-xs"
            path={["about", "missionDesc"]}
            fallback="We believe in your success and that technology can drive the best results for your business, no matter your industry or goals. At Kloudera, we specialize in innovative IT solutions that focus on cloud technology and data management."
          />
        </section>

        {/* Why Choose Us */}
        <section className="space-y-8">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-center">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="p-5 rounded-xl border border-blue-500/20 bg-slate-900/50 hover:border-cyan-400/40 transition-all backdrop-blur-md">
                <span className="text-[9.5px] font-bold text-cyan-400 block mb-1">
                  ⚡ // <InlineText as="span" path={["about", "whyChooseUs", String(i), "title"]} fallback={item.title} />
                </span>
                <InlineText as="p" multiline className="text-slate-300 text-xs leading-relaxed" path={["about", "whyChooseUs", String(i), "desc"]} fallback={item.desc} />
              </div>
            ))}
          </div>
        </section>

        {/* Meet Our Visionary Team */}
        <section className="space-y-8 border-t border-blue-900/40 pt-12">
          <div className="text-center">
            <span className="text-[9px] font-bold text-cyan-400 tracking-widest uppercase font-mono">EXECUTIVE LEADERSHIP</span>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mt-1">
              Meet Our Leadership Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((mbr, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-blue-500/20 bg-slate-900/60 flex flex-col items-center text-center space-y-4 hover:border-cyan-400/40 transition-all shadow-xl backdrop-blur-xl">
                <div className="w-24 h-24 rounded-full border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] overflow-hidden">
                  <InlineImage 
                    path={["about", "team", String(idx), "image"]} 
                    fallback={mbr.image || ""} 
                    className="w-full h-full"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <InlineText as="span" className="block font-extrabold text-white text-base tracking-wide" path={["about", "team", String(idx), "name"]} fallback={mbr.name} />
                  <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-[9.5px]">
                    <InlineText as="span" className="bg-blue-950/80 text-cyan-300 px-2 py-0.5 rounded-md border border-blue-800/60 shadow-sm" path={["about", "team", String(idx), "role"]} fallback={mbr.role || ""} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
