"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface EditorContextType {
  isEditMode: boolean;
  siteData: any;
  updateNestedValue: (pathArray: string[], newValue: any) => void;
  publishChanges: () => Promise<void>;
  closeEditor: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [siteData, setSiteData] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch of site data so we have it ready if we enter edit mode
    fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })
      .then(res => res.json())
      .then(data => setSiteData(data))
      .catch(console.error);

    const savedToken = localStorage.getItem("dev_token");
    if (savedToken) setAuthToken(savedToken);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + E
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        
        let token = authToken;
        if (!token) {
          const pass = window.prompt("Enter Editor Password to access Canva Mode:");
          if (!pass) return;
          token = pass;
        }

        // Validate token visually (basic check, actual validation on publish)
        localStorage.setItem("dev_token", token);
        setAuthToken(token);
        setIsEditMode(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [authToken]);

  const updateNestedValue = (pathArray: string[], newValue: any) => {
    setSiteData((prev: any) => {
      if (!prev) return prev;
      const copy = JSON.parse(JSON.stringify(prev));
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
    if (!authToken || !siteData) {
      alert("Missing authentication or data.");
      return;
    }

    try {
      const res = await fetch("/api/website-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-developer-token": authToken
        },
        body: JSON.stringify(siteData)
      });

      if (res.ok) {
        alert("✅ Changes published live successfully!");
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to publish: ${err.error || "Authentication failed"}`);
        // If auth failed, clear it
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("dev_token");
          setAuthToken(null);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Network error publishing changes.");
    }
  };

  const closeEditor = () => {
    setIsEditMode(false);
  };

  return (
    <EditorContext.Provider value={{ isEditMode, siteData, updateNestedValue, publishChanges, closeEditor }}>
      {children}
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
