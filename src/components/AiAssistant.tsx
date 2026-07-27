"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAccessibility } from "./AccessibilityContext";

interface Message {
  sender: "bot" | "user";
  text: string;
  options?: string[];
  link?: string;
  linkLabel?: string;
}

export const AiAssistant: React.FC = () => {
  const { playAudio, performanceMode } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "ACCESS GRANTED. Welcome to the Kloudera Holographic Command Assistant. How can I guide your enterprise operations today?",
      options: [
        "Recommend Cyber Security",
        "Configure Hardware Rig",
        "Explore Microsoft Suite",
        "Navigate Virtual Headquarters",
        "Contact the Team"
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [isHomePath, setIsHomePath] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    setIsIframe(window.self !== window.top);
    setIsHomePath(window.location.pathname === "/");
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-ai-chat", handleOpenChat);
    return () => {
      window.removeEventListener("open-ai-chat", handleOpenChat);
    };
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const addBotMessage = (text: string, options?: string[], link?: string, linkLabel?: string) => {
    setIsTyping(true);
    playAudio("scan");

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: "bot", text, options, link, linkLabel }]);
      playAudio("success");
    }, 800);
  };

  const handleOptionSelect = (optionText: string) => {
    playAudio("click");
    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: optionText }]);

    // Dialogue Logic Tree
    if (optionText === "Recommend Cyber Security") {
      addBotMessage(
        "Kloudera Security Posture Assessment: What is your primary infrastructure concern?",
        ["24/7 SOC Monitoring", "Security Penetration Audit", "Implementing Zero-Trust", "Contact the Team", "Main Menu"]
      );
    } else if (optionText === "Configure Hardware Rig") {
      addBotMessage(
        "Hardware provisioning center: Select your main target workload.",
        ["AI & Deep Learning Models", "Software Development rigs", "Cloud Core Server", "Contact the Team", "Main Menu"]
      );
    } else if (optionText === "Explore Microsoft Suite") {
      addBotMessage(
        "Microsoft Cloud Wing: Choose your migration or administration target.",
        ["M365 Cloud Migration", "Entra Identity Security", "Custom Power Automate Flows", "Contact the Team", "Main Menu"]
      );
    } else if (optionText === "Navigate Virtual Headquarters") {
      addBotMessage(
        "Opening navigation matrix: Select the wing you wish to teleport to.",
        ["Security Operations Center", "AI Laboratory", "Hardware Vault", "Knowledge Center", "Main Menu"]
      );
    } else if (optionText === "Contact the Team") {
      addBotMessage(
        "Kloudera Communications Gateway: How would you like to reach our security and systems integration team?",
        ["Book a Direct Consultation", "Send an Email Message", "Main Menu"]
      );
    }
    // Deep level 2 options - Cyber Security
    else if (optionText === "24/7 SOC Monitoring") {
      addBotMessage(
        "Continuous telemetry auditing is managed by our global Security Operations Center (SOC). Our live threat map tracks anomalous packets immediately.",
        ["Contact the Team", "Main Menu"],
        "/services/cyber-security",
        "Enter SOC Dashboard"
      );
    } else if (optionText === "Security Penetration Audit") {
      addBotMessage(
        "Vulnerability and Penetration Testing (VAPT) simulates active intrusions on your codebase to preempt real exploits.",
        ["Contact the Team", "Main Menu"]
      );
    } else if (optionText === "Implementing Zero-Trust") {
      addBotMessage(
        "Perimeterless security checks: we configure Microsoft Entra ID and Device Protection policies to secure corporate logins.",
        ["Contact the Team", "Main Menu"]
      );
    }
    // Deep level 2 options - Hardware
    else if (optionText === "AI & Deep Learning Models") {
      addBotMessage(
        "For LLM training and compute pipelines, I recommend the Nvidia HGX H100 system. Featuring 8x high-performance GPUs with NVLink interconnects.",
        ["Contact the Team", "Main Menu"],
        "/services/hardware",
        "View Nvidia HGX H100"
      );
    } else if (optionText === "Software Development rigs") {
      addBotMessage(
        "For compiled environments and local execution loops, the Apple MacBook Pro M4 Max provides the ultimate portable silicon speeds.",
        ["Contact the Team", "Main Menu"],
        "/services/hardware",
        "View MacBook Pro specs"
      );
    } else if (optionText === "Cloud Core Server") {
      addBotMessage(
        "For server hosting and localized file storage pools, our CloudRack Server R960 integrates up to 128 Intel Xeon cores.",
        ["Contact the Team", "Main Menu"],
        "/services/hardware",
        "View R960 Specifications"
      );
    }
    // Deep level 2 options - Microsoft Suite
    else if (optionText === "M365 Cloud Migration") {
      addBotMessage(
        "Complete enterprise deployment and migration support for Microsoft 365, SharePoint, Exchange Online, and cloud infrastructure.",
        ["Contact the Team", "Main Menu"]
      );
    } else if (optionText === "Entra Identity Security") {
      addBotMessage(
        "Secure identity provisioning, Single Sign-On (SSO), Multi-Factor Authentication (MFA), and Conditional Access policies via Microsoft Entra ID.",
        ["Contact the Team", "Main Menu"]
      );
    } else if (optionText === "Custom Power Automate Flows") {
      addBotMessage(
        "Custom robotic process automation (RPA) and app building using Microsoft Power Apps and Power Automate flows.",
        ["Contact the Team", "Main Menu"]
      );
    }
    // Deep level 2 options - Navigation
    else if (optionText === "Security Operations Center") {
      addBotMessage("Teleport sequence initialized. Teleporting to Cyber SOC...", ["Contact the Team", "Main Menu"], "/services/cyber-security", "Go to Security SOC");
    } else if (optionText === "AI Laboratory") {
      addBotMessage("Neural network calculations visualizer. Teleporting to AI Lab...", ["Contact the Team", "Main Menu"], "/services/ai-solutions", "Go to AI Solutions");
    } else if (optionText === "Hardware Vault") {
      addBotMessage("Entering premium enterprise hardware vault...", ["Contact the Team", "Main Menu"], "/services/hardware", "Go to Hardware Vault");
    } else if (optionText === "Knowledge Center") {
      addBotMessage("Loading technical documents and whitepaper repository...", ["Contact the Team", "Main Menu"], "/resources", "Go to Knowledge Center");
    }
    // Deep level 2 options - Contact
    else if (optionText === "Book a Direct Consultation") {
      addBotMessage(
        "Connecting calendar slots... You can book a direct online meeting slot now.",
        ["Contact the Team", "Main Menu"],
        "/book-meeting",
        "Open Calendar Scheduler"
      );
    } else if (optionText === "Send an Email Message") {
      addBotMessage(
        "You can submit a contact inquiry directly, or write to us at info@kloudera.ai. Our operations team will respond within 1 business hour.",
        ["Contact the Team", "Main Menu"],
        "/contact",
        "Open Contact Form"
      );
    }
    // Return / Main Menu / Fallbacks
    else if (optionText === "Main Menu" || optionText === "Return to Core") {
      addBotMessage(
        "Returned to Core menu. What other systems would you like to review?",
        [
          "Recommend Cyber Security",
          "Configure Hardware Rig",
          "Explore Microsoft Suite",
          "Navigate Virtual Headquarters",
          "Contact the Team"
        ]
      );
    } else {
      addBotMessage(
        "Understood. How would you like to proceed?",
        ["Return to Core"]
      );
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playAudio("click");
    const userQuery = inputText.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userQuery }]);
    setInputText("");

    // Simulate search logic keyword match or route to corresponding rule options
    const queryLower = userQuery.toLowerCase();
    if (queryLower.includes("security") || queryLower.includes("hack") || queryLower.includes("soc") || queryLower.includes("threat")) {
      addBotMessage(
        "Kloudera Security Systems detected query match: 'Cyber Security'. What security target do you require?",
        ["24/7 SOC Monitoring", "Security Penetration Audit", "Contact the Team", "Main Menu"]
      );
    } else if (queryLower.includes("hardware") || queryLower.includes("gpu") || queryLower.includes("nvidia") || queryLower.includes("macbook")) {
      addBotMessage(
        "Hardware Vault catalogs triggered: Select system class.",
        ["AI & Deep Learning Models", "Software Development rigs", "Contact the Team", "Main Menu"]
      );
    } else if (queryLower.includes("microsoft") || queryLower.includes("azure") || queryLower.includes("m365") || queryLower.includes("entra")) {
      addBotMessage(
        "Microsoft Wing systems triggered: Select infrastructure scope.",
        ["M365 Cloud Migration", "Entra Identity Security", "Contact the Team", "Main Menu"]
      );
    } else if (queryLower.includes("meeting") || queryLower.includes("book") || queryLower.includes("schedule") || queryLower.includes("calendar")) {
      addBotMessage(
        "Calendar synchronization active. Schedule a virtual workspace meeting.",
        ["Book a Direct Consultation", "Contact the Team", "Main Menu"]
      );
    } else if (queryLower.includes("career") || queryLower.includes("job") || queryLower.includes("apply") || queryLower.includes("work")) {
      addBotMessage(
        "Kloudera Careers: We are currently hiring security auditors, AI pipeline managers, and Microsoft consultants.",
        ["Contact the Team", "Main Menu"],
        "/careers",
        "View Open Careers"
      );
    } else if (queryLower.includes("contact") || queryLower.includes("team") || queryLower.includes("email") || queryLower.includes("phone")) {
      addBotMessage(
        "Kloudera Communications Gateway: How would you like to reach our security and systems integration team?",
        ["Book a Direct Consultation", "Send an Email Message", "Main Menu"]
      );
    } else {
      addBotMessage(
        "Natural language processing is restricted for security protocols. Please select from the available diagnostic commands below:",
        [
          "Recommend Cyber Security",
          "Configure Hardware Rig",
          "Explore Microsoft Suite",
          "Navigate Virtual Headquarters",
          "Contact the Team"
        ]
      );
    }
  };

  if (isIframe) return null;

  return (
    <>
      {/* Floating Hologram Orb Trigger */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          playAudio("click");
        }}
        className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[999] flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-purple-500/40 bg-black/90 shadow-[0_0_20px_rgba(168,85,247,0.4)] backdrop-blur-md transition-all hover:scale-110 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] cursor-pointer"
        title="AI Infrastructure Advisor"
        id="btn-ai-assistant-toggle"
      >
        <span className="relative flex h-8 w-8 items-center justify-center">
          {/* Pulsing circles inside the holographic trigger */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-30" />
          <span className="relative inline-flex h-6 w-6 rounded-full bg-gradient-to-tr from-purple-600 to-teal-400 shadow-[inset_0_0_10px_rgba(255,255,255,0.6)]" />
        </span>
      </button>

      {/* Holographic Dialog Console */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[999] flex h-[480px] w-[360px] flex-col rounded-lg border border-purple-500/20 bg-zinc-950/95 shadow-[0_0_40px_rgba(168,85,247,0.2)] backdrop-blur-md overflow-hidden animate-[fadeIn_0.3s_ease-out] font-mono">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-purple-500/20 bg-black/40 p-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />
              <span className="text-[11px] font-bold tracking-widest text-purple-400">KLOUDERA_ASSISTANT_V4</span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                playAudio("click");
              }}
              className="text-zinc-500 hover:text-white cursor-none"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Interactive Scan Line Overlay */}
          {performanceMode !== "lite" && (
            <div className="absolute inset-x-0 bottom-12 h-[1px] bg-purple-500/10 pointer-events-none animate-[scanAssistant_6s_infinite_linear]" />
          )}

          {/* Chat Logs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[10px] scrollbar-none">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded p-3 leading-relaxed border ${
                    msg.sender === "user"
                      ? "bg-purple-950/20 border-purple-500/20 text-purple-300"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-300"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Direct hyperlink if present */}
                  {msg.link && (
                    <a
                      href={msg.link}
                      className="mt-2 inline-flex items-center gap-1 font-bold text-teal-400 hover:underline cursor-none"
                    >
                      <span>{msg.linkLabel || "Explore link"}</span>
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Options selectors */}
                {msg.sender === "bot" && msg.options && (
                  <div className="mt-2 flex flex-wrap gap-1.5 w-full">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(opt)}
                        className="rounded border border-purple-500/30 bg-black/40 px-2.5 py-1 text-[9px] font-bold text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 transition-all cursor-none"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1 text-[10px] text-purple-400/60 italic">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500 [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500 [animation-delay:0.4s]" />
                <span>Assistant calculating...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSendMessage} className="border-t border-purple-500/20 bg-black/40 p-3 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Query diagnostic tree..."
              className="flex-1 rounded border border-purple-500/10 bg-zinc-950 px-3 py-2 text-[10px] text-zinc-100 placeholder-zinc-600 focus:border-purple-500/30 focus:outline-none cursor-none"
            />
            <button
              type="submit"
              className="rounded bg-purple-600 px-3 py-2 text-[10px] font-bold text-black hover:bg-purple-500 transition-colors cursor-none"
            >
              SEND
            </button>
          </form>
        </div>
      )}

      {/* CSS custom keyframe for vertical scan inside assistant dialog */}
      <style jsx global>{`
        @keyframes scanAssistant {
          0% { bottom: 95%; }
          100% { bottom: 5%; }
        }
      `}</style>
    </>
  );
};
