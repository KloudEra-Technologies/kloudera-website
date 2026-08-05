"use client";

import React, { useEffect, useState } from "react";
import { useEditor } from "@/components/editor/EditorContext";

interface KloudEraLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const KloudEraLogo: React.FC<KloudEraLogoProps> = ({ className = "", iconOnly = false }) => {
  const [processedLogoUrl, setProcessedLogoUrl] = useState<string | null>("/logo.png");
  const [logoHeight, setLogoHeight] = useState<string>("36px");
  const [logoLeft, setLogoLeft] = useState<string>("0px");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  let editorContext: any;
  try {
    editorContext = useEditor();
  } catch (e) {
    editorContext = { isEditMode: false, authToken: "", updateNestedValue: () => {} };
  }
  const { isEditMode, authToken, updateNestedValue } = editorContext;

  useEffect(() => {
    const loadLogo = async () => {
      let logoSrc = "/logo.png";
      try {
        const res = await fetch("/api/website-content", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.brand?.logoHeight) {
            setLogoHeight(data.brand.logoHeight);
          }
          if (data.brand?.logoLeft) {
            setLogoLeft(data.brand.logoLeft);
          }
          if (data.brand?.logoUrl) {
            logoSrc = data.brand.logoUrl;
          }
        }
      } catch (e) {}
      setProcessedLogoUrl(logoSrc);
    };

    loadLogo();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = authToken || "";
    const formData = new FormData();
    formData.append("logo", file);
    formData.append("token", token);

    try {
      const res = await fetch("/api/upload-logo", {
        method: "POST",
        headers: { "x-developer-token": token },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        // Force refresh logo
        const newUrl = `/logo.png?t=${Date.now()}`;
        setProcessedLogoUrl(newUrl);
        updateNestedValue(["brand", "logoUrl"], newUrl);
        alert("Logo uploaded successfully!");
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch (err) {
      alert("Network error uploading logo");
    }
  };

  return (
    <div 
      className={`flex items-center justify-center pr-6 relative group ${className}`}
      style={{ marginLeft: iconOnly ? "0px" : logoLeft }}
      onClick={(e) => {
        if (isEditMode) {
          e.preventDefault();
          e.stopPropagation();
          fileInputRef.current?.click();
        }
      }}
    >
      <img
        src={processedLogoUrl || "/logo.png"}
        alt="KloudEra Technologies"
        style={{ 
          height: iconOnly ? "44px" : logoHeight, 
          maxHeight: "54px",
          width: "auto"
        }}
        className="object-contain"
      />
      {isEditMode && (
        <>
          <div className="absolute inset-0 border border-dashed border-teal-500 hover:bg-teal-500/20 flex items-center justify-center cursor-pointer transition-all rounded">
            <span className="bg-teal-500 text-black text-[8px] font-bold font-mono px-1 py-0.5 rounded shadow">
              EDIT LOGO
            </span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleLogoUpload} 
          />
        </>
      )}
    </div>
  );
};
