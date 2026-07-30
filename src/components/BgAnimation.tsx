'use client';
import React from 'react';

type BgVariant = 'home' | 'certifications' | 'partners' | 'careers' | 'about' | 'default';

interface BgAnimationProps {
  variant?: BgVariant;
  className?: string;
}

/* ─────────────────────────────────────────────
   Shared wrapper style
───────────────────────────────────────────── */
const wrapperStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 0,
};

/* ─────────────────────────────────────────────
   HOME — Matrix falling binary digits
   20 columns, pre-computed positions & durations
───────────────────────────────────────────── */

// Pre-computed column data: [leftPct, durationSec, delaySec, digits string]
const MATRIX_COLUMNS: [number, number, number, string][] = [
  [2,  7,  0,   '1 0 1 1 0 0 1 0 1 1 0 1 0 0 1'],
  [7,  9,  1.2, '0 1 0 0 1 1 0 1 0 0 1 0 1 1 0'],
  [12, 6,  0.4, '1 1 0 1 0 1 1 0 0 1 1 0 1 0 1'],
  [17, 11, 2.1, '0 0 1 0 1 0 0 1 1 0 0 1 0 1 0'],
  [22, 8,  0.8, '1 0 0 1 1 1 0 0 1 0 1 1 0 0 1'],
  [27, 7,  3.0, '0 1 1 0 0 0 1 1 0 1 0 0 1 1 0'],
  [32, 10, 1.5, '1 1 1 0 1 0 1 0 0 1 0 1 0 1 1'],
  [37, 6,  0.2, '0 0 0 1 0 1 0 1 1 0 1 0 1 0 0'],
  [42, 9,  2.5, '1 0 1 0 0 1 1 1 0 0 1 1 0 1 0'],
  [47, 12, 0.6, '0 1 0 1 1 0 0 0 1 1 0 0 1 0 1'],
  [52, 7,  1.8, '1 1 0 0 1 0 1 1 0 1 1 0 0 1 1'],
  [57, 8,  3.3, '0 0 1 1 0 1 0 0 1 0 0 1 1 0 0'],
  [62, 10, 0.9, '1 0 0 0 1 1 0 1 0 1 0 1 0 1 0'],
  [67, 6,  2.2, '0 1 1 1 0 0 1 0 1 0 1 0 1 0 1'],
  [72, 9,  1.1, '1 0 1 0 1 0 0 1 1 0 1 1 0 0 1'],
  [77, 7,  3.7, '0 1 0 1 0 1 1 0 0 1 0 0 1 1 0'],
  [82, 11, 0.3, '1 1 0 1 1 0 1 0 1 0 1 0 0 1 1'],
  [87, 8,  2.8, '0 0 1 0 0 1 0 1 0 1 0 1 1 0 0'],
  [92, 6,  1.4, '1 0 0 1 0 0 1 1 0 0 1 0 1 1 0'],
  [97, 10, 0.7, '0 1 1 0 1 1 0 0 1 1 0 1 0 0 1'],
];

