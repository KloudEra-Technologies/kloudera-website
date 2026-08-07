"use client";

import React, { useRef, useState, useEffect } from "react";
import { useEditor } from "./EditorContext";
import { getCleanImageUrl, getImageStyle, getAdjustmentValue, setAdjustmentValue } from "@/lib/imageHelper";

interface InlineImageProps {
  path: string[];
  fallback: string;
  className?: string;
  alt?: string;
}

export const InlineImage = ({ path, fallback, className = "", alt = "" }: InlineImageProps) => {
  const { isEditMode, siteData, setActiveImageEdit, activeImageEdit } = useEditor();

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

  // Highlights active border when this image is selected in the global editor context
  const isEditingThis = activeImageEdit && JSON.stringify(activeImageEdit.path) === JSON.stringify(path);

  return (
    <div className={`relative group/inline-image inline-block ${className}`}>
      <img 
        src={getCleanImageUrl(currentUrl)} 
        alt={alt}
        className="w-full h-full"
        style={getImageStyle(currentUrl)} 
      />
      <div 
        className={`absolute inset-0 border-2 border-dashed cursor-pointer transition-colors ${
          isEditingThis ? "border-teal-400 bg-teal-500/10" : "border-transparent group-hover/inline-image:border-teal-500"
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setActiveImageEdit({ path, fallback, currentUrl });
        }}
      >
        <div className="absolute top-2 right-2 bg-teal-500 text-black text-[9px] font-bold font-mono px-2 py-1 rounded opacity-0 group-hover/inline-image:opacity-100 transition-opacity">
          CLICK TO EDIT IMAGE
        </div>
      </div>
    </div>
  );
};
