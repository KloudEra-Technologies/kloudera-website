"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VerificationGate } from "@/components/VerificationGate";
import { CyberCommandCenter3D } from "@/components/CyberCommandCenter3D";
import { ProfessionalBlueHome } from "@/components/ProfessionalBlueHome";

export default function Home() {
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorLog, setErrorLog] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"classic" | "3d">("classic");

  useEffect(() => {
    const hasVerified = localStorage.getItem("kloudera_verified");
    if (hasVerified === "true") {
      setVerified(true);
    }
    
    // Restore saved view mode from previous session
    const savedMode = localStorage.getItem("kloudera_view_mode") as "classic" | "3d" | null;
    if (savedMode === "3d" || savedMode === "classic") {
      setViewMode(savedMode);
    }
    
    setLoading(false);

    const handleError = (e: ErrorEvent) => {
      setErrorLog(`${e.message} at ${e.filename || "unknown"}:${e.lineno || 0}`);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-view", viewMode);
    
    // Prevent 3D view on mobile devices (< 768px width)
    const checkMobile = () => {
      if (window.innerWidth < 768 && viewMode === "3d") {
        setViewMode("classic");
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      document.body.removeAttribute("data-view");
      window.removeEventListener("resize", checkMobile);
    };
  }, [viewMode]);

  const handleVerifyComplete = () => {
    setVerified(true);
  };

  const handleNavigate = (url: string) => {
    router.push(url);
  };

  const handleSetViewMode = (mode: "classic" | "3d") => {
    setViewMode(mode);
    localStorage.setItem("kloudera_view_mode", mode);
  };

  if (loading) {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-black font-mono text-cyan-400">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border border-cyan-500 border-t-transparent mb-2 inline-block" />
          <p className="text-[10px] tracking-widest uppercase">Initializing Kloudera Enterprise...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex-1 flex flex-col min-h-screen w-screen bg-[#030712]">
      {errorLog && (
        <div className="absolute top-20 left-20 z-[9999] bg-rose-950/95 border border-rose-500 text-rose-400 p-4 font-mono text-[9.5px] max-w-lg rounded shadow-lg select-text">
          CRITICAL_JS_ERROR: {errorLog}
        </div>
      )}
      {!verified ? (
        <VerificationGate onVerifyComplete={handleVerifyComplete} />
      ) : viewMode === "classic" ? (
        <ProfessionalBlueHome onLaunch3D={() => handleSetViewMode("3d")} />
      ) : (
        <div className="relative h-screen w-screen overflow-hidden">
          {/* Exit 3D View Floating Button */}
          <button
            onClick={() => handleSetViewMode("classic")}
            className="fixed top-6 left-6 z-[999] flex items-center gap-2 rounded-full border border-cyan-500/40 bg-slate-950/90 px-4 py-2 text-xs font-bold font-mono text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md transition-all hover:scale-105 hover:border-cyan-400 hover:bg-slate-900 cursor-pointer"
          >
            <span>←</span>
            <span>RETURN TO PROFESSIONAL VIEW</span>
          </button>
          <CyberCommandCenter3D onNavigate={handleNavigate} />
        </div>
      )}
    </main>
  );
}
