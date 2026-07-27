"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type PerformanceMode = "high" | "balanced" | "lite";

interface AccessibilityContextProps {
  performanceMode: PerformanceMode;
  reducedMotion: boolean;
  highContrast: boolean;
  soundEffects: boolean;
  setPerformanceMode: (mode: PerformanceMode) => void;
  setReducedMotion: (val: boolean) => void;
  setHighContrast: (val: boolean) => void;
  setSoundEffects: (val: boolean) => void;
  playAudio: (type: "click" | "scan" | "success" | "hover" | "transition") => void;
}

const AccessibilityContext = createContext<AccessibilityContextProps | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [performanceMode, setPerformanceModeState] = useState<PerformanceMode>("balanced");
  const [reducedMotion, setReducedMotionState] = useState<boolean>(false);
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [soundEffects, setSoundEffectsState] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage on mount
    const savedPerf = localStorage.getItem("kloudera_perf") as PerformanceMode;
    const savedMotion = localStorage.getItem("kloudera_motion");
    const savedContrast = localStorage.getItem("kloudera_contrast");
    const savedSound = localStorage.getItem("kloudera_sound");

    if (savedPerf) setPerformanceModeState(savedPerf);
    if (savedMotion) setReducedMotionState(savedMotion === "true");
    if (savedContrast) setHighContrastState(savedContrast === "true");
    if (savedSound) setSoundEffectsState(savedSound === "true");

    setMounted(true);
  }, []);

  const setPerformanceMode = (mode: PerformanceMode) => {
    setPerformanceModeState(mode);
    localStorage.setItem("kloudera_perf", mode);
  };

  const setReducedMotion = (val: boolean) => {
    setReducedMotionState(val);
    localStorage.setItem("kloudera_motion", String(val));
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    localStorage.setItem("kloudera_contrast", String(val));
  };

  const setSoundEffects = (val: boolean) => {
    setSoundEffectsState(val);
    localStorage.setItem("kloudera_sound", String(val));
  };

  const playAudio = (type: "click" | "scan" | "success" | "hover" | "transition") => {
    if (!soundEffects || typeof window === "undefined") return;

    try {
      let oscType: OscillatorType = "sine";
      let freq = 440;
      let duration = 0.1;
      let gainVal = 0.05;

      switch (type) {
        case "click":
          oscType = "triangle";
          freq = 800;
          duration = 0.05;
          break;
        case "scan":
          oscType = "sawtooth";
          freq = 150;
          duration = 0.3;
          gainVal = 0.02;
          break;
        case "success":
          oscType = "sine";
          freq = 600;
          duration = 0.4;
          break;
        case "hover":
          oscType = "sine";
          freq = 1000;
          duration = 0.02;
          gainVal = 0.01;
          break;
        case "transition":
          oscType = "sine";
          freq = 300;
          duration = 0.6;
          gainVal = 0.03;
          break;
      }

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = oscType;
      
      if (type === "scan") {
        // Sweep frequency
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 3, audioCtx.currentTime + duration);
      } else if (type === "success") {
        // Arpeggio
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.setValueAtTime(500, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.2);
        osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      }

      gainNode.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  };

  const contextValue: AccessibilityContextProps = {
    performanceMode,
    reducedMotion,
    highContrast,
    soundEffects,
    setPerformanceMode,
    setReducedMotion,
    setHighContrast,
    setSoundEffects,
    playAudio,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      <div className={`h-full w-full flex flex-col ${highContrast ? "high-contrast" : ""}`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const SettingsPanel: React.FC = () => {
  const {
    performanceMode,
    reducedMotion,
    highContrast,
    soundEffects,
    setPerformanceMode,
    setReducedMotion,
    setHighContrast,
    setSoundEffects,
    playAudio
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    setIsIframe(window.self !== window.top);
  }, []);

  if (isIframe) return null;

  return (
    <>
      {/* Slide-out Settings Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div 
            className="absolute inset-0" 
            onClick={() => {
              setIsOpen(false);
              playAudio("click");
            }} 
          />
          <div className="relative h-full w-full max-w-md border-l border-teal-500/20 bg-zinc-950/95 p-8 text-zinc-100 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md sm:w-96 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="mb-8 flex items-center justify-between border-b border-teal-500/20 pb-4">
                <h2 className="text-xl font-bold tracking-wider text-teal-400 font-mono">SYSTEM INTERFACE CONFIG</h2>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    playAudio("click");
                  }}
                  className="text-zinc-400 hover:text-white cursor-none"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Performance Setting */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-teal-400/80 font-mono">HQ RENDER MODE</label>
                <div className="grid grid-cols-3 gap-2 bg-black/40 p-1 rounded-md border border-teal-500/10">
                  {(["lite", "balanced", "high"] as PerformanceMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setPerformanceMode(mode);
                        playAudio("click");
                      }}
                      className={`py-2 text-xs font-bold uppercase rounded transition-all cursor-none ${
                        performanceMode === mode
                          ? "bg-teal-500 text-black shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                          : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-zinc-500 leading-normal">
                  Scale visual physics and particle render frequencies. Lite is optimal for portable smartphones.
                </p>
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                {/* Sound Effects */}
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-md border border-teal-500/5">
                  <div>
                    <span className="block text-sm font-semibold text-zinc-300 font-mono">SOUND TELEMETRY</span>
                    <span className="text-[10px] text-zinc-500">Audio feedback scan alerts.</span>
                  </div>
                  <button
                    onClick={() => {
                      setSoundEffects(!soundEffects);
                      // Play feedback on toggle
                      if (!soundEffects) {
                        setTimeout(() => {
                          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                          const osc = audioCtx.createOscillator();
                          const gainNode = audioCtx.createGain();
                          osc.type = "sine";
                          osc.frequency.setValueAtTime(600, audioCtx.currentTime);
                          gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
                          gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
                          osc.connect(gainNode);
                          gainNode.connect(audioCtx.destination);
                          osc.start();
                          osc.stop(audioCtx.currentTime + 0.1);
                        }, 50);
                      }
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-none ${
                      soundEffects ? "bg-teal-500" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        soundEffects ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-md border border-teal-500/5">
                  <div>
                    <span className="block text-sm font-semibold text-zinc-300 font-mono">REDUCED MOTION</span>
                    <span className="text-[10px] text-zinc-500">Disable 3D fly-through corridors.</span>
                  </div>
                  <button
                    onClick={() => {
                      setReducedMotion(!reducedMotion);
                      playAudio("click");
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-none ${
                      reducedMotion ? "bg-teal-500" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        reducedMotion ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between bg-black/20 p-3 rounded-md border border-teal-500/5">
                  <div>
                    <span className="block text-sm font-semibold text-zinc-300 font-mono">HIGH CONTRAST</span>
                    <span className="text-[10px] text-zinc-500">Maximize readable text contours.</span>
                  </div>
                  <button
                    onClick={() => {
                      setHighContrast(!highContrast);
                      playAudio("click");
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-none ${
                      highContrast ? "bg-teal-500" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        highContrast ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-teal-500/10 pt-4 text-center">
              <span className="font-mono text-[9px] text-teal-500/40 uppercase tracking-widest">
                KLOUDERA COMMAND LAYER v4.8.0
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
