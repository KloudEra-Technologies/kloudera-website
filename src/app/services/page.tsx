"use client";

import React, { useState, useEffect } from "react";
import { InlineText } from "@/components/editor";
import { ReturnButton } from "@/components/ReturnButton";

const ICONS = [
  // Cybersecurity (Shield)
  <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <circle cx="12" cy="11" r="3" />
    <path d="M12 14v4" />
  </svg>,
  // Automation (Atom)
  <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(45 12 12)" />
    <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(-45 12 12)" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>,
  // Digital Tech (Screen)
  <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>,
  // Cloud (Cloud)
  <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>,
  // AI CoE (Cube)
  <svg key="4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="7.5 8 12 10.5 16.5 8" />
    <polyline points="12 21 12 10.5" />
  </svg>,
  // Additional (Plus-Circle)
  <svg key="5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>,
  // Hardware (Chip)
  <svg key="6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="15" x2="23" y2="15" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="15" x2="4" y2="15" />
  </svg>
];

const DEFAULT_CATEGORIES = [
  {
    title: "Managed Cybersecurity services",
    desc: "Protect your business from evolving threats with our managed cybersecurity services. We provide real-time monitoring, threat detection, and risk management strategies to safeguard your data, infrastructure, and digital assets, ensuring compliance and business continuity.",
    items: [
      "vCISO (Virtual CISO)",
      "vDPO (Virtual Data Protection Officer)",
      "VAPT / Red Teaming",
      "IAM / IGA / PAM (Identity & Access Management)",
      "EDR / XDR / MDR / SoC as a Service / VMDR",
      "Cloud GRC (Governance, Risk & Compliance)",
      "Email Security",
      "OT Security (Operational Technology)",
      "DC / On-Prem IT Infrastructure Security",
      "DevSecOps – Application Security",
      "DFIR (Digital Forensics & Incident Response)",
      "Cyber Resilience",
      "AI/ML Security – MLSecOps",
      "Cloud Security",
      "Data Security",
      "Network Security"
    ]
  },
  {
    title: "Automation services",
    desc: "Our managed IT services ensure seamless operations by providing proactive monitoring, maintenance, and support. We help businesses reduce downtime, enhance efficiency, and stay ahead with the latest technology solutions, allowing you to focus on growth while we handle the complexities of IT management.",
    items: [
      "Process Automation",
      "Robotic Process Automation (RPA)",
      "IT Automation",
      "DevOps Automation",
      "Monitoring Automation",
      "Cloud Automation",
      "Infrastructure as Code (IaC)",
      "Security Automation"
    ]
  },
  {
    title: "Digital Technology Services",
    desc: "Empower your business with end-to-end technology solutions that combine custom software development with managed IT infrastructure. We design, build, deploy, secure, and manage scalable digital environments to help your business innovate, improve operational efficiency, and ensure business continuity.",
    items: [
      "Data Center & Communication Management",
      "Network Management",
      "Cloud & Virtualization Services",
      "Database Design & Optimization",
      "Custom Software Development",
      "Microservices Architecture",
      "Data Center Management",
      "DevOps & CI/CD Automation",
      "Web & Mobile App Development"
    ]
  },
  {
    title: "Managed Cloud services",
    desc: "Optimize your cloud infrastructure with our managed cloud services. We provide end-to-end support for cloud migration, monitoring, and security, ensuring scalability, performance, and cost efficiency while keeping your business operations running smoothly.",
    items: [
      "Cloud Migration",
      "Serverless Computing Management",
      "Performance Monitoring & Optimisation",
      "Cloud Native Application Development Management",
      "Compliance & Governance",
      "Cloud Cost Management",
      "Cloud Infrastructure Management",
      "Cloud Security Management",
      "Multi-Cloud & Hybrid Cloud Management",
      "Cloud Resiliency/ DR as a Service"
    ]
  },
  {
    title: "AI CoE Custom LLM Development",
    desc: "Leverage the power of AI with our Center of Excellence (CoE) for custom LLM (Large Language Model) development. We create tailored AI solutions that enhance automation, decision-making, and customer experiences, helping businesses innovate and stay ahead in a rapidly evolving digital landscape.",
    items: [
      "Gen-AI Pipeline",
      "AI/ML Pipeline"
    ]
  },
  {
    title: "Additional services",
    desc: "Beyond our core offerings, we provide a range of specialized services tailored to your unique business needs. Whether it's IT consulting, infrastructure optimization, or industry-specific solutions, we deliver expertise and innovation to drive success.",
    items: [
      "Digital Transformation Consulting",
      "Hybrid Directory/ Identity Management",
      "ERP - SAP, Oracle, MS Dynamics 365 - All modules",
      "ACM (Application Lifecycle Management)",
      "Quantum Computing",
      "Blockchain Consulting and Application",
      "ITSM Tools - ServiceNow, Zoho",
      "Enterprise Application Management",
      "CRM - Salesforce"
    ]
  },
  {
    title: "Next Generation Hardware",
    desc: "Accelerate your digital transformation with cutting-edge hardware solutions designed for performance, scalability, and reliability. From AI-ready infrastructure and enterprise servers to networking, storage, and endpoint devices, we deliver modern hardware ecosystems that empower businesses to operate securely and efficiently.",
    items: [
      "Enterprise Servers & Workstations",
      "AI & GPU Computing Systems",
      "High-Performance Storage Solutions",
      "Network Infrastructure & Switches",
      "Edge Computing Devices",
      "Hyperconverged Infrastructure (HCI)",
      "Data Center Hardware",
      "Endpoint Devices & Thin Clients",
      "Backup & Disaster Recovery Appliances",
      "Hardware Installation & Configuration",
      "Hardware Lifecycle Management",
      "Preventive Maintenance & Technical Support",
      "Hardware Upgrades & Performance Optimization",
      "Warranty & Asset Management Optimization"
    ]
  }
];