function HomeAnimation() {
  return (
    <div style={wrapperStyle}>
      <style>{`
        @keyframes matrixFall {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.07; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
      `}</style>
      {MATRIX_COLUMNS.map(([left, dur, delay, digits], i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: `${left}%`,
            color: '#00ff41',
            fontSize: '13px',
            fontFamily: 'monospace',
            lineHeight: '1.8',
            whiteSpace: 'pre',
            opacity: 0.07,
            animation: `matrixFall ${dur}s linear ${delay}s infinite`,
            userSelect: 'none',
          }}
        >
          {digits.split(' ').join('\n')}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CERTIFICATIONS — Floating shield/lock icons
───────────────────────────────────────────── */

// Pre-computed: [leftPct, topPct, durationSec, delaySec, scale, iconType]
const CERT_ICONS: [number, number, number, number, number, 'shield' | 'lock'][] = [
  [5,  80, 12, 0,   1.0, 'shield'],
  [15, 70, 14, 1.5, 0.8, 'lock'],
  [25, 85, 11, 3.0, 1.2, 'shield'],
  [35, 75, 13, 0.8, 0.9, 'lock'],
  [45, 90, 15, 2.2, 1.1, 'shield'],
  [55, 65, 12, 4.1, 0.7, 'lock'],
  [65, 80, 14, 1.0, 1.3, 'shield'],
  [75, 72, 11, 3.5, 0.8, 'lock'],
  [85, 88, 13, 0.3, 1.0, 'shield'],
  [92, 60, 16, 2.7, 0.9, 'lock'],
  [10, 55, 12, 5.0, 0.6, 'shield'],
  [50, 50, 15, 1.8, 0.8, 'lock'],
];

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
        fill="#10b981"
        fillOpacity="0.6"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="#10b981"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" fill="#10b981" fillOpacity="0.6" />
      <path
        d="M8 11V7a4 4 0 018 0v4"
        stroke="#10b981"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1.5" fill="#ffffff" fillOpacity="0.5" />
    </svg>
  );
}

function CertificationsAnimation() {
  return (
    <div style={wrapperStyle}>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0); opacity: 0; }
          15%  { opacity: 0.1; }
          85%  { opacity: 0.08; }
          100% { transform: translateY(-120px); opacity: 0; }
        }
      `}</style>
      {CERT_ICONS.map(([left, top, dur, delay, scale, type], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            opacity: 0,
            transform: `scale(${scale})`,
            animation: `floatUp ${dur}s ease-in-out ${delay}s infinite`,
          }}
        >
          {type === 'shield' ? <ShieldIcon /> : <LockIcon />}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PARTNERS — Network nodes + connecting lines
───────────────────────────────────────────── */

const NODES: [number, number][] = [
  [10, 20], [30, 15], [55, 25], [75, 10], [90, 30],
  [20, 50], [45, 45], [70, 55], [85, 40], [15, 75],
  [40, 70], [60, 80], [80, 70], [50, 90], [25, 85],
];

const EDGES: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],[4,8],[0,5],[1,6],[2,6],
  [3,8],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],
  [12,7],[10,6],[11,13],[13,12],[9,14],[14,10],
];

function PartnersAnimation() {
  return (
    <div style={wrapperStyle}>
      <style>{`
        @keyframes nodePulse {
          0%, 100% { opacity: 0.09; }
          50%       { opacity: 0.12; }
        }
        @keyframes linePulse {
          0%, 100% { stroke-opacity: 0.04; }
          50%       { stroke-opacity: 0.10; }
        }
      `}</style>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}
      >
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a][0]} y1={NODES[a][1]}
            x2={NODES[b][0]} y2={NODES[b][1]}
            stroke="#06b6d4"
            strokeWidth="0.3"
            style={{
              animation: `linePulse ${3 + (i % 4)}s ease-in-out ${(i * 0.3) % 3}s infinite`,
            }}
          />
        ))}
        {NODES.map(([x, y], i) => (
          <circle
            key={i}
            cx={x} cy={y} r={3}
            fill="#06b6d4"
            style={{
              animation: `nodePulse ${3 + (i % 3)}s ease-in-out ${(i * 0.4) % 2.5}s infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CAREERS — Slowly rotating hexagons grid
───────────────────────────────────────────── */

const HEXAGONS: [number, number, number, number, number, number][] = [
  [10,  15, 40, 20, 0,   4],
  [30,  10, 50, 25, 2,   5],
  [55,  20, 35, 18, 1,   4],
  [75,  8,  45, 22, 3,   6],
  [90,  25, 38, 28, 0.5, 4],
  [5,   45, 42, 20, 1.5, 5],
  [25,  50, 55, 24, 0,   5],
  [50,  40, 38, 19, 2.5, 4],
  [70,  48, 48, 26, 1,   6],
  [88,  55, 36, 21, 3.5, 4],
  [15,  72, 44, 23, 0.8, 5],
  [40,  78, 52, 27, 1.2, 4],
  [62,  68, 40, 20, 2,   5],
  [82,  80, 46, 25, 0.3, 6],
  [95,  70, 34, 18, 1.8, 4],
];

