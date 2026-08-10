"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KloudEraLogo } from "@/components/KloudEraLogo";

export default function TestEmailDispatchPage() {
  const [email, setEmail] = useState("info@kloudera.ai");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail: email })
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ success: false, status: "CLIENT_ERROR", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 flex flex-col font-sans justify-center items-center p-6">
      <div className="max-w-md w-full bg-zinc-950 border border-teal-500/30 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <KloudEraLogo className="h-10 w-auto text-cyan-400 mx-auto" />
          </Link>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Email Dispatch Test</h1>
          <p className="text-xs text-zinc-400 font-mono">Verify Vercel environment variables & Resend API connection status.</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">Recipient Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 w-full"
              placeholder="e.g. info@kloudera.ai"
            />
          </div>

          <button
            onClick={handleTest}
            disabled={loading}
            className="w-full py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-500/20 text-black font-bold uppercase rounded-lg transition-colors text-center text-xs tracking-wider"
          >
            {loading ? "Sending test mail..." : "Send Test Email"}
          </button>
        </div>

        {result && (
          <div className="border border-zinc-800 p-4 rounded-xl bg-zinc-900/40 space-y-3 font-mono text-[10px]">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">STATUS:</span>
              <span className={result.success ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                {result.status || (result.success ? "SUCCESS" : "ERROR")}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 block">API RESPONSE DETAILS:</span>
              <pre className="text-zinc-300 bg-black/60 p-3 rounded-lg overflow-x-auto max-h-48 text-[9px] leading-relaxed">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
