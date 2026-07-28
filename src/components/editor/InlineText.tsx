"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEditor } from "./EditorContext";

interface InlineTextProps {
  path: string[];
  fallback: string;
  as?: React.ElementType;
  className?: string;
  multiline?: boolean;
}

export const InlineText = ({ path, fallback, as: Component = "span", className = "", multiline = false }: InlineTextProps) => {
  const { isEditMode, siteData, updateNestedValue } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  // Extract the value from siteData
  let value = siteData;
  for (const key of path) {
    if (value && value[key] !== undefined) {
      value = value[key];
    } else {
      value = undefined;
      break;
    }
  }
  const displayValue = value !== undefined ? value : fallback;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Auto-resize for textarea
      if (multiline && inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      }
    }
  }, [isEditing, multiline]);

  if (!isEditMode) {
    return <Component className={className}>{displayValue}</Component>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateNestedValue(path, e.target.value);
    if (multiline && e.target instanceof HTMLTextAreaElement) {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    const commonClasses = `bg-black/80 border-2 border-teal-500 rounded p-1 text-inherit w-full outline-none resize-none shadow-[0_0_15px_rgba(20,184,166,0.3)] min-w-[50px] font-inherit ${className}`;
    
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={commonClasses}
        style={{ overflow: 'hidden' }}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={commonClasses}
      />
    );
  }

  return (
    <Component 
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`relative cursor-text group/inline-text ${className}`}
      title="Click to edit text"
    >
      <span className="absolute -inset-1 border-2 border-dashed border-transparent group-hover/inline-text:border-teal-500/50 rounded pointer-events-none transition-colors" />
      {displayValue}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-teal-500 text-black text-[9px] font-bold font-mono px-2 py-0.5 rounded opacity-0 group-hover/inline-text:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
        EDIT TEXT
      </div>
    </Component>
  );
};
