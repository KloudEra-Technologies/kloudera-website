"use client";

import React, { useState } from "react";
import { useEditor } from "./EditorContext";

export const EditorToolbar = () => {
  const { isEditMode, publishChanges, closeEditor, authToken } = useEditor();
  const [publishing, setPublishing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Settings Modal State
  const [showSettings, setShowSettings] = useState(false);
  const [newContentPassword, setNewContentPassword] = useState("");
  const [newUltimatePassword, setNewUltimatePassword] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isEditMode) return null;

  const handlePublish = async () => {
    setPublishing(true);
    await publishChanges();
    setPublishing(false);
  };

  const handlePasswordChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterPassword) {
      alert("Master Password is required to authorize this change.");
      return;
    }
    
    if (!newContentPassword && !newUltimatePassword) {
      alert("Please specify at least one new password to change.");
      return;
    }

    setIsRequesting(true);
    try {
      const res = await fetch("/api/request-password-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          masterPassword,
          newContentPassword: newContentPassword || undefined,
          newUltimatePassword: newUltimatePassword || undefined,
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Verification email sent! Please check info@kloudera.ai to confirm the password change.");
        setShowSettings(false);
        setNewContentPassword("");
        setNewUltimatePassword("");
        setMasterPassword("");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert("Network error. Could not request password change.");
    }
    setIsRequesting(false);
  };

  return (
    <>
      {/* ── Floating Action Button (collapsed state) ── */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          title="Open Editor Controls"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-[0_0_20px_rgba(20,184,166,0.6),0_4px_20px_rgba(0,0,0,0.6)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          style={{ animation: "pulse-ring 2.5s ease-in-out infinite" }}
        >
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <style>{`
            @keyframes pulse-ring {
              0%, 100% { box-shadow: 0 0 0 0 rgba(20,184,166,0.5), 0 0 20px rgba(20,184,166,0.6), 0 4px 20px rgba(0,0,0,0.6); }
              50% { box-shadow: 0 0 0 8px rgba(20,184,166,0), 0 0 25px rgba(20,184,166,0.8), 0 4px 20px rgba(0,0,0,0.6); }
            }
          `}</style>
        </button>
      )}

      {/* ── Expanded Toolbar ── */}
      {expanded && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-zinc-950/95 backdrop-blur-xl border border-teal-500/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(20,184,166,0.2)] p-3 flex items-center gap-3 font-mono font-bold"
          style={{ animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.92); }
              to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
            }
          `}</style>

          {/* Collapse button */}
          <button
            onClick={() => setExpanded(false)}
            title="Collapse toolbar"
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-all shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          <div className="flex flex-col">
            <span className="text-[10px] text-teal-400 tracking-widest uppercase">CANVA EDIT MODE</span>
            <span className="text-[8px] text-zinc-500">LIVE WEBSITE EDITOR</span>
          </div>

          <div className="h-8 w-px bg-zinc-800 mx-1" />

          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-500 rounded-lg uppercase tracking-wider text-[10px] transition-all"
          >
            ⚙️ SETTINGS
          </button>

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
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-zinc-950 border border-teal-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-teal-400 font-mono font-bold text-lg mb-1 uppercase tracking-wider">Editor Settings</h2>
            <p className="text-zinc-400 text-xs mb-6">Request a password change. A confirmation link will be emailed to the administrator.</p>

            <form onSubmit={handlePasswordChangeRequest} className="space-y-4">
              <div className="space-y-1">
                <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">Current Master Password (Required)</label>
                <input 
                  type="password" 
                  value={masterPassword}
                  onChange={e => setMasterPassword(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-teal-500 rounded-lg p-2 text-white text-sm outline-none transition-colors"
                  placeholder="Authorize with Master Password"
                  required
                />
              </div>

              <div className="space-y-1 mt-4 pt-4 border-t border-zinc-800">
                <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">New Developer Password (Optional)</label>
                <input 
                  type="password" 
                  value={newContentPassword}
                  onChange={e => setNewContentPassword(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-teal-500 rounded-lg p-2 text-white text-sm outline-none transition-colors"
                  placeholder="Leave blank to keep unchanged"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">New Master Password (Optional)</label>
                <input 
                  type="password" 
                  value={newUltimatePassword}
                  onChange={e => setNewUltimatePassword(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-rose-500 rounded-lg p-2 text-white text-sm outline-none transition-colors"
                  placeholder="Leave blank to keep unchanged"
                />
              </div>

              <button
                type="submit"
                disabled={isRequesting || !masterPassword || (!newContentPassword && !newUltimatePassword)}
                className="w-full mt-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-bold uppercase tracking-wider rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRequesting ? "REQUESTING..." : "Send Confirmation Email"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
