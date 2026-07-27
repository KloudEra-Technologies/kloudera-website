"use client";

import React, { useEffect, useState } from "react";
import { useAccessibility } from "./AccessibilityContext";

interface VerificationGateProps {
  onVerifyComplete: () => void;
}

export const VerificationGate: React.FC<VerificationGateProps> = ({ onVerifyComplete }) => {
  const { playAudio, performanceMode } = useAccessibility();
  const [stage, setStage] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [ipAddress, setIpAddress] = useState("127.0.0.1");
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasVisited, setHasVisited] = useState(true); // Default true, sets false if not visited

  useEffect(() => {
    // Auto-bypass if inside preview iframe or url has preview=true
    const isIframe = typeof window !== "undefined" && (window.self !== window.top || window.location.search.includes("preview=true"));
    if (isIframe) {
      onVerifyComplete();
      return;
    }

    // Check if user verified previously
    const verified = localStorage.getItem("kloudera_verified");
    if (verified === "true") {
      onVerifyComplete();
      return;
    }

    setHasVisited(false);
    playAudio("scan");

    // Fetch or mock client IP
    setIpAddress(`192.168.10.${Math.floor(Math.random() * 254) + 1}`);

    // Steps progression
    const steps = [
      "SECURE TUNNEL: Establishing connection...",
      "PACKET AUDITING: Sniffing active ports...",
      "AI INTRUSION Posture: Scan running...",
      "CLIENT SIGNATURE: Generating token hashes...",
      "VERIFICATION STATE: ACCESS APPROVED."
    ];

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setMessages((prev) => [...prev, steps[currentStep]]);
        setStage(currentStep);
        setProgress(Math.floor(((currentStep + 1) / steps.length) * 100));
        currentStep += 1;
        playAudio("click");
      } else {
        clearInterval(stepInterval);
        setIsUnlocked(true);
        playAudio("success");
        // Save verification flag
        localStorage.setItem("kloudera_verified", "true");
        // Triggers the vault door opening transition
        setTimeout(() => {
          onVerifyComplete();
        }, 1200); // Wait for vault door animation to slide out
      }
    }, 700);

    return () => clearInterval(stepInterval);
  }, []);

  const handleSkip = () => {
    playAudio("click");
    localStorage.setItem("kloudera_verified", "true");
    setIsUnlocked(true);
    setTimeout(() => {
      onVerifyComplete();
    }, 500);
  };

  if (hasVisited) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black font-mono select-none overflow-hidden transition-all duration-1000 ${
        isUnlocked ? "pointer-events-none opacity-0" : ""
      }`}
    >
      {/* Vault Left Door */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1/2 border-r border-teal-500/20 bg-zinc-950 transition-transform duration-[1000ms] cubic-bezier(0.85, 0, 0.15, 1) ${
          isUnlocked ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(20,184,166,0.03)_0%,transparent_70%)]" />
      </div>

      {/* Vault Right Door */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-1/2 border-l border-teal-500/20 bg-zinc-950 transition-transform duration-[1000ms] cubic-bezier(0.85, 0, 0.15, 1) ${
          isUnlocked ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(20,184,166,0.03)_0%,transparent_70%)]" />
      </div>

      {/* Centered Security Grid console */}
      <div
        className={`relative z-10 w-full max-w-lg p-4 sm:p-8 rounded-xl border border-teal-500/20 bg-black/70 backdrop-blur-md shadow-[0_0_50px_rgba(20,184,166,0.1)] transition-transform duration-500 mx-4 ${
          isUnlocked ? "scale-90 opacity-0" : "scale-100"
        }`}
      >
        {/* Holographic scanner laser line */}
        {performanceMode !== "lite" && !isUnlocked && (
          <div className="absolute inset-x-0 top-0 h-[2px] bg-teal-400 shadow-[0_0_15px_rgba(20,184,166,1)] animate-[laser_3s_infinite_linear]" />
        )}

        {/* Console Header */}
        <div className="flex items-center justify-between border-b border-teal-500/20 pb-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-ping rounded-full bg-teal-400 shrink-0" />
            <span className="text-teal-400 font-bold tracking-widest text-[10px] sm:text-xs">SECURITY PROTOCOL INTERFACE</span>
          </div>
          <span className="text-zinc-500 text-[9px] sm:text-[10px]">VER_6.2.0-TLS</span>
        </div>

        {/* Connection logs */}
        <div className="space-y-2 text-[10px] leading-relaxed text-zinc-300 min-h-[120px] sm:min-h-[140px] border border-teal-500/10 bg-black/40 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-1 text-[9px] sm:text-[10px] text-zinc-400 border-b border-teal-500/10 pb-1.5 font-mono">
            <span>RESOLVED IP: {ipAddress}</span>
            <span>THREAT RATING: 0.00% (SAFE)</span>
          </div>
          <div className="space-y-1.5 mt-2 h-20 sm:h-24 overflow-y-auto scrollbar-none font-mono">
            {messages.map((msg, i) => (
              <p key={i} className={i === messages.length - 1 ? "text-teal-400 font-semibold animate-pulse" : "text-teal-500/80"}>
                &gt; {msg}
              </p>
            ))}
          </div>
        </div>

        {/* Progress Bar & Skip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-6 font-mono">
          <div className="flex-1">
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-teal-500/10">
              <div
                className="h-full bg-teal-500 transition-all duration-500 shadow-[0_0_10px_rgba(20,184,166,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[8px] text-teal-500/60 font-bold">
              <span>SCANNING HOST SYSTEM</span>
              <span>{progress}%</span>
            </div>
          </div>

          <button
            onClick={handleSkip}
            className="px-4 py-2 bg-teal-500/10 border border-teal-500/40 text-teal-300 text-[10px] tracking-widest rounded-lg hover:bg-teal-500/20 hover:border-teal-400 cursor-pointer transition-all text-center font-bold shadow-md"
          >
            BYPASS_GATE
          </button>
        </div>
      </div>

      {/* CSS Animation for laser sweep */}
      <style jsx global>{`
        @keyframes laser {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
