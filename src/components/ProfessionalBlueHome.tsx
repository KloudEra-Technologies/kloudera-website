"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { KloudEraLogo } from "./KloudEraLogo";
import { useAccessibility } from "./AccessibilityContext";
import { InlineText, InlineImage, useEditor } from "@/components/editor";
import { BgAnimation } from "./BgAnimation";
import { ScrollReveal } from "./ScrollReveal";
import { PartnerLogo, CertificationLogo } from "./FallbackLogo";

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
  const { isEditMode: isEditActive, updateNestedValue, siteData } = useEditor();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("cyber");
  const [fetchedData, setFetchedData] = useState<any>({});
  const [contactForm, setContactForm] = useState({ name: "", email: "", company: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  // Random display state — shuffled once on first data arrival
  const [partnersList, setPartnersList] = useState<any[]>([]);
  const [certificationsList, setCertificationsList] = useState<any[]>([]);
  const partnersInitRef = useRef(false);
  const certsInitRef = useRef(false);

  useEffect(() => {
    if (initialSiteData) return;
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch");
      })
      .then((data) => {
        if (data) {
          setFetchedData(data);
        }
      })
      .catch((err) => console.log("Using fallback blue home data:", err.message));
  }, [initialSiteData]);

  const getSectionData = (sectionKey: string) => {
    return siteData?.[sectionKey] || fetchedData?.[sectionKey] || initialSiteData?.[sectionKey] || {};
  };

  const homeData = getSectionData("home");
  const clienteleData = getSectionData("clienteles");
  const heroHighlightGradient = homeData.heroHighlightGradient ?? true;

  const solutionCards = homeData.solutionCards || [
    { category: "CYBERSECURITY", title: "Protect. Detect. Respond.", desc: "vCISO, vDPO, 24/7 Monitoring, VAPT, and proactive security strategy.", color: "#06b6d4" },
    { category: "CLOUD & INFRA", title: "Simplified Multi-Cloud", desc: "Cloud migration, serverless management, and cost optimization.", color: "#3b82f6" },
    { category: "AI COE & AUTOMATION", title: "Custom LLM Rigs", desc: "Gen-AI pipelines, RPA process automation, and MLSecOps workflows.", color: "#818cf8" },
    { category: "NEXT-GEN HARDWARE", title: "AI-Ready Compute", desc: "Enterprise GPU systems, servers, storage, and datacenter hardware.", color: "#10b981" }
  ];

  const clientelesList = clienteleData.items || [
    { name: "IndiaCapital", sector: "FinTech", category: "FINANCIAL SERVICES", logoType: "indiacapital", desc: "Enterprise financial technology and capital management solutions." },
    { name: "Fin Chikitsak", sector: "FinTech", category: "FINANCIAL WELLNESS", logoType: "finchikitsak", desc: "Comprehensive financial wellness and advisory platform." },
    { name: "gleeds", sector: "Construction Consultancy", category: "GLOBAL INFRASTRUCTURE", logoType: "gleeds", desc: "International property and construction management consultancy." },
    { name: "StatusNeo", sector: "MNC IT", category: "ENTERPRISE IT CONSULTING", logoType: "statusneo", desc: "Global digital transformation and enterprise IT consultancy." },
    { name: "SIT PUNE", sector: "Academic Institution", category: "EDUCATION & RESEARCH", logoType: "sitpune", desc: "Premier engineering and technological research institute." }
  ];

  const achievementsData = getSectionData("achievements");
  const achievementsList = achievementsData.items || [
    {
      name: "MSME Certified Enterprise",
      category: "GOVERNMENT ACCREDITATION",
      tagline: "सूक्ष्म , लघु एवं मध्यम उद्यम",
      desc: "Officially certified enterprise under the Ministry of Micro, Small and Medium Enterprises, Government of India.",
      logoUrl: ""
    },
    {
      name: "#startupindia Recognized Venture",
      category: "DPIIT RECOGNITION",
      tagline: "DPIIT Recognized Startup",
      desc: "Recognized technology startup by the Government of India under the flagship Startup India initiative.",
      logoUrl: ""
    }
  ];

  // Shuffle partners once when data first arrives
  useEffect(() => {
    const all = (siteData?.partners?.featured || fetchedData?.partners?.featured || []);
    if (all.length > 0 && !partnersInitRef.current) {
      partnersInitRef.current = true;
      const shuffled = [...all].sort(() => Math.random() - 0.5);
      setPartnersList(shuffled.slice(0, 8));
    }
  }, [siteData, fetchedData]);

  // Shuffle certs once when data first arrives
  useEffect(() => {
    const all = (siteData?.certifications?.items || fetchedData?.certifications?.items || []);
    if (all.length > 0 && !certsInitRef.current) {
      certsInitRef.current = true;
      const shuffled = [...all].sort(() => Math.random() - 0.5);
      setCertificationsList(shuffled.slice(0, 4));
    }
  }, [siteData, fetchedData]);

  const partnersData = getSectionData("partners");

  const aboutData = getSectionData("about");
  const whyChooseUsList = aboutData.whyChooseUs || [
    { title: "Proactive Defense", desc: "Identify risks early and protect critical digital assets with enterprise resilience." },
    { title: "Process Automation", desc: "Eliminate repetitive tasks and optimize workflows with intelligent DevOps & RPA." },
    { title: "Optimized IT Costs", desc: "Maximize cloud ROI, prevent budget waste, and streamline multi-cloud environments." },
    { title: "Data Innovation", desc: "Leverage custom LLM developments and high-density hardware for future growth." }
  ];

  const certificationsData = getSectionData("certifications");

  const careersData = getSectionData("careers");
  const jobsList = careersData.jobs || [
    { title: "Cyber Security Auditor", category: "SECURITY", desc: "Lead VAPT penetration tests and threat vector assessments across client cloud environments." },
    { title: "AI Compute Pipeline Lead", category: "HARDWARE", desc: "Architect Nvidia HGX H100 cluster deployments and benchmark deep learning model inference speed." },
    { title: "MS Solutions Architect", category: "MICROSOFT", desc: "Design Microsoft Entra ID security policies, M365 migrations, and automated Power RPA workflows." }
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "HOMEPAGE_INQUIRY",
          name: contactForm.name,
          email: contactForm.email,
          company: contactForm.company || null,
          subject: "Systems Consultation Request (Homepage)",
          message: contactForm.message
        })
      });
    } catch (err) {
      console.error("Failed to submit homepage lead:", err);
    }

    playAudio("success");
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: "", email: "", company: "", message: "" });
    }, 4000);
  };

  const addClientele = () => {
    const updated = [...clientelesList];
    updated.push({
      name: "New Clientele",
      sector: "FinTech",
      category: "SERVICES",
      logoType: "/logo.png",
      desc: "Double click to edit details."
    });
    updateNestedValue(["clienteles", "items"], updated);
  };

  const deleteClientele = (idx: number) => {
    const updated = [...clientelesList];
    updated.splice(idx, 1);
    updateNestedValue(["clienteles", "items"], updated);
  };

  const addAchievement = () => {
    const updated = [...achievementsList];
    updated.push({
      name: "New Achievement",
      category: "ACCREDITATION",
      tagline: "Certification Subtitle",
      desc: "Double click to edit details.",
      logoUrl: ""
    });
    updateNestedValue(["achievements", "items"], updated);
  };

  const deleteAchievement = (idx: number) => {
    const updated = [...achievementsList];
    updated.splice(idx, 1);
    updateNestedValue(["achievements", "items"], updated);
  };


  const addBenefit = () => {
    const updated = [...whyChooseUsList];
    updated.push({
      title: "New Benefit Card",
      desc: "Double click to edit details."
    });
    updateNestedValue(["about", "whyChooseUs"], updated);
  };

  const deleteBenefit = (idx: number) => {
    const updated = [...whyChooseUsList];
    updated.splice(idx, 1);
    updateNestedValue(["about", "whyChooseUs"], updated);
  };


  const addJob = () => {
    const updated = [...jobsList];
    updated.push({
      title: "New Position",
      category: "ENGINEERING",
      desc: "Double click to edit details."
    });
    updateNestedValue(["careers", "jobs"], updated);
  };

  const deleteJob = (idx: number) => {
    const updated = [...jobsList];
    updated.splice(idx, 1);
    updateNestedValue(["careers", "jobs"], updated);
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Fixed matrix rain behind entire page */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <BgAnimation variant="home" />
      </div>
      {/* ----------------- Top Header Navbar ----------------- */}
      <header className="w-full sticky top-0 z-50 border-b border-blue-900/40 bg-[#030712]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 sm:px-10 py-2">
          <Link href="/" className="flex items-center gap-3">
            <KloudEraLogo className="h-16 sm:h-20 w-auto text-blue-400" />
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
            <style>{`
              @keyframes text-glow-purple {
                0%, 100% {
                  text-shadow: 0 0 4px rgba(168, 85, 247, 0.4), 0 0 1px rgba(168, 85, 247, 0.2);
                  color: #d8b4fe;
                }
                50% {
                  text-shadow: 0 0 16px rgba(168, 85, 247, 0.95), 0 0 8px rgba(168, 85, 247, 0.75), 0 0 2px #ffffff;
                  color: #ffffff;
                }
              }
              .animate-text-glow-purple {
                animation: text-glow-purple 3s ease-in-out infinite;
              }
            `}</style>
            <button
              onClick={() => {
                playAudio("click");
                onLaunch3D();
              }}
              className="group relative hidden sm:inline-flex items-center gap-2 overflow-hidden rounded-full border-2 border-cyan-400 bg-cyan-950/90 px-3.5 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-black tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.55)] hover:shadow-[0_0_30px_rgba(34,211,238,0.85)] backdrop-blur-md transition-all hover:scale-105 hover:border-cyan-300 cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <span className="hidden sm:inline animate-text-glow-purple">LAUNCH 3D VIRTUAL HQ</span>
              <span className="sm:hidden animate-text-glow-purple">3D HQ</span>
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
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 border-b border-blue-900/20 bg-gradient-to-b from-[#030712]/90 via-[#090e1a]/90 to-[#030712]/90" style={{ position: 'relative', zIndex: 1 }}>
        {/* Glowing Background Radial Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-indigo-600/15 blur-3xl pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal variant="blur-glow" delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/60 px-3.5 py-1 text-[10px] sm:text-xs font-semibold tracking-wider text-cyan-300 backdrop-blur-md mb-6 max-w-full">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <InlineText as="span" className="truncate" path={["home", "heroBadge"]} fallback="ENTERPRISE CYBERSECURITY & HARDWARE PLATFORM" />
              </div>
            </ScrollReveal>

            <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight break-words animate-typewriter">
              <InlineText as="span" path={["home", "heroTitlePrefix"]} fallback="Architecting " />
              <InlineText 
                as="span" 
                className={heroHighlightGradient ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent" : "text-white"}
                path={["home", "heroTitleHighlight"]} 
                fallback="Zero-Trust" 
              />
              <InlineText as="span" path={["home", "heroTitleSuffix"]} fallback=" Digital Enterprises" />
            </h1>

            <ScrollReveal variant="blur-glow" delay={160}>
              <InlineText 
                as="p" 
                multiline
                className="mt-4 sm:mt-6 text-xs sm:text-base md:text-lg text-slate-300 leading-relaxed px-2 sm:px-0"
                path={["home", "heroSubtitle"]} 
                fallback="Empowering Fortune 500 infrastructure with 24/7 Security Operations Surveillance, custom GPU AI compute clusters, and seamless Microsoft Cloud ecosystem governance." 
              />
            </ScrollReveal>

            <ScrollReveal variant="scale" delay={240}>
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
            </ScrollReveal>
          </div>

          {/* Official Kloudera Solutions Feature Cards */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto stagger-group">
            {solutionCards.map((card: any, idx: number) => (
              <ScrollReveal key={idx} variant="flip-up" delay={idx * 90}>
                <div className="rounded-xl border border-blue-500/20 bg-slate-900/70 p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_20px_rgba(37,99,235,0.1)] hover:border-blue-400/40 transition-all text-left hover-card-3d h-full">
                  <div className="flex items-center justify-between">
                    <InlineText as="span" className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider" path={["home", "solutionCards", String(idx), "category"]} fallback={card.category} />
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: card.color || "#06b6d4" }} />
                  </div>
                  <InlineText as="h3" className="mt-2 sm:mt-3 text-base sm:text-lg font-bold text-white block" path={["home", "solutionCards", String(idx), "title"]} fallback={card.title} />
                  <InlineText as="p" multiline className="text-xs text-slate-400 mt-1 leading-relaxed block" path={["home", "solutionCards", String(idx), "desc"]} fallback={card.desc} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- Interactive Services Section ----------------- */}
      <section id="services" className="py-24 border-b border-blue-900/20 bg-[#030712]/95 relative" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase font-mono">CORE CAPABILITIES</h2>
              <InlineText as="p" className="mt-2 text-3xl font-extrabold text-white sm:text-4xl" path={["home", "servicesTitle"]} fallback="Enterprise Solution Architecture" />
              <InlineText as="p" multiline className="mt-4 text-slate-400 text-sm" path={["home", "servicesDesc"]} fallback="Explore our core operational wings. Select a domain below to review hardware specs and security frameworks." />
            </div>
          </ScrollReveal>

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
      <section id="partners" className="py-24 border-b border-blue-900/20 bg-gradient-to-b from-[#030712]/90 via-[#080d19]/90 to-[#030712]/90 relative" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal variant="fade-up">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-blue-900/40 pb-8">
              <div>
                <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase font-mono">STRATEGIC ECOSYSTEM</h2>
                <InlineText as="p" className="mt-1 text-3xl font-extrabold text-white" path={["home", "partnersTitle"]} fallback="Technology Partner Directory" />
              </div>
              <Link href="/partners" className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors">
                Explore All Partners →
              </Link>
            </div>
          </ScrollReveal>

          <div className="mt-12">
            {partnersList.length === 0 ? (
              Object.keys(fetchedData).length === 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="rounded-xl border border-blue-900/20 bg-slate-900/40 p-4 space-y-4 animate-pulse">
                      <div className="bg-zinc-950/60 rounded-lg w-full h-24 flex items-center justify-center">
                        <div className="w-10 h-10 rounded bg-blue-900/20" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-blue-900/20 rounded w-2/3" />
                        <div className="h-2 bg-blue-900/10 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-blue-900/40 flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm font-mono">No partners added yet.</p>
                  <p className="text-slate-600 text-xs font-mono">Visit the Partners page in editor mode to add partners.</p>
                </div>
              )
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {partnersList.map((item: any, idx: number) => (
                  <ScrollReveal key={idx} variant="flip-left" delay={idx * 80}>
                    <div
                      className="rounded-xl border border-blue-900/30 bg-slate-900/45 backdrop-blur-md transition-all hover:scale-105 hover:border-blue-500/40 hover:bg-blue-950/30 overflow-hidden flex flex-col hover-card-3d h-full"
                    >
                      {/* Logo / Image Area */}
                      <div className="flex items-center justify-center bg-zinc-950/60 w-full" style={{ minHeight: "100px" }}>
                        <PartnerLogo name={item.name || ""} customLogoUrl={item.logoUrl} />
                      </div>
                      {/* Name + Tagline */}
                      <div className="p-4 border-t border-blue-900/20 flex flex-col gap-1">
                        <p className="font-bold text-white text-sm truncate">{item.name || "Partner"}</p>
                        <p className="text-xs text-slate-400 line-clamp-2">{item.tagline || ""}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ----------------- Enterprise Benefits Section ----------------- */}
      <section className="py-20 border-b border-blue-900/20 bg-[#030712]/95 relative overflow-hidden" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase font-mono">WHY ENTERPRISES CHOOSE US</h2>
              <InlineText as="p" className="mt-2 text-3xl font-extrabold text-white" path={["home", "benefitsTitle"]} fallback="How Your Organization Benefits" />
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left stagger-group">
            {whyChooseUsList.map((item: any, idx: number) => {
              const bgColors = ["bg-cyan-400", "bg-blue-400", "bg-indigo-400", "bg-emerald-400"];
              const bgColor = bgColors[idx % bgColors.length];

              return (
                <ScrollReveal key={idx} variant="scale" delay={idx * 80}>
                  <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-6 backdrop-blur-lg relative hover-card-3d h-full">
                    {/* Delete Button */}
                    {isEditActive && (
                      <button
                        onClick={() => deleteBenefit(idx)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-zinc-900 border border-zinc-800 p-1.5 rounded-full transition-all z-10 font-bold text-xs"
                        title="Delete card"
                      >
                        ✕
                      </button>
                    )}
                    <div className={`h-2 w-8 rounded-full mb-3 ${bgColor}`} />
                    <InlineText as="h3" className="font-bold text-white text-base block" path={["about", "whyChooseUs", String(idx), "title"]} fallback={item.title} />
                    <InlineText as="p" multiline className="text-xs text-slate-400 mt-2 block" path={["about", "whyChooseUs", String(idx), "desc"]} fallback={item.desc} />
                  </div>
                </ScrollReveal>
              );
            })}

            {/* Add New Benefit Card */}
            {isEditActive && (
              <button
                onClick={addBenefit}
                className="rounded-xl border-2 border-dashed border-teal-500/40 bg-zinc-950/20 hover:bg-teal-500/5 hover:border-teal-500 p-6 flex flex-col items-center justify-center space-y-2 transition-all min-h-[120px] font-bold text-teal-400 uppercase tracking-widest text-[9px]"
              >
                <span>➕</span>
                <span>Add Benefit</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ----------------- About & Values Section ----------------- */}
      <section id="about" className="py-24 border-b border-blue-900/20 bg-[#060a14]/90 relative" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollReveal variant="fade-left">
              <div>
                <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase font-mono">ABOUT KLOUDERA</h2>
                <InlineText as="h3" className="mt-2 text-3xl font-extrabold text-white sm:text-4xl" path={["home", "aboutTitle"]} fallback="Built for High-Stakes Enterprise Resilience" />
                <InlineText as="p" multiline className="mt-4 text-sm text-slate-300 leading-relaxed" path={["home", "aboutDesc"]} fallback="Kloudera Technologies provides Fortune 500 organizations with end-to-end security posture optimization, compute hardware procurement, and cloud modernization strategies." />
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-xs text-cyan-400 font-bold shrink-0">✓</span>
                    <InlineText as="span" className="text-xs text-slate-200" path={["home", "aboutBullets", "0"]} fallback="ISO 27001 & SOC2 Type II Certified Infrastructure" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-xs text-cyan-400 font-bold shrink-0">✓</span>
                    <InlineText as="span" className="text-xs text-slate-200" path={["home", "aboutBullets", "1"]} fallback="Dedicated Hardware Rig Procurement & Benchmarking" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-xs text-cyan-400 font-bold shrink-0">✓</span>
                    <InlineText as="span" className="text-xs text-slate-200" path={["home", "aboutBullets", "2"]} fallback="Direct Microsoft Tier-1 Solutions Partner" />
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/about" className="rounded-lg bg-blue-950 px-5 py-2.5 text-xs font-bold text-cyan-300 border border-blue-800 hover:border-cyan-400">
                    Read Company Mission →
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-right">
              <div className="rounded-2xl border border-blue-500/20 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl relative hover-card-3d">
                <div className="text-xs font-mono text-cyan-400 mb-2">SYSTEM_FRAMEWORK</div>
                <InlineText as="h4" className="text-xl font-bold text-white mb-4 block" path={["home", "valuesTitle"]} fallback="Zero-Trust Command Principles" />
                <div className="space-y-4 text-xs text-slate-300">
                  <div className="border-l-2 border-blue-500 pl-4 py-1">
                    <InlineText as="span" className="font-bold text-white block" path={["home", "values", "0", "title"]} fallback="1. Explicit Verification" />
                    <InlineText as="span" className="block text-slate-400 mt-1" path={["home", "values", "0", "desc"]} fallback="Always authenticate and authorize based on all available data points." />
                  </div>
                  <div className="border-l-2 border-cyan-500 pl-4 py-1">
                    <InlineText as="span" className="font-bold text-white block" path={["home", "values", "1", "title"]} fallback="2. Least Privilege Access" />
                    <InlineText as="span" className="block text-slate-400 mt-1" path={["home", "values", "1", "desc"]} fallback="Limit user access with Just-In-Time and Just-Enough-Access (JIT/JEA) policies." />
                  </div>
                  <div className="border-l-2 border-indigo-500 pl-4 py-1">
                    <InlineText as="span" className="font-bold text-white block" path={["home", "values", "2", "title"]} fallback="3. Assume Breach Mindset" />
                    <InlineText as="span" className="block text-slate-400 mt-1" path={["home", "values", "2", "desc"]} fallback="Minimize blast radius and segment access. Verify end-to-end encryption." />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ----------------- Achievements & Recognition Section ----------------- */}
      <section id="achievements" className="py-24 border-b border-blue-900/20 bg-[#030712]/95 relative" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal variant="fade-up">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-blue-900/40 pb-8 mb-12">
              <div>
                <InlineText
                  as="h2"
                  className="text-3xl sm:text-4xl font-extrabold text-white"
                  path={["home", "achievementsTitle"]}
                  fallback="Our Achievements"
                />
                <InlineText
                  as="p"
                  className="mt-2 text-xs sm:text-sm text-slate-400 font-mono block"
                  path={["home", "achievementsDesc"]}
                  fallback="Official accreditation and government recognition under key national initiatives."
                />
              </div>
              <Link href="/achievements" className="rounded-full border border-blue-500/30 bg-blue-950/40 px-5 py-2.5 text-xs font-mono font-bold text-blue-300 hover:bg-blue-900/60 hover:border-blue-400 transition-all">
                View All Accreditations →
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto stagger-group">
            {achievementsList.map((item: any, idx: number) => {
              const hasCustomImage = item.logoUrl && (
                item.logoUrl.startsWith("data:") || 
                item.logoUrl.includes("/") || 
                item.logoUrl.startsWith("http")
              );

              return (
                <ScrollReveal key={idx} variant="flip-right" delay={idx * 100}>
                  <div 
                    className="rounded-2xl border border-blue-900/40 bg-white p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-2xl hover:scale-105 transition-all relative hover-card-3d h-full"
                  >
                    {/* Delete Button */}
                    {isEditActive && (
                      <button
                        onClick={() => deleteAchievement(idx)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-all z-10 font-bold"
                        title="Delete card"
                      >
                        ✕
                      </button>
                    )}

                    {/* Logo or Image Upload slot */}
                    <div className="w-full flex justify-center">
                      {isEditActive || hasCustomImage ? (
                        <div className="h-16 w-full flex items-center justify-center overflow-hidden relative border border-dashed border-teal-500/20 rounded">
                          <InlineImage 
                            path={["achievements", "items", String(idx), "logoUrl"]} 
                            fallback={hasCustomImage ? item.logoUrl : "/logo.png"} 
                            className="h-full w-auto max-h-16 object-contain"
                            alt={item.name}
                          />
                        </div>
                      ) : (
                        // Fallbacks
                        (() => {
                          const nameLower = item.name.toLowerCase();
                          if (nameLower.includes("msme")) {
                            return (
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
                            );
                          }
                          if (nameLower.includes("startup")) {
                            return (
                              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
                                <span className="text-orange-500">#startup</span>
                                <span className="text-cyan-500">ind</span>
                                <span className="text-yellow-500">i</span>
                                <span className="text-emerald-500 border-b-4 border-emerald-500 inline-block pb-0.5">a</span>
                              </div>
                            );
                          }
                          return (
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg">
                              🏆
                            </div>
                          );
                        })()
                      )}
                    </div>

                    <div className="text-center space-y-2 w-full">
                      <div className="mb-1">
                        <InlineText as="span" className="text-[10px] font-mono font-bold uppercase text-blue-900 bg-blue-50 px-4 py-1 rounded-full border border-blue-200" path={["achievements", "items", String(idx), "category"]} fallback={item.category} />
                      </div>
                      <InlineText as="h3" className="text-lg font-black text-slate-800 tracking-tight block pt-2" path={["achievements", "items", String(idx), "name"]} fallback={item.name} />
                      {item.tagline && <InlineText as="span" className="text-[10px] text-slate-500 block" path={["achievements", "items", String(idx), "tagline"]} fallback={item.tagline} />}
                      <InlineText as="p" multiline className="text-xs text-slate-500 leading-relaxed block" path={["achievements", "items", String(idx), "desc"]} fallback={item.desc} />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}

            {/* Add New Card Button */}
            {isEditActive && (
              <button
                onClick={addAchievement}
                className="rounded-2xl border-2 border-dashed border-teal-500/40 bg-zinc-950/20 hover:bg-teal-500/5 hover:border-teal-500 p-8 flex flex-col items-center justify-center space-y-2 transition-all min-h-[220px]"
              >
                <span className="text-2xl text-teal-400">➕</span>
                <span className="text-[11px] font-bold font-mono text-teal-400 uppercase tracking-widest">
                  Add New Achievement
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ----------------- Clientele & Verticals Section ----------------- */}
      <section id="clienteles" className="py-24 border-b border-blue-900/20 bg-[#030712]/95 relative" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal variant="fade-up">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-blue-900/40 pb-8 mb-12">
              <div>
                <InlineText
                  as="h2"
                  className="text-3xl sm:text-4xl font-extrabold text-white"
                  path={["home", "clientelesTitle"]}
                  fallback="Our Clienteles"
                />
                <InlineText
                  as="p"
                  className="mt-2 text-xs sm:text-sm text-slate-300 font-mono block"
                  path={["home", "clientelesDesc"]}
                  fallback="Engineered for industry-leading financial, IT, construction, and educational enterprises."
                />
              </div>
              <Link href="/clienteles" className="rounded-full border border-blue-500/30 bg-blue-950/40 px-5 py-2.5 text-xs font-mono font-bold text-cyan-300 hover:bg-blue-900/60 transition-all">
                View Clientele Details →
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-group">
            {clientelesList.map((item: any, idx: number) => {
              const hasCustomImage = item.logoType && (
                item.logoType.startsWith("data:") || 
                item.logoType.includes("/") || 
                item.logoType.startsWith("http")
              );

              return (
                <ScrollReveal key={idx} variant="flip-left" delay={idx * 90}>
                  <div 
                    className="rounded-xl bg-white p-8 shadow-xl flex flex-col items-center justify-between h-56 hover:scale-105 transition-all border border-slate-100 relative hover-card-3d"
                  >
                    {/* Delete Button */}
                    {isEditActive && (
                      <button
                        onClick={() => deleteClientele(idx)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-all z-10 font-bold text-xs"
                        title="Delete card"
                      >
                        ✕
                      </button>
                    )}

                    <div className="flex flex-col items-center justify-center h-full w-full overflow-hidden">
                      {isEditActive || hasCustomImage ? (
                        <div className="h-16 w-full flex items-center justify-center overflow-hidden relative">
                          <InlineImage 
                            path={["clienteles", "items", String(idx), "logoType"]} 
                            fallback={hasCustomImage ? item.logoType : "/logo.png"} 
                            className="h-full w-auto max-h-16"
                            alt={item.name}
                          />
                        </div>
                      ) : (
                        // Fallback to custom layouts based on name
                        (() => {
                          const nameLower = item.name.toLowerCase();
                          if (nameLower.includes("indiacapital")) {
                            return (
                              <div className="bg-[#0b1b1f] text-white px-5 py-2.5 rounded-lg flex items-center gap-2.5 border border-slate-800 shadow-sm">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 via-emerald-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold">
                                  ❖
                                </div>
                                <span className="font-bold text-base tracking-tight font-sans">IndiaCapital</span>
                              </div>
                            );
                          }
                          if (nameLower.includes("chikitsak")) {
                            return (
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-emerald-700 font-extrabold text-xl tracking-tighter">
                                  <span>F</span>
                                  <span className="text-emerald-500">C</span>
                                </div>
                                <span className="font-bold text-sm text-emerald-950 tracking-wider block">FIN CHIKITSAK</span>
                                <span className="text-[9px] text-emerald-700 font-serif italic block">Be Financially Fit</span>
                              </div>
                            );
                          }
                          if (nameLower.includes("gleeds")) {
                            return (
                              <span className="font-sans text-4xl font-extrabold text-slate-900 tracking-tight">gleeds</span>
                            );
                          }
                          if (nameLower.includes("statusneo")) {
                            return (
                              <div className="flex items-center text-2xl font-sans text-slate-900">
                                <span className="font-normal">Status</span>
                                <span className="font-extrabold">Neo</span>
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ml-0.5" />
                              </div>
                            );
                          }
                          if (nameLower.includes("sit pune")) {
                            return (
                              <div className="bg-[#1a1a1a] p-3 rounded-lg flex items-center gap-3 text-red-500 border border-slate-700">
                                <div className="w-8 h-8 rounded bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 text-xs font-bold">
                                  🌐
                                </div>
                                <div className="text-left">
                                  <span className="text-xs font-bold text-white block">SIT PUNE</span>
                                  <span className="text-[7px] text-red-400 font-serif block">वसुधैव कुटुम्बकम्</span>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div className="bg-slate-50 border border-slate-200 p-3 rounded flex items-center gap-2 text-slate-700">
                              <span>💼</span>
                              <span className="font-bold text-xs uppercase">{item.name}</span>
                            </div>
                          );
                        })()
                      )}
                    </div>
                    
                    <div className="text-center space-y-1 mt-4 w-full">
                      <div className="flex justify-between items-center w-full mb-1">
                        <InlineText as="span" className="text-[8px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded" path={["clienteles", "items", String(idx), "sector"]} fallback={item.sector} />
                        <InlineText as="span" className="text-[8px] font-bold text-blue-500 uppercase tracking-widest" path={["clienteles", "items", String(idx), "category"]} fallback={item.category} />
                      </div>
                      <InlineText as="h3" className="text-base font-black text-slate-800 tracking-tight" path={["clienteles", "items", String(idx), "name"]} fallback={item.name} />
                      <InlineText as="p" multiline className="text-[10px] text-slate-500 leading-relaxed" path={["clienteles", "items", String(idx), "desc"]} fallback={item.desc} />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}

            {/* Add New Clientele Card */}
            {isEditActive && (
              <button
                onClick={addClientele}
                className="rounded-xl border-2 border-dashed border-teal-500/40 bg-zinc-950/20 hover:bg-teal-500/5 hover:border-teal-500 p-8 flex flex-col items-center justify-center space-y-2 transition-all h-56"
              >
                <span className="text-2xl text-teal-400">➕</span>
                <span className="text-[11px] font-bold font-mono text-teal-400 uppercase tracking-widest">
                  Add New Clientele
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ----------------- Security Certifications ----------------- */}
      <section id="certifications" className="py-24 border-b border-emerald-950/20 bg-[#030712]/95 relative" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal variant="fade-up">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-blue-900/40 pb-8">
              <div>
                <InlineText
                  as="h2"
                  className="text-xs font-bold tracking-widest text-emerald-400 uppercase font-mono block"
                  path={["home", "certificationsSub"]}
                  fallback="COMPLIANCE STANDARDS"
                />
                <InlineText
                  as="p"
                  className="mt-1 text-3xl font-extrabold text-white block"
                  path={["home", "certificationsTitle"]}
                  fallback="Security & Regulatory Certifications"
                />
              </div>
              <Link href="/certifications" className="rounded-full border border-emerald-500/30 bg-emerald-950/40 px-5 py-2.5 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 transition-all">
                View Certification Badges →
              </Link>
            </div>
          </ScrollReveal>

          <div className="mt-12">
            {certificationsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-950/20 border border-emerald-800/30 flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-emerald-900" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm font-mono">No certifications added yet.</p>
                <p className="text-slate-600 text-xs font-mono">Visit the Certifications page in editor mode to add badges.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 stagger-group">
                {certificationsList.map((item: any, idx: number) => (
                  <ScrollReveal key={idx} variant="flip-right" delay={idx * 80}>
                    <div
                      className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 overflow-hidden flex flex-col hover:border-emerald-400/40 transition-all hover-card-3d h-full"
                    >
                      {/* Badge Image Area */}
                      <div className="flex items-center justify-center bg-[#060c18]/60 w-full" style={{ minHeight: "80px" }}>
                        <CertificationLogo code={item.code || ""} title={item.title} customImageUrl={item.imageUrl} />
                      </div>
                      {/* Title */}
                      <div className="p-3 border-t border-emerald-900/20 text-center">
                        <p className="text-emerald-400 font-mono font-bold text-[10px] leading-tight">{item.title || "Certification"}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ----------------- Careers & Talent Portal ----------------- */}
      <section id="careers" className="py-24 border-b border-blue-900/20 bg-[#030712]/95 relative" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal variant="fade-up">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-blue-900/40 pb-8">
              <div>
                <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase font-mono">CAREER PORTAL</h2>
                <InlineText as="p" className="mt-1 text-3xl font-extrabold text-white" path={["home", "careersTitle"]} fallback="Join the Kloudera Engineering Core" />
              </div>
              <Link href="/careers" className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500">
                View All Open Positions →
              </Link>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 stagger-group">
            {jobsList.map((job: any, idx: number) => {
              const textColors = ["text-cyan-300", "text-blue-300", "text-indigo-300", "text-emerald-300"];
              const textColor = textColors[idx % textColors.length];

              return (
                <ScrollReveal key={idx} variant="flip-up" delay={idx * 80}>
                  <div 
                    className="rounded-xl border border-blue-500/20 bg-slate-900/50 p-6 backdrop-blur-md relative flex flex-col justify-between hover-card-3d h-full"
                  >
                    {/* Delete Button */}
                    {isEditActive && (
                      <button
                        onClick={() => deleteJob(idx)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-zinc-900 border border-zinc-800 p-1.5 rounded-full transition-all z-10 font-bold text-xs"
                        title="Delete card"
                      >
                        ✕
                      </button>
                    )}
                    <div>
                      <InlineText as="span" className={`rounded bg-blue-950 px-2.5 py-1 text-[10px] font-mono border border-blue-800 inline-block ${textColor}`} path={["careers", "jobs", String(idx), "category"]} fallback={job.category} />
                      <InlineText as="h3" className="mt-3 text-lg font-bold text-white block" path={["careers", "jobs", String(idx), "title"]} fallback={job.title} />
                      <InlineText as="p" multiline className="text-xs text-slate-400 mt-2 block" path={["careers", "jobs", String(idx), "desc"]} fallback={job.desc} />
                    </div>
                    <Link href="/careers" className="mt-4 inline-block text-xs font-bold text-blue-400 hover:text-cyan-300">
                      Apply Position →
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}

            {/* Add Career Card */}
            {isEditActive && (
              <button
                onClick={addJob}
                className="rounded-xl border-2 border-dashed border-teal-500/40 bg-zinc-950/20 hover:bg-teal-500/5 hover:border-teal-500 p-6 flex flex-col items-center justify-center space-y-2 transition-all min-h-[160px] font-bold text-teal-400 uppercase tracking-widest text-[9px]"
              >
                <span>➕ Position</span>
              </button>
            )}
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
                  Prefer direct email? Contact us at <span className="text-cyan-300 font-mono">info@kloudera.ai</span>
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

      {/* ----------------- Our Visionary Team ----------------- */}
      <TeamSection siteData={siteData} fetchedData={fetchedData} />

      {/* ----------------- Social Media Connect ----------------- */}
      <SocialSection siteData={siteData} fetchedData={fetchedData} />

      {/* ----------------- Footer ----------------- */}
      <footer className="border-t border-blue-900/40 bg-[#02040a] py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <KloudEraLogo className="h-24 w-auto text-blue-400" />
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

// ─────────────────────────────────────────────────────────────────────────────
// TeamSection — "Our Visionary Team" displayed at the bottom of the home page
// Reads from the same about.team data used by /about
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_HOME_TEAM = [
  { name: "Ratnesh Pandey", role: "CEO | Co-Founder | vCISO | Director", image: "" },
  { name: "Deepa", role: "Director | Co-Founder | CHRO", image: "" },
  { name: "Utkarsh", role: "Sr. Cyber Security SME | Partner Success Mgr", image: "" },
];

function TeamSection({ siteData, fetchedData }: { siteData: any; fetchedData: any }) {
  const teamData: any[] =
    siteData?.about?.team ||
    fetchedData?.about?.team ||
    DEFAULT_HOME_TEAM;

  return (
    <section
      id="team"
      className="py-24 border-b border-blue-900/20 bg-gradient-to-b from-[#030712] via-[#07101f] to-[#030712] relative overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase bg-cyan-950/40 border border-cyan-900/40 px-4 py-1 rounded-full mb-4">
            EXECUTIVE LEADERSHIP
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Visionary</span> Team
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
            The minds steering Kloudera's mission to deliver world-class cybersecurity and cloud solutions.
          </p>
        </div>

        {/* Team cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {teamData.map((mbr: any, idx: number) => (
            <div
              key={idx}
              className="group relative w-full max-w-xs rounded-3xl border border-blue-500/20 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-cyan-400/50 hover:shadow-[0_8px_40px_rgba(6,182,212,0.15)] transition-all duration-300 p-8 flex flex-col items-center text-center gap-5 overflow-hidden"
            >
              {/* Card glow on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-2 border-cyan-400/60 shadow-[0_0_24px_rgba(6,182,212,0.35)] overflow-hidden bg-slate-800 flex items-center justify-center">
                  {mbr.image ? (
                    <img src={mbr.image} alt={mbr.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-extrabold text-cyan-400 font-mono select-none">
                      {(mbr.name || "?")[0].toUpperCase()}
                    </span>
                  )}
                </div>
                {/* Online indicator */}
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>

              {/* Info */}
              <div className="space-y-2">
                <p className="font-extrabold text-white text-lg tracking-wide leading-tight">{mbr.name || "Team Member"}</p>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {(mbr.role || "").split("|").map((r: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-blue-950/80 text-cyan-300 px-2.5 py-0.5 rounded-md border border-blue-800/60"
                    >
                      {r.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA link */}
        <div className="mt-12 text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-900/40 hover:border-cyan-400/60 transition-all"
          >
            <span>Learn More About Our Team</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SocialSection — Interactive cards connecting to LinkedIn, Instagram, Facebook, YouTube
// ─────────────────────────────────────────────────────────────────────────────

function SocialSection({ siteData, fetchedData }: { siteData: any; fetchedData: any }) {
  const { isEditMode: isEditActive, updateNestedValue } = useEditor();

  const linkedIn = siteData?.home?.social?.linkedin || fetchedData?.home?.social?.linkedin || "https://www.linkedin.com/company/104839162/";
  const instagram = siteData?.home?.social?.instagram || fetchedData?.home?.social?.instagram || "https://www.instagram.com/klouderatech/";
  const facebook = siteData?.home?.social?.facebook || fetchedData?.home?.social?.facebook || "https://www.facebook.com/people/KloudEra-Technologies/61567616190162/";
  const youtube = siteData?.home?.social?.youtube || fetchedData?.home?.social?.youtube || "https://www.youtube.com/@KloudEraTechnologies-b3z";

  const platforms = [
    {
      name: "LinkedIn",
      url: linkedIn,
      key: "linkedin",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
      ),
      theme: "group-hover:border-blue-500 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] text-blue-400 bg-blue-500/10",
      desc: "Connect with our professional network, team updates, and corporate milestones.",
    },
    {
      name: "Instagram",
      url: instagram,
      key: "instagram",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
      theme: "group-hover:border-pink-500 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] text-pink-400 bg-pink-500/10",
      desc: "Take a look behind the scenes, at our work culture, and design achievements.",
    },
    {
      name: "Facebook",
      url: facebook,
      key: "facebook",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
        </svg>
      ),
      theme: "group-hover:border-indigo-600 group-hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] text-indigo-400 bg-indigo-500/10",
      desc: "Join our community hub for customer stories, webinars, and events.",
    },
    {
      name: "YouTube",
      url: youtube,
      key: "youtube",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.389-.507a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      theme: "group-hover:border-red-500 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] text-red-500 bg-red-500/10",
      desc: "Watch product demonstrations, expert guides, and technical breakdowns.",
    },
  ];

  return (
    <section id="social" className="py-24 border-b border-blue-900/20 bg-[#030712] relative overflow-hidden" style={{ zIndex: 1 }}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-80 w-80 rounded-full bg-blue-500/[0.02] blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-96 w-96 rounded-full bg-cyan-500/[0.02] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative">
        <div className="text-center mb-14">
          <span className="inline-block text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase bg-cyan-950/40 border border-cyan-900/40 px-4 py-1 rounded-full mb-4">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect With <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">KloudEra</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
            Stay updated with our latest technology insights, corporate announcements, and active project highlights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <div key={platform.name} className="group relative flex flex-col justify-between rounded-2xl border border-blue-900/30 bg-[#060c18]/60 backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1">
              <a
                href={isEditActive ? undefined : platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`absolute inset-0 rounded-2xl ${isEditActive ? "pointer-events-none" : ""}`}
              />
              
              <div className="space-y-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border border-transparent transition-all duration-300 ${platform.theme}`}>
                  {platform.icon}
                </div>
                <h3 className="text-lg font-bold text-white font-mono tracking-wide">{platform.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{platform.desc}</p>
              </div>

              {isEditActive ? (
                <div className="mt-6 pt-4 border-t border-blue-900/30 space-y-1.5 relative z-10">
                  <label className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">Redirect URL</label>
                  <input
                    type="text"
                    value={platform.url}
                    onChange={(e) => updateNestedValue(["home", "social", platform.key], e.target.value)}
                    className="w-full bg-zinc-950 border border-blue-900/50 focus:border-cyan-400 text-[10px] text-zinc-300 rounded px-2.5 py-1.5 outline-none font-mono transition-colors"
                  />
                </div>
              ) : (
                <div className="mt-6 pt-4 border-t border-blue-900/20 flex items-center justify-between text-[10px] font-mono text-cyan-500 group-hover:text-cyan-400 transition-colors">
                  <span>VISIT PROFILE</span>
                  <span>→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

