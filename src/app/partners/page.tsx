"use client";

import React, { useState, useEffect } from "react";

const FEATURED_PARTNERS = [
  {
    name: "Microsoft",
    logoColor: "#f25f22",
    tagline: "Enterprise Identity & Cloud Core Alliance",
    details: "We co-architect secure directory environments and unified identity governance protocols, integrating Microsoft Entra ID and Active Directory into automated threat defense pipelines.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#f25f22] flex-shrink-0">
        <rect width="11" height="11" fill="currentColor" />
        <rect x="13" width="11" height="11" fill="currentColor" />
        <rect y="13" width="11" height="11" fill="currentColor" />
        <rect x="13" y="13" width="11" height="11" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "MongoDB",
    logoColor: "#10b981",
    tagline: "High-Performance Secure Data Clusters",
    details: "Collaborating on encrypted document-model data clusters and telemetry databases to store and audit cyber security logs with zero-leak cryptographic signatures.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-[#10b981] flex-shrink-0">
        <path d="M12 2C12 2 5 6 5 12C5 18 12 22 12 22C12 22 19 18 19 12C19 6 12 2 12 2Z" fill="currentColor" opacity="0.15" />
        <path d="M12 2v20" />
      </svg>
    )
  },
  {
    name: "AWS (Amazon Web Services)",
    logoColor: "#ff9900",
    tagline: "Global Cloud Resiliency & Infrastructure Security",
    details: "Managed cloud security automation, hybrid architecture configuration, and serverless compute defense systems designed to withstand volumetric DDoS incursions.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#ff9900] flex-shrink-0">
        <path d="M6 18a6 6 0 0 1 12 0" />
        <path d="M12 6V3" />
        <path d="M12 21v-3" />
      </svg>
    )
  },
  {
    name: "Fortinet",
    logoColor: "#ef4444",
    tagline: "Next-Generation Hardware Boundary Firewalls",
    details: "Providing hardware-level boundary inspection, physical perimeter threat monitoring, and automated intrusion prevention systems (IPS) for private enterprise networks.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#ef4444] flex-shrink-0">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
      </svg>
    )
  },
  {
    name: "Google Cloud",
    logoColor: "#ea4335",
    tagline: "MLSecOps & Advanced Threat Intelligence Analytics",
    details: "Harnessing Google Cloud's globally distributed analytics pipelines and security lakes to run machine learning security threat prediction and automated heuristics.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#ea4335] flex-shrink-0">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </svg>
    )
  },
  {
    name: "Sprinto",
    logoColor: "#a855f7",
    tagline: "Automated GRC & Compliance Frameworks",
    details: "Continuous integration of audit-ready compliance scripts mapping system operations directly to ISO27001, SOC2, HIPAA, and GDPR standards.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#a855f7] flex-shrink-0">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
      </svg>
    )
  },
  {
    name: "Trend Micro",
    logoColor: "#f43f5e",
    tagline: "Endpoint Detection & Response (EDR) Systems",
    details: "Protecting host endpoints and virtual workstations via proactive sandboxing, behavioral anomaly analysis, and threat patch mitigation.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#f43f5e] flex-shrink-0">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  },
  {
    name: "Cross Cipher",
    logoColor: "#0ea5e9",
    tagline: "Secure Cryptographic Communications Networks",
    details: "Deploying high-speed zero-knowledge communication tunnels, quantum-safe data encryption keys, and distributed transit path privacy routing protocols.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#0ea5e9] flex-shrink-0">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  }
];

const OTHER_ALLIANCES = [
  "AvePoint", "Axidian", "Ishan Technologies", "Web Werks", "Salesforce", 
  "Seclogic", "Snowflake", "Adobe Enterprise", "Arcon GRC", "CloudBlue", 
  "RAS Infotech", "Databricks", "Zendesk Security", "UiPath RPA", "Zoho ITSM", 
  "ServiceNow Corp", "Tenable Network Security", "Veeam Data Resiliency"
];

