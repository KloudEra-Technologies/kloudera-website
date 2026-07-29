"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

interface EditorContextType {
  isEditMode: boolean;
  siteData: any;
  updateNestedValue: (pathArray: string[], newValue: any) => void;
  publishChanges: () => Promise<void>;
  closeEditor: () => void;
  authToken: string | null;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [siteData, setSiteData] = useState<any>(null);
  // authToken is NEVER persisted — always cleared on close
  const authTokenRef = useRef<string | null>(null);
  const [authToken, setAuthTokenState] = useState<string | null>(null);

  // Helper that keeps both ref and state in sync
  const setAuthToken = (val: string | null) => {
    authTokenRef.current = val;
    setAuthTokenState(val);
  };

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
      // Make all text nodes on the page directly editable
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

        // EXIT: if already in edit mode — clear token immediately, no caching
        if (isEditMode) {
          setIsEditMode(false);
          setAuthToken(null); // ALWAYS cleared on exit — no caching ever
          return;
        }

        // ENTER: always prompt for password, NO caching whatsoever
        const pass = window.prompt("🔐 Enter Editor Password to access Edit Mode:");
        if (!pass || pass.trim() === "") return; // cancelled or empty = do nothing

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
        // Security: always clear token after publish — must re-enter next time
        setIsEditMode(false);
        setAuthToken(null);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to publish: ${err.error || "Authentication failed. Check your password."}`);
        if (res.status === 401 || res.status === 403) {
          // Wrong password — clear everything
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
    setAuthToken(null); // ALWAYS clear on close — never cache the password
  };

  return (
    <EditorContext.Provider value={{ isEditMode, siteData, updateNestedValue, publishChanges, closeEditor, authToken }}>
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
