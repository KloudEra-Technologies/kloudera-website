"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface SearchResult {
  title: string;
  type: string;
  url: string;
  description: string;
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const library: SearchResult[] = [
      { title: "Cyber Security SOC Dashboard", type: "SERVICE", url: "/services/cyber-security", description: "Continuous telemetry auditing and intrusion mitigation." },
      { title: "AI Neural Computation Lab", type: "SERVICE", url: "/services/ai-solutions", description: "Configuring vector models, RAG systems, and LLM automation." },
      { title: "Nvidia HGX H100 System", type: "PRODUCT", url: "/services/hardware", description: "Hopper GPU compute cluster nodes." },
      { title: "Apple MacBook Pro M4 Max", type: "PRODUCT", url: "/services/hardware", description: "Developer workstation powered by M4 Max silicon." },
      { title: "Zero Trust Deployment Blueprint", type: "DOCUMENT", url: "/resources", description: "Whitepaper detailing Entra ID conditional access." }
    ];

    if (query) {
      const filtered = library.filter(
        item => item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-white uppercase mb-4">
        Query: &quot;{query}&quot; // {results.length} Matches Found
      </h2>

      <div className="space-y-4">
        {results.map((res, i) => (
          <div key={i} className="cyber-panel p-4 rounded-lg border border-teal-500/15 hover:border-teal-400 transition-all">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[8px] text-teal-400 font-bold bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/10 uppercase">
                {res.type}
              </span>
              <a href={res.url} className="text-teal-400 hover:underline font-bold cursor-none">Teleport &gt;</a>
            </div>
            <h3 className="text-white font-bold text-xs uppercase">{res.title}</h3>
            <p className="text-zinc-500 text-[10px] mt-1.5 leading-relaxed">{res.description}</p>
          </div>
        ))}
        {results.length === 0 && (
          <div className="text-center py-12 text-zinc-600 border border-dashed border-teal-500/10 rounded">
            No matching nodes found in index files.
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-teal-500/30">
      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // SEARCH DECK</span>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal">
            SEARCH RESULTS
          </h1>
        </div>

        <button
          onClick={() => window.location.href = "/"}
          className="mt-4 sm:mt-0 px-4 py-1.5 border border-teal-500/30 text-teal-400 font-mono text-[10px] tracking-wider rounded hover:bg-teal-500/10 cursor-none transition-all"
        >
          DISCONNECT
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 max-w-xl mx-auto w-full py-12 font-mono text-xs">
        <Suspense fallback={
          <div className="text-center py-12 text-zinc-600 font-mono">
            SYNCING RESOURCE SEARCH DAEMON...
          </div>
        }>
          <SearchResultsContent />
        </Suspense>
      </main>
    </div>
  );
}
