"use client";

import React, { useRef, useState } from "react";
import { useEditor } from "./EditorContext";
import { getCleanImageUrl, getImageStyle, getAdjustmentValue, setAdjustmentValue } from "@/lib/imageHelper";

interface InlineImageProps {
  path: string[];
  fallback: string;
  className?: string;
  alt?: string;
}

export const InlineImage = ({ path, fallback, className = "", alt = "" }: InlineImageProps) => {
  const { isEditMode, siteData, updateNestedValue, authToken } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showControls, setShowControls] = useState(false);

  let value = siteData;
  for (const key of path) {
    if (value && value[key] !== undefined) {
      value = value[key];
    } else {
      value = undefined;
      break;
    }
  }
  const currentUrl = value !== undefined ? value : fallback;

  if (!isEditMode) {
    return (
      <img 
        src={getCleanImageUrl(currentUrl)} 
        alt={alt}
        className={className}
        style={getImageStyle(currentUrl)} 
      />
    );
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = authToken || "";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "x-developer-token": token },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        // preserve previous parameters if needed, or reset them
        updateNestedValue(path, data.url);
      } else {
        alert(`Upload error: ${data.error}`);
      }
    } catch (err) {
      alert("Network error during upload");
    }
  };

  const scale = Number(getAdjustmentValue(currentUrl, "scale", "1"));
  const x = Number(getAdjustmentValue(currentUrl, "x", "0"));
  const y = Number(getAdjustmentValue(currentUrl, "y", "0"));

  return (
    <div className={`relative group/inline-image inline-block ${className}`}>
      <img 
        src={getCleanImageUrl(currentUrl)} 
        alt={alt}
        className="w-full h-full object-cover"
        style={getImageStyle(currentUrl)} 
      />
      <div 
        className="absolute inset-0 border-2 border-dashed border-transparent group-hover/inline-image:border-teal-500 cursor-pointer transition-colors"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowControls(!showControls);
        }}
      >
        <div className="absolute top-2 right-2 bg-teal-500 text-black text-[9px] font-bold font-mono px-2 py-1 rounded opacity-0 group-hover/inline-image:opacity-100 transition-opacity">
          CLICK TO EDIT IMAGE
        </div>
      </div>

      {showControls && (
        <div 
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-zinc-950 border border-teal-500/40 p-4 rounded-xl shadow-2xl z-[100] font-mono text-[9px] w-64 flex flex-col gap-3"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center border-b border-teal-500/20 pb-2">
            <span className="text-teal-400 font-bold uppercase">Image Controls</span>
            <button onClick={() => setShowControls(false)} className="text-zinc-500 hover:text-white">✕</button>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-1.5 bg-teal-500 hover:bg-teal-400 text-black font-bold uppercase rounded transition-colors"
          >
            Upload New Image
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleUpload} 
          />

          <div className="space-y-2 mt-2">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-zinc-400">
                <span>SCALE / ZOOM</span>
                <span>{scale.toFixed(2)}x</span>
              </div>
              <input
                type="range" min="0.1" max="3" step="0.05" value={scale}
                onChange={(e) => updateNestedValue(path, setAdjustmentValue(currentUrl, "scale", e.target.value))}
                className="accent-teal-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-zinc-400">
                <span>PAN X</span>
                <span>{x}px</span>
              </div>
              <input
                type="range" min="-200" max="200" step="1" value={x}
                onChange={(e) => updateNestedValue(path, setAdjustmentValue(currentUrl, "x", e.target.value))}
                className="accent-teal-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-zinc-400">
                <span>PAN Y</span>
                <span>{y}px</span>
              </div>
              <input
                type="range" min="-200" max="200" step="1" value={y}
                onChange={(e) => updateNestedValue(path, setAdjustmentValue(currentUrl, "y", e.target.value))}
                className="accent-teal-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
