"use client";

import React, { useEffect, useState } from "react";

interface UnlockingOverlayProps {
  isVisible: boolean;
  roomName: string;
}

export const UnlockingOverlay: React.FC<UnlockingOverlayProps> = ({ isVisible, roomName }) => {
  const [status, setStatus] = useState("SECURE GATE LOCKED");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setStatus("SECURE GATE LOCKED");
      return;
    }

    // Decryption telemetry text cycles
    const timers = [
      setTimeout(() => setStatus("DECRYPTING ACCESS SIGNATURE..."), 300),
      setTimeout(() => setStatus("ROTATING MECHANICAL CYLINDERS..."), 700),
      setTimeout(() => setStatus("RETRACTING HYDRAULIC BOLTS..."), 1100),
      setTimeout(() => setStatus("ACCESS GRANTED // OPENING DOOR"), 1500),
    ];

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + 2.5));
    }, 40);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressTimer);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-black/95 font-mono select-none overflow-hidden text-teal-400">
      {/* Background cyber grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(20,184,166,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />

      <div className="relative flex flex-col items-center max-w-md w-full px-6">
        {/* Holographic Spinning Lock Rings */}
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-teal-500/20 animate-[spin_10s_linear_infinite]" />
          
          {/* Middle turning dial */}
          <div className="absolute w-40 h-40 rounded-full border border-teal-400/40 border-t-transparent border-b-transparent animate-[spin_3s_linear_infinite]" />
          
          {/* Inner mechanical dial plate */}
          <svg className="absolute w-32 h-32 text-teal-500" viewBox="0 0 100 100">
            {/* Vault teeth */}
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 6" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="15 5" className="animate-[spin_6s_reverse_linear_infinite]" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" />
            
            {/* Center keyhole icon */}
            <path d="M47 43 a 3 3 0 0 1 6 0 c 0 1.5 -1 2.5 -2 3.5 l 1.5 6.5 h -5 l 1.5 -6.5 c -1 -1 -2 -2 -2 -3.5 z" fill="currentColor" className="animate-pulse" />
          </svg>

          {/* Glowing scanner line */}
          <div className="absolute left-0 right-0 h-0.5 bg-teal-400 shadow-[0_0_15px_#14b8a6] opacity-80 animate-[bounce_2.5s_infinite_ease-in-out]" />
        </div>

        {/* Chamber Destination plaque */}
        <div className="w-full border border-teal-500/30 rounded bg-zinc-950/80 p-4 mb-6 shadow-[0_0_20px_rgba(20,184,166,0.05)] text-center">
          <span className="text-[10px] text-zinc-500 tracking-widest block uppercase mb-1">DESTINATION CHAMBER</span>
          <span className="text-sm font-bold text-white uppercase tracking-wider">{roomName}</span>
        </div>

        {/* Decryption Telemetry Details */}
        <div className="w-full text-left space-y-1 mb-6 text-[10px]">
          <div className="flex justify-between text-zinc-500">
            <span>SECURE_LINK:</span>
            <span className="text-teal-500 font-semibold">ESTABLISHED</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>DECRYPT_RATIO:</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="w-full bg-teal-950/40 h-1.5 rounded-full overflow-hidden border border-teal-950">
            <div className="bg-teal-500 h-full transition-all duration-75" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Lock Telemetry Console Line */}
        <div className="text-[11px] font-bold tracking-widest text-center uppercase animate-pulse">
          &gt;&gt; {status} &lt;&lt;
        </div>
      </div>
    </div>
  );
};