const getPartnerIcon = (name: string, color: string) => {
  const n = name.toLowerCase();
  if (n.includes("microsoft")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color }} className="flex-shrink-0">
        <rect width="11" height="11" fill="currentColor" />
        <rect x="13" width="11" height="11" fill="currentColor" />
        <rect y="13" width="11" height="11" fill="currentColor" />
        <rect x="13" y="13" width="11" height="11" fill="currentColor" />
      </svg>
    );
  }
  if (n.includes("mongodb")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color }} className="flex-shrink-0">
        <path d="M12 2C12 2 5 6 5 12C5 18 12 22 12 22C12 22 19 18 19 12C19 6 12 2 12 2Z" fill="currentColor" opacity="0.15" />
        <path d="M12 2v20" />
      </svg>
    );
  }
  if (n.includes("aws") || n.includes("amazon")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color }} className="flex-shrink-0">
        <path d="M6 18a6 6 0 0 1 12 0" />
        <path d="M12 6V3" />
        <path d="M12 21v-3" />
      </svg>
    );
  }
  if (n.includes("fortinet")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color }} className="flex-shrink-0">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
      </svg>
    );
  }
  if (n.includes("google")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color }} className="flex-shrink-0">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </svg>
    );
  }
  if (n.includes("sprinto")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color }} className="flex-shrink-0">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
      </svg>
    );
  }
  if (n.includes("trend micro")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color }} className="flex-shrink-0">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  if (n.includes("cross cipher") || n.includes("cipher")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color }} className="flex-shrink-0">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  // Generic network node icon for custom partners
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color }} className="flex-shrink-0">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
};

export default function PartnersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [partnersData, setPartnersData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.partners) {
          setPartnersData(data.partners);
        }
      })
      .catch((err) => console.error("Failed to load partners database", err));
  }, []);

  const title = partnersData?.title || "OUR STRATEGIC PARTNERS";
  const tagline = partnersData?.tagline || "KLOUDERA TECHNOLOGIES // GLOBAL ECOSYSTEM";
  const introTitle = partnersData?.introTitle || "Enterprise Alliances & Security Nodes";
  const introDesc = partnersData?.introDesc || "We integrate with top-tier cybersecurity networks, cloud providers, and hardware infrastructure suppliers to deliver threat-shielded operational stability.";
  
  const featured = partnersData?.featured || FEATURED_PARTNERS;
  const alliances = partnersData?.alliances || OTHER_ALLIANCES;

  const filteredFeatured = featured.filter((p: any) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlliances = alliances.filter((name: string) => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-teal-500/30">
      
      {/* Header Section */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">{tagline}</span>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal">
            {title}
          </h1>
        </div>

        <div className="flex gap-4 mt-4 sm:mt-0 items-center font-mono">
          <input
            type="text"
            placeholder="Search partners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-950 border border-teal-500/20 rounded px-3 py-1 text-white focus:outline-none focus:border-teal-500 text-[10px] uppercase w-48 tracking-wider"
          />
          
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-1 border border-teal-500/30 text-teal-400 text-[10px] tracking-wider rounded hover:bg-teal-500/10 transition-all"
          >
            DISCONNECT
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-16 py-16 font-mono text-xs">
        
        {/* Intro */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <span className="text-[8px] font-bold text-teal-400 tracking-widest uppercase bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/10">
            INTEGRATED COGNITIVE CORE
          </span>
          <h2 className="text-lg font-bold text-white uppercase mt-2">{introTitle}</h2>
          <p className="text-zinc-500 text-[10.5px] leading-relaxed">
            {introDesc}
          </p>
        </div>

        {/* Featured Partners Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFeatured.map((partner: any, idx: number) => (
            <div 
              key={idx}
              className="cyber-panel p-6 rounded-lg border border-teal-500/10 bg-zinc-950/30 hover:border-teal-500/30 transition-all flex flex-col justify-between space-y-4"
              style={{ boxShadow: `0 0 10px ${partner.logoColor}08` }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 border-b border-teal-500/5 pb-3">
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                    {getPartnerIcon(partner.name, partner.logoColor)}
                  </div>
                  <div>
                    <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">{partner.name}</h3>
                    <span className="text-[8px] font-semibold text-zinc-500 block uppercase mt-0.5 tracking-tight">{partner.tagline}</span>
                  </div>
                </div>

                <p className="text-zinc-400 text-[10px] leading-relaxed">
                  {partner.details}
                </p>
              </div>

              <div className="pt-2 flex justify-between items-center text-[8.5px] text-zinc-500 font-bold border-t border-teal-500/5">
                <span>NODE INTERFACES: OK</span>
                <span style={{ color: partner.logoColor }}>INTEGRATED</span>
              </div>
            </div>
          ))}
        </div>

        {/* Other Alliances Grid */}
        {filteredAlliances.length > 0 && (
          <div className="space-y-6 pt-12 border-t border-teal-500/10">
            <h3 className="text-center text-[10px] font-bold text-white uppercase tracking-widest">
              Extended Network & Client Alliances
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {filteredAlliances.map((name: string, i: number) => (
                <div 
                  key={i}
                  className="p-3 border border-zinc-800 bg-zinc-950/40 rounded text-center text-[9px] font-bold text-zinc-400 hover:text-teal-400 hover:border-teal-500/30 transition-all"
                >
                  📁 // {name.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
