"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { KloudEraLogo } from "./KloudEraLogo";
import { useAccessibility } from "./AccessibilityContext";
import { InlineText } from "@/components/editor";

interface ProfessionalBlueHomeProps {
  onLaunch3D?: () => void;
  siteData?: any;
  isEditMode?: boolean;
  onSelectElement?: (element: { path: string[]; type: "text" | "door"; value: any }) => void;
  selectedElementPath?: string;
}

export function ProfessionalBlueHome({ 
  onLaunch3D = () => {}, 
  siteData: initialSiteData, 
  isEditMode = false, 
  onSelectElement, 
  selectedElementPath 
}: ProfessionalBlueHomeProps) {
  const { playAudio } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("cyber");
  const [fetchedData, setFetchedData] = useState<any>({});
  const [contactForm, setContactForm] = useState({ name: "", email: "", company: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (initialSiteData) return;
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch");
      })
      .then((data) => {
        if (data && data.home) {
          setFetchedData(data.home);
        }
      })
      .catch((err) => console.log("Using fallback blue home data:", err.message));
  }, [initialSiteData]);

  const homeData = initialSiteData?.home || fetchedData || {};

  const heroHighlightGradient = homeData.heroHighlightGradient ?? true;

  const solutionCards = homeData.solutionCards || [
    { category: "CYBERSECURITY", title: "Protect. Detect. Respond.", desc: "vCISO, vDPO, 24/7 Monitoring, VAPT, and proactive security strategy.", color: "#06b6d4" },
    { category: "CLOUD & INFRA", title: "Simplified Multi-Cloud", desc: "Cloud migration, serverless management, and cost optimization.", color: "#3b82f6" },
    { category: "AI COE & AUTOMATION", title: "Custom LLM Rigs", desc: "Gen-AI pipelines, RPA process automation, and MLSecOps workflows.", color: "#818cf8" },
    { category: "NEXT-GEN HARDWARE", title: "AI-Ready Compute", desc: "Enterprise GPU systems, servers, storage, and datacenter hardware.", color: "#10b981" }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    playAudio("success");
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: "", email: "", company: "", message: "" });
    }, 4000);
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* ----------------- Top Header Navbar ----------------- */}
      <header className="sticky top-0 z-50 border-b border-blue-900/40 bg-[#030712]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <KloudEraLogo className="h-8 sm:h-10 w-auto text-blue-400" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
            <Link href="/achievements" className="hover:text-cyan-400 transition-colors">Achievements</Link>
            <Link href="/clienteles" className="hover:text-cyan-400 transition-colors">Clienteles</Link>
            <Link href="/certifications" className="hover:text-cyan-400 transition-colors">Certifications</Link>
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#careers" className="hover:text-cyan-400 transition-colors">Careers</a>
            <Link href="/products" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <span>Products</span>
              <span className="text-[9px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded-full">SOON</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playAudio("click");
                onLaunch3D();
              }}
              className="group relative hidden sm:inline-flex items-center gap-2 overflow-hidden rounded-full border border-cyan-500/40 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 px-3.5 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md transition-all hover:scale-105 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.45)] cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <span className="hidden sm:inline">LAUNCH 3D VIRTUAL HQ</span>
              <span className="sm:hidden">3D HQ</span>
              <span className="text-sm transition-transform group-hover:translate-x-0.5">🌌</span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 text-zinc-700 hover:text-black hover:bg-zinc-200/50 rounded-lg transition-all cursor-pointer border border-zinc-300/40 flex items-center justify-center relative z-50 pointer-events-auto"
            >
              <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Slide-down Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-blue-900/50 bg-[#060b18] px-6 py-5 space-y-4 font-mono text-xs animate-[slideDown_0.2s_ease-out]">
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-slate-300 hover:text-cyan-400 py-1 border-b border-blue-950"
            >
              ⚡ // SERVICES
            </a>
            <Link 
              href="/achievements" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-slate-300 hover:text-cyan-400 py-1 border-b border-blue-950"
            >
              🏆 // ACHIEVEMENTS
            </Link>
            <Link 
              href="/clienteles" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-slate-300 hover:text-cyan-400 py-1 border-b border-blue-950"
            >
              🤝 // CLIENTELES
            </Link>
            <Link 
              href="/certifications" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-slate-300 hover:text-cyan-400 py-1 border-b border-blue-950"
            >
              📜 // CERTIFICATIONS
            </Link>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-slate-300 hover:text-cyan-400 py-1 border-b border-blue-950"
            >
              🛡️ // ABOUT
            </a>
            <a 
              href="#careers" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-slate-300 hover:text-cyan-400 py-1 border-b border-blue-950"
            >
              🚀 // CAREERS
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-slate-300 hover:text-cyan-400 py-1 border-b border-blue-950"
            >
              📞 // CONTACT
            </a>
            <Link 
              href="/products" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-amber-300 hover:text-amber-200 py-1 border-b border-blue-950 flex justify-between items-center"
            >
              <span>🚀 // PRODUCTS</span>
              <span className="text-[9px] bg-amber-950 px-2 py-0.5 rounded border border-amber-800">SOON</span>
            </Link>
          </div>
        )}
      </header>

      {/* ----------------- Hero Section ----------------- */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 border-b border-blue-900/20 bg-gradient-to-b from-[#030712] via-[#090e1a] to-[#030712]">
        {/* Glowing Background Radial Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-indigo-600/15 blur-3xl pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/60 px-3.5 py-1 text-[10px] sm:text-xs font-semibold tracking-wider text-cyan-300 backdrop-blur-md mb-6 max-w-full">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <InlineText as="span" className="truncate" path={["home", "heroBadge"]} fallback="ENTERPRISE CYBERSECURITY & HARDWARE PLATFORM" />
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight break-words">
              <InlineText as="span" path={["home", "heroTitlePrefix"]} fallback="Architecting " />
              <InlineText 
                as="span" 
                className={heroHighlightGradient ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent" : "text-white"}
                path={["home", "heroTitleHighlight"]} 
                fallback="Zero-Trust" 
              />
              <InlineText as="span" path={["home", "heroTitleSuffix"]} fallback=" Digital Enterprises" />
            </h1>

            <InlineText 
              as="p" 
              multiline
              className="mt-4 sm:mt-6 text-xs sm:text-base md:text-lg text-slate-300 leading-relaxed px-2 sm:px-0"
              path={["home", "heroSubtitle"]} 
              fallback="Empowering Fortune 500 infrastructure with 24/7 Security Operations Surveillance, custom GPU AI compute clusters, and seamless Microsoft Cloud ecosystem governance." 
            />

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
              <a
                href="#services"
                className="rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] text-center cursor-pointer"
              >
                Explore Infrastructure Services
              </a>
              <button
                onClick={() => {
                  playAudio("click");
                  onLaunch3D();
                }}
                className="rounded-lg border border-blue-500/30 bg-slate-900/80 px-6 py-3 text-xs sm:text-sm font-bold text-cyan-300 shadow-lg backdrop-blur-md transition-all hover:bg-blue-900/40 text-center cursor-pointer"
              >
                Launch Interactive 3D HQ 🌐
              </button>
            </div>
          </div>

          {/* Official Kloudera Solutions Feature Cards */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {solutionCards.map((card: any, idx: number) => (
              <div key={idx} className="rounded-xl border border-blue-500/20 bg-slate-900/50 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_20px_rgba(37,99,235,0.1)] hover:border-blue-400/40 transition-all text-left">
                <div className="flex items-center justify-between">
                  <InlineText as="span" className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider" path={["home", "solutionCards", String(idx), "category"]} fallback={card.category} />
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: card.color || "#06b6d4" }} />
                </div>
                <InlineText as="h3" className="mt-2 sm:mt-3 text-base sm:text-lg font-bold text-white block" path={["home", "solutionCards", String(idx), "title"]} fallback={card.title} />
                <InlineText as="p" multiline className="text-xs text-slate-400 mt-1 leading-relaxed block" path={["home", "solutionCards", String(idx), "desc"]} fallback={card.desc} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- Interactive Services Section ----------------- */}
      <section id="services" className="py-24 border-b border-blue-900/20 bg-[#030712] relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase font-mono">CORE CAPABILITIES</h2>
            <InlineText as="p" className="mt-2 text-3xl font-extrabold text-white sm:text-4xl" path={["home", "servicesTitle"]} fallback="Enterprise Solution Architecture" />
            <InlineText as="p" multiline className="mt-4 text-slate-400 text-sm" path={["home", "servicesDesc"]} fallback="Explore our core operational wings. Select a domain below to review hardware specs and security frameworks." />
          </div>

          {/* Tab Selection */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              { id: "cyber", label: "🛡️ Cyber Security SOC" },
              { id: "hardware", label: "⚡ AI Compute & Rigs" },
              { id: "microsoft", label: "☁️ Microsoft Cloud Suite" },
              { id: "vault", label: "🔐 Data Vault & Storage" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playAudio("click");
                  setActiveTab(tab.id as any);
                }}
                className={`rounded-lg px-5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-cyan-400/50"
                    : "bg-slate-900/80 text-slate-400 border border-blue-900/30 hover:text-white hover:bg-blue-950/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Card Content */}
          <div className="mt-12 mx-auto max-w-4xl rounded-2xl border border-blue-500/20 bg-slate-900/70 p-8 backdrop-blur-2xl shadow-[0_0_40px_rgba(37,99,235,0.15)]">
            {activeTab === "cyber" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-blue-900/40 pb-4">
                  <div>
                    <InlineText as="h3" className="text-2xl font-bold text-white" path={["home", "cyberTitle"]} fallback="24/7 Security Operations Center (SOC)" />
                    <InlineText as="p" className="text-xs text-cyan-400 font-mono mt-1" path={["home", "cyberSubtitle"]} fallback="ZERO-TRUST AUDITING • PENETRATION AUDITS • VAPT" />
                  </div>
                  <Link href="/services" className="rounded bg-blue-950 px-3 py-1.5 text-xs font-bold text-blue-300 border border-blue-800 hover:border-cyan-400">
                    Full SOC Suite →
                  </Link>
                </div>
                <InlineText as="p" multiline className="text-sm text-slate-300 leading-relaxed" path={["home", "cyberDesc"]} fallback="Our continuous telemetry surveillance engine monitors global IP networks, detecting and neutralizing zero-day intrusions before they compromise critical database clusters." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-lg bg-blue-950/30 border border-blue-800/30 p-4">
                    <InlineText as="h4" className="font-bold text-white text-xs" path={["home", "cyberCard1Title"]} fallback="Continuous Threat Deflection" />
                    <InlineText as="p" multiline className="text-xs text-slate-400 mt-1" path={["home", "cyberCard1Desc"]} fallback="Real-time deep packet inspection with automated AI firewall countermeasures." />
                  </div>
                  <div className="rounded-lg bg-blue-950/30 border border-blue-800/30 p-4">
                    <InlineText as="h4" className="font-bold text-white text-xs" path={["home", "cyberCard2Title"]} fallback="Vulnerability & Penetration Testing" />
                    <InlineText as="p" multiline className="text-xs text-slate-400 mt-1" path={["home", "cyberCard2Desc"]} fallback="Rigorous ethical hacking simulations against web applications, APIs, and cloud networks." />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "hardware" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-blue-900/40 pb-4">
                  <div>
                    <InlineText as="h3" className="text-2xl font-bold text-white" path={["home", "hardwareTitle"]} fallback="High-Performance AI & Workstation Rigs" />
                    <InlineText as="p" className="text-xs text-cyan-400 font-mono mt-1" path={["home", "hardwareSubtitle"]} fallback="NVIDIA HGX H100 • MACBOOK MAX • CLOUDRACK R960" />
                  </div>
                  <Link href="/services" className="rounded bg-blue-950 px-3 py-1.5 text-xs font-bold text-blue-300 border border-blue-800 hover:border-cyan-400">
                    Hardware Vault →
                  </Link>
                </div>
                <InlineText as="p" multiline className="text-sm text-slate-300 leading-relaxed" path={["home", "hardwareDesc"]} fallback="Provision bespoke compute nodes tailored for LLM neural model training, compilation pipelines, and high-density enterprise database hosting." />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="rounded-lg bg-blue-950/30 border border-blue-800/30 p-4">
                    <h4 className="font-bold text-white text-xs">Nvidia HGX H100</h4>
                    <p className="text-xs text-slate-400 mt-1">8x GPU NVLink compute node for massive AI model training.</p>
                  </div>
                  <div className="rounded-lg bg-blue-950/30 border border-blue-800/30 p-4">
                    <h4 className="font-bold text-white text-xs">MacBook Pro M4 Max</h4>
                    <p className="text-xs text-slate-400 mt-1">128GB unified memory workstation for local dev compilers.</p>
                  </div>
                  <div className="rounded-lg bg-blue-950/30 border border-blue-800/30 p-4">
                    <h4 className="font-bold text-white text-xs">CloudRack R960</h4>
                    <p className="text-xs text-slate-400 mt-1">128-core Intel Xeon core server for enterprise hosting.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "microsoft" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-blue-900/40 pb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Microsoft Enterprise Cloud Migration</h3>
                    <p className="text-xs text-cyan-400 font-mono mt-1">MICROSOFT 365 • ENTRA ID • POWER AUTOMATE RPA</p>
                  </div>
                  <Link href="/services" className="rounded bg-blue-950 px-3 py-1.5 text-xs font-bold text-blue-300 border border-blue-800 hover:border-cyan-400">
                    Microsoft Wing →
                  </Link>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Direct Microsoft Cloud Solution Provider (CSP) integration offering seamless migration of legacy email, identity, and workflows to M365 and Entra ID.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-lg bg-blue-950/30 border border-blue-800/30 p-4">
                    <h4 className="font-bold text-white text-xs">Entra ID Governance</h4>
                    <p className="text-xs text-slate-400 mt-1">Conditional access policies, PAM, and multi-tenant identity controls.</p>
                  </div>
                  <div className="rounded-lg bg-blue-950/30 border border-blue-800/30 p-4">
                    <h4 className="font-bold text-white text-xs">Power Automate RPA</h4>
                    <p className="text-xs text-slate-400 mt-1">Automated robotic flows for back-office enterprise operations.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "vault" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-blue-900/40 pb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Encrypted Data Vault & Cloud Storage</h3>
                    <p className="text-xs text-cyan-400 font-mono mt-1">AES-256 ENCRYPTION • REDUNDANT SNAPSHOTS • SOC2</p>
                  </div>
                  <Link href="/services" className="rounded bg-blue-950 px-3 py-1.5 text-xs font-bold text-blue-300 border border-blue-800 hover:border-cyan-400">
                    Storage Core →
                  </Link>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Immutable, geo-redundant storage arrays engineered for enterprise disaster recovery and regulatory compliance requirements.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-lg bg-blue-950/30 border border-blue-800/30 p-4">
                    <h4 className="font-bold text-white text-xs">Immutable Snapshots</h4>
                    <p className="text-xs text-slate-400 mt-1">Ransomware-proof point-in-time state recovery for corporate databases.</p>
                  </div>
                  <div className="rounded-lg bg-blue-950/30 border border-blue-800/30 p-4">
                    <h4 className="font-bold text-white text-xs">Zero-Knowledge Key Vault</h4>
                    <p className="text-xs text-slate-400 mt-1">Customer-managed keys (CMK) ensuring absolute data sovereignty.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ----------------- Technology Partners Section ----------------- */}
      <section id="partners" className="py-24 border-b border-blue-900/20 bg-gradient-to-b from-[#030712] via-[#080d19] to-[#030712]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-blue-900/40 pb-8">
            <div>
              <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase font-mono">STRATEGIC ECOSYSTEM</h2>
              <InlineText as="p" className="mt-1 text-3xl font-extrabold text-white" path={["home", "partnersTitle"]} fallback="Technology Partner Directory" />
            </div>
            <Link href="/partners" className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors">
              Explore All Partners →
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { name: "Microsoft", role: "Cloud & Identity Partner", color: "border-blue-500/40" },
              { name: "AWS", role: "Infrastructure & Compute", color: "border-amber-500/40" },
              { name: "MongoDB", role: "Enterprise Database Core", color: "border-emerald-500/40" },
              { name: "Fortinet", role: "Next-Gen Firewall Alliance", color: "border-rose-500/40" },
              { name: "Google Cloud", role: "AI & BigQuery Engine", color: "border-blue-400/40" },
              { name: "Sprinto", role: "SOC2 Compliance Platform", color: "border-purple-500/40" },
              { name: "Trend Micro", role: "Endpoint Threat Defense", color: "border-indigo-500/40" },
              { name: "Cross Cipher", role: "Hardware Security Modules", color: "border-cyan-500/40" }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`rounded-xl border bg-slate-900/40 p-5 backdrop-blur-md transition-all hover:scale-105 hover:bg-blue-950/40 ${item.color}`}
              >
                <div className="h-2 w-8 rounded-full bg-blue-500/60 mb-3" />
                <h3 className="font-bold text-white text-base">{item.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- Enterprise Benefits Section ----------------- */}
      <section className="py-20 border-b border-blue-900/20 bg-[#030712] relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase font-mono">WHY ENTERPRISES CHOOSE US</h2>
            <InlineText as="p" className="mt-2 text-3xl font-extrabold text-white" path={["home", "benefitsTitle"]} fallback="How Your Organization Benefits" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-6 backdrop-blur-lg">
              <div className="h-2 w-8 rounded-full bg-cyan-400 mb-3" />
              <h3 className="font-bold text-white text-base">Proactive Defense</h3>
              <p className="text-xs text-slate-400 mt-2">Identify risks early and protect critical digital assets with enterprise resilience.</p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-6 backdrop-blur-lg">
              <div className="h-2 w-8 rounded-full bg-blue-400 mb-3" />
              <h3 className="font-bold text-white text-base">Process Automation</h3>
              <p className="text-xs text-slate-400 mt-2">Eliminate repetitive tasks and optimize workflows with intelligent DevOps & RPA.</p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-6 backdrop-blur-lg">
              <div className="h-2 w-8 rounded-full bg-indigo-400 mb-3" />
              <h3 className="font-bold text-white text-base">Optimized IT Costs</h3>
              <p className="text-xs text-slate-400 mt-2">Maximize cloud ROI, prevent budget waste, and streamline multi-cloud environments.</p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-6 backdrop-blur-lg">
              <div className="h-2 w-8 rounded-full bg-emerald-400 mb-3" />
              <h3 className="font-bold text-white text-base">Data Innovation</h3>
              <p className="text-xs text-slate-400 mt-2">Leverage custom LLM developments and high-density hardware for future growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- About & Values Section ----------------- */}
      <section id="about" className="py-24 border-b border-blue-900/20 bg-[#060a14]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase font-mono">ABOUT KLOUDERA</h2>
              <InlineText as="h3" className="mt-2 text-3xl font-extrabold text-white sm:text-4xl" path={["home", "aboutTitle"]} fallback="Built for High-Stakes Enterprise Resilience" />
              <InlineText as="p" multiline className="mt-4 text-sm text-slate-300 leading-relaxed" path={["home", "aboutDesc"]} fallback="Kloudera Technologies provides Fortune 500 organizations with end-to-end security posture optimization, compute hardware procurement, and cloud modernization strategies." />
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-xs text-cyan-400 font-bold">✓</span>
                  <span className="text-xs text-slate-200">ISO 27001 & SOC2 Type II Certified Infrastructure</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-xs text-cyan-400 font-bold">✓</span>
                  <span className="text-xs text-slate-200">Dedicated Hardware Rig Procurement & Benchmarking</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-xs text-cyan-400 font-bold">✓</span>
                  <span className="text-xs text-slate-200">Direct Microsoft Tier-1 Solutions Partner</span>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/about" className="rounded-lg bg-blue-950 px-5 py-2.5 text-xs font-bold text-cyan-300 border border-blue-800 hover:border-cyan-400">
                  Read Company Mission →
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl relative">
              <div className="text-xs font-mono text-cyan-400 mb-2">SYSTEM_FRAMEWORK</div>
              <h4 className="text-xl font-bold text-white mb-4">Zero-Trust Command Principles</h4>
              <div className="space-y-4 text-xs text-slate-300">
                <div className="border-l-2 border-blue-500 pl-4 py-1">
                  <span className="font-bold text-white block">1. Explicit Verification</span>
                  <span>Always authenticate and authorize based on all available data points.</span>
                </div>
                <div className="border-l-2 border-cyan-500 pl-4 py-1">
                  <span className="font-bold text-white block">2. Least Privilege Access</span>
                  <span>Limit user access with Just-In-Time and Just-Enough-Access (JIT/JEA) policies.</span>
                </div>
                <div className="border-l-2 border-indigo-500 pl-4 py-1">
                  <span className="font-bold text-white block">3. Assume Breach Mindset</span>
                  <span>Minimize blast radius and segment access. Verify end-to-end encryption.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Achievements & Recognition Section ----------------- */}
      <section id="achievements" className="py-24 border-b border-blue-900/20 bg-[#030712]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-blue-900/40 pb-8 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Our <span className="text-blue-500">Achievements</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 font-mono">
                Official accreditation and government recognition under key national initiatives.
              </p>
            </div>
            <Link href="/achievements" className="rounded-full border border-blue-500/30 bg-blue-950/40 px-5 py-2.5 text-xs font-mono font-bold text-blue-300 hover:bg-blue-900/60 hover:border-blue-400 transition-all">
              View All Accreditations →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* MSME Achievement Card */}
            <div className="rounded-2xl border border-blue-900/40 bg-white p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-2xl hover:scale-105 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-600 font-extrabold text-lg">
                    🇮🇳
                  </div>
                  <div className="text-left">
                    <span className="text-2xl font-black tracking-tight text-red-600 font-sans block">MSME</span>
                    <span className="text-[10px] text-slate-700 font-semibold block leading-tight">सूक्ष्म , लघु एवं मध्यम उद्यम</span>
                    <span className="text-[8px] text-slate-500 font-mono block">MICRO, SMALL & MEDIUM ENTERPRISES</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-blue-900 bg-blue-50 px-4 py-1 rounded-full border border-blue-200">
                Government of India Certified
              </span>
            </div>

            {/* #startupindia Achievement Card */}
            <div className="rounded-2xl border border-blue-900/40 bg-white p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-2xl hover:scale-105 transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
                <span className="text-orange-500">#startup</span>
                <span className="text-cyan-500">ind</span>
                <span className="text-yellow-500">i</span>
                <span className="text-emerald-500 border-b-4 border-emerald-500 inline-block pb-0.5">a</span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-orange-900 bg-orange-50 px-4 py-1 rounded-full border border-orange-200">
                DPIIT Recognized Startup
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Clientele & Verticals Section ----------------- */}
      <section id="clienteles" className="py-24 border-b border-blue-900/20 bg-[#020a24]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-blue-900/40 pb-8 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Our <span className="text-blue-500">Clienteles</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 font-mono">
                Engineered for industry-leading financial, IT, construction, and educational enterprises.
              </p>
            </div>
            <Link href="/clienteles" className="rounded-full border border-blue-500/30 bg-blue-950/40 px-5 py-2.5 text-xs font-mono font-bold text-cyan-300 hover:bg-blue-900/60 transition-all">
              View Clientele Details →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* IndiaCapital */}
            <div className="rounded-xl bg-white p-8 shadow-xl flex flex-col items-center justify-between h-48 hover:scale-105 transition-all">
              <div className="flex items-center justify-center h-full">
                <div className="bg-[#0b1b1f] text-white px-5 py-2.5 rounded-lg flex items-center gap-2.5 border border-slate-800">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 via-emerald-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold">
                    ❖
                  </div>
                  <span className="font-bold text-base tracking-tight font-sans">IndiaCapital</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-900 bg-blue-100/80 px-4 py-1 rounded-md border border-blue-200">
                FinTech
              </span>
            </div>

            {/* FIN CHIKITSAK */}
            <div className="rounded-xl bg-white p-8 shadow-xl flex flex-col items-center justify-between h-48 hover:scale-105 transition-all">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="flex items-center gap-1 text-emerald-700 font-extrabold text-xl tracking-tighter">
                  <span>F</span>
                  <span className="text-emerald-500">C</span>
                </div>
                <span className="font-bold text-sm text-emerald-950 tracking-wider block">FIN CHIKITSAK</span>
                <span className="text-[9px] text-emerald-700 font-serif italic block">Be Financially Fit</span>
              </div>
              <span className="text-[11px] font-bold text-blue-900 bg-blue-100/80 px-4 py-1 rounded-md border border-blue-200">
                FinTech
              </span>
            </div>

            {/* gleeds */}
            <div className="rounded-xl bg-white p-8 shadow-xl flex flex-col items-center justify-between h-48 hover:scale-105 transition-all">
              <div className="flex items-center justify-center h-full">
                <span className="font-sans text-3xl font-extrabold text-slate-900 tracking-tight">gleeds</span>
              </div>
              <span className="text-[11px] font-bold text-blue-900 bg-blue-100/80 px-4 py-1 rounded-md border border-blue-200">
                Construction Consultancy
              </span>
            </div>

            {/* StatusNeo */}
            <div className="rounded-xl bg-white p-8 shadow-xl flex flex-col items-center justify-between h-48 hover:scale-105 transition-all">
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center text-2xl font-sans text-slate-900">
                  <span className="font-normal">Status</span>
                  <span className="font-extrabold">Neo</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ml-0.5" />
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-900 bg-blue-100/80 px-4 py-1 rounded-md border border-blue-200">
                MNC IT
              </span>
            </div>

            {/* SIT PUNE */}
            <div className="rounded-xl bg-white p-8 shadow-xl flex flex-col items-center justify-between h-48 hover:scale-105 transition-all sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-center h-full">
                <div className="bg-[#1a1a1a] p-3 rounded-lg flex items-center gap-3 text-red-500 border border-slate-700">
                  <div className="w-8 h-8 rounded bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 text-xs font-bold">
                    🌐
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">SIT PUNE</span>
                    <span className="text-[7px] text-red-400 font-serif block">वसुधैव कुटुम्बकम्</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-900 bg-blue-100/80 px-4 py-1 rounded-md border border-blue-200">
                SIT PUNE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Security Certifications ----------------- */}
      <section id="certifications" className="py-24 border-b border-blue-900/20 bg-[#030712]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-blue-900/40 pb-8">
            <div>
              <h2 className="text-xs font-bold tracking-widest text-emerald-400 uppercase font-mono">COMPLIANCE STANDARDS</h2>
              <p className="mt-1 text-3xl font-extrabold text-white">Security & Regulatory Certifications</p>
            </div>
            <Link href="/certifications" className="rounded-full border border-emerald-500/30 bg-emerald-950/40 px-5 py-2.5 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 transition-all">
              View Certification Badges →
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center space-y-1">
              <span className="text-emerald-400 font-mono font-extrabold text-xs block">ISO 27001:2022</span>
              <span className="text-[9px] text-slate-400 font-mono block">Security Management</span>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center space-y-1">
              <span className="text-emerald-400 font-mono font-extrabold text-xs block">SOC 2 TYPE II</span>
              <span className="text-[9px] text-slate-400 font-mono block">Trust Services</span>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center space-y-1">
              <span className="text-emerald-400 font-mono font-extrabold text-xs block">NIST CSF 2.0</span>
              <span className="text-[9px] text-slate-400 font-mono block">Cyber Framework</span>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center space-y-1">
              <span className="text-emerald-400 font-mono font-extrabold text-xs block">CMMI LEVEL 5</span>
              <span className="text-[9px] text-slate-400 font-mono block">Process Optimization</span>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center space-y-1">
              <span className="text-emerald-400 font-mono font-extrabold text-xs block">HIPAA</span>
              <span className="text-[9px] text-slate-400 font-mono block">Healthcare Privacy</span>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center space-y-1">
              <span className="text-emerald-400 font-mono font-extrabold text-xs block">PCI-DSS v4.0</span>
              <span className="text-[9px] text-slate-400 font-mono block">Payment Security</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Careers & Talent Portal ----------------- */}
      <section id="careers" className="py-24 border-b border-blue-900/20 bg-[#030712]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-blue-900/40 pb-8">
            <div>
              <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase font-mono">CAREER PORTAL</h2>
              <InlineText as="p" className="mt-1 text-3xl font-extrabold text-white" path={["home", "careersTitle"]} fallback="Join the Kloudera Engineering Core" />
            </div>
            <Link href="/careers" className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500">
              View All Open Positions →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-blue-500/20 bg-slate-900/50 p-6 backdrop-blur-md">
              <span className="rounded bg-blue-950 px-2.5 py-1 text-[10px] font-mono text-cyan-300 border border-blue-800">SECURITY</span>
              <h3 className="mt-3 text-lg font-bold text-white">Cyber Security Auditor</h3>
              <p className="text-xs text-slate-400 mt-2">Lead VAPT penetration tests and threat vector assessments across client cloud environments.</p>
              <Link href="/careers" className="mt-4 inline-block text-xs font-bold text-blue-400 hover:text-cyan-300">
                Apply Position →
              </Link>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-slate-900/50 p-6 backdrop-blur-md">
              <span className="rounded bg-blue-950 px-2.5 py-1 text-[10px] font-mono text-blue-300 border border-blue-800">HARDWARE</span>
              <h3 className="mt-3 text-lg font-bold text-white">AI Compute Pipeline Lead</h3>
              <p className="text-xs text-slate-400 mt-2">Architect Nvidia HGX H100 cluster deployments and benchmark deep learning model inference speed.</p>
              <Link href="/careers" className="mt-4 inline-block text-xs font-bold text-blue-400 hover:text-cyan-300">
                Apply Position →
              </Link>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-slate-900/50 p-6 backdrop-blur-md">
              <span className="rounded bg-blue-950 px-2.5 py-1 text-[10px] font-mono text-indigo-300 border border-blue-800">MICROSOFT</span>
              <h3 className="mt-3 text-lg font-bold text-white">MS Solutions Architect</h3>
              <p className="text-xs text-slate-400 mt-2">Design Microsoft Entra ID security policies, M365 migrations, and automated Power RPA workflows.</p>
              <Link href="/careers" className="mt-4 inline-block text-xs font-bold text-blue-400 hover:text-cyan-300">
                Apply Position →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Contact & Scheduling Gateway ----------------- */}
      <section id="contact" className="py-24 border-b border-blue-900/20 bg-gradient-to-b from-[#030712] via-[#090f1d] to-[#030712]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase font-mono">GET IN TOUCH</h2>
              <InlineText as="h3" className="mt-2 text-3xl font-extrabold text-white" path={["home", "contactTitle"]} fallback="Schedule a Systems Consultation" />
              <InlineText as="p" multiline className="mt-4 text-sm text-slate-300 leading-relaxed" path={["home", "contactDesc"]} fallback="Connect directly with our solutions engineering team to evaluate your infrastructure security posture or configure enterprise hardware rigs." />

              <div className="mt-8 space-y-4">
                <Link
                  href="/book-meeting"
                  className="inline-flex items-center gap-3 rounded-lg border border-cyan-500/40 bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-3.5 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 hover:border-cyan-400"
                >
                  <span>📅 Open Calendar Scheduler</span>
                  <span>→</span>
                </Link>
                <div className="text-xs text-slate-400 block pt-2">
                  Prefer direct email? Contact us at <span className="text-cyan-300 font-mono">support@kloudera.ai</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="rounded-2xl border border-blue-500/20 bg-slate-900/70 p-8 backdrop-blur-xl shadow-2xl">
              {formSubmitted ? (
                <div className="text-center py-12 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold mx-auto">✓</div>
                  <h4 className="text-xl font-bold text-white">Inquiry Transmitted</h4>
                  <p className="text-xs text-slate-300">Our operations team will contact you within 1 business hour.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full rounded-lg border border-blue-900/50 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="jane@enterprise.com"
                      className="w-full rounded-lg border border-blue-900/50 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                      placeholder="Enterprise Corp"
                      className="w-full rounded-lg border border-blue-900/50 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Message / Infrastructure Request</label>
                    <textarea
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Specify your security, hardware, or cloud requirements..."
                      className="w-full rounded-lg border border-blue-900/50 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer"
                  >
                    Transmit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Enterprise Products Suite (Work In Progress) ----------------- */}
      <section id="products" className="py-20 border-b border-blue-900/20 bg-gradient-to-b from-[#030712] via-[#090f1e] to-[#030712]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl border border-amber-500/30 bg-[#060b18]/90 p-8 sm:p-12 text-center space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.1)] relative overflow-hidden backdrop-blur-xl">
            {/* Ambient background glow */}
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/60 px-4 py-1 text-xs font-mono font-bold tracking-wider text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span>🛠️ UNDER ACTIVE DEVELOPMENT</span>
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              <InlineText as="h2" className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-mono" path={["home", "productsTitle"]} fallback="Products Suite In Progress" />
              <InlineText as="p" multiline className="text-slate-300 text-xs sm:text-sm leading-relaxed" path={["home", "productsDesc"]} fallback="Our engineering team is actively building proprietary enterprise software solutions including Kloudera Meet Scheduler, Klodera Data Recovery Tool, and Kloudera Remote Device Controller." />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-amber-500/50 bg-amber-950/40 text-amber-300 font-mono text-xs font-bold hover:bg-amber-900/60 transition-all flex items-center justify-center gap-2"
              >
                <span>Preview Products Pipeline</span>
                <span>→</span>
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-blue-900 bg-slate-900 text-slate-300 font-mono text-xs font-bold hover:text-white transition-all"
              >
                Request Beta Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Footer ----------------- */}
      <footer className="border-t border-blue-900/40 bg-[#02040a] py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <KloudEraLogo className="h-8 w-auto text-blue-400" />
            <InlineText as="span" className="text-xs text-slate-500 font-mono" path={["home", "footerCopyright"]} fallback="© 2026 Kloudera Technologies Inc. All rights reserved." />
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <Link href="/privacy-policy" className="hover:text-cyan-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-cyan-300">Terms of Service</Link>
            <Link href="/developer" className="hover:text-cyan-300 font-mono text-blue-400">Developer Portal</Link>
            <button
              onClick={() => {
                playAudio("click");
                onLaunch3D();
              }}
              className="hidden sm:inline-block font-bold text-cyan-400 hover:underline cursor-pointer"
            >
              Launch 3D Virtual HQ 🌌
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfessionalBlueHome;
