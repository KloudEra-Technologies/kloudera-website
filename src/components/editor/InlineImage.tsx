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
  const [localPreview, setLocalPreview] = useState<string | null>(null);

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
  const displayUrl = localPreview || currentUrl;

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

    // Set local preview instantly
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    const token = authToken || "";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", token);
    formData.append("path", path.join("_"));

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "x-developer-token": token },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        updateNestedValue(path, data.url);
      } else {
        alert(`Upload error: ${data.error}`);
      }
    } catch (err) {
      alert("Network error during upload");
    }
  };

  const scale = Number(getAdjustmentValue(displayUrl, "scale", "1"));
  const x = Number(getAdjustmentValue(displayUrl, "x", "0"));
  const y = Number(getAdjustmentValue(displayUrl, "y", "0"));
  const fit = getAdjustmentValue(displayUrl, "fit", "cover");

  return (
    <div className={`relative group/inline-image inline-block ${className}`}>
      <img 
        src={getCleanImageUrl(displayUrl)} 
        alt={alt}
        className="w-full h-full"
        style={getImageStyle(displayUrl)} 
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
        <>
          {/* Click outside to close overlay (completely transparent so it doesn't block the image view) */}
          <div 
            className="fixed inset-0 z-[99998]"
            onClick={() => setShowControls(false)}
          />
          {/* Floating side panel on the right side of the screen */}
          <div 
            className="fixed right-6 top-24 w-80 bg-zinc-950/95 border border-teal-500/40 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] font-mono text-[10px] flex flex-col gap-4 text-left text-zinc-100 z-[99999] backdrop-blur-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-teal-500/20 pb-3">
              <span className="text-teal-400 font-bold uppercase tracking-wider">Image Settings</span>
              <button onClick={() => setShowControls(false)} className="text-zinc-500 hover:text-white text-sm">✕</button>
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
              onChange={handleUpload} 
            />

            <div className="space-y-3 mt-1">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-zinc-400 text-[9px] uppercase tracking-wider">
                  <span>IMAGE FITTING</span>
                </div>
                <select
                  value={fit}
                  onChange={(e) => updateNestedValue(path, setAdjustmentValue(currentUrl, "fit", e.target.value))}
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
                  onChange={(e) => updateNestedValue(path, setAdjustmentValue(currentUrl, "scale", e.target.value))}
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
                  onChange={(e) => updateNestedValue(path, setAdjustmentValue(currentUrl, "x", e.target.value))}
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
                  onChange={(e) => updateNestedValue(path, setAdjustmentValue(currentUrl, "y", e.target.value))}
                  className="accent-teal-500 w-full"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
