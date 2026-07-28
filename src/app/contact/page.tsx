"use client";

import React, { useState, useEffect } from "react";
import { useAccessibility } from "@/components/AccessibilityContext";

const DEFAULT_OFFICES = [
  {
    name: "Bengaluru Office",
    tag: "HQ",
    address: "35/36, Shri Durga Kurupa, Thanisandra, Raechanhalli, Bengaluru, Karnataka - 560045",
    hours: "Mon - Fri, 10am - 6pm",
    phone: "+91 9899822926, +91 9390484180",
    email: "info@kloudera.ai"
  },
  {
    name: "Pune Office",
    tag: "BRANCH",
    address: "412, Tower B City Vista DownTown, Kharadi Pune - 411014 | Maharashtra | India",
    hours: "Mon - Fri, 10am - 6pm",
    phone: "+91 9899822926, +91 9390484180",
    email: "info@kloudera.ai"
  }
];

export default function ContactPage() {
  const { playAudio } = useAccessibility();
  const [formData, setFormData] = useState({ name: "", email: "", company: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Dynamic content states
  const [pageTitle, setPageTitle] = useState("Transmit General Inquiry");
  const [offices, setOffices] = useState<any[]>(DEFAULT_OFFICES);

  useEffect(() => {
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("API load failed");
      })
      .then(data => {
        if (data && data.contact) {
          if (data.contact.title) setPageTitle(data.contact.title);
          if (data.contact.offices) setOffices(data.contact.offices);
        }
      })
      .catch(err => console.log("Using fallback static copy:", err.message));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    playAudio("click");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CONTACT",
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (res.ok) {
        playAudio("success");
        setSuccess(true);
        setFormData({ name: "", email: "", company: "", subject: "", message: "" });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-teal-500/30">
      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // SECURE MAIL</span>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal">
            CONTACT CENTER
          </h1>
        </div>

        <button
          onClick={() => window.location.href = "/"}
          className="mt-4 sm:mt-0 px-4 py-1.5 border border-teal-500/30 text-teal-400 font-mono text-[10px] tracking-wider rounded hover:bg-teal-500/10 cursor-none transition-all"
        >
          DISCONNECT
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full flex flex-col justify-center py-12 space-y-12">
        
        {/* Form panel */}
        <div className="cyber-panel p-6 rounded-lg border border-teal-500/20 font-mono text-xs max-w-xl mx-auto w-full">
          <div className="border-b border-teal-500/10 pb-3 mb-6">
            <span className="text-[9px] text-teal-400 font-bold uppercase tracking-widest block mb-1">COMMS GATEWAY</span>
            <h2 className="text-sm font-bold text-white uppercase">{pageTitle}</h2>
          </div>

          {success ? (
            <div className="text-center py-12 text-teal-400 animate-pulse font-bold uppercase tracking-widest">
              MESSAGE_DISPATCHED_OK // COMPLETED
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-bold text-[10px]">SENDER NAME</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-black border border-teal-500/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500 text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-bold text-[10px]">SENDER EMAIL</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-black border border-teal-500/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 font-bold text-[10px]">COMPANY NAME (OPTIONAL)</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="bg-black border border-teal-500/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500 text-xs font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 font-bold text-[10px]">SUBJECT LINE</label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="bg-black border border-teal-500/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500 text-xs font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 font-bold text-[10px]">ENQUIRY DESCRIPTION</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="bg-black border border-teal-500/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500 text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-black font-extrabold uppercase rounded-lg cursor-pointer transition-all shadow-[0_0_15px_rgba(20,184,166,0.4)] disabled:opacity-40 text-xs tracking-wider"
              >
                {loading ? "TRANSMITTING DATA PACKET..." : "SECURE DISPATCH"}
              </button>
            </form>
          )}
        </div>

        {/* Office Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 font-mono text-xs border-t border-teal-500/10 pt-12">
          {offices.map((office, idx) => (
            <div key={idx} className="cyber-panel p-5 sm:p-6 rounded-xl border border-teal-500/20 space-y-4 bg-zinc-950/80 backdrop-blur-md">
              <div className="border-b border-teal-500/20 pb-2 flex justify-between items-center">
                <span className="font-bold text-white uppercase tracking-wider text-xs">{office.city || office.name || `OFFICE HUB ${idx + 1}`}</span>
                <span className="text-[8.5px] font-bold text-teal-400 uppercase bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">{office.tag || "HUB"}</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[10.5px]">
                {office.address}
              </p>
              <div className="space-y-1 text-[9.5px]">
                <div className="flex justify-between text-zinc-500">
                  <span>HOURS:</span>
                  <span className="text-zinc-300 font-bold">{office.hours}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>CONTACTS:</span>
                  <span className="text-zinc-300 font-bold">{office.phone}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>EMAIL:</span>
                  <span className="text-teal-400 font-bold">{office.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
