"use client";

import React, { useState } from "react";
import { useAccessibility } from "@/components/AccessibilityContext";
import { InlineText } from "@/components/editor";

interface DocumentItem {
  id: string;
  title: string;
  category: "WHITEPAPER" | "GUIDE" | "REPORT" | "BROCHURE";
  size: string;
  format: "PDF" | "DOCX";
  description: string;
  downloads: number;
}

const DOCUMENTS_CATALOG: DocumentItem[] = [
  {
    id: "zero-trust-wp",
    title: "Zero Trust Architecture Deployment Blueprint",
    category: "WHITEPAPER",
    size: "2.4 MB",
    format: "PDF",
    description: "An in-depth guide to implementing secure micro-perimeters and Entra ID conditional access controls across hybrid infrastructures.",
    downloads: 1482
  },
  {
    id: "m365-migration-guide",
    title: "Enterprise M365 Mailbox Migration Roadmap",
    category: "GUIDE",
    size: "1.8 MB",
    format: "PDF",
    description: "Step-by-step checklist for multi-tenant Exchange migrations to Azure Cloud ecosystems, preventing data leakage.",
    downloads: 2891
  },
  {
    id: "cyber-threat-report",
    title: "Kloudera Cyber Threat Intelligence Landscape 2026",
    category: "REPORT",
    size: "4.1 MB",
    format: "PDF",
    description: "Statistical analysis of evolving AI-driven intrusion vectors, phishing exploits, and zero-day containment strategies.",
    downloads: 912
  },
  {
    id: "h100-gpu-brochure",
    title: "Nvidia HGX H100 Compute Node Specifications",
    category: "BROCHURE",
    size: "820 KB",
    format: "PDF",
    description: "Technical details, power draws, InfiniBand network layouts, and hosting metrics for Hopper GPU server architectures.",
    downloads: 3410
  },
  {
    id: "iso-compliance-wp",
    title: "Structuring ISO 27001 Security Controls in Azure",
    category: "WHITEPAPER",
    size: "3.2 MB",
    format: "PDF",
    description: "Compliance audit handbook for deploying encrypted storage clusters, audit logging pools, and user IAM controls.",
    downloads: 729
  }
];

export default function KnowledgeCenterPage() {
  const { playAudio } = useAccessibility();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (doc: DocumentItem) => {
    playAudio("click");
    setDownloadSuccess(doc.id);
    
    // Simulate dynamic file download link creation
    setTimeout(() => {
      playAudio("success");
      const link = document.createElement("a");
      link.href = "#"; // Mock download location
      link.setAttribute("download", `${doc.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 600);

    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2500);
  };

  const filteredDocs = DOCUMENTS_CATALOG.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || doc.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "ALL" || doc.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-teal-500/30">
      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // KNOWLEDGE HUB</span>
          <InlineText as="h1" className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal" path={["resources", "title"]} fallback="RESOURCES & DOCUMENTATION" />
        </div>

        <div className="flex gap-4 mt-4 sm:mt-0 items-center font-mono">
          <div className="text-right">
            <span className="text-[9px] text-zinc-500 block">DOCUMENT_INDEX</span>
            <span className="text-xs text-teal-400 font-bold">CACHED // SECURE_DOWNLOADS</span>
          </div>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-1.5 border border-teal-500/30 text-teal-400 text-[10px] tracking-wider rounded hover:bg-teal-500/10 cursor-none transition-all"
          >
            DISCONNECT
          </button>
        </div>
      </header>

      {/* Content wrapper */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8 py-12">
        
        {/* Search Matrix */}
        <section className="cyber-panel p-5 rounded-lg border border-teal-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-1 font-mono">
            <span className="text-[8px] text-teal-400 font-bold uppercase tracking-widest block">TELEMETRY FILTER</span>
            <InlineText as="h2" className="text-sm font-bold text-white uppercase" path={["resources", "filterTitle"]} fallback="Filter Resource Indexes" />
          </div>
          
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 w-full font-mono text-xs">
            <input
              type="text"
              placeholder="Search resource headers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-black border border-teal-500/15 rounded p-2 text-white focus:outline-none focus:border-teal-500 cursor-none text-[11px]"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-zinc-950 border border-teal-500/15 rounded px-3 py-2 text-white focus:outline-none focus:border-teal-500 cursor-none text-[11px]"
            >
              <option value="ALL">All Categories</option>
              <option value="WHITEPAPER">Whitepapers</option>
              <option value="GUIDE">Deployment Guides</option>
              <option value="REPORT">Threat Reports</option>
              <option value="BROCHURE">Product Brochures</option>
            </select>
          </div>
        </section>

        {/* Resources list */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="cyber-panel p-5 rounded-lg border border-teal-500/20 hover:border-teal-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-teal-500/10 pb-2 mb-4">
                    <span className="text-[9px] text-teal-400 font-bold uppercase tracking-wider">{doc.category}</span>
                    <span className="text-[9px] text-zinc-500 uppercase">{doc.size} // {doc.format}</span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">{doc.title}</h3>
                  <p className="text-zinc-400 text-[11px] mt-3 leading-relaxed">{doc.description}</p>
                </div>

                <div className="mt-6 border-t border-teal-500/5 pt-4 flex justify-between items-center">
                  <span className="text-[9px] text-zinc-500">{doc.downloads} INDEX DOWNLOADS</span>
                  
                  <button
                    onClick={() => handleDownload(doc)}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-black font-bold uppercase rounded cursor-none transition-all"
                  >
                    {downloadSuccess === doc.id ? "TRANSMITTING..." : "DOWNLOAD RESOURCE"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
