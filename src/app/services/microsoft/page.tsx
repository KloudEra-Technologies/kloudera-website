"use client";

import React, { useState } from "react";
import { MicrosoftLoader } from "@/components/LoadingSequences";
import { useAccessibility } from "@/components/AccessibilityContext";

interface SolutionItem {
  id: string;
  name: string;
  category: "AZURE" | "WORKPLACE" | "SECURITY" | "DEVELOPMENT";
  icon: string;
  tagline: string;
  details: string[];
}

const MICROSOFT_SOLUTIONS: SolutionItem[] = [
  {
    id: "azure-cloud",
    name: "Azure Cloud Infrastructure",
    category: "AZURE",
    icon: "Cloud",
    tagline: "Scalable cloud resources for enterprise calculations.",
    details: [
      "Provisioning Virtual Machine scale arrays and Kubernetes (AKS) nodes.",
      "Structuring SQL Databases with active replication and failovers.",
      "Configured virtual networks (VNets) with private endpoints.",
      "Hybrid-cloud connection linking local server racks to Azure Cloud."
    ]
  },
  {
    id: "m365-suite",
    name: "Microsoft 365 Enterprise",
    category: "WORKPLACE",
    icon: "Users",
    tagline: "The premier productivity and collaboration hub.",
    details: [
      "Zero-downtime email and Exchange mailbox migrations.",
      "Unified Teams channels and SharePoint intranet file pools.",
      "Tailoring Microsoft Copilot to local corporate documents.",
      "Routine license audits ensuring optimal cost structures."
    ]
  },
  {
    id: "defender-security",
    name: "Microsoft Defender & Intune",
    category: "SECURITY",
    icon: "ShieldAlert",
    tagline: "Securing end-user devices and identities.",
    details: [
      "Deploying Microsoft Intune MDM policies for Macs and PCs.",
      "Continuous device health monitoring with Defender for Endpoint.",
      "Applying zero-trust conditional access gating to email.",
      "Automated system patches locking vulnerabilities."
    ]
  },
  {
    id: "entra-identity",
    name: "Microsoft Entra ID (Azure AD)",
    category: "SECURITY",
    icon: "Key",
    tagline: "Unified corporate credential authentication.",
    details: [
      "Single Sign-On (SSO) links for all SaaS applications.",
      "Multi-Factor Authentication (MFA) enforcement policies.",
      "Cryptographic passwordless authentication (FIDO2 Keys).",
      "Identity protection telemetry blocking anomalous login locations."
    ]
  },
  {
    id: "power-platform",
    name: "Power Platform & Dynamics 365",
    category: "DEVELOPMENT",
    icon: "Cpu",
    tagline: "Low-code app orchestration and automation workflows.",
    details: [
      "Creating Power Apps for internal inventory and approvals.",
      "Automating spreadsheet email logs with Power Automate.",
      "Building Dynamics 365 pipelines for sales tracking.",
      "Power BI analytics boards mapping corporate SQL tables."
    ]
  }
];

