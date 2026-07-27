"use client";

import React, { useEffect, useState } from "react";
import { useAccessibility } from "./AccessibilityContext";

interface LoaderProps {
  onComplete?: () => void;
  duration?: number; // Duration of loading in ms
}

export const CyberSecurityLoader: React.FC<LoaderProps> = ({ onComplete, duration = 2500 }) => {
  const { playAudio } = useAccessibility();
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string>("SYSTEM BOOT: Initializing firewall daemon...");

  const logs = [
    "SYSTEM BOOT: Initializing firewall daemon...",
    "ESTABLISHING: Encrypted handshake with perimeter nodes...",
    "ISOLATING: Dynamic sandbox containers...",
    "THREAT ANALYSIS: Checking current threat vectors...",
    "INTEGRITY SCAN: Verifying checksum hashes...",
    "IDENTITY CHECK: Requesting cryptographic certificate...",
    "ACCESS VERIFIED: System active and secure."
  ];

  useEffect(() => {
    playAudio("scan");
    const interval = duration / logs.length;
    let index = 0;

    const timer = setInterval(() => {
      index += 1;
      if (index < logs.length) {
        setLog(logs[index]);
        setProgress(Math.floor((index / logs.length) * 100));
      } else {
        setProgress(100);
        clearInterval(timer);
        playAudio("success");
        if (onComplete) setTimeout(onComplete, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black font-mono text-xs text-teal-400">
      <div className="relative w-80 rounded border border-teal-500/20 bg-zinc-950 p-6 shadow-[0_0_40px_rgba(20,184,166,0.15)]">
        {/* Terminal Header */}
        <div className="mb-4 flex items-center justify-between border-b border-teal-500/20 pb-2 text-[10px] uppercase text-teal-500/60">
          <span>SECURE_SOC_PORTAL_SHIELD</span>
          <span className="h-2 w-2 animate-ping rounded-full bg-teal-400" />
        </div>

        {/* Scan effect lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded bg-[linear-gradient(rgba(20,184,166,0.02)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] before:absolute before:inset-0 before:bg-[linear-gradient(transparent_0%,rgba(20,184,166,0.08)_50%,transparent_100%)] before:animate-[scan_3s_linear_infinite]" />

        {/* Log feed */}
        <div className="mb-6 min-h-[48px] overflow-hidden text-[10px] leading-normal text-teal-300">
          <p className="text-zinc-500">&gt; kloudera_soc --authenticate</p>
          <p className="mt-1 animate-pulse">{log}</p>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-teal-500/10">
          <div
            className="h-full bg-teal-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(20,184,166,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percent indicator */}
        <div className="mt-2 flex justify-between text-[9px] text-teal-500/60 font-bold">
          <span>THREAT DEFENSE SHIELD</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export const AiSolutionsLoader: React.FC<LoaderProps> = ({ onComplete, duration = 2500 }) => {
  const { playAudio } = useAccessibility();
  const [progress, setProgress] = useState(0);
  const [layer, setLayer] = useState("Initializing neural core...");

  const stages = [
    "Initializing neural core...",
    "Allocating model memory nodes...",
    "Loading attention head structures...",
    "Mapping context weight matrices...",
    "Starting pipeline vector calculations...",
    "Initializing cognitive routing agents...",
    "Synapses fired: AI model active."
  ];

  useEffect(() => {
    playAudio("scan");
    const interval = duration / stages.length;
    let index = 0;

    const timer = setInterval(() => {
      index += 1;
      if (index < stages.length) {
        setLayer(stages[index]);
        setProgress(Math.floor((index / stages.length) * 100));
      } else {
        setProgress(100);
        clearInterval(timer);
        playAudio("success");
        if (onComplete) setTimeout(onComplete, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black font-mono text-xs text-purple-400">
      <div className="relative w-80 rounded border border-purple-500/20 bg-zinc-950 p-6 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-purple-500/20 pb-2 text-[10px] uppercase text-purple-500/60">
          <span>COGNITIVE_AI_LAB_SECTOR</span>
          <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />
        </div>

        {/* Neural Signal Grid */}
        <div className="mb-4 flex justify-center gap-1.5 py-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full border border-purple-500/30 transition-all duration-300 ${
                progress > i * 15 ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] scale-110" : "bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* Text */}
        <div className="mb-6 text-[10px] text-purple-300 min-h-[30px] text-center">
          <p className="italic text-purple-400/80">{layer}</p>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-purple-500/10">
          <div
            className="h-full bg-purple-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(168,85,247,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[9px] text-purple-500/60 font-bold">
          <span>NEURAL PIPELINE INITIALIZED</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export const MicrosoftLoader: React.FC<LoaderProps> = ({ onComplete, duration = 2500 }) => {
  const { playAudio } = useAccessibility();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Syncing Azure endpoints...");

  const logs = [
    "Syncing Azure endpoints...",
    "Authenticating Entra ID credentials...",
    "Initializing Defender policy engines...",
    "Mounting Microsoft 365 cloud templates...",
    "Registering active tenant workspace...",
    "Deploying Azure app container gates...",
    "Cloud Sync complete: Workspace secure."
  ];

  useEffect(() => {
    playAudio("scan");
    const interval = duration / logs.length;
    let index = 0;

    const timer = setInterval(() => {
      index += 1;
      if (index < logs.length) {
        setStatus(logs[index]);
        setProgress(Math.floor((index / logs.length) * 100));
      } else {
        setProgress(100);
        clearInterval(timer);
        playAudio("success");
        if (onComplete) setTimeout(onComplete, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black font-mono text-xs text-blue-400">
      <div className="relative w-80 rounded border border-blue-500/20 bg-zinc-950 p-6 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-blue-500/20 pb-2 text-[10px] uppercase text-blue-500/60">
          <span>MS_CLOUD_TENANT_LINK</span>
          <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
            <span className="bg-red-500 rounded-sm" />
            <span className="bg-green-500 rounded-sm" />
            <span className="bg-blue-500 rounded-sm" />
            <span className="bg-yellow-500 rounded-sm" />
          </div>
        </div>

        {/* Text */}
        <div className="mb-6 text-[10px] text-blue-300 min-h-[30px] text-center">
          <p className="font-semibold text-blue-400">{status}</p>
        </div>

        {/* Progress */}
        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-blue-500/10">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[9px] text-blue-500/60 font-bold">
          <span>AZURE ENDPOINT LINK</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export const HardwareLoader: React.FC<LoaderProps> = ({ onComplete, duration = 2500 }) => {
  const { playAudio } = useAccessibility();
  const [progress, setProgress] = useState(0);
  const [telemetry, setTelemetry] = useState("Checking power modules...");

  const phases = [
    "Checking power modules...",
    "Sending current along motherboard traces...",
    "Syncing PCIe Generation 5 buses...",
    "Sensing VRAM chips (HBM3)...",
    "Spinning up cooling fan nodes...",
    "Running internal CUDA test loops...",
    "Hardware boot OK. Systems fully active."
  ];

  useEffect(() => {
    playAudio("scan");
    const interval = duration / phases.length;
    let index = 0;

    const timer = setInterval(() => {
      index += 1;
      if (index < phases.length) {
        setTelemetry(phases[index]);
        setProgress(Math.floor((index / phases.length) * 100));
      } else {
        setProgress(100);
        clearInterval(timer);
        playAudio("success");
        if (onComplete) setTimeout(onComplete, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black font-mono text-xs text-rose-400">
      <div className="relative w-80 rounded border border-rose-500/20 bg-zinc-950 p-6 shadow-[0_0_40px_rgba(244,63,94,0.15)]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-rose-500/20 pb-2 text-[10px] uppercase text-rose-500/60">
          <span>GPU_POWER_BOOT_CONSOLE</span>
          <span className="h-2 w-2 animate-ping rounded-full bg-rose-400" />
        </div>

        {/* Text */}
        <div className="mb-6 text-[10px] text-rose-300 min-h-[30px]">
          <p className="text-zinc-600">&gt; check_vitals --verbose</p>
          <p className="mt-1 font-semibold text-rose-400 animate-pulse">{telemetry}</p>
        </div>

        {/* Progress */}
        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-rose-500/10">
          <div
            className="h-full bg-rose-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(244,63,94,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[9px] text-rose-500/60 font-bold">
          <span>CORE SILICON TELEMETRY</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export const KnowledgeLoader: React.FC<LoaderProps> = ({ onComplete, duration = 2000 }) => {
  const { playAudio } = useAccessibility();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Indexing documents...");

  const files = [
    "Indexing whitepapers...",
    "Compiling Microsoft migration guides...",
    "Scanning cybersecurity risk indexes...",
    "Caching product brochures...",
    "Generating download links...",
    "Knowledge indexing complete."
  ];

  useEffect(() => {
    playAudio("scan");
    const interval = duration / files.length;
    let index = 0;

    const timer = setInterval(() => {
      index += 1;
      if (index < files.length) {
        setStatus(files[index]);
        setProgress(Math.floor((index / files.length) * 100));
      } else {
        setProgress(100);
        clearInterval(timer);
        playAudio("success");
        if (onComplete) setTimeout(onComplete, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black font-mono text-xs text-amber-400">
      <div className="relative w-80 rounded border border-amber-500/20 bg-zinc-950 p-6 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-amber-500/20 pb-2 text-[10px] uppercase text-amber-500/60">
          <span>KNOWLEDGE_INDEXER_DAEMON</span>
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
        </div>

        {/* Text */}
        <div className="mb-6 text-[10px] text-amber-300 min-h-[30px] text-center">
          <p className="font-semibold text-amber-400">{status}</p>
        </div>

        {/* Progress */}
        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-amber-500/10">
          <div
            className="h-full bg-amber-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(245,158,11,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[9px] text-amber-500/60 font-bold">
          <span>DOCUMENT METADATA LOG</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};