function hexPoints(cx: number, cy: number, size: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`;
  }).join(' ');
}

function CareersAnimation() {
  return (
    <div style={wrapperStyle}>
      <style>{`
        @keyframes hexSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes hexPulse {
          0%, 100% { opacity: 0.05; }
          50%       { opacity: 0.10; }
        }
      `}</style>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}
      >
        {HEXAGONS.map(([cx, cy, size, rotDur, rotDelay, pulseDur], i) => (
          <polygon
            key={i}
            points={hexPoints(cx, cy, size / 10)}
            fill="none"
            stroke="#6366f1"
            strokeWidth="0.3"
            style={{
              transformOrigin: `${cx}% ${cy}%`,
              animation: [
                `hexSpin ${rotDur}s linear ${rotDelay}s infinite`,
                `hexPulse ${pulseDur}s ease-in-out ${rotDelay * 0.5}s infinite`,
              ].join(', '),
              opacity: 0.07,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ABOUT — Circuit board trace lines
───────────────────────────────────────────── */

const H_TRACES: [number, number, number, number, number][] = [
  [10, 5,  45, 5, 0],
  [10, 60, 95, 6, 1],
  [25, 10, 40, 5, 2],
  [25, 55, 90, 7, 0.5],
  [40, 5,  30, 6, 1.5],
  [40, 45, 80, 5, 3],
  [55, 15, 50, 7, 0],
  [55, 65, 95, 6, 2],
  [70, 5,  35, 5, 1],
  [70, 50, 85, 6, 0.8],
  [85, 10, 45, 7, 2.5],
  [85, 60, 92, 5, 0],
];

const V_TRACES: [number, number, number, number, number][] = [
  [20, 5,  35, 6, 0.5],
  [20, 45, 75, 5, 2],
  [35, 10, 55, 7, 1],
  [50, 5,  30, 6, 0],
  [50, 50, 90, 5, 3],
  [65, 15, 45, 6, 1.5],
  [80, 5,  40, 7, 0.8],
  [80, 55, 90, 5, 2.2],
];

const CIRCUIT_DOTS: [number, number][] = [
  [20, 10], [20, 25], [35, 25], [35, 40], [50, 10],
  [50, 25], [50, 55], [65, 40], [80, 10], [80, 40],
  [20, 55], [20, 70], [35, 55], [50, 70], [65, 70],
  [80, 70], [80, 85],
];

function AboutAnimation() {
  return (
    <div style={wrapperStyle}>
      <style>{`
        @keyframes tracePulse {
          0%, 100% { stroke-opacity: 0.04; }
          50%       { stroke-opacity: 0.10; }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 0.05; }
          50%       { opacity: 0.12; }
        }
      `}</style>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}
      >
        {H_TRACES.map(([y, x1, x2, dur, delay], i) => (
          <line
            key={`h${i}`}
            x1={x1} y1={y} x2={x2} y2={y}
            stroke="#3b82f6"
            strokeWidth="0.25"
            style={{
              animation: `tracePulse ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        ))}
        {V_TRACES.map(([x, y1, y2, dur, delay], i) => (
          <line
            key={`v${i}`}
            x1={x} y1={y1} x2={x} y2={y2}
            stroke="#3b82f6"
            strokeWidth="0.25"
            style={{
              animation: `tracePulse ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        ))}
        {CIRCUIT_DOTS.map(([cx, cy], i) => (
          <circle
            key={`d${i}`}
            cx={cx} cy={cy} r={0.7}
            fill="#3b82f6"
            style={{
              animation: `dotBlink ${3 + (i % 3)}s ease-in-out ${(i * 0.3) % 2}s infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DEFAULT — Floating particles drifting upward
───────────────────────────────────────────── */

const PARTICLES: [number, number, number, number, number][] = [
  [5,  90, 4, 12, 0],
  [12, 80, 3, 15, 1.5],
  [20, 95, 5, 11, 3],
  [28, 85, 3, 14, 0.7],
  [36, 70, 4, 13, 2.2],
  [44, 92, 6, 16, 4],
  [52, 78, 3, 12, 1],
  [60, 88, 5, 14, 3.5],
  [68, 75, 4, 11, 0.3],
  [76, 93, 3, 15, 2.8],
  [84, 82, 5, 13, 1.2],
  [91, 68, 4, 16, 4.5],
  [8,  60, 3, 12, 2],
  [23, 65, 5, 14, 0.5],
  [47, 55, 4, 11, 3.2],
  [70, 62, 3, 13, 1.8],
  [88, 58, 5, 15, 0.9],
  [33, 96, 3, 12, 3.8],
  [57, 72, 4, 14, 2.5],
  [78, 84, 3, 16, 0.1],
];

function DefaultAnimation() {
  return (
    <div style={wrapperStyle}>
      <style>{`
        @keyframes particleDrift {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 0.09; }
          90%  { opacity: 0.06; }
          100% { transform: translateY(-80px) translateX(10px); opacity: 0; }
        }
      `}</style>
      {PARTICLES.map(([left, top, size, dur, delay], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            borderRadius: '50%',
            background: i % 3 === 0 ? '#14b8a6' : '#3b82f6',
            opacity: 0,
            animation: `particleDrift ${dur}s ease-in-out ${delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main exported component
───────────────────────────────────────────── */

export function BgAnimation({ variant = 'default', className = '' }: BgAnimationProps) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    >
      {variant === 'home'           && <HomeAnimation />}
      {variant === 'certifications' && <CertificationsAnimation />}
      {variant === 'partners'       && <PartnersAnimation />}
      {variant === 'careers'        && <CareersAnimation />}
      {variant === 'about'          && <AboutAnimation />}
      {variant === 'default'        && <DefaultAnimation />}
    </div>
  );
}
