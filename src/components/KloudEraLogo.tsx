"use client";

import React, { useEffect, useState } from "react";
import { useEditor } from "@/components/editor/EditorContext";

interface KloudEraLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const KloudEraLogo: React.FC<KloudEraLogoProps> = ({ className = "", iconOnly = false }) => {
  const [processedLogoUrl, setProcessedLogoUrl] = useState<string | null>(null);
  const [logoHeight, setLogoHeight] = useState<string>("68px");
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
    const loadLogoAndCrop = async () => {
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

      // Load image and crop transparent borders
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = logoSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setProcessedLogoUrl(logoSrc);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Find bounding box of non-transparent content (alpha > 5)
        let minX = canvas.width;
        let minY = canvas.height;
        let maxX = 0;
        let maxY = 0;
        let hasContent = false;

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const alpha = data[idx + 3];
            if (alpha > 5) {
              hasContent = true;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (!hasContent) {
          setProcessedLogoUrl(logoSrc);
          return;
        }

        // Add 2px safety padding to prevent sub-pixel clipping
        const pad = 2;
        const startX = Math.max(0, minX - pad);
        const startY = Math.max(0, minY - pad);
        const endX = Math.min(canvas.width - 1, maxX + pad);
        const endY = Math.min(canvas.height - 1, maxY + pad);

        const cropWidth = endX - startX + 1;
        const cropHeight = endY - startY + 1;

        const cropCanvas = document.createElement("canvas");
        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;
        const cropCtx = cropCanvas.getContext("2d");
        if (!cropCtx) {
          setProcessedLogoUrl(logoSrc);
          return;
        }

        cropCtx.drawImage(
          canvas,
          startX, startY, cropWidth, cropHeight, // Source bounds
          0, 0, cropWidth, cropHeight            // Destination bounds
        );

        setProcessedLogoUrl(cropCanvas.toDataURL("image/png"));
      };
      img.onerror = () => {
        setProcessedLogoUrl(logoSrc);
      };
    };

    loadLogoAndCrop();
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
          maxHeight: "48px",
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