export default function MicrosoftSolutionsPage() {
  const { playAudio } = useAccessibility();
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  
  // Interactive matcher state
  const [businessGoal, setBusinessGoal] = useState<string | null>(null);
  const [matchedSolution, setMatchedSolution] = useState<SolutionItem | null>(null);

  const handleMatchGoal = (goal: string) => {
    playAudio("click");
    setBusinessGoal(goal);
    
    let matched: SolutionItem | null = null;
    if (goal === "secure-devices") {
      matched = MICROSOFT_SOLUTIONS.find(s => s.id === "defender-security") || null;
    } else if (goal === "scale-servers") {
      matched = MICROSOFT_SOLUTIONS.find(s => s.id === "azure-cloud") || null;
    } else if (goal === "collab-tools") {
      matched = MICROSOFT_SOLUTIONS.find(s => s.id === "m365-suite") || null;
    } else if (goal === "sso-logins") {
      matched = MICROSOFT_SOLUTIONS.find(s => s.id === "entra-identity") || null;
    } else if (goal === "automate-tasks") {
      matched = MICROSOFT_SOLUTIONS.find(s => s.id === "power-platform") || null;
    }
    setMatchedSolution(matched);
    playAudio("success");
  };

  const filteredSolutions = activeCategory === "ALL" 
    ? MICROSOFT_SOLUTIONS
    : MICROSOFT_SOLUTIONS.filter(s => s.category === activeCategory);

  if (loading) {
    return <MicrosoftLoader onComplete={() => setLoading(false)} duration={2000} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-blue-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // GOLD SUITE</span>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-blue">
            MICROSOFT SOLUTIONS DECK
          </h1>
        </div>

        <div className="flex gap-4 mt-4 sm:mt-0 items-center">
          {/* MS Logo design block */}
          <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
            <span className="bg-[#f25022] rounded-sm" />
            <span className="bg-[#7fba00] rounded-sm" />
            <span className="bg-[#00a4ef] rounded-sm" />
            <span className="bg-[#ffb900] rounded-sm" />
          </div>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-1.5 border border-blue-500/30 text-blue-400 font-mono text-[10px] tracking-wider rounded hover:bg-blue-500/10 cursor-none transition-all"
          >
            DISCONNECT
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Interactive AI Solution Matcher Dashboard */}
        <section className="cyber-panel p-6 rounded-lg border border-blue-500/20">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[9px] font-bold text-blue-400 font-mono tracking-widest uppercase bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/10">
              SMART SOLUTION ARCHITECT ADVISOR
            </span>
            <h2 className="text-md font-bold font-mono text-white mt-3 uppercase">
              What is your primary operational bottleneck?
            </h2>
          </div>

          {/* Goal Selectors */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[
              { id: "secure-devices", label: "Secure Remote Endpoints" },
              { id: "scale-servers", label: "Migrate Server Workloads" },
              { id: "collab-tools", label: "Equip Workspace Collaboration" },
              { id: "sso-logins", label: "Unify SSO Login Postures" },
              { id: "automate-tasks", label: "Automate Routine Paperwork" }
            ].map((goal) => (
              <button
                key={goal.id}
                onClick={() => handleMatchGoal(goal.id)}
                className={`px-4 py-2 rounded text-xs font-mono border transition-all cursor-none ${
                  businessGoal === goal.id
                    ? "bg-blue-500 border-blue-400 text-black shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-blue-500/20 hover:text-zinc-200"
                }`}
              >
                {goal.label}
              </button>
            ))}
          </div>

          {/* Recommendation Output Display */}
          {matchedSolution && (
            <div className="bg-blue-950/10 border border-blue-500/20 p-5 rounded-lg max-w-2xl mx-auto font-mono text-xs animate-[fadeIn_0.3s_ease-out]">
              <span className="text-[9px] text-blue-400 font-bold block mb-1">ARCHITECT RECOMMENDATION // STACK DEPLOYMENT</span>
              <h3 className="text-white font-bold text-sm uppercase">{matchedSolution.name}</h3>
              <p className="text-zinc-400 mt-2 text-[10.5px] leading-relaxed">{matchedSolution.tagline}</p>
              
              <ul className="mt-4 space-y-2 text-zinc-300 text-[10px]">
                {matchedSolution.details.map((detail, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-blue-400 font-bold">&gt;</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 border-t border-blue-500/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-[9px] text-zinc-500">Deployable under unified tenant agreement.</span>
                <button
                  onClick={() => window.location.href = "/book-meeting"}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-black text-[10px] font-bold rounded cursor-none transition-all uppercase tracking-wider"
                >
                  Schedule Setup Call
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Catalog Categories */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-blue-500/10 pb-4">
            <h2 className="text-xs font-bold font-mono tracking-widest text-teal-400 uppercase">
              GOLD CERTIFIED SOLUTIONS PORTFOLIO
            </h2>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {["ALL", "AZURE", "WORKPLACE", "SECURITY", "DEVELOPMENT"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); playAudio("click"); }}
                  className={`px-3 py-1 rounded border transition-all cursor-none ${
                    activeCategory === cat
                      ? "border-blue-500/50 bg-blue-500/10 text-white"
                      : "border-zinc-800 bg-zinc-900/20 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSolutions.map((sol) => (
              <div
                key={sol.id}
                className="cyber-panel p-5 rounded-lg border border-blue-500/25 hover:border-blue-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-blue-500/10 pb-2 mb-4">
                    <span className="font-mono text-[9px] text-blue-400 font-bold uppercase tracking-wider">{sol.category}</span>
                    <span className="text-[9px] text-zinc-500 font-mono">ACTIVE DEPLOYMENT</span>
                  </div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase">{sol.name}</h3>
                  <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{sol.tagline}</p>
                  
                  <ul className="mt-4 space-y-2 text-zinc-300 text-[10.5px]">
                    {sol.details.slice(0, 3).map((detail, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-blue-500 font-mono">&gt;</span>
                        <span className="leading-tight">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-blue-500/5 pt-4">
                  <button
                    onClick={() => { handleMatchGoal(sol.id === "defender-security" ? "secure-devices" : sol.id === "azure-cloud" ? "scale-servers" : sol.id === "m365-suite" ? "collab-tools" : sol.id === "entra-identity" ? "sso-logins" : "automate-tasks"); }}
                    className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 text-[10px] font-mono rounded cursor-none transition-all uppercase font-bold"
                  >
                    Select Solution Spec
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