export default function ServicesHubPage() {
  const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("API load failed");
      })
      .then(data => {
        if (data && data.services) {
          if (data.services.categories) setCategories(data.services.categories);
        }
      })
      .catch(err => console.log("Using fallback static copy:", err.message));
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-blue-900/40 bg-[#030712]/90 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-xl">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // SOLUTIONS LAYER</span>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase mt-1">
            SERVICES COMMAND DECK
          </h1>
        </div>

        <ReturnButton />
      </header>

      {/* Content */}
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-16 py-16 font-mono text-xs">
        
        {/* Intro */}
        <div className="text-center space-y-4">
          <span className="text-[9px] font-bold text-cyan-300 tracking-widest uppercase bg-blue-950/60 px-3 py-1 rounded border border-blue-500/30">
            SOLUTIONS COMMAND
          </span>
          <InlineText as="h2" className="text-2xl font-extrabold tracking-widest text-white uppercase mt-3" path={["services", "title"]} fallback="Our Services" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="p-5 sm:p-8 rounded-xl border border-blue-500/20 bg-slate-900/60 flex flex-col space-y-4 sm:space-y-6 hover:border-cyan-400/40 transition-all backdrop-blur-xl shadow-xl"
            >
              <div className="flex items-center gap-4 border-b border-blue-900/40 pb-4">
                <div className="w-10 h-10 bg-blue-950/80 border border-blue-800 rounded-lg flex items-center justify-center text-cyan-400 flex-shrink-0">
                  {ICONS[idx % ICONS.length]}
                </div>
                <InlineText as="h3" className="text-sm font-bold text-white uppercase tracking-wider" path={["services", "categories", String(idx), "title"]} fallback={cat.title} />
              </div>

              <InlineText as="p" multiline className="text-slate-300 text-xs leading-relaxed" path={["services", "categories", String(idx), "desc"]} fallback={cat.desc} />

              {/* Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {cat.items && cat.items.map((item: string, iIdx: number) => (
                  <div key={iIdx} className="flex items-center gap-2 text-[11px] text-slate-300 bg-blue-950/30 border border-blue-900/30 rounded px-3 py-1.5">
                    <span className="text-cyan-400 font-bold">›</span>
                    <InlineText as="span" path={["services", "categories", String(idx), "items", String(iIdx)]} fallback={item} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center p-8 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 space-y-4 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
          <InlineText as="p" multiline className="text-slate-300 text-xs max-w-2xl mx-auto leading-relaxed" path={["services", "ctaText"]} fallback="Interested in learning more about how our services can benefit your business? Contact us today to discuss your needs and find the perfect solution. Our team is ready to help you optimize, secure, and scale your IT infrastructure. Reach out now!" />

          <button
            onClick={() => window.location.href = "/contact"}
            className="px-8 py-2.5 border border-teal-500/35 text-teal-400 font-mono text-[10px] tracking-wider rounded hover:bg-teal-500/10 cursor-none transition-all"
          >
            SCHEDULE A MEETING
          </button>
        </div>

      </main>
    </div>
  );
}
