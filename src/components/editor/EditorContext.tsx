"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

interface EditorContextType {
  isEditMode: boolean;
  siteData: any;
  updateNestedValue: (pathArray: string[], newValue: any) => void;
  publishChanges: () => Promise<void>;
  closeEditor: () => void;
  authToken: string | null;
  activeImageEdit: { path: string[]; fallback: string; currentUrl: string } | null;
  setActiveImageEdit: (val: { path: string[]; fallback: string; currentUrl: string } | null) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [siteData, setSiteData] = useState<any>(null);
  // authToken is NEVER persisted — always cleared on close
  const authTokenRef = useRef<string | null>(null);
  const [authToken, setAuthTokenState] = useState<string | null>(null);

  // Global active image edit settings
  const [activeImageEdit, setActiveImageEdit] = useState<{ path: string[]; fallback: string; currentUrl: string } | null>(null);

  // Position coordinates for draggable editor panel (global state, persists throughout editing session)
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panelStart = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set default position on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPosition({ x: window.innerWidth - 350, y: 120 });
    }
  }, []);

  // Sync drag movement listener
  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 330, panelStart.current.x + dx)),
        y: Math.max(10, Math.min(window.innerHeight - 350, panelStart.current.y + dy))
      });
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Helper that keeps both ref and state in sync
  const setAuthToken = (val: string | null) => {
    authTokenRef.current = val;
    setAuthTokenState(val);
  };

  // Close editor controls if edit mode exits
  useEffect(() => {
    if (!isEditMode) {
      setActiveImageEdit(null);
    }
  }, [isEditMode]);

  // On mount: fetch latest site data from server
  useEffect(() => {
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then(res => res.json())
      .then(data => setSiteData(data))
      .catch(console.error);
  }, []);

  // Apply/remove contentEditable on the whole page when edit mode changes
  useEffect(() => {
    if (isEditMode) {
      document.body.classList.add("kloudera-edit-active");
    } else {
      document.body.classList.remove("kloudera-edit-active");
    }
    return () => {
      document.body.classList.remove("kloudera-edit-active");
    };
  }, [isEditMode]);

  // Keyboard shortcut: Ctrl+Shift+E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        if (isEditMode) {
          setIsEditMode(false);
          setAuthToken(null);
          return;
        }
        const pass = window.prompt("🔐 Enter Editor Password to access Edit Mode:");
        if (!pass || pass.trim() === "") return;
        setAuthToken(pass.trim());
        setIsEditMode(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditMode]);

  const updateNestedValue = (pathArray: string[], newValue: any) => {
    setSiteData((prev: any) => {
      const base = prev || {};
      const copy = JSON.parse(JSON.stringify(base));
      let current = copy;
      for (let i = 0; i < pathArray.length - 1; i++) {
        if (current[pathArray[i]] === undefined) {
          current[pathArray[i]] = {};
        }
        current = current[pathArray[i]];
      }
      current[pathArray[pathArray.length - 1]] = newValue;
      return copy;
    });
  };

  const publishChanges = async () => {
    const token = authTokenRef.current;
    if (!token || !siteData) {
      alert("Missing authentication or data. Please re-enter the editor.");
      return;
    }
    try {
      const res = await fetch("/api/website-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-developer-token": token,
        },
        body: JSON.stringify(siteData),
      });
      if (res.ok) {
        alert("✅ Changes published successfully!");
        setIsEditMode(false);
        setAuthToken(null);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to publish: ${err.error || "Authentication failed. Check your password."}`);
        if (res.status === 401 || res.status === 403) {
          setAuthToken(null);
          setIsEditMode(false);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Network error while publishing changes.");
    }
  };

  const closeEditor = () => {
    setIsEditMode(false);
    setAuthToken(null);
  };

  const handleGlobalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeImageEdit) return;

    const token = authToken || "";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);
    formData.append("path", activeImageEdit.path.join("_"));

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "x-developer-token": token },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        updateNestedValue(activeImageEdit.path, data.url);
        // Force URL state refresh in editor context view
        setActiveImageEdit({
          ...activeImageEdit,
          currentUrl: data.url
        });
      } else {
        alert(`Upload error: ${data.error}`);
      }
    } catch (err) {
      alert("Network error during upload");
    }
  };

  // Helper getters for currently edited image URL parameters
  const getAdjustmentValueLocal = (url: string, param: string, defaultValue: string): string => {
    if (!url) return defaultValue;
    const queryIdx = url.indexOf("?");
    if (queryIdx === -1) return defaultValue;
    const params = new URLSearchParams(url.substring(queryIdx));
    return params.get(param) || defaultValue;
  };

  const setAdjustmentValueLocal = (url: string, param: string, value: string): string => {
    if (!url) return "";
    const queryIdx = url.indexOf("?");
    let baseUrl = url;
    let params = new URLSearchParams();
    if (queryIdx !== -1) {
      baseUrl = url.substring(0, queryIdx);
      params = new URLSearchParams(url.substring(queryIdx));
    }
    params.set(param, value);
    return `${baseUrl}?${params.toString()}`;
  };

  const currentEditedUrl = activeImageEdit
    ? (() => {
        let value = siteData;
        for (const key of activeImageEdit.path) {
          if (value && value[key] !== undefined) {
            value = value[key];
          } else {
            value = undefined;
            break;
          }
        }
        return value !== undefined ? value : activeImageEdit.fallback;
      })()
    : "";

  const scale = activeImageEdit ? Number(getAdjustmentValueLocal(currentEditedUrl, "scale", "1")) : 1;
  const x = activeImageEdit ? Number(getAdjustmentValueLocal(currentEditedUrl, "x", "0")) : 0;
  const y = activeImageEdit ? Number(getAdjustmentValueLocal(currentEditedUrl, "y", "0")) : 0;
  const fit = activeImageEdit ? getAdjustmentValueLocal(currentEditedUrl, "fit", "cover") : "cover";

  return (
    <EditorContext.Provider value={{ isEditMode, siteData, updateNestedValue, publishChanges, closeEditor, authToken, activeImageEdit, setActiveImageEdit }}>
      {children}
      
      {/* Global Image Editor Panel - Rendered at the Root Layer */}
      {isEditMode && activeImageEdit && (
        <div 
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
          className="fixed w-80 bg-zinc-950/95 border border-teal-500/40 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] font-mono text-[10px] flex flex-col gap-4 text-left text-zinc-100 z-[99999] backdrop-blur-md"
          onMouseDown={(e) => {
            // Only trigger dragging if clicked directly on widget wrapper background or sliders area (excluding inputs)
            const target = e.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "BUTTON") {
              return;
            }
          }}
        >
          {/* Header (specifically draggable handle) */}
          <div 
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging(true);
              dragStart.current = { x: e.clientX, y: e.clientY };
              panelStart.current = { x: position.x, y: position.y };
            }}
            className="flex justify-between items-center border-b border-teal-500/20 pb-3 cursor-move active:cursor-grabbing select-none"
          >
            <span className="text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>✥</span> Image Settings
            </span>
            <button onClick={() => setActiveImageEdit(null)} className="text-zinc-500 hover:text-white text-sm">✕</button>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-black font-bold uppercase rounded-lg transition-colors text-center text-[10px]"
          >
            Upload New Image
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleGlobalUpload} 
          />

          <div className="space-y-3 mt-1 select-none">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-zinc-400 text-[9px] uppercase tracking-wider">
                <span>IMAGE FITTING</span>
              </div>
              <select
                value={fit}
                onChange={(e) => updateNestedValue(activeImageEdit.path, setAdjustmentValueLocal(currentEditedUrl, "fit", e.target.value))}
                className="bg-zinc-900 border border-zinc-800 text-white rounded px-2 py-1.5 outline-none focus:border-teal-500 text-[10px]"
              >
                <option value="cover">Fill space (Cropped)</option>
                <option value="contain">Show entire image (No crop)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-zinc-400 text-[9px] uppercase tracking-wider">
                <span>SCALE / ZOOM</span>
                <span className="text-white font-bold">{scale.toFixed(2)}x</span>
              </div>
              <input
                type="range" min="0.1" max="3" step="0.05" value={scale}
                onChange={(e) => updateNestedValue(activeImageEdit.path, setAdjustmentValueLocal(currentEditedUrl, "scale", e.target.value))}
                className="accent-teal-500 w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-zinc-400 text-[9px] uppercase tracking-wider">
                <span>PAN X</span>
                <span className="text-white font-bold">{x}px</span>
              </div>
              <input
                type="range" min="-200" max="200" step="1" value={x}
                onChange={(e) => updateNestedValue(activeImageEdit.path, setAdjustmentValueLocal(currentEditedUrl, "x", e.target.value))}
                className="accent-teal-500 w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-zinc-400 text-[9px] uppercase tracking-wider">
                <span>PAN Y</span>
                <span className="text-white font-bold">{y}px</span>
              </div>
              <input
                type="range" min="-200" max="200" step="1" value={y}
                onChange={(e) => updateNestedValue(activeImageEdit.path, setAdjustmentValueLocal(currentEditedUrl, "y", e.target.value))}
                className="accent-teal-500 w-full"
              />
            </div>
          </div>
        </div>
      )}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
