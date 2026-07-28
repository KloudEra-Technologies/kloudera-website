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

export const InlineText = ({
  path,
  fallback,
  as: Component = "span",
  className = "",
  multiline = false,
}: InlineTextProps) => {
  const { isEditMode, siteData, updateNestedValue } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  // Extract the value from siteData using path
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
      if (multiline && inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      }
    }
  }, [isEditing, multiline]);

  // Exit editing when edit mode is turned off
  useEffect(() => {
    if (!isEditMode) {
      setIsEditing(false);
    }
  }, [isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    updateNestedValue(path, e.target.value);
    if (multiline && e.target instanceof HTMLTextAreaElement) {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  // Not in edit mode — render normally
  if (!isEditMode) {
    return <Component className={className}>{displayValue}</Component>;
  }

  // In edit mode but not clicked yet — show clickable element with highlight
  if (!isEditing) {
    return (
      <Component
        data-inline-editable="true"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setIsEditing(true);
        }}
        className={`relative cursor-text group/inline-text ${className}`}
        title="Click to edit"
      >
        {displayValue}
        {/* Tooltip */}
        <span
          style={{
            position: "absolute",
            top: "-22px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(20,184,166,1)",
            color: "#000",
            fontSize: "9px",
            fontWeight: "bold",
            fontFamily: "monospace",
            padding: "2px 6px",
            borderRadius: "3px",
            whiteSpace: "nowrap",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 9999,
            transition: "opacity 0.15s",
          }}
          className="group-hover/inline-text:opacity-100"
        >
          ✏️ EDIT
        </span>
      </Component>
    );
  }

  // Actively editing — show input/textarea
  const commonClasses = `bg-black/90 border-2 border-teal-400 rounded p-1 text-inherit w-full outline-none resize-none shadow-[0_0_15px_rgba(20,184,166,0.4)] min-w-[50px] font-inherit ${className}`;

  return multiline ? (
    <textarea
      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={commonClasses}
      style={{ overflow: "hidden" }}
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
};
