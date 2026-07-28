"use client";

import React, { useState, useEffect } from "react";
import ProfessionalBlueHome from "@/components/ProfessionalBlueHome";

type PageKey = "home" | "services" | "products" | "achievements" | "clienteles" | "certifications" | "about" | "careers" | "contact" | "security" | "brand" | "partners";

export default function DeveloperPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessLevel, setAccessLevel] = useState<"content" | "ultimate" | null>(null);
  
  // 2-Step Login Flow States
  const [loginStep, setLoginStep] = useState<"select_role" | "enter_password">("select_role");
  const [targetRole, setTargetRole] = useState<"content" | "ultimate" | null>(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [siteData, setSiteData] = useState<any>(null);
  const [selectedPage, setSelectedPage] = useState<PageKey>("home");
  const [selectedElement, setSelectedElement] = useState<{ path: string[]; type: "text" | "list" | "door"; value: any } | null>(null);
  const [editorMode, setEditorMode] = useState<"edit" | "preview">("edit");
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Security password & audit management state
  const [newContentPass, setNewContentPass] = useState("");
  const [newUltimatePass, setNewUltimatePass] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [showPassToggle, setShowPassToggle] = useState(false);
  const [passSaveMsg, setPassSaveMsg] = useState("");
  const [passSaveErr, setPassSaveErr] = useState("");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // SMTP & API Settings State
  const [apiKey, setApiKey] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [testEmailStatus, setTestEmailStatus] = useState<{ msg: string; success: boolean } | null>(null);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  // Logo upload state management
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Canva interactive state management
  const [brandEditorMode, setBrandEditorMode] = useState<"visual" | "structured">("visual");
  const [draggingElement, setDraggingElement] = useState<"logo" | "companyName" | "tagline" | null>(null);
  const [resizingElement, setResizingElement] = useState<"logo" | "companyName" | "tagline" | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dimensionsStart, setDimensionsStart] = useState({ width: 0, height: 0, left: 0 });
  const [activeCanvaElement, setActiveCanvaElement] = useState<"logo" | "companyName" | "tagline" | null>(null);

  const handleMouseDown = (
    e: React.MouseEvent,
    element: "logo" | "companyName" | "tagline",
    isResize: boolean
  ) => {
    e.stopPropagation();
    e.preventDefault();
    
    setActiveCanvaElement(element);

    const pathMap = {
      logo: ["brand", "logoHeight"],
      companyName: ["brand", "companyName"],
      tagline: ["brand", "tagline"]
    };

    setSelectedElement({
      path: pathMap[element],
      type: "text",
      value: element === "logo" 
        ? siteData?.brand?.logoHeight || "68px" 
        : element === "companyName" 
        ? siteData?.brand?.companyName 
        : siteData?.brand?.tagline
    });

    if (isResize) {
      setResizingElement(element);
      const currentHeight = element === "logo" 
        ? parseInt(siteData?.brand?.logoHeight || "68") 
        : element === "companyName"
        ? parseInt(siteData?.brand?.companyNameSize || "20")
        : parseInt(siteData?.brand?.taglineSize || "12");
      setDimensionsStart({
        width: 0,
        height: currentHeight,
        left: parseInt(siteData?.brand?.[`${element}Left`] || "0")
      });
    } else {
      setDraggingElement(element);
      setDimensionsStart({
        width: 0,
        height: 0,
        left: parseInt(siteData?.brand?.[`${element}Left`] || "0")
      });
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const targetResize = resizingElement;
      const targetDrag = draggingElement;

      if (targetResize) {
        const deltaY = e.clientY - dragStart.y;
        if (targetResize === "logo") {
          const newHeight = Math.max(24, Math.min(180, dimensionsStart.height + deltaY));
          updateNestedValue(["brand", "logoHeight"], `${newHeight}px`);
        } else if (targetResize === "companyName") {
          const newSize = Math.max(12, Math.min(72, dimensionsStart.height + deltaY / 2));
          updateNestedValue(["brand", "companyNameSize"], `${newSize}px`);
        } else if (targetResize === "tagline") {
          const newSize = Math.max(8, Math.min(48, dimensionsStart.height + deltaY / 2));
          updateNestedValue(["brand", "taglineSize"], `${newSize}px`);
        }
      } else if (targetDrag) {
        const deltaX = e.clientX - dragStart.x;
        const newLeft = Math.max(-100, Math.min(600, dimensionsStart.left + deltaX));
        updateNestedValue(["brand", `${targetDrag}Left`], `${newLeft}px`);
      }
    };

    const handleMouseUp = () => {
      setDraggingElement(null);
      setResizingElement(null);
    };

    if (draggingElement || resizingElement) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingElement, resizingElement, dragStart, dimensionsStart]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setUploadSuccess(false);
    setUploadError(null);

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await fetch("/api/upload-logo", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setUploadSuccess(true);
        // Force refresh all frames
        const iframe = document.querySelector("iframe");
        if (iframe) {
          iframe.src = iframe.src;
        }
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        const data = await res.json();
        setUploadError(data.error || "Upload failed");
      }
    } catch (err: any) {
      setUploadError(err.message || "Upload error");
    } finally {
      setUploadingLogo(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch("/api/admin-audit", { cache: "no-store" });
      if (res.ok) {
        const d = await res.json();
        if (d.logs) setAuditLogs(d.logs);
      }
    } catch (err) {
      console.error("Failed to load audit logs", err);
    }
  };

  const handleSendTestEmail = async () => {
    setSendingTestEmail(true);
    setTestEmailStatus(null);
    const targetEmail = newAdminEmail.trim() || siteData?.credentials?.adminEmail || "admin@kloudera.ai";
    const emailConfig = {
      apiKey: apiKey.trim() || siteData?.credentials?.emailConfig?.apiKey || "",
      smtpHost: smtpHost.trim() || siteData?.credentials?.emailConfig?.smtpHost || "smtp.office365.com",
      smtpPort: Number(smtpPort) || siteData?.credentials?.emailConfig?.smtpPort || 587,
      smtpUser: smtpUser.trim() || siteData?.credentials?.emailConfig?.smtpUser || targetEmail,
      smtpPass: smtpPass.trim() || siteData?.credentials?.emailConfig?.smtpPass || "",
      fromEmail: fromEmail.trim() || siteData?.credentials?.emailConfig?.fromEmail || "no-reply@kloudera.ai"
    };

    try {
      const res = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail: targetEmail, emailConfig })
      });
      const data = await res.json();
      if (data.success) {
        setTestEmailStatus({ success: true, msg: `✅ ${data.message}` });
      } else {
        setTestEmailStatus({ success: false, msg: `⚠️ ${data.message}` });
      }
      fetchAuditLogs();
    } catch (err: any) {
      setTestEmailStatus({ success: false, msg: `❌ Network error: ${err.message}` });
    } finally {
      setSendingTestEmail(false);
    }
  };

  useEffect(() => {
    if (selectedPage === "security") {
      fetchAuditLogs();
    }
  }, [selectedPage]);

  // Load configuration
  useEffect(() => {
    const token = localStorage.getItem("dev_token");
    if (token) {
      fetchContent(token);
    }
  }, []);

  const fetchContent = async (token: string) => {
    try {
      const res = await fetch("/api/website-content", {
        headers: { "x-developer-token": token },
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        setSiteData(data);
        const creds = data.credentials || { contentPassword: "content123", ultimatePassword: "admin" };
        
        if (token === creds.ultimatePassword) {
          setAccessLevel("ultimate");
          setIsAuthenticated(true);
        } else if (token === creds.contentPassword) {
          setAccessLevel("content");
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("dev_token");
          setIsAuthenticated(false);
          setLoginStep("select_role");
        }
      } else {
        localStorage.removeItem("dev_token");
        setIsAuthenticated(false);
        setLoginStep("select_role");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectRole = (role: "content" | "ultimate") => {
    setTargetRole(role);
    setLoginStep("enter_password");
    setPassword("");
    setErrorMsg("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const token = password.trim();

    if (!targetRole) {
      setErrorMsg("Please select an access tier.");
      return;
    }

    try {
      const res = await fetch("/api/website-content", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const creds = data.credentials || { contentPassword: "content123", ultimatePassword: "admin" };

        if (targetRole === "ultimate") {
          if (token === creds.ultimatePassword) {
            localStorage.setItem("dev_token", token);
            setAccessLevel("ultimate");
            setIsAuthenticated(true);
            setSiteData(data);
          } else {
            setErrorMsg("Incorrect password for Ultimate Access Master.");
          }
        } else if (targetRole === "content") {
          if (token === creds.contentPassword) {
            localStorage.setItem("dev_token", token);
            setAccessLevel("content");
            setIsAuthenticated(true);
            setSiteData(data);
          } else {
            setErrorMsg("Incorrect password for Content Level Access.");
          }
        }
      } else {
        setErrorMsg("Failed to fetch security credentials.");
      }
    } catch (err) {
      setErrorMsg("Network error verifying password.");
    }
  };

  const handleUpdatePasswords = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accessLevel !== "ultimate") {
      setPassSaveErr("Forbidden. Only Ultimate Access Master can change passwords.");
      return;
    }

    setPassSaveMsg("");
    setPassSaveErr("");

    const updatedContentPass = newContentPass.trim() || siteData?.credentials?.contentPassword || "content123";
    const updatedUltimatePass = newUltimatePass.trim() || siteData?.credentials?.ultimatePassword || "admin";
    const updatedAdminEmail = newAdminEmail.trim() || siteData?.credentials?.adminEmail || "admin@kloudera.ai";
    const updatedEmailConfig = {
      apiKey: apiKey.trim() || siteData?.credentials?.emailConfig?.apiKey || "",
      smtpHost: smtpHost.trim() || siteData?.credentials?.emailConfig?.smtpHost || "smtp.office365.com",
      smtpPort: Number(smtpPort) || siteData?.credentials?.emailConfig?.smtpPort || 587,
      smtpUser: smtpUser.trim() || siteData?.credentials?.emailConfig?.smtpUser || updatedAdminEmail,
      smtpPass: smtpPass.trim() || siteData?.credentials?.emailConfig?.smtpPass || "",
      fromEmail: fromEmail.trim() || siteData?.credentials?.emailConfig?.fromEmail || "no-reply@kloudera.ai",
      webhookUrl: ""
    };

    const updatedData = {
      ...siteData,
      credentials: {
        contentPassword: updatedContentPass,
        ultimatePassword: updatedUltimatePass,
        adminEmail: updatedAdminEmail,
        emailConfig: updatedEmailConfig
      }
    };

    const token = localStorage.getItem("dev_token") || "";

    try {
      const res = await fetch("/api/website-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-developer-token": token
        },
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        setSiteData(updatedData);
        setPassSaveMsg(`✅ Security settings & credentials updated successfully! Notification record sent to ${updatedAdminEmail}.`);
        if (newUltimatePass.trim()) {
          localStorage.setItem("dev_token", newUltimatePass.trim());
        }
        setNewContentPass("");
        setNewUltimatePass("");
        setNewAdminEmail("");
        fetchAuditLogs();
      } else {
        const errJson = await res.json();
        setPassSaveErr(errJson.error || "Failed to update security credentials.");
      }
    } catch (err) {
      setPassSaveErr("Network error updating passwords.");
    }
  };

  // Update value in nested state path
  const updateNestedValue = (pathArray: string[], newValue: any) => {
    setSiteData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let current = copy;
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      current[pathArray[pathArray.length - 1]] = newValue;
      return copy;
    });

    // Update selected element value in real time
    if (selectedElement) {
      setSelectedElement((prev) => (prev ? { ...prev, value: newValue } : null));
    }
  };

  // Add new item to an array path
  const addItemToArray = (pathArray: string[], defaultItem: any) => {
    setSiteData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let current = copy;
      for (let i = 0; i < pathArray.length - 1; i++) {
        if (!current[pathArray[i]]) current[pathArray[i]] = {};
        current = current[pathArray[i]];
      }
      const lastKey = pathArray[pathArray.length - 1];
      if (!Array.isArray(current[lastKey])) {
        current[lastKey] = [];
      }
      current[lastKey].push(defaultItem);
      return copy;
    });
  };

  // Remove item from an array path
  const removeItemFromArray = (pathArray: string[], index: number) => {
    setSiteData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let current = copy;
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      const lastKey = pathArray[pathArray.length - 1];
      if (Array.isArray(current[lastKey])) {
        current[lastKey].splice(index, 1);
      }
      return copy;
    });
    setSelectedElement(null);
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPublishSuccess(false);
    const token = localStorage.getItem("dev_token") || "";

    try {
      const res = await fetch("/api/website-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-developer-token": token
        },
        body: JSON.stringify(siteData)
      });

      if (res.ok) {
        setPublishSuccess(true);
        setTimeout(() => setPublishSuccess(false), 3000);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to publish changes: ${errData.error || "Check access token."}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error publishing changes.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("dev_token");
    setIsAuthenticated(false);
    setAccessLevel(null);
    setTargetRole(null);
    setLoginStep("select_role");
    setPassword("");
    setErrorMsg("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center font-sans p-4">
        <div className="max-w-xl w-full p-8 border border-teal-500/30 bg-zinc-950 rounded-2xl shadow-[0_0_50px_rgba(20,184,166,0.15)] font-mono text-xs space-y-6">
          <div className="border-b border-teal-500/20 pb-4 text-center space-y-1">
            <span className="text-[10px] text-teal-400 font-bold tracking-widest uppercase">KLOUDERA CANVA EDITOR // ACCESS GATE</span>
            <h1 className="text-2xl font-black tracking-widest text-white uppercase">
              DEVELOPER PORTAL
            </h1>
          </div>

          {/* STEP 1: Select Access Level */}
          {loginStep === "select_role" && (
            <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-teal-300 block">SELECT REQUIRED ACCESS LEVEL</span>
                <p className="text-[10px] text-zinc-400">Which level of authorization are you trying to access?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Content Level Card */}
                <button
                  type="button"
                  onClick={() => handleSelectRole("content")}
                  className="p-5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-950/50 hover:border-cyan-400 transition-all text-left space-y-3 group cursor-pointer shadow-lg hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400 text-sm group-hover:text-cyan-300">📝 CONTENT LEVEL</span>
                    <span className="text-[8px] bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded border border-cyan-700 font-bold">TIER 1</span>
                  </div>
                  <p className="text-[9.5px] text-zinc-400 leading-relaxed group-hover:text-zinc-300">
                    Edit website text, products, achievements, clienteles, certifications & contact info. Cannot modify system security passwords.
                  </p>
                  <div className="text-[9px] text-cyan-400 font-bold pt-1 flex items-center justify-between">
                    <span>Select Content Access</span>
                    <span>→</span>
                  </div>
                </button>

                {/* Ultimate Access Card */}
                <button
                  type="button"
                  onClick={() => handleSelectRole("ultimate")}
                  className="p-5 rounded-xl border border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/50 hover:border-amber-400 transition-all text-left space-y-3 group cursor-pointer shadow-lg hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-sm group-hover:text-amber-300">🔑 ULTIMATE ACCESS</span>
                    <span className="text-[8px] bg-amber-900 text-amber-200 px-2 py-0.5 rounded border border-amber-700 font-bold">TIER 2 (MASTER)</span>
                  </div>
                  <p className="text-[9.5px] text-zinc-400 leading-relaxed group-hover:text-zinc-300">
                    Full site content editing + Security Governance to change Content & Master passwords.
                  </p>
                  <div className="text-[9px] text-amber-400 font-bold pt-1 flex items-center justify-between">
                    <span>Select Master Access</span>
                    <span>→</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Password Authentication */}
          {loginStep === "enter_password" && targetRole && (
            <form onSubmit={handleLogin} className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/60 font-mono">
                <span className="text-[10px] text-zinc-400 font-bold">SELECTED LEVEL:</span>
                {targetRole === "ultimate" ? (
                  <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-3 py-1 rounded border border-amber-500/40">
                    🔑 ULTIMATE ACCESS MASTER
                  </span>
                ) : (
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded border border-cyan-500/40">
                    📝 CONTENT LEVEL EDITOR
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-zinc-300 text-[10px] uppercase font-bold tracking-wider">
                  ENTER PASSWORD FOR {targetRole === "ultimate" ? "ULTIMATE MASTER" : "CONTENT LEVEL"} ACCESS
                </label>
                <input
                  autoFocus
                  required
                  type="password"
                  placeholder={targetRole === "ultimate" ? "Enter Ultimate Master Password..." : "Enter Content Level Password..."}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black border border-teal-500/40 focus:border-teal-300 rounded-xl p-3.5 text-white focus:outline-none text-center text-sm tracking-wider shadow-inner"
                />
              </div>

              {errorMsg && <p className="text-red-400 text-center text-[10px] font-bold bg-red-950/50 p-2 rounded border border-red-900">{errorMsg}</p>}

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-extrabold uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] cursor-pointer text-xs tracking-wider"
                >
                  AUTHENTICATE & ENTER EDITOR
                </button>

                <button
                  type="button"
                  onClick={() => { setLoginStep("select_role"); setTargetRole(null); setErrorMsg(""); }}
                  className="w-full py-2 bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 font-bold uppercase rounded-xl transition-all text-[10px] tracking-wider cursor-pointer border border-zinc-800"
                >
                  ← CHOOSE DIFFERENT ACCESS LEVEL
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="min-h-screen bg-black text-teal-400 flex items-center justify-center font-mono">
        LOADING DEVELOPMENT CORE DATA CONSOLE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-teal-500/30">
      
      {/* Top publisher navigation bar */}
      <header className="developer-header border-b border-teal-500/20 bg-zinc-950/80 p-4 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-black font-extrabold font-mono text-sm shadow-[0_0_10px_rgba(20,184,166,0.4)]">
            KC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-black tracking-widest text-white uppercase font-mono">
                KLOUDERA CANVA EDITOR
              </h1>
              {accessLevel === "ultimate" ? (
                <span className="text-[9px] font-mono font-bold bg-amber-950/90 text-amber-300 px-2 py-0.5 rounded border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  🔑 ULTIMATE MASTER ACCESS
                </span>
              ) : (
                <span className="text-[9px] font-mono font-bold bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/50">
                  📝 CONTENT LEVEL ACCESS
                </span>
              )}
            </div>
            <span className="text-[8.5px] text-zinc-500 font-mono">SYSTEM_VERSION // 1.3.0 // 2-TIER AUTH</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-6 py-2 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 text-black font-bold uppercase rounded font-mono text-[10px] tracking-wider transition-all shadow-[0_0_15px_rgba(20,184,166,0.4)] cursor-pointer"
          >
            {publishing ? "SAVING PACKETS..." : "PUBLISH TO LIVE SITE"}
          </button>
          
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 border border-zinc-700 hover:border-red-500 text-zinc-400 hover:text-red-400 font-mono text-[9px] uppercase rounded transition-all cursor-pointer"
          >
            LOCK CONSOLE
          </button>
        </div>
      </header>

      {/* Main Workspace Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        
        {/* Left Navigator Sidebar */}
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-teal-500/10 bg-zinc-950 p-3 lg:p-5 flex flex-row lg:flex-col justify-between items-center lg:items-stretch gap-4 select-none font-mono text-xs overflow-x-auto shrink-0">
          <div className="w-full">
            <span className="text-[8px] text-zinc-500 uppercase tracking-widest block mb-2 hidden lg:block">PAGE SELECTOR</span>
            <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
              {(["home", "brand", "services", "products", "achievements", "clienteles", "certifications", "about", "careers", "contact", "partners"] as PageKey[]).map((p) => (
                <button
                  key={p}
                  onClick={() => { setSelectedPage(p); setSelectedElement(null); }}
                  className={`whitespace-nowrap text-left px-3 py-2 rounded transition-all uppercase text-[10px] tracking-wider cursor-pointer ${
                    selectedPage === p 
                      ? "bg-teal-500/10 border-b-2 lg:border-b-0 lg:border-l-2 border-teal-500 text-teal-400 font-bold" 
                      : "text-zinc-400 hover:bg-zinc-900"
                  }`}
                >
                  📁 // {p === "brand" ? "BRAND & LOGO" : p}
                </button>
              ))}

              {/* Security & Password Governance Button */}
              {accessLevel === "ultimate" ? (
                <button
                  onClick={() => { setSelectedPage("security"); setSelectedElement(null); }}
                  className={`whitespace-nowrap text-left px-3 py-2 rounded transition-all uppercase text-[10px] tracking-wider cursor-pointer mt-2 border ${
                    selectedPage === "security"
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                      : "border-amber-500/30 text-amber-400/80 hover:bg-amber-950/40"
                  }`}
                >
                  🔑 // SECURITY & PASSWORDS
                </button>
              ) : (
                <button
                  disabled
                  title="Password Manager requires Ultimate Master Access"
                  className="whitespace-nowrap text-left px-3 py-1.5 rounded transition-all uppercase text-[9px] tracking-wider mt-2 border border-zinc-900 text-zinc-600 opacity-60 cursor-not-allowed"
                >
                  🔒 // PASSWORDS (LOCKED)
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-teal-500/10 pt-4 flex-1">
            <span className="text-[8px] text-zinc-500 uppercase tracking-widest block mb-3">CANVA DESKTOP</span>
            <p className="text-[9.5px] text-zinc-400 leading-relaxed">
              Click on any text block, heading, button, or card in the preview panel to edit its values in real-time. Changes are applied locally immediately; click "Publish" to save.
            </p>
          </div>
        </aside>

        {/* Center WYSIWYG Preview Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-zinc-900/30 flex justify-center items-start">
          <div className="bg-black border border-zinc-800 shadow-2xl relative min-h-[600px] flex flex-col justify-between selection:bg-teal-500/20 w-full max-w-5xl rounded-xl p-6 sm:p-8 mx-auto">
            {/* Live website preview markup */}
            <div className="space-y-12">
              
              {/* Header bar with Mode Switcher & Device Viewport Selector */}
              <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center text-xs">
                {/* Primary Mode Toggle: Edit vs Device Preview */}
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-teal-500/20 font-mono text-[9.5px]">
                  <button
                    onClick={() => setEditorMode("edit")}
                    className={`px-3 py-1.5 rounded transition-all flex items-center gap-2 cursor-pointer font-bold ${
                      editorMode === "edit"
                        ? "bg-teal-500 text-black shadow-[0_0_12px_rgba(20,184,166,0.4)]"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>🛠️</span>
                    <span>EDIT CONTENT MODE</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditorMode("preview");
                      if (viewportMode === "desktop") setViewportMode("mobile");
                    }}
                    className={`px-3 py-1.5 rounded transition-all flex items-center gap-2 cursor-pointer font-bold ${
                      editorMode === "preview"
                        ? "bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>👁️</span>
                    <span>DEVICE PREVIEW MODE</span>
                  </button>
                </div>

                {/* Device Viewport Toggle (Active in Preview Mode) */}
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 font-mono text-[9px]">
                  <button
                    onClick={() => { setEditorMode("preview"); setViewportMode("desktop"); }}
                    className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                      editorMode === "preview" && viewportMode === "desktop"
                        ? "bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>🖥️</span>
                    <span className="hidden sm:inline">DESKTOP</span>
                  </button>

                  <button
                    onClick={() => { setEditorMode("preview"); setViewportMode("tablet"); }}
                    className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                      editorMode === "preview" && viewportMode === "tablet"
                        ? "bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>💻</span>
                    <span className="hidden sm:inline">TABLET</span>
                  </button>

                  <button
                    onClick={() => { setEditorMode("preview"); setViewportMode("mobile"); }}
                    className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                      editorMode === "preview" && viewportMode === "mobile"
                        ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>📱</span>
                    <span>MOBILE</span>
                  </button>
                </div>
              </div>

              {/* ----------------- 1. LIVE DEVICE PREVIEW MODE ----------------- */}
              {editorMode === "preview" && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                  <div className="text-center font-mono text-[9.5px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/40 border border-cyan-500/20 py-2 rounded-lg flex items-center justify-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>AUTHENTIC LIVE {viewportMode.toUpperCase()} VIEWPORT PREVIEW (http://localhost:3000/{
                      selectedPage === "brand" || selectedPage === "security"
                        ? ""
                        : selectedPage === "home"
                        ? ""
                        : selectedPage
                    })</span>
                  </div>

                  <div className={`mx-auto bg-black border border-blue-900/40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 disable-custom-cursor cursor-auto ${
                    viewportMode === "mobile" 
                      ? "w-[375px] max-w-full h-[667px] border-[6px] border-zinc-800 rounded-[2.5rem] p-0 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative" 
                      : viewportMode === "tablet"
                      ? "w-[720px] max-w-full h-[700px] border-[6px] border-zinc-800 rounded-2xl p-0 shadow-[0_0_40px_rgba(6,182,212,0.2)] relative"
                      : "w-full h-[750px] border border-zinc-800 rounded-lg p-0"
                  }`}>
                    {viewportMode === "mobile" && (
                      <div className="sticky top-0 z-50 bg-[#030712] pt-2 pb-1 border-b border-blue-900/40 shrink-0">
                        <div className="w-20 h-2.5 bg-zinc-900 border border-zinc-800 rounded-full mx-auto flex items-center justify-center">
                          <div className="w-6 h-0.5 bg-zinc-700 rounded-full" />
                        </div>
                      </div>
                    )}

                    <iframe
                      src={
                        selectedPage === "brand" || selectedPage === "security"
                          ? "/"
                          : `/${selectedPage === "home" ? "" : selectedPage}`
                      }
                      className="w-full h-full border-0 bg-[#030712] disable-custom-cursor cursor-auto"
                      title="Live Real Website Viewport"
                    />
                  </div>
                </div>
              )}

              {/* ----------------- 2. STRUCTURED EDIT CONTENT MODE ----------------- */}
              {editorMode === "edit" && (
                <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
                  {selectedPage === "home" && (
                    <div className="space-y-8 font-mono">
                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["home", "heroTitleHighlight"], type: "text", value: siteData?.home?.heroTitleHighlight || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">HERO_TITLE_HIGHLIGHT (EDITABLE)</span>
                        <h2 className="text-sm font-bold text-white uppercase">{siteData?.home?.heroTitleHighlight || "Zero-Trust"}</h2>
                      </div>

                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["home", "heroSubtitle"], type: "text", value: siteData?.home?.heroSubtitle || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">HERO_SUBTITLE (EDITABLE)</span>
                        <p className="text-zinc-400 text-xs">{siteData?.home?.heroSubtitle}</p>
                      </div>

                      <div className="space-y-4 pt-4">
                        <span className="text-[8px] text-zinc-500 font-bold block uppercase tracking-wider">Solution Cards</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(siteData?.home?.solutionCards || []).map((card: any, idx: number) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedElement({ path: ["home", "solutionCards", idx.toString()], type: "door", value: card })}
                              className={`p-4 border rounded-lg bg-zinc-950/50 hover:bg-zinc-950 transition-all cursor-pointer ${
                                selectedElement?.path.join(".") === `home.solutionCards.${idx}` ? "border-teal-400 ring-1 ring-teal-400" : "border-zinc-800"
                              }`}
                            >
                              <span className="text-[8px] text-teal-400 font-bold block mb-1">{card.category}</span>
                              <h4 className="font-bold text-white text-xs mb-1">{card.title}</h4>
                              <p className="text-zinc-400 text-[10px] leading-relaxed">{card.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                        <span className="text-[8px] text-zinc-500 font-bold block uppercase tracking-wider">3D Gallery Corridor Doors</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(siteData?.home?.doors || []).map((door: any, idx: number) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedElement({ path: ["home", "doors", idx.toString()], type: "door", value: door })}
                              className={`p-4 border rounded-lg bg-zinc-950/50 hover:bg-zinc-950 transition-all cursor-pointer ${
                                selectedElement?.path.join(".") === `home.doors.${idx}` ? "border-teal-400 ring-1 ring-teal-400" : "border-zinc-800"
                              }`}
                            >
                              <span className="text-[8px] text-zinc-500 block mb-1">DOOR_UNIT {idx + 1}</span>
                              <h4 className="font-bold text-white text-xs mb-1" style={{ color: door.color }}>{door.name}</h4>
                              <p className="text-zinc-400 text-[10px] leading-relaxed">{door.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPage === "brand" && (
                    <div className="space-y-6 font-mono">
                      {/* Brand Editor Mode Switcher */}
                      <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-teal-500/20 max-w-[320px]">
                        <button
                          type="button"
                          onClick={() => setBrandEditorMode("visual")}
                          className={`flex-1 text-center py-1.5 rounded transition-all font-bold text-[9px] uppercase cursor-pointer ${
                            brandEditorMode === "visual"
                              ? "bg-teal-500 text-black shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          🎨 Canva Visual Canvas
                        </button>
                        <button
                          type="button"
                          onClick={() => setBrandEditorMode("structured")}
                          className={`flex-1 text-center py-1.5 rounded transition-all font-bold text-[9px] uppercase cursor-pointer ${
                            brandEditorMode === "structured"
                              ? "bg-teal-500 text-black shadow-[0_0_10px_rgba(20,184,166,0.3)]"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          📝 Structured Form
                        </button>
                      </div>

                      {brandEditorMode === "visual" ? (
                        <div className="space-y-4">
                          <div className="bg-zinc-950/80 border border-teal-500/20 rounded-xl p-3.5 text-[9.5px] leading-relaxed text-zinc-400 flex items-start gap-2.5 shadow-md">
                            <span className="text-teal-400 font-bold shrink-0">💡 GUIDE:</span>
                            <p>
                              Click on the <strong className="text-teal-300">Logo</strong>, <strong className="text-teal-300">Company Name</strong>, or <strong className="text-teal-300">Tagline</strong> inside the canvas below to select it.
                              <br />
                              • <strong className="text-white">Drag the element</strong> to slide it horizontally.
                              <br />
                              • <strong className="text-white">Drag the bottom-right corner handle</strong> to scale its size dynamically.
                            </p>
                          </div>

                          {/* Interactive Canva Gridboard container */}
                          <div className="relative border border-zinc-800 rounded-xl bg-[#030712] p-8 flex flex-col justify-center items-center min-h-[240px] select-none overflow-hidden group shadow-[inset_0_0_30px_rgba(0,0,0,0.95)]">
                            {/* Visual Grid Layer */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-950/40 via-black to-black opacity-90 pointer-events-none" />
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b2a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b2a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                            <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 p-5 border border-zinc-800 bg-zinc-950/90 rounded-xl shadow-2xl">
                              
                              {/* 1. LOGO OBJECT */}
                              <div
                                className={`relative group/item cursor-move transition-all ${
                                  activeCanvaElement === "logo" ? "ring-2 ring-cyan-500 rounded p-1" : "hover:ring-1 hover:ring-zinc-700 rounded p-1"
                                }`}
                                style={{
                                  marginLeft: siteData?.brand?.logoLeft || "0px"
                                }}
                                onMouseDown={(e) => handleMouseDown(e, "logo", false)}
                              >
                                <img
                                  src="/logo.png"
                                  alt="KloudEra Logo"
                                  style={{
                                    height: siteData?.brand?.logoHeight || "68px",
                                    width: "auto"
                                  }}
                                  className="object-contain pointer-events-none select-none max-w-full"
                                />
                                {activeCanvaElement === "logo" && (
                                  <div
                                    className="w-3.5 h-3.5 bg-white border-2 border-cyan-500 rounded-full absolute -bottom-1.5 -right-1.5 cursor-se-resize shadow-[0_0_8px_rgba(6,182,212,0.7)] z-20 flex items-center justify-center pointer-events-auto"
                                    onMouseDown={(e) => handleMouseDown(e, "logo", true)}
                                  >
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                                  </div>
                                )}
                                <div className="absolute -top-6 left-0 bg-cyan-500 text-black text-[7px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none uppercase">
                                  Logo ({siteData?.brand?.logoHeight || "68px"})
                                </div>
                              </div>

                              {/* TEXTS GROUPING */}
                              <div className="flex-1 flex flex-col items-center sm:items-start pl-6 border-t sm:border-t-0 sm:border-l border-zinc-800/80 w-full">
                                
                                {/* 2. COMPANY NAME OBJECT */}
                                <div
                                  className={`relative group/item cursor-move transition-all ${
                                    activeCanvaElement === "companyName" ? "ring-2 ring-cyan-500 rounded p-1" : "hover:ring-1 hover:ring-zinc-700 rounded p-1"
                                  }`}
                                  style={{
                                    marginLeft: siteData?.brand?.companyNameLeft || "0px",
                                    fontSize: siteData?.brand?.companyNameSize || "20px"
                                  }}
                                  onMouseDown={(e) => handleMouseDown(e, "companyName", false)}
                                >
                                  <h2 className="font-bold text-white uppercase select-none pointer-events-none leading-none tracking-wide">
                                    {siteData?.brand?.companyName || "KloudEra Technologies"}
                                  </h2>
                                  {activeCanvaElement === "companyName" && (
                                    <div
                                      className="w-3.5 h-3.5 bg-white border-2 border-cyan-500 rounded-full absolute -bottom-1.5 -right-1.5 cursor-se-resize shadow-[0_0_8px_rgba(6,182,212,0.7)] z-20 flex items-center justify-center pointer-events-auto"
                                      onMouseDown={(e) => handleMouseDown(e, "companyName", true)}
                                    >
                                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                                    </div>
                                  )}
                                  <div className="absolute -top-6 left-0 bg-cyan-500 text-black text-[7px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none uppercase">
                                    Title ({siteData?.brand?.companyNameSize || "20px"})
                                  </div>
                                </div>

                                {/* 3. COMPANY TAGLINE OBJECT */}
                                <div
                                  className={`relative group/item cursor-move transition-all mt-2 ${
                                    activeCanvaElement === "tagline" ? "ring-2 ring-cyan-500 rounded p-1" : "hover:ring-1 hover:ring-zinc-700 rounded p-1"
                                  }`}
                                  style={{
                                    marginLeft: siteData?.brand?.taglineLeft || "0px",
                                    fontSize: siteData?.brand?.taglineSize || "12px"
                                  }}
                                  onMouseDown={(e) => handleMouseDown(e, "tagline", false)}
                                >
                                  <p className="text-zinc-400 select-none pointer-events-none leading-none font-medium">
                                    {siteData?.brand?.tagline || "Secure, Innovate, Transform"}
                                  </p>
                                  {activeCanvaElement === "tagline" && (
                                    <div
                                      className="w-3.5 h-3.5 bg-white border-2 border-cyan-500 rounded-full absolute -bottom-1.5 -right-1.5 cursor-se-resize shadow-[0_0_8px_rgba(6,182,212,0.7)] z-20 flex items-center justify-center pointer-events-auto"
                                      onMouseDown={(e) => handleMouseDown(e, "tagline", true)}
                                    >
                                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                                    </div>
                                  )}
                                  <div className="absolute -top-6 left-0 bg-cyan-500 text-black text-[7px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none uppercase">
                                    Tagline ({siteData?.brand?.taglineSize || "12px"})
                                  </div>
                                </div>

                              </div>
                            </div>

                            {/* CANVA STATUS HUD INDICATOR */}
                            {draggingElement && (
                              <div className="absolute bottom-3 left-3 bg-zinc-950/90 border border-teal-500/30 px-3 py-1 rounded font-mono text-[8.5px] text-teal-400 font-bold animate-pulse z-30 uppercase tracking-wider">
                                DRAGGING [{draggingElement.toUpperCase()}] ➜ LEFT: {siteData?.brand?.[`${draggingElement}Left`]}
                              </div>
                            )}
                            {resizingElement && (
                              <div className="absolute bottom-3 left-3 bg-zinc-950/90 border border-teal-500/30 px-3 py-1 rounded font-mono text-[8.5px] text-teal-400 font-bold animate-pulse z-30 uppercase tracking-wider">
                                RESIZING [{resizingElement.toUpperCase()}] ➜ SIZE: {resizingElement === "logo" ? siteData?.brand?.logoHeight : siteData?.brand?.[`${resizingElement}Size`]}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                               onClick={() => setSelectedElement({ path: ["brand", "companyName"], type: "text", value: siteData?.brand?.companyName || "" })}>
                            <span className="text-[8px] text-teal-400 font-bold">COMPANY NAME (EDITABLE)</span>
                            <h2 className="text-lg font-bold text-white uppercase">{siteData?.brand?.companyName || "KloudEra Technologies"}</h2>
                          </div>

                          <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                               onClick={() => setSelectedElement({ path: ["brand", "tagline"], type: "text", value: siteData?.brand?.tagline || "" })}>
                            <span className="text-[8px] text-teal-400 font-bold">COMPANY TAGLINE (EDITABLE)</span>
                            <p className="text-zinc-400 text-xs">{siteData?.brand?.tagline || "Secure, Innovate, Transform"}</p>
                          </div>

                          <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                               onClick={() => setSelectedElement({ path: ["brand", "logoUrl"], type: "text", value: siteData?.brand?.logoUrl || "" })}>
                            <span className="text-[8px] text-teal-400 font-bold">LOGO ROUTE URL (EDITABLE)</span>
                            <p className="text-zinc-400 text-xs">{siteData?.brand?.logoUrl || "/logo.png"}</p>
                          </div>

                          <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                               onClick={() => setSelectedElement({ path: ["brand", "logoHeight"], type: "text", value: siteData?.brand?.logoHeight || "" })}>
                            <span className="text-[8px] text-teal-400 font-bold">LOGO HEIGHT SIZE (EDITABLE - E.G. 48px, 52px, 60px)</span>
                            <p className="text-zinc-400 text-xs">{siteData?.brand?.logoHeight || "52px"}</p>
                          </div>
                        </div>
                      )}

                      {/* File Uploader remains permanently below */}
                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 bg-zinc-950/20 rounded-r transition-all">
                        <span className="text-[8px] text-teal-400 font-bold block mb-1">UPLOAD LOGO IMAGE (.PNG, .JPG)</span>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload-input"
                          />
                          <label
                            htmlFor="logo-upload-input"
                            className="px-3.5 py-1.5 text-[9px] font-mono font-bold rounded bg-teal-500 text-black hover:bg-teal-400 transition-all cursor-pointer shadow-[0_0_8px_rgba(20,184,166,0.3)] inline-block"
                          >
                            SELECT FILE & UPLOAD
                          </label>
                          {uploadingLogo && <span className="text-zinc-500 text-[10px] animate-pulse">Uploading file...</span>}
                          {uploadSuccess && <span className="text-emerald-400 text-[9px] font-bold">✓ Upload Success! Preview Updated.</span>}
                          {uploadError && <span className="text-rose-400 text-[9px] font-bold">❌ {uploadError}</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPage === "services" && (
                    <div className="space-y-8 font-mono">
                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["services", "title"], type: "text", value: siteData?.services?.title || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">PAGE_TITLE (EDITABLE)</span>
                        <h2 className="text-lg font-bold text-white uppercase">{siteData?.services?.title || "Our Services"}</h2>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Services Catalog Categories</span>
                          <button
                            onClick={() => addItemToArray(["services", "categories"], { title: "New Service Domain", desc: "Specify service description...", items: ["Service Option 1", "Service Option 2"] })}
                            className="px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[9px] font-bold uppercase rounded transition-all cursor-pointer"
                          >
                            ➕ Add Service Category
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          {(siteData?.services?.categories || []).map((cat: any, idx: number) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedElement({ path: ["services", "categories", idx.toString()], type: "door", value: cat })}
                              className={`p-5 border rounded-lg bg-zinc-950/30 hover:bg-zinc-950/80 transition-all cursor-pointer ${
                                selectedElement?.path.join(".") === `services.categories.${idx}` ? "border-teal-400 ring-1 ring-teal-400" : "border-zinc-800"
                              }`}
                            >
                              <h4 className="font-bold text-white uppercase text-xs border-b border-zinc-800 pb-2 mb-2 flex justify-between">
                                <span>{cat.title}</span>
                                <span className="text-teal-400 text-[9px]">⚡</span>
                              </h4>
                              <p className="text-zinc-400 text-[10px] leading-relaxed mb-4">{cat.desc}</p>
                              <div className="flex flex-wrap gap-2">
                                {(cat.items || []).map((it: string, i: number) => (
                                  <span key={i} className="text-[8.5px] bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">
                                    {it}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["services", "ctaText"], type: "text", value: siteData?.services?.ctaText || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">CTA_TEXT (EDITABLE)</span>
                        <p className="text-zinc-500 text-[10px] leading-relaxed">{siteData?.services?.ctaText}</p>
                      </div>
                    </div>
                  )}

                  {selectedPage === "products" && (
                    <div className="space-y-8 font-mono">
                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["products", "title"], type: "text", value: siteData?.products?.title || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">PAGE_TITLE (EDITABLE)</span>
                        <h3 className="font-bold text-white text-xs uppercase">{siteData?.products?.title || "Kloudera Software & Infrastructure Product Suite"}</h3>
                      </div>

                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["products", "intro"], type: "text", value: siteData?.products?.intro || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">INTRO_COPY (EDITABLE)</span>
                        <p className="text-zinc-400 text-[10px] leading-relaxed">{siteData?.products?.intro || ""}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Proprietary Products Catalog</span>
                          <button
                            onClick={() => addItemToArray(["products", "items"], { name: "New Kloudera Product", tagline: "Product Tagline...", category: "SOFTWARE", desc: "Description...", badge: "NEW", color: "#06b6d4" })}
                            className="px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[9px] font-bold uppercase rounded transition-all cursor-pointer"
                          >
                            ➕ Add Product
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(siteData?.products?.items || []).map((prod: any, idx: number) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedElement({ path: ["products", "items", idx.toString()], type: "door", value: prod })}
                              className={`p-4 border rounded bg-zinc-950/50 hover:bg-zinc-950 transition-all cursor-pointer ${
                                selectedElement?.path.join(".") === `products.items.${idx}` ? "border-teal-400 ring-1 ring-teal-400" : "border-zinc-800"
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white text-xs">{prod.name}</span>
                                <span className="text-[8px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800">{prod.badge}</span>
                              </div>
                              <p className="text-teal-400 text-[9.5px] mb-1">{prod.tagline}</p>
                              <p className="text-zinc-400 text-[9.5px] leading-relaxed">{prod.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPage === "achievements" && (
                    <div className="space-y-8 font-mono">
                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["achievements", "title"], type: "text", value: siteData?.achievements?.title || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">PAGE_TITLE (EDITABLE)</span>
                        <h3 className="font-bold text-white text-xs uppercase">{siteData?.achievements?.title || "Our Enterprise Achievements & Impact"}</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Milestone & Impact Metrics</span>
                          <button
                            onClick={() => addItemToArray(["achievements", "items"], { metric: "100+", label: "New Impact Metric", desc: "Achievement narrative...", year: "2026" })}
                            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[9px] font-bold uppercase rounded transition-all cursor-pointer"
                          >
                            ➕ Add Achievement
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          {(siteData?.achievements?.items || []).map((item: any, idx: number) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedElement({ path: ["achievements", "items", idx.toString()], type: "door", value: item })}
                              className={`p-3 border rounded bg-zinc-950/50 hover:bg-zinc-950 transition-all cursor-pointer text-center ${
                                selectedElement?.path.join(".") === `achievements.items.${idx}` ? "border-amber-400 ring-1 ring-amber-400" : "border-zinc-800"
                              }`}
                            >
                              <span className="text-xl font-bold text-amber-400 block">{item.metric}</span>
                              <span className="font-bold text-white text-[9.5px] block">{item.label}</span>
                              <p className="text-zinc-500 text-[8.5px] mt-1">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPage === "clienteles" && (
                    <div className="space-y-8 font-mono">
                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["clienteles", "title"], type: "text", value: siteData?.clienteles?.title || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">PAGE_TITLE (EDITABLE)</span>
                        <h3 className="font-bold text-white text-xs uppercase">{siteData?.clienteles?.title || "Our Enterprise Clientele & Verticals"}</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Client Portfolio & Industry Sectors</span>
                          <button
                            onClick={() => addItemToArray(["clienteles", "items"], { name: "New Industry Sector", sector: "ENTERPRISE", desc: "Deployment narrative...", stats: "Verified" })}
                            className="px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[9px] font-bold uppercase rounded transition-all cursor-pointer"
                          >
                            ➕ Add Client Sector
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(siteData?.clienteles?.items || []).map((client: any, idx: number) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedElement({ path: ["clienteles", "items", idx.toString()], type: "door", value: client })}
                              className={`p-4 border rounded bg-zinc-950/50 hover:bg-zinc-950 transition-all cursor-pointer ${
                                selectedElement?.path.join(".") === `clienteles.items.${idx}` ? "border-indigo-400 ring-1 ring-indigo-400" : "border-zinc-800"
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white text-xs">{client.name}</span>
                                <span className="text-[8px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">{client.sector}</span>
                              </div>
                              <p className="text-zinc-400 text-[9.5px] leading-relaxed">{client.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPage === "certifications" && (
                    <div className="space-y-8 font-mono">
                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["certifications", "title"], type: "text", value: siteData?.certifications?.title || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">PAGE_TITLE (EDITABLE)</span>
                        <h3 className="font-bold text-white text-xs uppercase">{siteData?.certifications?.title || "Security Compliance & Global Standards"}</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Compliance & Certification Frameworks</span>
                          <button
                            onClick={() => addItemToArray(["certifications", "items"], { code: "NEW CERT 100", title: "Certification Title", issuer: "Authority Name", desc: "Framework details...", status: "ACTIVE" })}
                            className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold uppercase rounded transition-all cursor-pointer"
                          >
                            ➕ Add Certification
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {(siteData?.certifications?.items || []).map((cert: any, idx: number) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedElement({ path: ["certifications", "items", idx.toString()], type: "door", value: cert })}
                              className={`p-3 border rounded bg-zinc-950/50 hover:bg-zinc-950 transition-all cursor-pointer ${
                                selectedElement?.path.join(".") === `certifications.items.${idx}` ? "border-emerald-400 ring-1 ring-emerald-400" : "border-zinc-800"
                              }`}
                            >
                              <span className="font-bold text-emerald-400 text-[10px] block">{cert.code}</span>
                              <span className="text-white text-[9.5px] font-bold block">{cert.title}</span>
                              <p className="text-zinc-500 text-[8.5px] mt-1">{cert.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPage === "about" && (
                    <div className="space-y-8 font-mono">
                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["about", "missionTitle"], type: "text", value: siteData?.about?.missionTitle || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">MISSION_TITLE (EDITABLE)</span>
                        <h3 className="font-bold text-white text-xs uppercase">{siteData?.about?.missionTitle || "Built for High-Stakes Enterprise Resilience"}</h3>
                      </div>

                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["about", "missionDesc"], type: "text", value: siteData?.about?.missionDesc || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">MISSION_DESC (EDITABLE)</span>
                        <p className="text-zinc-400 text-[10px] leading-relaxed">{siteData?.about?.missionDesc || siteData?.about?.mission || ""}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Why Choose Us Pillars</span>
                          <button
                            onClick={() => addItemToArray(["about", "whyChooseUs"], { title: "New Enterprise Pillar", desc: "Value proposition details..." })}
                            className="px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[9px] font-bold uppercase rounded transition-all cursor-pointer"
                          >
                            ➕ Add Pillar
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(siteData?.about?.whyChooseUs || []).map((pillar: any, idx: number) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedElement({ path: ["about", "whyChooseUs", idx.toString()], type: "door", value: pillar })}
                              className={`p-4 border rounded bg-zinc-950/50 hover:bg-zinc-950 transition-all cursor-pointer ${
                                selectedElement?.path.join(".") === `about.whyChooseUs.${idx}` ? "border-teal-400 ring-1 ring-teal-400" : "border-zinc-800"
                              }`}
                            >
                              <span className="text-teal-400 font-bold text-[9.5px] block mb-1">⚡ // {pillar.title}</span>
                              <p className="text-zinc-400 text-[10px] leading-relaxed">{pillar.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Leadership Team Members</span>
                          <button
                            onClick={() => addItemToArray(["about", "team"], { name: "New Executive Name", role: "Executive Title | Department", initials: "NE", image: "" })}
                            className="px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[9px] font-bold uppercase rounded transition-all cursor-pointer"
                          >
                            ➕ Add Team Member
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {(siteData?.about?.team || []).map((mbr: any, idx: number) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedElement({ path: ["about", "team", idx.toString()], type: "door", value: mbr })}
                              className={`p-4 border rounded flex flex-col items-center text-center bg-zinc-950/50 hover:bg-zinc-950 transition-all cursor-pointer ${
                                selectedElement?.path.join(".") === `about.team.${idx}` ? "border-teal-400 ring-1 ring-teal-400" : "border-zinc-800"
                              }`}
                            >
                              {mbr.image ? (
                                <img src={mbr.image} alt={mbr.name} className="w-12 h-12 rounded-full object-cover border border-teal-500/40 mb-2" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold mb-2">
                                  {mbr.initials || "K"}
                                </div>
                              )}
                              <span className="block font-bold text-white text-[10.5px]">{mbr.name}</span>
                              <span className="block text-[8px] text-zinc-500 mt-0.5 leading-tight">{mbr.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPage === "careers" && (
                    <div className="space-y-8 font-mono">
                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["careers", "title"], type: "text", value: siteData?.careers?.title || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">PAGE_TITLE (EDITABLE)</span>
                        <h3 className="font-bold text-white text-xs uppercase">{siteData?.careers?.title || "Bright Future Awaits You!"}</h3>
                      </div>

                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["careers", "intro"], type: "text", value: siteData?.careers?.intro || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">INTRO_COPY (EDITABLE)</span>
                        <p className="text-zinc-400 text-[10px] leading-relaxed">{siteData?.careers?.intro || siteData?.careers?.heroSubtitle || ""}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Recruitment Corridor Timeline</span>
                          <button
                            onClick={() => addItemToArray(["careers", "timeline"], { step: "STEP_NEW", name: "NEW STAGE", desc: "Stage overview..." })}
                            className="px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[9px] font-bold uppercase rounded transition-all cursor-pointer"
                          >
                            ➕ Add Recruitment Stage
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                          {(siteData?.careers?.timeline || []).map((step: any, idx: number) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedElement({ path: ["careers", "timeline", idx.toString()], type: "door", value: step })}
                              className={`p-3 border rounded bg-zinc-950/40 hover:bg-zinc-950 transition-all cursor-pointer ${
                                selectedElement?.path.join(".") === `careers.timeline.${idx}` ? "border-teal-400 ring-1 ring-teal-400" : "border-zinc-800"
                              }`}
                            >
                              <span className="block text-[9px] font-bold text-teal-400">{step.step} // {step.name}</span>
                              <p className="text-zinc-500 text-[8.5px] mt-1.5 leading-snug">{step.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPage === "contact" && (
                    <div className="space-y-8 font-mono">
                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["contact", "title"], type: "text", value: siteData?.contact?.title || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">PAGE_TITLE (EDITABLE)</span>
                        <h3 className="font-bold text-white text-xs uppercase">{siteData?.contact?.title || "Let's get in touch"}</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Physical Office Addresses</span>
                          <button
                            onClick={() => addItemToArray(["contact", "offices"], { city: "New Regional Hub", address: "Office Address...", hours: "Monday - Friday 9am - 5pm", phone: "+91 0000000000", email: "info@kloudera.ai" })}
                            className="px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[9px] font-bold uppercase rounded transition-all cursor-pointer"
                          >
                            ➕ Add Office Location
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {(siteData?.contact?.offices || []).map((office: any, idx: number) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedElement({ path: ["contact", "offices", idx.toString()], type: "door", value: office })}
                              className={`p-4 border rounded bg-zinc-950/50 hover:bg-zinc-950 transition-all cursor-pointer ${
                                selectedElement?.path.join(".") === `contact.offices.${idx}` ? "border-teal-400 ring-1 ring-teal-400" : "border-zinc-800"
                              }`}
                            >
                              <h4 className="font-bold text-white text-xs mb-1">{office.city}</h4>
                              <p className="text-zinc-400 text-[10px] leading-relaxed mb-3">{office.address}</p>
                              <div className="space-y-1 text-[9px] text-zinc-500">
                                <div className="flex justify-between"><span>HOURS:</span><span className="text-zinc-300">{office.hours}</span></div>
                                <div className="flex justify-between"><span>CONTACTS:</span><span className="text-zinc-300">{office.phone}</span></div>
                                <div className="flex justify-between"><span>EMAIL:</span><span className="text-teal-400">{office.email}</span></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPage === "partners" && (
                    <div className="space-y-8 font-mono">
                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["partners", "title"], type: "text", value: siteData?.partners?.title || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">PAGE_TITLE (EDITABLE)</span>
                        <h3 className="font-bold text-white text-xs uppercase">{siteData?.partners?.title || "OUR STRATEGIC PARTNERS"}</h3>
                      </div>

                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["partners", "tagline"], type: "text", value: siteData?.partners?.tagline || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">PAGE_TAGLINE (EDITABLE)</span>
                        <h3 className="font-bold text-white text-xs uppercase">{siteData?.partners?.tagline || "KLOUDERA TECHNOLOGIES // GLOBAL ECOSYSTEM"}</h3>
                      </div>

                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["partners", "introTitle"], type: "text", value: siteData?.partners?.introTitle || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">INTRO_TITLE (EDITABLE)</span>
                        <h3 className="font-bold text-white text-xs uppercase">{siteData?.partners?.introTitle || "Enterprise Alliances & Security Nodes"}</h3>
                      </div>

                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-2 hover:bg-zinc-950/40 cursor-pointer transition-all"
                           onClick={() => setSelectedElement({ path: ["partners", "introDesc"], type: "text", value: siteData?.partners?.introDesc || "" })}>
                        <span className="text-[8px] text-teal-400 font-bold">INTRO_DESCRIPTION (EDITABLE)</span>
                        <p className="text-zinc-400 text-[10px] leading-relaxed">{siteData?.partners?.introDesc || ""}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Featured Partners List</span>
                          <button
                            onClick={() => addItemToArray(["partners", "featured"], { name: "New Partner", logoColor: "#0ea5e9", tagline: "Alliance Level Title", details: "Integration and partnership details..." })}
                            className="px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[9px] font-bold uppercase rounded transition-all cursor-pointer"
                          >
                            ➕ Add Partner
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(siteData?.partners?.featured || []).map((partner: any, idx: number) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedElement({ path: ["partners", "featured", idx.toString()], type: "door", value: partner })}
                              className={`p-4 border rounded bg-zinc-950/50 hover:bg-zinc-950 transition-all cursor-pointer relative ${
                                selectedElement?.path.join(".") === `partners.featured.${idx}` ? "border-teal-400 ring-1 ring-teal-400" : "border-zinc-800"
                              }`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItemFromArray(["partners", "featured"], idx);
                                }}
                                className="absolute top-2 right-2 p-1 text-rose-400 hover:text-rose-300 font-bold text-[9px]"
                              >
                                ✖ DELETE
                              </button>
                              <span className="text-teal-400 font-bold text-[9.5px] block mb-1">🤝 // {partner.name}</span>
                              <span className="text-zinc-500 text-[8px] block uppercase mb-1">{partner.tagline}</span>
                              <p className="text-zinc-400 text-[10px] leading-relaxed">{partner.details}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 border-l-2 border-teal-500/20 pl-4 py-3 bg-zinc-950/20 rounded">
                        <span className="text-[8px] text-teal-400 font-bold block mb-1">Extended Network & Client Alliances (Comma Separated List)</span>
                        <textarea
                          rows={4}
                          value={(siteData?.partners?.alliances || []).join(", ")}
                          onChange={(e) => {
                            const list = e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean);
                            updateNestedValue(["partners", "alliances"], list);
                          }}
                          className="w-full bg-black border border-teal-500/10 hover:border-teal-500/30 focus:border-teal-500 rounded p-2 text-white focus:outline-none text-[11px] leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                  {selectedPage === "security" && (
                    <div className="space-y-8 font-mono max-w-2xl">
                      <div className="border-b border-amber-500/20 pb-4 space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[9px] font-bold">
                          🔑 ULTIMATE ACCESS GOVERNANCE PANEL
                        </div>
                        <h3 className="text-xl font-bold text-white uppercase">System Access & Security Passwords</h3>
                        <p className="text-zinc-400 text-[10px] leading-relaxed">
                          As Ultimate Access Master, you have authorization to modify access passwords for Content Level Editors and Ultimate Master Admin.
                        </p>
                      </div>

                      {/* Current Active Credentials & Audit Recipient Overview */}
                      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider block">ACTIVE SYSTEM SECURITY RECORD</span>
                          <button
                            type="button"
                            onClick={() => setShowPassToggle(!showPassToggle)}
                            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[9px] font-bold rounded border border-zinc-700 transition-all cursor-pointer"
                          >
                            {showPassToggle ? "🙈 Hide Passwords" : "👁️ Show Passwords"}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 rounded bg-zinc-900 border border-zinc-800 space-y-1">
                            <span className="text-cyan-400 font-bold block text-[10px]">📝 Content Level Password</span>
                            <span className="font-bold text-white font-mono bg-black px-2.5 py-1 rounded inline-block text-[11px] tracking-wider border border-zinc-800">
                              {showPassToggle ? (siteData?.credentials?.contentPassword || "content123") : "••••••••••••"}
                            </span>
                          </div>

                          <div className="p-3 rounded bg-zinc-900 border border-zinc-800 space-y-1">
                            <span className="text-amber-400 font-bold block text-[10px]">🔑 Ultimate Master Password</span>
                            <span className="font-bold text-white font-mono bg-black px-2.5 py-1 rounded inline-block text-[11px] tracking-wider border border-zinc-800">
                              {showPassToggle ? (siteData?.credentials?.ultimatePassword || "admin") : "••••••••••••"}
                            </span>
                          </div>

                          <div className="p-3 rounded bg-zinc-900 border border-zinc-800 space-y-1 sm:col-span-1">
                            <span className="text-emerald-400 font-bold block text-[10px]">📧 Admin Notification Email</span>
                            <span className="font-bold text-emerald-300 font-mono bg-black px-2.5 py-1 rounded inline-block text-[11px] border border-zinc-800 truncate max-w-full">
                              {siteData?.credentials?.adminEmail || "admin@kloudera.ai"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Password & Notification Update Form */}
                      <form onSubmit={handleUpdatePasswords} className="p-6 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-6">
                        <h4 className="text-sm font-bold text-amber-300 uppercase">Update Security Passwords & Notification Email</h4>
                        
                        <div className="space-y-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-zinc-300 text-[10px] font-bold">ADMIN NOTIFICATION AUDIT EMAIL ID</label>
                            <input
                              type="email"
                              placeholder="e.g. admin.security@kloudera.ai"
                              value={newAdminEmail}
                              onChange={(e) => setNewAdminEmail(e.target.value)}
                              className="bg-black border border-zinc-800 focus:border-emerald-400 rounded-lg p-2.5 text-white text-xs font-mono"
                            />
                            <span className="text-[8.5px] text-zinc-500">Receives automatic notification records whenever passwords or site contents are changed.</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-zinc-300 text-[10px] font-bold">NEW CONTENT LEVEL EDITOR PASSWORD</label>
                              <input
                                type={showPassToggle ? "text" : "password"}
                                placeholder="Type new content level password..."
                                value={newContentPass}
                                onChange={(e) => setNewContentPass(e.target.value)}
                                className="bg-black border border-zinc-800 focus:border-cyan-400 rounded-lg p-2.5 text-white text-xs font-mono tracking-wider"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-zinc-300 text-[10px] font-bold">NEW ULTIMATE MASTER PASSWORD</label>
                              <input
                                type={showPassToggle ? "text" : "password"}
                                placeholder="Type new ultimate master password..."
                                value={newUltimatePass}
                                onChange={(e) => setNewUltimatePass(e.target.value)}
                                className="bg-black border border-zinc-800 focus:border-amber-400 rounded-lg p-2.5 text-white text-xs font-mono tracking-wider"
                              />
                            </div>
                          </div>
                          <div className="border-t border-zinc-800/80 pt-4 space-y-4">
                            <div className="bg-sky-950/40 p-4 rounded-xl border border-sky-500/30 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sky-300 font-bold text-xs">ℹ️ Microsoft Outlook Security Requirement</span>
                                <button
                                  type="button"
                                  onClick={handleSendTestEmail}
                                  disabled={sendingTestEmail}
                                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-black font-extrabold rounded-lg text-[10px] uppercase transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_10px_rgba(14,165,233,0.3)]"
                                >
                                  {sendingTestEmail ? "⏳ Testing Connection..." : "🧪 Send Test Security Email"}
                                </button>
                              </div>
                              <p className="text-zinc-300 text-[10px] leading-relaxed">
                                Microsoft Outlook (<strong className="text-sky-300">outlook.com / office365.com</strong>) blocks emails sent without a password. Enter your Outlook Email & Password in the box below so Microsoft can authenticate and deliver notifications directly to your inbox.
                              </p>
                            </div>

                            {testEmailStatus && (
                              <div className={`p-3 rounded text-xs border ${testEmailStatus.success ? "bg-emerald-950/90 border-emerald-500/60 text-emerald-200 font-bold" : "bg-amber-950/90 border-amber-500/60 text-amber-200 font-bold"}`}>
                                {testEmailStatus.msg}
                              </div>
                            )}

                            {/* Outlook & Custom API Credentials Panel */}
                            <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-5">
                              <div className="space-y-1">
                                <h5 className="text-xs font-bold text-sky-400 uppercase">📧 Select Outlook Delivery Method</h5>
                                <p className="text-[9.5px] text-zinc-400">Choose either Option A (Outlook App Password) or Option B (Free Resend API Key):</p>
                              </div>

                              {/* Option A */}
                              <div className="p-4 rounded-lg bg-sky-950/30 border border-sky-500/20 space-y-3">
                                <span className="text-[10px] font-bold text-sky-300 uppercase block">OPTION A: Outlook App Password (Recommended for Microsoft Accounts)</span>
                                <p className="text-[9px] text-zinc-400 leading-relaxed">
                                  Microsoft requires a 16-letter <strong className="text-white">App Password</strong> for third-party scripts. Create one in 20 seconds at <a href="https://account.microsoft.com/security" target="_blank" rel="noreferrer" className="text-sky-400 underline font-bold">account.microsoft.com/security</a> (under <em>Advanced Security -&gt; App Passwords</em>).
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="flex flex-col gap-1">
                                    <label className="text-zinc-300 text-[9.5px] font-bold">OUTLOOK EMAIL</label>
                                    <input
                                      type="email"
                                      placeholder={newAdminEmail || siteData?.credentials?.adminEmail || "your-name@outlook.com"}
                                      value={smtpUser}
                                      onChange={(e) => setSmtpUser(e.target.value)}
                                      className="bg-black border border-zinc-800 focus:border-sky-400 rounded-lg p-2.5 text-white text-xs font-mono"
                                    />
                                  </div>

                                  <div className="flex flex-col gap-1">
                                    <label className="text-zinc-300 text-[9.5px] font-bold">OUTLOOK APP PASSWORD (16-CHARACTERS)</label>
                                    <input
                                      type="password"
                                      placeholder="e.g. abcd-efgh-ijkl-mnop"
                                      value={smtpPass}
                                      onChange={(e) => setSmtpPass(e.target.value)}
                                      className="bg-black border border-zinc-800 focus:border-sky-400 rounded-lg p-2.5 text-white text-xs font-mono"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Option B */}
                              <div className="p-4 rounded-lg bg-teal-950/30 border border-teal-500/20 space-y-3">
                                <span className="text-[10px] font-bold text-teal-300 uppercase block">OPTION B: Resend Email API Key (Guaranteed 100% Instant Delivery)</span>
                                <div className="flex flex-col gap-1">
                                  <label className="text-zinc-300 text-[9.5px] font-bold">RESEND API KEY (Starts with re_)</label>
                                  <input
                                    type="text"
                                    placeholder={siteData?.credentials?.emailConfig?.apiKey || "re_123456789..."}
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="bg-black border border-zinc-800 focus:border-teal-400 rounded-lg p-2.5 text-white text-xs font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {passSaveMsg && <div className="p-3 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs">{passSaveMsg}</div>}
                        {passSaveErr && <div className="p-3 rounded bg-red-950/80 border border-red-500/50 text-red-300 text-xs">{passSaveErr}</div>}

                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase rounded-lg text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
                        >
                          💾 Save Security Settings & Notify Admin Email
                        </button>
                      </form>

                      {/* Admin Audit Notification Log History */}
                      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950 space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase">📑 Notification Audit Log History</h4>
                            <span className="text-[9px] text-zinc-500">Record of audit notifications dispatched to Admin Email ({siteData?.credentials?.adminEmail || "admin@kloudera.ai"})</span>
                          </div>
                          <button
                            type="button"
                            onClick={fetchAuditLogs}
                            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-teal-400 text-[9px] font-bold rounded border border-zinc-800 transition-all cursor-pointer"
                          >
                            🔄 Refresh Logs
                          </button>
                        </div>

                        {auditLogs.length === 0 ? (
                          <div className="text-[10px] text-zinc-500 italic text-center py-4">
                            No security audit log entries recorded yet.
                          </div>
                        ) : (
                          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                            {auditLogs.map((log) => (
                              <div key={log.id} className="p-3 rounded bg-black border border-zinc-800/80 space-y-1">
                                <div className="flex justify-between items-center text-[9px]">
                                  <span className={`font-bold uppercase ${log.event.includes("SECURITY") ? "text-amber-400" : "text-cyan-400"}`}>
                                    {log.event}
                                  </span>
                                  <span className="text-zinc-500">{log.formattedTime || log.timestamp}</span>
                                </div>
                                <p className="text-[10px] text-zinc-300 font-sans">{log.summary}</p>
                                <div className="flex items-center justify-between text-[8px] text-zinc-500 pt-1 border-t border-zinc-900">
                                  <span>Recipient: <strong className="text-emerald-400">{log.recipientEmail}</strong></span>
                                  <span className="text-emerald-400 font-bold">✓ DELIVERED</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Footer preview */}
            <div className="border-t border-zinc-800 pt-4 text-center text-[8px] text-zinc-600 font-mono mt-12">
              © {new Date().getFullYear()} KLOUDERA TECHNOLOGIES // ACCESS MODE // SECURE FOOTER
            </div>

          </div>
        </main>

        {/* Right Canva-Properties Editor Sidebar */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-teal-500/10 bg-zinc-950 p-4 lg:p-6 flex flex-col select-none font-mono text-xs justify-between shrink-0">
          <div className="space-y-6">
            <div className="border-b border-teal-500/10 pb-3">
              <span className="text-[8.5px] text-teal-400 font-bold block mb-1">PROPERTIES PANEL</span>
              <h3 className="text-sm font-bold text-white uppercase">Element Customizer</h3>
            </div>

            {selectedElement ? (
              <div className="space-y-5 animate-[fadeIn_0.15s_ease-out]">
                <div>
                  <span className="text-[8px] text-zinc-500 block mb-1.5 uppercase">Target Path Address</span>
                  <span className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-zinc-300 block break-all font-bold">
                    {selectedElement.path.join(" ➜ ")}
                  </span>
                </div>

                {selectedElement.type === "text" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-500 uppercase text-[8px]">Text Value Content</label>
                    <textarea
                      rows={8}
                      value={selectedElement.value}
                      onChange={(e) => updateNestedValue(selectedElement.path, e.target.value)}
                      className="bg-black border border-teal-500/10 hover:border-teal-500/30 focus:border-teal-500 rounded p-2 text-white focus:outline-none text-[11px] leading-relaxed"
                    />
                  </div>
                )}

                {selectedElement.type === "door" && (
                  <div className="space-y-4">
                    {Object.keys(selectedElement.value).map((key) => {
                      if (key === "items") {
                        return (
                          <div key={key} className="flex flex-col gap-2">
                            <label className="text-zinc-500 uppercase text-[8px]">List Items (Comma separated)</label>
                            <textarea
                              rows={4}
                              value={selectedElement.value.items.join(", ")}
                              onChange={(e) => {
                                const list = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                                updateNestedValue([...selectedElement.path, "items"], list);
                              }}
                              className="bg-black border border-teal-500/10 hover:border-teal-500/30 focus:border-teal-500 rounded p-2 text-white focus:outline-none text-[11px] leading-relaxed"
                            />
                          </div>
                        );
                      }
                      return (
                        <div key={key} className="flex flex-col gap-1.5">
                          <label className="text-zinc-500 uppercase text-[8px] flex items-center justify-between">
                            <span>{key} Property</span>
                            {(key.toLowerCase().includes("image") || key.toLowerCase().includes("logo") || key.toLowerCase().includes("photo") || key.toLowerCase().includes("pic")) && (
                              <span className="text-[7.5px] text-teal-400 font-bold">IMAGE PATH</span>
                            )}
                          </label>

                          <input
                            type="text"
                            value={selectedElement.value[key] || ""}
                            onChange={(e) => updateNestedValue([...selectedElement.path, key], e.target.value)}
                            className="bg-black border border-teal-500/10 hover:border-teal-500/30 focus:border-teal-500 rounded p-2 text-white focus:outline-none text-[11px]"
                          />

                          {/* Image Upload Input for Image/Logo/Photo properties */}
                          {(key.toLowerCase().includes("image") || key.toLowerCase().includes("logo") || key.toLowerCase().includes("photo") || key.toLowerCase().includes("pic") || key === "image") && (
                            <div className="mt-1 flex flex-col gap-2 p-3 bg-zinc-900/90 border border-teal-500/20 rounded-lg">
                              <label className="text-[8px] text-teal-400 font-bold uppercase flex items-center gap-1">
                                <span>📁 UPLOAD IMAGE TO /public/uploads/</span>
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const token = localStorage.getItem("dev_token") || "";
                                  const bodyData = new FormData();
                                  bodyData.append("file", file);
                                  try {
                                    const res = await fetch("/api/upload-image", {
                                      method: "POST",
                                      headers: { "x-developer-token": token },
                                      body: bodyData
                                    });
                                    const data = await res.json();
                                    if (res.ok && data.url) {
                                      updateNestedValue([...selectedElement.path, key], data.url);
                                      alert(`Image successfully saved to: ${data.url}`);
                                    } else {
                                      alert(`Upload error: ${data.error || "Failed to save file."}`);
                                    }
                                  } catch (err) {
                                    alert("Network error uploading file.");
                                  }
                                }}
                                className="text-[9.5px] text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[8.5px] file:font-mono file:bg-teal-500 file:text-black hover:file:bg-teal-400 cursor-pointer"
                              />
                              {selectedElement.value[key] && (
                                <div className="mt-1 flex items-center gap-2">
                                  <img
                                    src={selectedElement.value[key]}
                                    alt="Preview"
                                    className="w-10 h-10 rounded object-cover border border-zinc-700 bg-black"
                                  />
                                  <span className="text-[8px] text-zinc-400 font-mono break-all line-clamp-1">{selectedElement.value[key]}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedElement.type === "door" && selectedElement.value.color && (
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-500 uppercase text-[8px]">Color Spectrum Picker</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={selectedElement.value.color}
                        onChange={(e) => updateNestedValue([...selectedElement.path, "color"], e.target.value)}
                        className="bg-transparent border border-zinc-800 rounded cursor-pointer w-8 h-8 flex-shrink-0"
                      />
                      <span className="text-[10px] text-zinc-400 font-bold">{selectedElement.value.color}</span>
                    </div>
                  </div>
                )}

                {/* Delete Entry Button for Array Items */}
                {selectedElement.path.length >= 3 && !isNaN(Number(selectedElement.path[selectedElement.path.length - 1])) && (
                  <button
                    onClick={() => {
                      const parentPath = selectedElement.path.slice(0, -1);
                      const index = Number(selectedElement.path[selectedElement.path.length - 1]);
                      removeItemFromArray(parentPath, index);
                    }}
                    className="w-full py-2.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold uppercase text-[9px] rounded transition-all cursor-pointer mt-6 shadow-lg"
                  >
                    🗑️ REMOVE THIS ITEM FROM SECTION
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-20 text-zinc-600 text-[10px] border border-dashed border-zinc-800 rounded-lg p-4 leading-relaxed">
                Click on any text or panel in the live preview to begin editing layout or copy details.
              </div>
            )}
          </div>

          <div className="border-t border-teal-500/10 pt-4">
            {publishSuccess && (
              <div className="bg-teal-950/80 border border-teal-500/30 text-teal-400 p-3 rounded text-center text-[10px] uppercase font-bold animate-pulse">
                TELEMETRY_COMMITTED_OK // LIVE
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
