"use client";

import React, { useState, useEffect } from "react";
import { useAccessibility } from "@/components/AccessibilityContext";
import { InlineText } from "@/components/editor";

export default function BlogsPage() {
  const { playAudio } = useAccessibility();
  const [blogsData, setBlogsData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.blogs) setBlogsData(data.blogs);
      })
      .catch(() => {});
  }, []);

  const defaultPosts = [
    { title: "Securing Cloud Postures Against LLM Attacks", category: "Security", date: "June 24, 2026", desc: "A deep dive into securing context injection vectors inside Kubernetes networks." },
    { title: "Fine-Tuning Enterprise RAG Pipelines", category: "AI Solutions", date: "May 18, 2026", desc: "Why standard embeddings fail on tabular SQL schemas and how to structure context injection." }
  ];

  const posts = blogsData?.posts || defaultPosts;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-teal-500/30">
      {/* Header */}
      <header className="border-b border-teal-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div className="font-mono">
          <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // INTEL FEEDS</span>
          <InlineText as="h1" className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-teal" path={["blogs", "title"]} fallback="TECHNICAL BLOGS" />
        </div>

        <button
          onClick={() => window.location.href = "/"}
          className="mt-4 sm:mt-0 px-4 py-1.5 border border-teal-500/30 text-teal-400 font-mono text-[10px] tracking-wider rounded hover:bg-teal-500/10 cursor-none transition-all"
        >
          DISCONNECT
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6 py-12 font-mono text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post: any, i: number) => (
            <div key={i} className="cyber-panel p-5 rounded-lg border border-teal-500/15 flex flex-col justify-between">
              <div>
                <div className="flex justify-between text-[8px] text-zinc-500 mb-3 border-b border-teal-500/5 pb-1">
                  <InlineText as="span" path={["blogs", "posts", String(i), "category"]} fallback={post.category} />
                  <InlineText as="span" path={["blogs", "posts", String(i), "date"]} fallback={post.date} />
                </div>
                <InlineText as="h3" className="text-white font-bold text-xs uppercase" path={["blogs", "posts", String(i), "title"]} fallback={post.title} />
                <InlineText as="p" multiline className="text-zinc-500 mt-2 leading-relaxed" path={["blogs", "posts", String(i), "desc"]} fallback={post.desc} />
              </div>
              <button
                onClick={() => playAudio("click")}
                className="w-full mt-4 py-2 bg-zinc-900 border border-teal-500/10 text-teal-400 text-[8px] font-bold rounded cursor-none uppercase"
              >
                Read Full Paper &gt;
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
