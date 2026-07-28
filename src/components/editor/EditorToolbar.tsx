"use client";

import React, { useRef, useState } from "react";
import { useEditor } from "./EditorContext";

export const EditorToolbar = () => {
  const { isEditMode, publishChanges, closeEditor } = useEditor();
  const [publishing, setPublishing] = useState(false);

  if (!isEditMode) return null;

  const handlePublish = async () => {
    setPublishing(true);
    await publishChanges();
    setPublishing(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-zinc-950/95 backdrop-blur-xl border border-teal-500/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(20,184,166,0.2)] p-3 flex items-center gap-4 font-mono font-bold animate-[slideUp_0.3s_ease-out]">
      <div className="flex flex-col">
        <span className="text-[10px] text-teal-400 tracking-widest uppercase">CANVA EDIT MODE</span>
        <span className="text-[8px] text-zinc-500">LIVE WEBSITE EDITOR</span>
      </div>

      <div className="h-8 w-px bg-zinc-800 mx-2" />

      <button
        onClick={handlePublish}
        disabled={publishing}
        className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black rounded-lg uppercase tracking-wider text-[11px] transition-all shadow-[0_0_15px_rgba(20,184,166,0.4)] disabled:opacity-50"
      >
        {publishing ? "SAVING..." : "💾 PUBLISH CHANGES"}
      </button>

      <button
        onClick={closeEditor}
        className="px-4 py-2.5 bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-500/50 rounded-lg uppercase tracking-wider text-[10px] transition-all"
      >
        ❌ EXIT EDITOR
      </button>
    </div>
  );
};
