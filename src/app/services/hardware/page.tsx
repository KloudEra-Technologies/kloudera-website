"use client";

import React, { useState, useEffect } from "react";
import { HardwareLoader } from "@/components/LoadingSequences";
import { useAccessibility } from "@/components/AccessibilityContext";
import { InlineText } from "@/components/editor";

interface Product {
  name: string;
  slug: string;
  category: string;
  image: string;
  description: string;
  specs: Record<string, string>;
  features: string[];
  hotspots: { x: number; y: number; label: string; desc: string }[];
}

const HARDWARE_CATALOG: Product[] = [
  {
    name: "Apple MacBook Pro (M4 Max)",
    slug: "macbook-pro-m4-max",
    category: "MacBooks",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
    description: "The ultimate developer workstation, powered by the Apple M4 Max chip with up to 128GB of unified memory and hardware-accelerated ray tracing.",
    specs: {
      Chip: "Apple M4 Max with 16‑core CPU and 40‑core GPU",
      Memory: "Up to 128GB Unified Memory (400GB/s bandwidth)",
      Storage: "512GB to 8TB Superfast SSD",
      Display: "16.2-inch Liquid Retina XDR (120Hz ProMotion, 1600 nits)",
      Ports: "3x Thunderbolt 5, HDMI, SDXC, MagSafe 3",
      Battery: "Up to 24 hours of usage"
    },
    features: [
      "Extreme machine learning compilation and compilation speeds",
      "Configured out-of-the-box for AI developers and enterprise designers",
      "Supports up to four external high-resolution Pro Display XDR screens",
      "Secure Enclave authentication with Face ID"
    ],
    hotspots: [
      { x: 30, y: 40, label: "M4 Max Silicon", desc: "Dedicated neural engine executing 38 trillion ops/sec." },
      { x: 75, y: 15, label: "Retina XDR Screen", desc: "Stunning 1,000,000:1 contrast ratio with mini-LED array." },
      { x: 10, y: 80, label: "Thunderbolt 5 Ports", desc: "Bi-directional bandwidth up to 120Gbps for storage pools." }
    ],
  },
  {
    name: "Nvidia HGX H100 System",
    slug: "nvidia-hgx-h100",
    category: "GPUs",
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=600&auto=format&fit=crop",
    description: "The premier infrastructure node for large-scale language model training, AI inferencing, and high-performance computing.",
    specs: {
      Architecture: "Nvidia Hopper GPU Architecture",
      "Total VRAM": "640GB HBM3 Memory (across 8x H100 GPUs)",
      Performance: "Up to 32 PetaFLOPS of FP8 Tensor Core compute",
      Interconnect: "Nvidia NVSwitch system at 7.2TB/s bi-directional",
      Networking: "8x 400Gb/s InfiniBand links",
      Power: "Typical draw of 10.2kW per 10U system"
    },
    features: [
      "Transformer Engine acceleration for massive LLM models (e.g. GPT-4 scale)",
      "Secure Multi-Instance GPU (MIG) supporting isolated workflows",
      "Integrated liquid-cooled manifolds or high-flow air systems",
      "Optimized for cluster deployment in private datacenters"
    ],
    hotspots: [
      { x: 50, y: 50, label: "Hopper Silicon Matrix", desc: "4nm TSMC lithography with 80 billion transistors per die." },
      { x: 20, y: 30, label: "NVSwitch Fabric", desc: "Permits unified GPU memory access across nodes." },
      { x: 80, y: 70, label: "InfiniBand NICs", desc: "Ultra-low-latency high-throughput datacenter clustering." }
    ],
  },
  {
    name: "Kloudera CloudRack Server R960",
    slug: "kloudera-cloudrack-r960",
    category: "Servers",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop",
    description: "Enterprise rack server engineered for hyper-virtualization, database acceleration, and core cloud hosting deployments.",
    specs: {
      Processor: "Dual 5th Gen Intel Xeon Scalable Processors (up to 128 cores)",
      Memory: "Up to 8TB DDR5 ECC RAM (32 DIMM slots)",
      Drive: "Up to 24x NVMe U.2 SSD drives with hardware RAID",
      Network: "Quad 10/25GbE SFP28 and Dual 100GbE ports",
      Management: "Integrated iDRAC9 telemetry with zero-touch deployment",
      Security: "Silicon Root of Trust, Secure Boot, System Lockdown"
    },
    features: [
      "PCIe Gen 5 support for next-generation expansion and network cards",
      "Redundant hot-swappable 2400W Titanium power supplies",
      "Active threat containment via hardware-enforced hypervisor locks",
      "Intelligent thermal cooling arrays reducing rack power waste"
    ],
    hotspots: [
      { x: 45, y: 35, label: "Dual Intel Xeon CPUs", desc: "High core count processors with built-in matrix acceleration." },
      { x: 85, y: 55, label: "Hot-swap NVMe Bays", desc: "U.2 storage pools swapping in real-time under active operations." },
      { x: 15, y: 20, label: "Titanium Power Modules", desc: "96% efficiency ratings under peak computational loads." }
    ],
  }
];

