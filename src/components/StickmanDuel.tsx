"use client";

import React from "react";

export const StickmanDuel: React.FC = () => {
  return (
    <div className="relative w-44 h-11 flex items-center justify-center overflow-hidden select-none pointer-events-none opacity-80">
      <style>{`
        /* --- STICKMAN ANIMATION TIMELINE --- */
        
        /* Left Fighter Animation (Cyan Aura / Blade) */
        @keyframes fighter-left {
          0%, 10% { /* Idle Standing Ready */
            transform: translateX(-40px) scaleX(1);
          }
          15%, 25% { /* Aura Emit (Pulsing back) */
            transform: translateX(-42px) scaleX(1) skewY(-3deg);
          }
          30%, 40% { /* Draw Blade / Stance shift */
            transform: translateX(-35px) scaleX(1) skewY(2deg);
          }
          45%, 60% { /* Dash & Clash */
            transform: translateX(-5px) scaleX(1) translateY(-2px);
          }
          65%, 80% { /* Blowback & Slide Recoil */
            transform: translateX(-50px) scaleX(-1) translateY(2px);
          }
          85%, 100% { /* Stand up and return to stance */
            transform: translateX(-40px) scaleX(1);
          }
        }

        /* Right Fighter Animation (Purple Aura / Blade) */
        @keyframes fighter-right {
          0%, 10% { /* Idle Standing Ready */
            transform: translateX(40px) scaleX(-1);
          }
          15%, 25% { /* Aura Emit */
            transform: translateX(42px) scaleX(-1) skewY(-3deg);
          }
          30%, 40% { /* Draw Blade */
            transform: translateX(35px) scaleX(-1) skewY(2deg);
          }
          45%, 60% { /* Dash & Clash */
            transform: translateX(5px) scaleX(-1) translateY(-2px);
          }
          65%, 80% { /* Blowback & Slide Recoil */
            transform: translateX(50px) scaleX(1) translateY(2px);
          }
          85%, 100% { /* Stand up and return to stance */
            transform: translateX(40px) scaleX(-1);
          }
        }

        /* Aura Animations */
        @keyframes aura-pulse-left {
          0%, 10%, 65%, 100% { opacity: 0; filter: blur(4px); }
          15%, 40% { opacity: 0.6; filter: blur(5px); }
          45%, 60% { opacity: 0.95; filter: blur(3px); }
        }
        @keyframes aura-pulse-right {
          0%, 10%, 65%, 100% { opacity: 0; filter: blur(4px); }
          15%, 40% { opacity: 0.6; filter: blur(5px); }
          45%, 60% { opacity: 0.95; filter: blur(3px); }
        }

        /* Blade drawing and rotation animations */
        @keyframes blade-left {
          0%, 25%, 80%, 100% { transform: scale(0) rotate(-45deg); opacity: 0; }
          30%, 40% { transform: scale(1) rotate(-10deg); opacity: 0.9; }
          45%, 60% { transform: scale(1.1) rotate(35deg); opacity: 1; }
        }
        @keyframes blade-right {
          0%, 25%, 80%, 100% { transform: scale(0) rotate(-45deg); opacity: 0; }
          30%, 40% { transform: scale(1) rotate(-10deg); opacity: 0.9; }
          45%, 60% { transform: scale(1.1) rotate(35deg); opacity: 1; }
        }

        /* Spark particle animation */
        @keyframes clash-sparks {
          0%, 44%, 61%, 100% { opacity: 0; transform: scale(0); }
          45%, 58% { opacity: 1; transform: scale(1.2); }
        }

        /* Applying animations */
        .ani-fighter-left {
          animation: fighter-left 8s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .ani-fighter-right {
          animation: fighter-right 8s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .ani-aura-left {
          animation: aura-pulse-left 8s ease-in-out infinite;
        }
        .ani-aura-right {
          animation: aura-pulse-right 8s ease-in-out infinite;
        }
        .ani-blade-left {
          animation: blade-left 8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          transform-origin: 6px 16px;
        }
        .ani-blade-right {
          animation: blade-right 8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          transform-origin: 6px 16px;
        }
        .ani-sparks {
          animation: clash-sparks 8s ease-out infinite;
        }
      `}</style>

      {/* Sparks Layer */}
      <svg className="absolute w-full h-full ani-sparks z-10" viewBox="0 0 160 40">
        <circle cx="80" cy="20" r="3" fill="#ffffff" filter="drop-shadow(0 0 4px #06b6d4)" />
        <circle cx="78" cy="18" r="1.5" fill="#22d3ee" />
        <circle cx="82" cy="22" r="1.5" fill="#c084fc" />
        <path d="M 80 20 L 73 15 M 80 20 L 87 25 M 80 20 L 74 24 M 80 20 L 86 14" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
      </svg>

      <svg className="w-full h-full" viewBox="0 0 160 40">
        {/* Left Fighter */}
        <g className="ani-fighter-left">
          {/* Cyan Aura */}
          <circle cx="12" cy="18" r="10" fill="none" stroke="#22d3ee" strokeWidth="3" className="ani-aura-left opacity-0" />
          
          {/* Stickman Body Elements */}
          {/* Head */}
          <circle cx="12" cy="12" r="3" fill="#ffffff" stroke="#22d3ee" strokeWidth="1" />
          {/* Spine */}
          <line x1="12" y1="15" x2="12" y2="24" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          {/* Left Arm (holding blade) */}
          <line x1="12" y1="17" x2="19" y2="21" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          {/* Right Arm (guarding) */}
          <line x1="12" y1="17" x2="7" y2="21" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          {/* Left Leg */}
          <line x1="12" y1="24" x2="16" y2="33" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          {/* Right Leg */}
          <line x1="12" y1="24" x2="8" y2="33" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />

          {/* Cyan Blade */}
          <g className="ani-blade-left" style={{ transformOrigin: "12px 18px" }}>
            <line x1="12" y1="18" x2="28" y2="6" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 4px #06b6d4)" />
            <line x1="12" y1="18" x2="28" y2="6" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" />
          </g>
        </g>

        {/* Right Fighter */}
        <g className="ani-fighter-right">
          {/* Purple Aura */}
          <circle cx="12" cy="18" r="10" fill="none" stroke="#c084fc" strokeWidth="3" className="ani-aura-right opacity-0" />
          
          {/* Stickman Body Elements */}
          {/* Head */}
          <circle cx="12" cy="12" r="3" fill="#ffffff" stroke="#c084fc" strokeWidth="1" />
          {/* Spine */}
          <line x1="12" y1="15" x2="12" y2="24" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          {/* Left Arm */}
          <line x1="12" y1="17" x2="19" y2="21" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          {/* Right Arm */}
          <line x1="12" y1="17" x2="7" y2="21" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          {/* Left Leg */}
          <line x1="12" y1="24" x2="16" y2="33" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          {/* Right Leg */}
          <line x1="12" y1="24" x2="8" y2="33" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />

          {/* Purple Blade */}
          <g className="ani-blade-right" style={{ transformOrigin: "12px 18px" }}>
            <line x1="12" y1="18" x2="28" y2="6" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 4px #a855f7)" />
            <line x1="12" y1="18" x2="28" y2="6" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
};
