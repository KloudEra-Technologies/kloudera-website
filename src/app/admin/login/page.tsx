"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useAccessibility } from "@/components/AccessibilityContext";

export default function AdminLoginPage() {
  const { playAudio } = useAccessibility();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playAudio("click");
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password
      });

      if (res?.error) {
        setError("AUTHENTICATION FAILED: Invalid credentials signature.");
        playAudio("scan");
        setLoading(false);
      } else {
        playAudio("success");
        // Redirect to admin panel
        window.location.href = "/admin";
      }
    } catch (err) {
      setError("SYSTEM EXCEPTION: Unable to contact auth database.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100 flex items-center justify-center font-mono select-none overflow-hidden">
      <div className="absolute inset-0 pointer-events-none cyber-grid animate-grid-flow opacity-10" />

      {/* Login Box */}
      <div className="relative z-10 w-full max-w-sm p-8 rounded-lg border border-teal-500/20 bg-black/80 backdrop-blur-md shadow-[0_0_40px_rgba(20,184,166,0.1)]">
        {/* Header */}
        <div className="border-b border-teal-500/20 pb-3 mb-6 text-center">
          <span className="text-[9px] font-bold text-teal-400 tracking-widest uppercase block mb-1">COMMAND DECK INTERFACE</span>
          <h1 className="text-md font-bold text-white uppercase tracking-wider">ADMIN SECURE LOGIN</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-rose-500/30 bg-rose-950/20 text-rose-400 text-[10px] rounded leading-normal">
            &gt; {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-500 font-bold uppercase tracking-wider">SECURITY MAIL</label>
            <input
              required
              type="email"
              placeholder="admin@kloudera.tech"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border border-teal-500/10 rounded p-2 text-white focus:outline-none focus:border-teal-500 cursor-none text-[11px]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-500 font-bold uppercase tracking-wider">PASSCODE HASH</label>
            <input
              required
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border border-teal-500/10 rounded p-2 text-white focus:outline-none focus:border-teal-500 cursor-none text-[11px]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-teal-500 hover:bg-teal-400 text-black font-bold uppercase rounded cursor-none transition-all shadow-[0_0_12px_rgba(20,184,166,0.3)] disabled:opacity-40"
          >
            {loading ? "DECRYPTING KEY..." : "TRANSMIT ACCESS TOKEN"}
          </button>
        </form>
      </div>
    </main>
  );
}
