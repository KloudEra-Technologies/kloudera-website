"use client";

import React, { useState, useEffect, useRef } from "react";
import { CyberSecurityLoader } from "@/components/LoadingSequences";
import { useAccessibility } from "@/components/AccessibilityContext";
import { InlineText } from "@/components/editor";

interface ThreatLog {
  time: string;
  source: string;
  target: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: string;
}

export default function CyberSecurityPage() {
  const { playAudio, performanceMode } = useAccessibility();
  const [loading, setLoading] = useState(true);
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Dashboard states
  const [riskScore, setRiskScore] = useState(42);
  const [firewallLevel, setFirewallLevel] = useState("OPTIMAL");
  const [logs, setLogs] = useState<ThreatLog[]>([]);
  const [activePackets, setActivePackets] = useState(1482);
  const [mitigatedToday, setMitigatedToday] = useState(8912);
  const [selectedNode, setSelectedNode] = useState<string | null>("Core Database Gateway");

  // Mock threat databases
  const threatTypes = ["SQL Injection", "XSS Exploit", "Brute Force Auth", "DDoS Flood Packet", "Entra Bypass Alert", "Port Scan Sweep", "Phishing Link Redirect"];
  const servers = ["DB-Gateway-East", "Auth-Session-Primary", "M365-Exchange-Sync", "Azure-Kubernetes-Node1", "User-Terminal-Admin"];

  useEffect(() => {
    if (loading) return;

    // Seeding initial logs
    const seedLogs: ThreatLog[] = Array.from({ length: 6 }).map(() => generateRandomLog());
    setLogs(seedLogs);

    // Dynamic log generator
    const logTimer = setInterval(() => {
      setLogs((prev) => [generateRandomLog(), ...prev.slice(0, 8)]);
      setActivePackets((prev) => prev + Math.floor(Math.random() * 50) - 25);
      setMitigatedToday((prev) => prev + 1);
      playAudio("click");
    }, 3000);

    // Canvas Attack Map rendering loop (skip on Lite mode)
    if (performanceMode === "lite") return;

    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;

    const nodes = [
      { x: width * 0.15, y: height * 0.45, label: "North America" },
      { x: width * 0.45, y: height * 0.35, label: "Europe" },
      { x: width * 0.75, y: height * 0.4, label: "Asia" },
      { x: width * 0.3, y: height * 0.75, label: "South America" },
      { x: width * 0.85, y: height * 0.7, label: "Australia" },
      { x: width * 0.55, y: height * 0.8, label: "Africa" }
    ];

    interface ParticleArc {
      sx: number; sy: number;
      tx: number; ty: number;
      progress: number;
      speed: number;
      color: string;
    }

    let arcs: ParticleArc[] = [];

    const drawMap = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw simple background grid
      ctx.strokeStyle = "rgba(20, 184, 166, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw map nodes
      nodes.forEach((node) => {
        ctx.fillStyle = "rgba(20, 184, 166, 0.08)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(20, 184, 166, 0.2)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(20, 184, 166, 0.8)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y - 12);
      });

      // Spawn arcs
      if (Math.random() < 0.04 && arcs.length < 12) {
        const start = nodes[Math.floor(Math.random() * nodes.length)];
        let target = nodes[Math.floor(Math.random() * nodes.length)];
        while (start === target) {
          target = nodes[Math.floor(Math.random() * nodes.length)];
        }

        arcs.push({
          sx: start.x, sy: start.y,
          tx: target.x, ty: target.y,
          progress: 0,
          speed: 0.015 + Math.random() * 0.015,
          color: Math.random() > 0.3 ? "#14b8a6" : "#f43f5e" // green is safe block, red is warning
        });
      }

      // Animate Arcs
      arcs.forEach((arc, idx) => {
        arc.progress += arc.speed;
        if (arc.progress >= 1) {
          arcs.splice(idx, 1);
          return;
        }

        // Draw bezier arc curves
        const midX = (arc.sx + arc.tx) / 2;
        const midY = (arc.sy + arc.ty) / 2 - 50; // Curve height

        const currentX = (1 - arc.progress) * (1 - arc.progress) * arc.sx + 2 * (1 - arc.progress) * arc.progress * midX + arc.progress * arc.progress * arc.tx;
        const currentY = (1 - arc.progress) * (1 - arc.progress) * arc.sy + 2 * (1 - arc.progress) * arc.progress * midY + arc.progress * arc.progress * arc.ty;

        ctx.strokeStyle = arc.color === "#f43f5e" ? "rgba(244, 63, 94, 0.15)" : "rgba(20, 184, 166, 0.15)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(arc.sx, arc.sy);
        ctx.quadraticCurveTo(midX, midY, arc.tx, arc.ty);
        ctx.stroke();

        ctx.fillStyle = arc.color;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(drawMap);
    };

    drawMap();

    const handleResize = () => {
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(logTimer);
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [loading, performanceMode]);

  const generateRandomLog = (): ThreatLog => {
    const timestamp = new Date().toLocaleTimeString();
    const sourceIp = `185.220.101.${Math.floor(Math.random() * 254) + 1}`;
    const targetServer = servers[Math.floor(Math.random() * servers.length)];
    const threat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    const severities: ("LOW" | "MEDIUM" | "HIGH" | "CRITICAL")[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    const severity = severities[Math.floor(Math.random() * severities.length)];

    return {
      time: timestamp,
      source: sourceIp,
      target: targetServer,
      type: threat,
      severity,
      status: severity === "CRITICAL" || severity === "HIGH" ? "BLOCKED & CONTAINED" : "MITIGATED"
    };
  };

  const toggleFirewallLevel = () => {
    playAudio("click");
    if (firewallLevel === "OPTIMAL") {
      setFirewallLevel("MAXIMUM SECURITY");
      setRiskScore(12);
    } else if (firewallLevel === "MAXIMUM SECURITY") {
      setFirewallLevel("STANDARD PROSTURE");
      setRiskScore(68);
    } else {
      setFirewallLevel("OPTIMAL");
      setRiskScore(38);
    }
  };

  if (loading) {
    return <CyberSecurityLoader onComplete={() => setLoading(false)} duration={2000} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-mono selection:bg-teal-500/30">
      {/* HUD Header Banner */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div>
          <span className="text-[10px] font-bold text-teal-500 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // SECURE CORE</span>
          <InlineText as="h1" className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal" path={["services", "cyber-security", "title"]} fallback="SECURITY OPERATIONS CENTER (SOC)" />
        </div>

        <div className="flex gap-4 mt-4 sm:mt-0 items-center">
          <div className="text-right">
            <span className="text-[9px] text-zinc-500 block">SYSTEM_TELEMETRY</span>
            <span className="text-xs text-teal-400 font-bold">MONITORING DECK 01 // ON_AIR</span>
          </div>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-1.5 border border-teal-500/30 text-teal-400 text-[10px] tracking-wider rounded hover:bg-teal-500/10 cursor-none transition-all"
          >
            DISCONNECT
          </button>
        </div>
      </header>

      {/* SOC Command Grid */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full shelf-row">
        {/* Left Column: Diagnostics & Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Risk Dashboard Gauge */}
          <div className="cyber-panel shelf-card p-5 rounded-lg border border-teal-500/20">
            <h2 className="text-[11px] font-bold tracking-widest text-teal-500/70 border-b border-teal-500/10 pb-2 uppercase mb-4">
              CYBER RISK LEVEL
            </h2>
            <div className="flex flex-col items-center justify-center py-4">
              <span className={`text-4xl font-extrabold ${riskScore > 50 ? "text-rose-500 glow-text-rose" : "text-teal-400 glow-text-teal"}`}>
                {riskScore}%
              </span>
              <span className="text-[9px] text-zinc-500 mt-2 font-mono uppercase">ESTIMATED THREAT INDEX</span>
            </div>
            {/* Interactive Firewall Toggle Button */}
            <div className="mt-4 border-t border-teal-500/10 pt-4">
              <button
                onClick={toggleFirewallLevel}
                className="w-full py-2.5 rounded bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs uppercase tracking-wider transition-all cursor-none shadow-[0_0_15px_rgba(20,184,166,0.3)]"
              >
                TOGGLE FIREWALL POLICY
              </button>
              <div className="mt-3 flex justify-between text-[9px] text-zinc-500">
                <span>ACTIVE SHIELD:</span>
                <span className="text-teal-400 font-bold">{firewallLevel}</span>
              </div>
            </div>
          </div>
 
          {/* Infrastructure Nodes Topology */}
          <div className="cyber-panel shelf-card p-5 rounded-lg border border-teal-500/20">
            <h2 className="text-[11px] font-bold tracking-widest text-teal-500/70 border-b border-teal-500/10 pb-2 uppercase mb-4">
              ACTIVE SUBNETS
            </h2>
            <div className="space-y-2">
              {servers.map((srv, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedNode(srv); playAudio("click"); }}
                  className={`w-full p-2 rounded text-left border transition-all cursor-none flex justify-between items-center text-[10px] ${
                    selectedNode === srv
                      ? "border-teal-400 bg-teal-500/5 text-white"
                      : "border-teal-500/5 bg-black/40 text-zinc-400 hover:border-teal-500/20 hover:text-zinc-200"
                  }`}
                >
                  <span>{srv}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${idx === 4 ? "bg-amber-400 animate-pulse" : "bg-teal-400"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
 
        {/* Center Panels: Attack Map & Logs */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          <div className="grid grid-cols-3 gap-4">
            <div className="cyber-panel shelf-card p-4 rounded-lg border border-teal-500/20 flex flex-col items-center">
              <span className="text-[9px] text-zinc-500 uppercase">INCOMING PACKETS / MIN</span>
              <span className="text-xl font-bold text-white mt-1">{activePackets}</span>
            </div>
            <div className="cyber-panel shelf-card p-4 rounded-lg border border-teal-500/20 flex flex-col items-center">
              <span className="text-[9px] text-zinc-500 uppercase">MITIGATED THREATS TODAY</span>
              <span className="text-xl font-bold text-teal-400 mt-1">{mitigatedToday}</span>
            </div>
            <div className="cyber-panel shelf-card p-4 rounded-lg border border-teal-500/20 flex flex-col items-center">
              <span className="text-[9px] text-zinc-500 uppercase">ISO 27001 Posture</span>
              <span className="text-xl font-bold text-teal-400 mt-1">100% COMPLIANT</span>
            </div>
          </div>
 
          {/* Global Cyber Attack Map Canvas */}
          <div className="cyber-panel shelf-card p-5 rounded-lg border border-teal-500/20 flex-1 min-h-[300px] flex flex-col relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[9px] font-bold text-teal-400 tracking-widest uppercase bg-black/80 px-2 py-1 rounded border border-teal-500/10">
                LIVE ATTACK VECTOR VISUALIZATION
              </span>
            </div>
            {performanceMode === "lite" ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-500 p-6">
                <svg className="h-10 w-10 text-teal-500/40 animate-pulse mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-[10px] uppercase tracking-wide">Attack map deactivated in Lite mode.</p>
                <p className="text-[9px] text-zinc-600 mt-1">Switch HQ Render Mode in Settings to view dynamic maps.</p>
              </div>
            ) : (
              <canvas ref={mapCanvasRef} className="flex-1 w-full h-full block rounded bg-black/40" />
            )}
          </div>
 
          {/* Real-time Threat Logs Console */}
          <div className="cyber-panel shelf-card p-5 rounded-lg border border-teal-500/20 flex-1 min-h-[220px] max-h-[320px] overflow-hidden flex flex-col">
            <h2 className="text-[11px] font-bold tracking-widest text-teal-500/70 border-b border-teal-500/10 pb-2 uppercase mb-3">
              REAL-TIME THREAT LOGS FEED
            </h2>
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[9px] scrollbar-none">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row justify-between p-2 rounded bg-black/40 border border-teal-500/5 hover:border-teal-500/10 transition-all gap-1.5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-zinc-500">[{log.time}]</span>
                    <span className={`font-bold px-1 rounded text-[8px] ${
                      log.severity === "CRITICAL"
                        ? "bg-rose-500 text-black shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                        : log.severity === "HIGH"
                        ? "bg-amber-500 text-black"
                        : "bg-teal-500/10 text-teal-400"
                    }`}>
                      {log.severity}
                    </span>
                    <span className="text-zinc-300 font-semibold">{log.type}</span>
                    <span className="text-zinc-500">source: {log.source}</span>
                    <span className="text-zinc-500">target: {log.target}</span>
                  </div>
                  <div className="text-teal-400 font-bold text-[8px] uppercase tracking-wide flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                    {log.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
