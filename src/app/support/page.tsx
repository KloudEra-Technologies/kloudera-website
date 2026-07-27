"use client";

import React, { useState } from "react";
import { useAccessibility } from "@/components/AccessibilityContext";

export default function SupportPage() {
  const { playAudio } = useAccessibility();
  const [formData, setFormData] = useState({ name: "", email: "", ticketId: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    playAudio("click");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SUPPORT",
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: `Ticket Ref: ${formData.ticketId || "NEW"}. Details: ${formData.message}`
        })
      });

      if (res.ok) {
        playAudio("success");
        setSuccess(true);
        setFormData({ name: "", email: "", ticketId: "", subject: "", message: "" });
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
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // SECURE RESPONSE</span>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal">
            SUPPORT CORE
          </h1>
        </div>

        <button
          onClick={() => window.location.href = "/"}
          className="mt-4 sm:mt-0 px-4 py-1.5 border border-teal-500/30 text-teal-400 font-mono text-[10px] tracking-wider rounded hover:bg-teal-500/10 cursor-none transition-all"
        >
          DISCONNECT
        </button>
      </header>

      {/* Form */}
      <main className="flex-1 p-6 max-w-lg mx-auto w-full flex flex-col justify-center py-12">
        <div className="cyber-panel p-6 rounded-lg border border-teal-500/20 font-mono text-xs">
          <div className="border-b border-teal-500/10 pb-3 mb-6">
            <span className="text-[9px] text-teal-400 font-bold uppercase tracking-widest block mb-1">TICKET DAEMON</span>
            <h2 className="text-sm font-bold text-white uppercase">Log Secure Support Ticket</h2>
          </div>

          {success ? (
            <div className="text-center py-12 text-teal-400 animate-pulse font-bold uppercase tracking-widest">
              SUPPORT_TICKET_LOGGED // ACTIVE
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-500">CLIENT NAME</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-black border border-teal-500/10 rounded p-2 text-white focus:outline-none focus:border-teal-500 cursor-none text-[11px]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-500">CLIENT EMAIL</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-black border border-teal-500/10 rounded p-2 text-white focus:outline-none focus:border-teal-500 cursor-none text-[11px]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-500">EXISTING TICKET ID (IF APPLICABLE)</label>
                <input
                  type="text"
                  placeholder="KLD-XXXXX"
                  value={formData.ticketId}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticketId: e.target.value }))}
                  className="bg-black border border-teal-500/10 rounded p-2 text-white focus:outline-none focus:border-teal-500 cursor-none text-[11px]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-500">ISSUE OVERVIEW</label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="bg-black border border-teal-500/10 rounded p-2 text-white focus:outline-none focus:border-teal-500 cursor-none text-[11px]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-500">TECHNICAL DIAGNOSTICS DESCRIPTION</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="bg-black border border-teal-500/10 rounded p-2 text-white focus:outline-none focus:border-teal-500 cursor-none text-[11px]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-black font-bold uppercase rounded cursor-none transition-all shadow-[0_0_12px_rgba(20,184,166,0.3)] disabled:opacity-40"
              >
                {loading ? "COMPILING SIGNAL DATA..." : "SECURE DISPATCH"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