export default function HardwarePage() {
  const { playAudio, performanceMode } = useAccessibility();
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product>(HARDWARE_CATALOG[0]);
  
  // Interactive details state
  const [activeHotspot, setActiveHotspot] = useState<{ label: string; desc: string } | null>(null);
  
  // Form modal state
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    qty: 1,
    requirements: ""
  });

  // Comparison states
  const [compProductA, setCompProductA] = useState<Product>(HARDWARE_CATALOG[0]);
  const [compProductB, setCompProductB] = useState<Product>(HARDWARE_CATALOG[1]);

  useEffect(() => {
    // Reset hotspots details when switching products
    setActiveHotspot(null);
  }, [selectedProduct]);

  const handleSelectProduct = (prod: Product) => {
    playAudio("click");
    setSelectedProduct(prod);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playAudio("click");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "HARDWARE_ENQUIRY",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          subject: `Hardware Quote Request: ${selectedProduct.name}`,
          message: `Qty: ${formData.qty}. Special Requirements: ${formData.requirements}`,
          payload: JSON.stringify({
            productSlug: selectedProduct.slug,
            productName: selectedProduct.name,
            qty: formData.qty
          })
        })
      });

      if (res.ok) {
        playAudio("success");
        setQuoteSuccess(true);
        setTimeout(() => {
          setShowQuoteForm(false);
          setQuoteSuccess(false);
          setFormData({ name: "", company: "", email: "", phone: "", qty: 1, requirements: "" });
        }, 2000);
      }
    } catch (err) {
      console.error("Quote submit error:", err);
    }
  };

  if (loading) {
    return <HardwareLoader onComplete={() => setLoading(false)} duration={2000} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-rose-500/30">
      {/* Header */}
      <header className="border-b border-rose-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-rose-500 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // COMPUTE VAULT</span>
          <InlineText as="h1" className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-rose" path={["services", "hardware", "title"]} fallback="ENTERPRISE HARDWARE" />
        </div>

        <div className="flex gap-4 mt-4 sm:mt-0 items-center">
          <div className="text-right">
            <span className="text-[9px] text-zinc-500 block font-mono">SPECIFICATION_MATRIX</span>
            <span className="text-xs text-rose-400 font-bold font-mono">SECURED BOOT // STABLE</span>
          </div>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-1.5 border border-rose-500/30 text-rose-400 font-mono text-[10px] tracking-wider rounded hover:bg-rose-500/10 cursor-none transition-all"
          >
            DISCONNECT
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-12">
        
        {/* Product selector buttons */}
        <div className="flex justify-center gap-3">
          {HARDWARE_CATALOG.map((prod) => (
            <button
              key={prod.slug}
              onClick={() => handleSelectProduct(prod)}
              className={`px-4 py-2 border font-mono text-xs rounded transition-all cursor-none ${
                selectedProduct.slug === prod.slug
                  ? "bg-rose-500 border-rose-400 text-black shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-rose-500/20 hover:text-zinc-200"
              }`}
            >
              {prod.name.split(" (")[0]}
            </button>
          ))}
        </div>

        {/* Dynamic Interactive Showcase Panel */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center cyber-panel p-6 sm:p-8 rounded-lg border border-rose-500/20">
          
          {/* Interactive Image with Hotspots (Disabled on Lite mode) */}
          <div className="relative rounded overflow-hidden border border-rose-500/10 bg-zinc-950 flex items-center justify-center p-8 aspect-video">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="max-h-64 object-contain rounded shadow-2xl transition-transform duration-500 hover:scale-105"
            />

            {/* Hotspots layer */}
            {performanceMode !== "lite" && selectedProduct.hotspots.map((spot, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveHotspot(spot); playAudio("click"); }}
                className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-black border border-white/60 shadow-[0_0_15px_rgba(244,63,94,0.8)] cursor-none hover:scale-110 transition-all font-bold font-mono text-[10px]"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              >
                +
              </button>
            ))}

            {/* Hotspot detail card overlay */}
            {activeHotspot && (
              <div className="absolute bottom-4 inset-x-4 p-4 border border-rose-500/30 bg-black/90 backdrop-blur-md rounded font-mono text-[9.5px] leading-relaxed animate-[fadeIn_0.2s_ease-out]">
                <div className="flex justify-between items-center border-b border-rose-500/10 pb-1.5 mb-2">
                  <span className="text-rose-400 font-bold uppercase tracking-wider">{activeHotspot.label}</span>
                  <button onClick={() => setActiveHotspot(null)} className="text-zinc-500 hover:text-white cursor-none">X</button>
                </div>
                <p className="text-zinc-300">{activeHotspot.desc}</p>
              </div>
            )}
          </div>

          {/* Details & Copy */}
          <div className="space-y-6">
            <div className="font-mono border-b border-rose-500/10 pb-4">
              <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest">{selectedProduct.category}</span>
              <h2 className="text-xl font-bold text-white mt-1 uppercase">{selectedProduct.name}</h2>
              <p className="text-zinc-400 text-xs mt-3 leading-relaxed">{selectedProduct.description}</p>
            </div>

            {/* Features check */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs text-rose-500/80 font-bold uppercase tracking-wider">Key Highlights</h3>
              <ul className="text-zinc-300 text-xs space-y-2 font-mono">
                {selectedProduct.features.map((feat, i) => (
                  <li key={i} className="flex gap-2 items-start text-[11px]">
                    <span className="text-rose-500 font-bold">&gt;</span>
                    <span className="leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-4 border-t border-rose-500/5">
              <button
                onClick={() => { playAudio("click"); setShowQuoteForm(true); }}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-400 text-black text-xs font-bold font-mono tracking-widest rounded cursor-none transition-all uppercase shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                REQUEST QUOTE BIDS
              </button>
              <button
                onClick={() => playAudio("click")}
                className="px-6 py-3 border border-rose-500/30 text-rose-400 text-xs font-bold font-mono tracking-widest rounded hover:bg-rose-500/10 cursor-none transition-all uppercase"
              >
                Download PDF
              </button>
            </div>
          </div>
        </section>

        {/* Specifications Matrix Accordion */}
        <section className="cyber-panel p-6 rounded-lg border border-rose-500/20">
          <h2 className="text-xs font-bold font-mono tracking-widest text-teal-400 border-b border-rose-500/10 pb-3 mb-6 uppercase">
            SPECIFICATION MATRIX BREAKDOWN
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-[11px]">
            {Object.entries(selectedProduct.specs).map(([key, val]) => (
              <div key={key} className="p-3 bg-black/40 border border-rose-500/5 hover:border-rose-500/15 rounded flex justify-between gap-4 items-center">
                <span className="text-zinc-500 uppercase">{key}:</span>
                <span className="text-zinc-200 font-semibold text-right leading-tight">{val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Comparative analysis matrix */}
        <section className="cyber-panel p-6 rounded-lg border border-rose-500/20">
          <h2 className="text-xs font-bold font-mono tracking-widest text-teal-400 border-b border-rose-500/10 pb-3 mb-6 uppercase">
            HARDWARE COMPARATIVE ANALYTICAL LAB
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 font-mono text-xs">
            {/* Selector A */}
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-500">SPECIMEN A</label>
              <select
                value={compProductA.slug}
                onChange={(e) => setCompProductA(HARDWARE_CATALOG.find(p => p.slug === e.target.value) || HARDWARE_CATALOG[0])}
                className="bg-zinc-900 border border-rose-500/20 rounded p-2 text-white focus:outline-none focus:border-rose-500 text-xs cursor-none"
              >
                {HARDWARE_CATALOG.map(p => <option key={p.slug} value={p.slug}>{p.name.split(" (")[0]}</option>)}
              </select>
            </div>

            {/* VS block */}
            <div className="flex items-end justify-center py-2 text-rose-500 font-extrabold text-sm">
              VS
            </div>

            {/* Selector B */}
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-500">SPECIMEN B</label>
              <select
                value={compProductB.slug}
                onChange={(e) => setCompProductB(HARDWARE_CATALOG.find(p => p.slug === e.target.value) || HARDWARE_CATALOG[1])}
                className="bg-zinc-900 border border-rose-500/20 rounded p-2 text-white focus:outline-none focus:border-rose-500 text-xs cursor-none"
              >
                {HARDWARE_CATALOG.map(p => <option key={p.slug} value={p.slug}>{p.name.split(" (")[0]}</option>)}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-rose-500/20 text-zinc-500">
                  <th className="p-3 uppercase">PARAMETER</th>
                  <th className="p-3 text-rose-400 font-bold uppercase">{compProductA.name.split(" (")[0]}</th>
                  <th className="p-3 text-rose-400 font-bold uppercase">{compProductB.name.split(" (")[0]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-500/10 text-zinc-300">
                <tr>
                  <td className="p-3 font-semibold text-zinc-500 uppercase">CATEGORY</td>
                  <td className="p-3">{compProductA.category}</td>
                  <td className="p-3">{compProductB.category}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-500 uppercase">PRIMARY INTENT</td>
                  <td className="p-3 leading-relaxed">{compProductA.description.split(",")[0]}</td>
                  <td className="p-3 leading-relaxed">{compProductB.description.split(",")[0]}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-500 uppercase">CORE VITAL 1</td>
                  <td className="p-3">{Object.entries(compProductA.specs)[0]?.[0]}: {Object.entries(compProductA.specs)[0]?.[1]}</td>
                  <td className="p-3">{Object.entries(compProductB.specs)[0]?.[0]}: {Object.entries(compProductB.specs)[0]?.[1]}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-500 uppercase">CORE VITAL 2</td>
                  <td className="p-3">{Object.entries(compProductA.specs)[1]?.[0]}: {Object.entries(compProductA.specs)[1]?.[1]}</td>
                  <td className="p-3">{Object.entries(compProductB.specs)[1]?.[0]}: {Object.entries(compProductB.specs)[1]?.[1]}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Slide-out Quote Request Form Drawer Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-lg border border-rose-500/30 bg-zinc-950 p-8 rounded-lg shadow-2xl font-mono text-zinc-100 mx-4">
            <div className="flex justify-between items-center border-b border-rose-500/20 pb-4 mb-6">
              <h2 className="text-sm font-bold text-rose-400 uppercase tracking-wider">HARDWARE BIDDING TELEMETRY</h2>
              <button
                onClick={() => { setShowQuoteForm(false); playAudio("click"); }}
                className="text-zinc-500 hover:text-white cursor-none"
              >
                [CLOSE]
              </button>
            </div>

            {quoteSuccess ? (
              <div className="text-center py-8 text-teal-400 animate-pulse text-xs uppercase tracking-widest font-bold">
                QUOTE_BID_TRANSMITTED_SUCCESSFULLY
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-500">VISITOR NAME</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-black border border-rose-500/10 rounded p-2 text-white focus:outline-none focus:border-rose-500 cursor-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-500">COMPANY NAME</label>
                    <input
                      required
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="bg-black border border-rose-500/10 rounded p-2 text-white focus:outline-none focus:border-rose-500 cursor-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-500">SECURE EMAIL</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-black border border-rose-500/10 rounded p-2 text-white focus:outline-none focus:border-rose-500 cursor-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-500">PHONE TELEMETRY</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-black border border-rose-500/10 rounded p-2 text-white focus:outline-none focus:border-rose-500 cursor-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-500">PROVISIONING QTY</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.qty}
                    onChange={(e) => setFormData(prev => ({ ...prev, qty: parseInt(e.target.value) || 1 }))}
                    className="bg-black border border-rose-500/10 rounded p-2 text-white focus:outline-none focus:border-rose-500 cursor-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-500">SPECIAL WORKLOAD REQUIREMENTS</label>
                  <textarea
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    className="bg-black border border-rose-500/10 rounded p-2 text-white focus:outline-none focus:border-rose-500 cursor-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-500 hover:bg-rose-400 text-black text-xs font-bold rounded cursor-none transition-all uppercase tracking-wider"
                >
                  TRANSMIT BID REQUEST
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
