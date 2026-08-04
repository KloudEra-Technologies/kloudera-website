"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useAccessibility } from "./AccessibilityContext";
import { UnlockingOverlay } from "./UnlockingOverlay";

interface Department {
  name: string;
  url: string;
  desc: string;
  color: string;
  telemetry: string;
}

const DEPARTMENTS: Department[] = [
  { name: "Services Command Deck", url: "/services", desc: "Managed Cybersecurity, Cloud, Automation, Digital Technology, Custom LLM, and Hardware.", color: "#06b6d4", telemetry: "SERVICES_DECK: ONLINE" },
  { name: "About Our Enterprise", url: "/about", desc: "Our mission, company background, and core values of high quality and standards.", color: "#ffffff", telemetry: "MISSION_DECK: LOCKED" },
  { name: "Career Port", url: "/careers", desc: "Explore job opportunities and join a team of innovators shaping the future.", color: "#a855f7", telemetry: "RECRUIT_GATE: LISTENING" },
  { name: "Our Partners", url: "/partners", desc: "We collaborate with global leaders like Microsoft, MongoDB, Cross Cipher, and Sprinto.", color: "#1e40af", telemetry: "ALLIANCES_BUS: RUNNING" },
  { name: "Executive Briefing Deck", url: "/contact", desc: "Get in touch with our Bengaluru and Pune offices for support and inquiries.", color: "#cbd5e1", telemetry: "COMMS_GATEWAY: OPEN" },
];

interface Partner {
  name: string;
  fullName: string;
  desc: string;
  logoColor: string;
  zVal: number;
  isLeft: boolean;
  yVal?: number;
}

const PARTNER_TEMPLATES = [
  { name: "Microsoft", fullName: "Microsoft Gold Partner", desc: "Enterprise cloud sync configurations & Entra architectures.", logoColor: "#3b82f6" },
  { name: "MongoDB", fullName: "MongoDB Database Partner", desc: "Distributed document database engines and atlas clouds.", logoColor: "#10b981" },
  { name: "Cross Cipher", fullName: "Cross Cipher Cybersec", desc: "Advanced cryptography network shield integrations.", logoColor: "#0ea5e9" },
  { name: "Sprinto", fullName: "Sprinto Compliance", desc: "Automated security compliance auditing and SOC2 readiness.", logoColor: "#a855f7" },
  { name: "AvePoint", fullName: "AvePoint SaaS Cloud", desc: "Enterprise data management & SaaS governance orchestration.", logoColor: "#ef4444" },
  { name: "Axidian", fullName: "Axidian Identity Security", desc: "Access control, single sign-on, and credential management.", logoColor: "#6366f1" },
  { name: "Ishan Technologies", fullName: "Ishan Technologies Integrator", desc: "High-performance WAN networking & telecommunications.", logoColor: "#3b82f6" },
  { name: "Web Werks", fullName: "Web Werks Datacenters", desc: "Tier-III colocation datacenters and hybrid clouds.", logoColor: "#0ea5e9" },
  { name: "Salesforce", fullName: "Salesforce CRM Partner", desc: "Customer relationship index matrices and cloud API sync.", logoColor: "#0ea5e9" },
  { name: "Trend Micro", fullName: "Trend Micro Security", desc: "Hybrid cloud intrusion prevention and server security.", logoColor: "#ef4444" },
  { name: "Seclogic", fullName: "Seclogic Cyber Auditing", desc: "Threat vector modeling and secure intelligence audits.", logoColor: "#22c55e" },
  { name: "Snowflake", fullName: "Snowflake Data Partner", desc: "Elastic data warehouse compute clusters and SQL queries.", logoColor: "#38bdf8" },
  { name: "Adobe", fullName: "Adobe Design Partner", desc: "Creative suite assets orchestration and design environments.", logoColor: "#f43f5e" },
  { name: "Arcon", fullName: "Arcon Privileged Access", desc: "Privileged user monitoring and session governance.", logoColor: "#ef4444" },
  { name: "AWS", fullName: "AWS Cloud Partner", desc: "Elastic compute cloud clusters and VPC network subnets.", logoColor: "#ff9900" },
  { name: "CloudBlue", fullName: "CloudBlue SaaS Platform", desc: "Cloud commerce provisioning and SaaS subscription sync.", logoColor: "#3b82f6" },
  { name: "RAS Infotech Limited", fullName: "RAS Infotech Limited", desc: "Enterprise value-added cybersecurity distribution.", logoColor: "#0ea5e9" },
  { name: "Databricks", fullName: "Databricks Lakehouse", desc: "Unified data engineering, analytics, and delta tables.", logoColor: "#f97316" },
  { name: "Fortinet", fullName: "Fortinet Security Partner", desc: "Next-gen firewalls, packet filters, and UTM appliances.", logoColor: "#ef4444" },
  { name: "Google Cloud", fullName: "Google Cloud Partner", desc: "Anthos hybrid-cloud configurations and Kubernetes clusters.", logoColor: "#4285F4" },
  { name: "IBM", fullName: "IBM Cognitive Partner", desc: "Cognitive compute, mainframe cloud sync, and quantum services.", logoColor: "#0062ff" },
  { name: "Synergic Training", fullName: "Synergic Training & Consulting", desc: "Professional DevOps & Agile training integrations.", logoColor: "#6366f1" },
  { name: "DigitalOcean", fullName: "DigitalOcean Developer Partner", desc: "Developer cloud droplets, app platform, and block storage.", logoColor: "#0069ff" },
  { name: "Zoom", fullName: "Zoom Video Communications", desc: "Enterprise virtual meetings & collaborative workspace APIs.", logoColor: "#3b82f6" },
  { name: "Kratikal", fullName: "Kratikal Secure For Sure", desc: "Vulnerability assessment, penetration tests, and anti-phishing.", logoColor: "#f59e0b" },
  { name: "Datasamudra", fullName: "Datasamudra Cloud Solutions", desc: "Co-location server hosting and secure data backup storage.", logoColor: "#10b981" },
  { name: "NxtGen", fullName: "NxtGen Infinite Datacenters", desc: "Enterprise cloud services and secure bare-metal compute.", logoColor: "#0ea5e9" },
  { name: "AccuKnox", fullName: "AccuKnox Zero Trust Runtime", desc: "Kubernetes runtime security & zero-trust posture monitoring.", logoColor: "#6366f1" },
  { name: "Acronis", fullName: "Acronis Cyber Protect", desc: "Integrated backup, disaster recovery, and cyber protection.", logoColor: "#3b82f6" },
  { name: "BeyondTrust", fullName: "BeyondTrust PAM", desc: "Privileged remote access and endpoint privilege management.", logoColor: "#ff9900" },
  { name: "Datadog", fullName: "Datadog Telemetry Partner", desc: "Real-time telemetry aggregation and performance metrics.", logoColor: "#6366f1" },
  { name: "Forcepoint", fullName: "Forcepoint Edge Security", desc: "Data loss prevention, secure web gateway, and SASE cloud.", logoColor: "#10b981" },
  { name: "HCL Software", fullName: "HCL Software Solutions", desc: "Enterprise software development & AI orchestration.", logoColor: "#3b82f6" },
  { name: "HP", fullName: "HP Enterprise Systems", desc: "Scalable rack mount servers, virtualization, and storage.", logoColor: "#00b050" },
  { name: "Infoblox", fullName: "Infoblox DDI Services", desc: "DNS, DHCP, and IP address management infrastructure.", logoColor: "#22c55e" },
  { name: "JumpCloud", fullName: "JumpCloud Directory Platform", desc: "Cloud directory services, SSO, and MDM configurations.", logoColor: "#38bdf8" },
  { name: "NinjaOne", fullName: "NinjaOne RMM Platform", desc: "Unified endpoint remote monitoring & patching automation.", logoColor: "#f97316" },
  { name: "SAP", fullName: "SAP Enterprise Partner", desc: "Enterprise resource planning databases and ledger engines.", logoColor: "#008fd3" },
  { name: "Attrix", fullName: "Attrix Technologies", desc: "Cybersecurity assessment, compliance, and threat hunting.", logoColor: "#f59e0b" },
  { name: "ServiceNow", fullName: "ServiceNow IT Partner", desc: "IT service management ticketing and workflow automation.", logoColor: "#293e40" },
  { name: "Tally", fullName: "Tally Solutions Partner", desc: "Business management software and accounting ledger sync.", logoColor: "#ef4444" },
  { name: "TeamViewer", fullName: "TeamViewer Remote Access", desc: "Secure remote desktop connections & IoT interface nodes.", logoColor: "#3b82f6" },
  { name: "UiPath", fullName: "UiPath Automation Partner", desc: "Robotic process automation bots and cognitive loops.", logoColor: "#fa4616" },
  { name: "Zabbix", fullName: "Zabbix Monitoring Solutions", desc: "Real-time network device tracking & server alert nodes.", logoColor: "#ef4444" },
  { name: "Zoho", fullName: "Zoho Business Partner", desc: "Collaborative workspace systems and custom creator apps.", logoColor: "#f59e0b" },
  { name: "6clicks", fullName: "6clicks GRC Audits", desc: "Risk assessment, policy mapping, and auditor checklists.", logoColor: "#3b82f6" },
  { name: "Forescout", fullName: "Forescout Device Visibility", desc: "Continuous asset inventory and network access control.", logoColor: "#10b981" },
  { name: "Tenable", fullName: "Tenable Vulnerability Partner", desc: "Vulnerability scanning, Nessus audits, and risk scoring.", logoColor: "#4f46e5" },
  { name: "Veeam", fullName: "Veeam Backup Partner", desc: "Secure backup, replication, and disaster recovery nodes.", logoColor: "#00b050" },
  { name: "Sify", fullName: "Sify Technologies Integrator", desc: "Enterprise network architecture and secure colocation.", logoColor: "#85b810" },
  { name: "AdaniConnex", fullName: "AdaniConnex Datacenters", desc: "Green hyper-scale data hosting grids and solar power grids.", logoColor: "#3b82f6" },
  { name: "CtrlS", fullName: "CtrlS Rated-4 Datacenters", desc: "Disaster recovery, managed hosting, and enterprise cloud.", logoColor: "#22c55e" },
  { name: "Colt", fullName: "Colt Technology Services", desc: "High-speed optical fiber networks & global SD-WAN nodes.", logoColor: "#0ea5e9" },
  { name: "Zendesk", fullName: "Zendesk Support Partner", desc: "Omnichannel customer support index routing environments.", logoColor: "#032d20" },
  { name: "Xurrent", fullName: "Xurrent Service Management", desc: "Enterprise service management orchestration platforms.", logoColor: "#a855f7" },
  { name: "current", fullName: "Xurrent Service Management", desc: "Enterprise service management orchestration platforms.", logoColor: "#a855f7" },
  { name: "Radware", fullName: "Radware DDoS Shield", desc: "Application delivery controllers and DDoS mitigation.", logoColor: "#ef4444" },
  { name: "Quest", fullName: "Quest Software Solutions", desc: "Active directory backup, cloud sync, and SQL performance.", logoColor: "#06b6d4" },
  { name: "IdentityOne", fullName: "IdentityOne Access", desc: "Biometric access verification & security clearance control.", logoColor: "#ff9900" },
  { name: "Ingram", fullName: "Ingram Micro Distribution", desc: "Global IT logistics supply chain and technology staging.", logoColor: "#3b82f6" },
  { name: "SnapLogic", fullName: "SnapLogic Integration", desc: "Generative integration workflows and cloud data pipelines.", logoColor: "#0ea5e9" },
  { name: "RP", fullName: "RP Tech India", desc: "Technology product distribution and infrastructure sales.", logoColor: "#f59e0b" }
];

const PARTNERS: Partner[] = [];
const slots: { zVal: number; isLeft: boolean; yVal: number }[] = [];
const pillarZPositions = [-2, -8, -14, -20, -26, -32, -38, -44, -50, -56];

// Slots are kept empty to remove all partner posters from the walls and show the clean cybersecurity wallpaper.

// Populate PARTNERS to fill all generated slots systematically (looping templates to ensure no empty space and a perfect repeating pattern)
slots.forEach((slot, idx) => {
  const tpl = PARTNER_TEMPLATES[idx % PARTNER_TEMPLATES.length];
  PARTNERS.push({
    ...tpl,
    zVal: slot.zVal,
    isLeft: slot.isLeft,
    yVal: slot.yVal
  });
});

const createPartnerLogoTexture = (name: string, logoColor: string) => {
  if (typeof window === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Dark canvas background
  ctx.fillStyle = "#09090b";
  ctx.fillRect(0, 0, 512, 256);

  // Outer border trim
  ctx.strokeStyle = logoColor;
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 496, 240);

  // Draw customized logo graphic centered vertically at y=128
  ctx.save();
  if (name === "Microsoft") {
    ctx.fillStyle = "#f25f22"; ctx.fillRect(60, 80, 42, 42);
    ctx.fillStyle = "#7fba00"; ctx.fillRect(106, 80, 42, 42);
    ctx.fillStyle = "#00a4ef"; ctx.fillRect(60, 126, 42, 42);
    ctx.fillStyle = "#ffb900"; ctx.fillRect(106, 126, 42, 42);
  } else if (name === "MongoDB") {
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.moveTo(100, 80);
    ctx.quadraticCurveTo(130, 128, 100, 176);
    ctx.quadraticCurveTo(70, 128, 100, 80);
    ctx.fill();
  } else if (name === "Sprinto") {
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(100, 85);
    ctx.lineTo(135, 95);
    ctx.lineTo(135, 140);
    ctx.quadraticCurveTo(100, 175, 100, 175);
    ctx.quadraticCurveTo(65, 140, 65, 140);
    ctx.lineTo(65, 95);
    ctx.closePath();
    ctx.stroke();
  } else if (name === "Salesforce") {
    ctx.fillStyle = "#0ea5e9";
    ctx.beginPath();
    ctx.arc(80, 134, 18, 0, Math.PI * 2);
    ctx.arc(105, 120, 24, 0, Math.PI * 2);
    ctx.arc(130, 134, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(80, 134, 50, 16);
  } else if (name === "Trend Micro") {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(104, 128, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(104, 128, 20, Math.PI/4, Math.PI * 1.2);
    ctx.stroke();
  } else if (name === "Snowflake") {
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
      ctx.beginPath();
      ctx.moveTo(104, 128);
      ctx.lineTo(104 + Math.sin(angle) * 32, 128 + Math.cos(angle) * 32);
      ctx.stroke();
    }
  } else if (name === "Adobe") {
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.moveTo(104, 88);
    ctx.lineTo(138, 168);
    ctx.lineTo(116, 168);
    ctx.lineTo(104, 138);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(104, 88);
    ctx.lineTo(70, 168);
    ctx.lineTo(92, 168);
    ctx.lineTo(104, 138);
    ctx.closePath();
    ctx.fill();
  } else if (name === "AWS") {
    ctx.strokeStyle = "#ff9900";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(104, 114, 30, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();
  } else if (name === "Fortinet") {
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(74, 98, 60, 12);
    ctx.fillRect(74, 118, 60, 12);
    ctx.fillRect(74, 138, 60, 12);
  } else if (name === "Google Cloud") {
    ctx.fillStyle = "#ea4335";
    ctx.beginPath();
    ctx.moveTo(104, 80);
    ctx.lineTo(140, 100);
    ctx.lineTo(140, 140);
    ctx.lineTo(104, 160);
    ctx.lineTo(68, 140);
    ctx.lineTo(68, 100);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#4285f4";
    ctx.beginPath();
    ctx.arc(104, 120, 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (name === "IBM") {
    ctx.fillStyle = "#0062ff";
    for (let y = 92; y <= 164; y += 10) {
      ctx.fillRect(68, y, 72, 5);
    }
  } else if (name === "Datadog") {
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    ctx.arc(104, 128, 28, 0, Math.PI * 2);
    ctx.fill();
  } else if (name === "SAP") {
    ctx.fillStyle = "#008fd3";
    ctx.beginPath();
    ctx.moveTo(68, 92);
    ctx.lineTo(140, 92);
    ctx.lineTo(128, 164);
    ctx.lineTo(56, 164);
    ctx.closePath();
    ctx.fill();
  } else if (name === "ServiceNow") {
    ctx.fillStyle = "#293e40";
    ctx.beginPath();
    ctx.arc(104, 128, 28, 0, Math.PI * 2);
    ctx.fill();
  } else if (name === "Tenable") {
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(104, 128, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    ctx.arc(104, 128, 12, 0, Math.PI * 2);
    ctx.fill();
  } else if (name === "Veeam") {
    ctx.fillStyle = "#00b050";
    ctx.fillRect(72, 92, 30, 72);
    ctx.fillRect(106, 92, 28, 28);
    ctx.fillRect(106, 124, 28, 40);
  } else if (name === "Zoho") {
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(88, 114, 16, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "#10b981"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(120, 114, 16, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(88, 142, 16, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(120, 142, 16, 0, Math.PI * 2); ctx.stroke();
  } else if (name === "Zendesk") {
    ctx.fillStyle = "#032d20";
    ctx.beginPath();
    ctx.arc(90, 128, 20, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(118, 128, 20, 0, Math.PI);
    ctx.fill();
  } else if (name === "DigitalOcean") {
    ctx.fillStyle = "#0069ff";
    ctx.beginPath();
    ctx.arc(104, 128, 30, Math.PI * 0.2, Math.PI * 1.8);
    ctx.stroke();
  } else if (name === "UiPath") {
    ctx.font = "bold 78px sans-serif";
    ctx.fillStyle = "#fa4616";
    ctx.fillText("U", 78, 156);
  }
  ctx.restore();

  // Brand Name Typography centered vertically
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 38px monospace";
  ctx.textAlign = "left";
  ctx.fillText(name.toUpperCase(), 200, 128);

  // Subtitle
  ctx.fillStyle = logoColor;
  ctx.font = "bold 14px monospace";
  ctx.fillText("PARTNER ALLIANCE NODE", 200, 162);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

const createChromaKeyTexture = (imgUrl: string, keyColor: "white" | "black") => {
  if (typeof window === "undefined") return null;
  console.log(`[ChromaKey] Initializing texture for: ${imgUrl}`);
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d");
  
  const texture = new THREE.CanvasTexture(canvas);
  const img = new Image();
  
  img.onload = () => {
    console.log(`[ChromaKey] Image loaded successfully: ${imgUrl} (${img.naturalWidth}x${img.naturalHeight})`);
    // Draw scaled to match fixed canvas dimensions to prevent WebGL texture size re-allocation
    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    if (imgData) {
      const data = imgData.data;
      let keyedCount = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        if (keyColor === "white") {
          if (r > 220 && g > 220 && b > 220) {
            data[i+3] = 0;
            keyedCount++;
          }
        } else {
          if (r < 25 && g < 25 && b < 25) {
            data[i+3] = 0;
            keyedCount++;
          }
        }
      }
      console.log(`[ChromaKey] Processed pixels for ${imgUrl}. Keyed out ${keyedCount} pixels.`);
      ctx?.putImageData(imgData, 0, 0);
      texture.needsUpdate = true;
    }
  };
  
  img.onerror = (err) => {
    console.error(`[ChromaKey] Failed to load image: ${imgUrl}`, err);
  };
  
  img.src = imgUrl;
  return texture;
};

const createKlouderaLogoTexture = () => {
  if (typeof window === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Dark canvas background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 1024, 512);

  // Draw grid pattern in the background
  ctx.strokeStyle = "rgba(20, 184, 166, 0.08)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 1024; i += 64) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
  }
  for (let j = 0; j < 512; j += 64) {
    ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(1024, j); ctx.stroke();
  }

  // Draw laser accent bands (teal and purple borders)
  ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(100, 480);
  ctx.lineTo(924, 480);
  ctx.stroke();

  ctx.strokeStyle = "rgba(20, 184, 166, 0.3)";
  ctx.beginPath();
  ctx.moveTo(100, 32);
  ctx.lineTo(924, 32);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);

  // Load the official logo PNG directly from public/logo.png
  const img = new Image();
  img.onload = () => {
    // Process image to make white background pixels transparent
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = img.naturalWidth;
    tempCanvas.height = img.naturalHeight;
    const tempCtx = tempCanvas.getContext("2d");
    if (tempCtx) {
      tempCtx.drawImage(img, 0, 0);
      const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const pixels = imgData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i+1];
        const b = pixels[i+2];
        // Chroma key near-white pixels to transparent
        if (r > 235 && g > 235 && b > 235) {
          pixels[i+3] = 0;
        }
      }
      tempCtx.putImageData(imgData, 0, 0);
    }

    ctx.save();
    // Draw a premium soft satin zinc-grey background plaque behind the logo (prevents washing out)
    ctx.shadowColor = "rgba(20, 184, 166, 0.4)";
    ctx.shadowBlur = 30;
    ctx.fillStyle = "rgba(228, 228, 231, 0.95)"; // Zinc-200 satin finish
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(112, 136, 800, 240, 16);
    } else {
      ctx.rect(112, 136, 800, 240);
    }
    ctx.fill();
    ctx.restore();

    // Draw the chroma-keyed logo canvas
    const imgW = 720;
    const imgH = 720 * (img.naturalHeight / img.naturalWidth || 411/1830);
    const x = (1024 - imgW) / 2;
    const y = (512 - imgH) / 2;
    ctx.drawImage(tempCanvas, x, y, imgW, imgH);

    // Notify Three.js that the texture needs an update
    texture.needsUpdate = true;
  };
  img.src = "/logo.png";

  return texture;
};

interface CyberCommandCenterProps {
  onNavigate: (url: string) => void;
}

export const CyberCommandCenter3D: React.FC<CyberCommandCenterProps> = ({ onNavigate }) => {
  const { performanceMode, setPerformanceMode, playAudio } = useAccessibility();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [projectedPositions, setProjectedPositions] = useState<{ x: number; y: number; id: number }[]>([]);
  const [zooming, setZooming] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockingRoomName, setUnlockingRoomName] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  
  // Dynamic doors state loaded from Canva JSON store
  const [activeDoors, setActiveDoors] = useState<Department[]>(DEPARTMENTS);

  useEffect(() => {
    fetch("/api/website-content")
      .then(res => res.json())
      .then(data => {
        if (data && data.home && data.home.doors) {
          const loaded = data.home.doors.map((door: any, idx: number) => ({
            name: door.name,
            url: DEPARTMENTS[idx].url, // Kept to correct routes
            desc: door.desc,
            color: door.color || DEPARTMENTS[idx].color,
            telemetry: door.telemetry || DEPARTMENTS[idx].telemetry
          }));
          setActiveDoors(loaded);
        }
      })
      .catch(err => console.log("Using static fallback doors:", err.message));
  }, []);

  const hoveredNodeRef = useRef<number | null>(null);
  const zoomingRef = useRef<boolean>(false);

  const updateHoveredNode = (val: number | null) => {
    setHoveredNode(val);
    hoveredNodeRef.current = val;
  };

  const updateZooming = (val: boolean) => {
    setZooming(val);
    zoomingRef.current = val;
  };

  useEffect(() => {
    // If Lite Mode (Mobile), we bypass WebGL and render SVG version instead
    if (performanceMode === "lite") return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Initialize Scene & Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0c, 25, 95);

    let currentWidth = container.clientWidth || 800;
    let currentHeight = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(50, currentWidth / currentHeight, 0.1, 100);
    camera.rotation.order = "YXZ";
    camera.position.set(0, 1.1, 1.5); // Center of corridor, eye-level

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      
      if (!renderer.getContext()) {
        throw new Error("WebGL context is null");
      }
      
      renderer.setSize(currentWidth, currentHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
    } catch (e) {
      console.warn("WebGL initialization failed, falling back to Lite mode:", e);
      setTimeout(() => {
        setPerformanceMode("lite");
      }, 0);
      return;
    }

    // 2. Base Corridor Architecture (Kloudera Animated Cyber Command Center Wallpaper)
    const textureLoader = new THREE.TextureLoader();
    
    // Left Wall Animated Canvas Setup (Double resolution 3072x256 for razor-sharp text and waveforms)
    const leftCanvas = document.createElement("canvas");
    leftCanvas.width = 3072;
    leftCanvas.height = 256;
    const leftCtx = leftCanvas.getContext("2d");
    const leftWallTex = new THREE.CanvasTexture(leftCanvas);
    leftWallTex.wrapS = THREE.ClampToEdgeWrapping;
    leftWallTex.wrapT = THREE.ClampToEdgeWrapping;

    // Right Wall Animated Canvas Setup (Double resolution 3072x256 for sharp server rack displays)
    const rightCanvas = document.createElement("canvas");
    rightCanvas.width = 3072;
    rightCanvas.height = 256;
    const rightCtx = rightCanvas.getContext("2d");
    const rightWallTex = new THREE.CanvasTexture(rightCanvas);
    rightWallTex.wrapS = THREE.ClampToEdgeWrapping;
    rightWallTex.wrapT = THREE.ClampToEdgeWrapping;

    const leftWallMat = new THREE.MeshStandardMaterial({ 
      map: leftWallTex,
      emissiveMap: leftWallTex,
      emissive: 0x555555, // Self-luminous glow for screens
      roughness: 0.15, 
      metalness: 0.8
    });

    const rightWallMat = new THREE.MeshStandardMaterial({ 
      map: rightWallTex,
      emissiveMap: rightWallTex,
      emissive: 0x555555, // Self-luminous glow for screens
      roughness: 0.15, 
      metalness: 0.8
    });

    // Procedural Cybersecurity Animation Drawing Logic (Scaled x2 for 3072x256)
    const drawWallAnimations = (time: number) => {
      if (!leftCtx || !rightCtx) return;

      // Clear background
      leftCtx.fillStyle = "#07070a";
      leftCtx.fillRect(0, 0, 3072, 256);
      rightCtx.fillStyle = "#07070a";
      rightCtx.fillRect(0, 0, 3072, 256);

      // Grid lines
      leftCtx.strokeStyle = "rgba(6, 182, 212, 0.05)";
      leftCtx.lineWidth = 1.5;
      for (let x = 0; x < 3072; x += 64) {
        leftCtx.beginPath(); leftCtx.moveTo(x, 0); leftCtx.lineTo(x, 256); leftCtx.stroke();
      }
      for (let y = 0; y < 256; y += 64) {
        leftCtx.beginPath(); leftCtx.moveTo(0, y); leftCtx.lineTo(3072, y); leftCtx.stroke();
      }
      rightCtx.strokeStyle = "rgba(6, 182, 212, 0.05)";
      rightCtx.lineWidth = 1.5;
      for (let x = 0; x < 3072; x += 64) {
        rightCtx.beginPath(); rightCtx.moveTo(x, 0); rightCtx.lineTo(x, 256); rightCtx.stroke();
      }
      for (let y = 0; y < 256; y += 64) {
        rightCtx.beginPath(); rightCtx.moveTo(0, y); rightCtx.lineTo(3072, y); rightCtx.stroke();
      }

      // --- LEFT WALL: Security Operations Center ---
      // Section 1: System Init / Authorization (x: 0 to 1024)
      leftCtx.strokeStyle = "rgba(6, 182, 212, 0.25)";
      leftCtx.lineWidth = 2;
      leftCtx.strokeRect(16, 16, 992, 224);
      leftCtx.lineWidth = 1;
      
      // Radar Sweeper
      const radarX = 180;
      const radarY = 128;
      leftCtx.beginPath();
      leftCtx.arc(radarX, radarY, 80, 0, Math.PI * 2);
      leftCtx.strokeStyle = "rgba(6, 182, 212, 0.3)";
      leftCtx.lineWidth = 2;
      leftCtx.stroke();
      leftCtx.lineWidth = 1;

      const sweepAngle = time * 2.2;
      leftCtx.beginPath();
      leftCtx.moveTo(radarX, radarY);
      leftCtx.lineTo(radarX + Math.cos(sweepAngle) * 80, radarY + Math.sin(sweepAngle) * 80);
      leftCtx.strokeStyle = "#22d3ee";
      leftCtx.lineWidth = 3;
      leftCtx.stroke();
      leftCtx.lineWidth = 1;

      leftCtx.beginPath();
      leftCtx.arc(radarX, radarY, 90, sweepAngle * 0.5, sweepAngle * 0.5 + Math.PI);
      leftCtx.strokeStyle = "rgba(168, 85, 247, 0.35)";
      leftCtx.lineWidth = 2;
      leftCtx.stroke();
      leftCtx.lineWidth = 1;

      // Scrolling console log (x: 320 onwards)
      leftCtx.fillStyle = "#22d3ee";
      leftCtx.font = "bold 18px monospace";
      const logOffset = Math.floor(time * 2.0) % 4;
      const logs = [
        "KLOUDERA SECURE CORE v5.12",
        "ACCESS GATEWAYS: SYSTEM_OK",
        `THREAT MONITOR: ACTIVE [SWEEPING]`,
        `SECURE CONSOLE: SHIELD_MAX_CAP`,
        "ENCRYPTION KEY: SHA-256_ACTIVE",
        "PORT 443 FIREWALL: PROTECTED"
      ];
      for (let i = 0; i < 4; i++) {
        const logIdx = (i + logOffset) % logs.length;
        leftCtx.fillText(logs[logIdx], 320, 56 + i * 44);
      }

      // Section 2: Encrypted Pipeline Flows (x: 1024 to 2048)
      leftCtx.strokeStyle = "rgba(168, 85, 247, 0.25)";
      leftCtx.lineWidth = 2;
      leftCtx.strokeRect(1040, 16, 992, 224);
      leftCtx.lineWidth = 1;

      const flowLinesY = [64, 128, 192];
      leftCtx.lineWidth = 3;
      flowLinesY.forEach((yVal, lineIdx) => {
        leftCtx.beginPath();
        leftCtx.moveTo(1080, yVal);
        leftCtx.lineTo(1980, yVal);
        leftCtx.strokeStyle = "rgba(168, 85, 247, 0.2)";
        leftCtx.stroke();

        const speed = 150 + lineIdx * 45;
        const packetX = 1080 + ((time * speed) % 860);
        leftCtx.beginPath();
        leftCtx.arc(packetX, yVal, 8, 0, Math.PI * 2);
        leftCtx.fillStyle = lineIdx === 1 ? "#22d3ee" : "#a855f7";
        leftCtx.fill();
        
        // Inner white light packet
        leftCtx.beginPath();
        leftCtx.arc(packetX, yVal, 4, 0, Math.PI * 2);
        leftCtx.fillStyle = "#ffffff";
        leftCtx.fill();
      });
      leftCtx.lineWidth = 1;

      // Section 3: Threat Analytics Waveform (x: 2048 to 3072)
      leftCtx.strokeStyle = "rgba(6, 182, 212, 0.25)";
      leftCtx.lineWidth = 2;
      leftCtx.strokeRect(2064, 16, 992, 224);
      leftCtx.lineWidth = 1;

      leftCtx.beginPath();
      leftCtx.strokeStyle = "#22d3ee";
      leftCtx.lineWidth = 3;
      for (let x = 2100; x < 2500; x++) {
        const yOffset = 128 + Math.sin(x * 0.025 + time * 12) * 40 * Math.sin(x * 0.0025 + time * 2);
        if (x === 2100) leftCtx.moveTo(x, yOffset);
        else leftCtx.lineTo(x, yOffset);
      }
      leftCtx.stroke();
      leftCtx.lineWidth = 1;

      leftCtx.fillStyle = "rgba(168, 85, 247, 0.45)";
      for (let i = 0; i < 12; i++) {
        const barH = 40 + Math.sin(time * 3 + i) * 30 + Math.cos(time * 5 + i * 2) * 20;
        leftCtx.fillRect(2560 + i * 32, 200 - barH, 20, barH);
      }
      leftCtx.fillStyle = "#22d3ee";
      leftCtx.font = "bold 18px monospace";
      leftCtx.fillText("VAULT DETECT CORE", 2560, 50);
      leftCtx.fillText("INTEGRITY: 99.8%", 2560, 76);

      // --- RIGHT WALL: Security Matrix Hub ---
      // Section 1: Attack Vector Web (x: 0 to 1024)
      rightCtx.strokeStyle = "rgba(6, 182, 212, 0.25)";
      rightCtx.lineWidth = 2;
      rightCtx.strokeRect(16, 16, 992, 224);
      rightCtx.lineWidth = 1;

      const hubX = 512;
      const hubY = 128;
      rightCtx.beginPath();
      rightCtx.arc(hubX, hubY, 30, 0, Math.PI * 2);
      rightCtx.fillStyle = "rgba(6, 182, 212, 0.2)";
      rightCtx.fill();
      rightCtx.strokeStyle = "#22d3ee";
      rightCtx.lineWidth = 2;
      rightCtx.stroke();
      rightCtx.lineWidth = 1;

      const nodeAngles = [0, Math.PI/3, 2*Math.PI/3, Math.PI, 4*Math.PI/3, 5*Math.PI/3];
      nodeAngles.forEach((angle, i) => {
        const nx = hubX + Math.cos(angle) * 160;
        const ny = hubY + Math.sin(angle) * 70;
        
        rightCtx.beginPath();
        rightCtx.moveTo(hubX, hubY);
        rightCtx.lineTo(nx, ny);
        rightCtx.strokeStyle = "rgba(6, 182, 212, 0.2)";
        rightCtx.lineWidth = 1.5;
        rightCtx.stroke();
        rightCtx.lineWidth = 1;

        rightCtx.beginPath();
        rightCtx.arc(nx, ny, 12, 0, Math.PI * 2);
        rightCtx.fillStyle = (i === Math.floor(time * 1.5) % 6) ? "#ef4444" : "#a855f7";
        rightCtx.fill();
      });

      // Section 2: Server Cabinet Status (x: 1024 to 2048)
      rightCtx.strokeStyle = "rgba(168, 85, 247, 0.25)";
      rightCtx.lineWidth = 2;
      rightCtx.strokeRect(1040, 16, 992, 224);
      rightCtx.lineWidth = 1;

      for (let cab = 0; cab < 6; cab++) {
        const cabX = 1080 + cab * 150;
        rightCtx.fillStyle = "rgba(18, 18, 24, 0.85)";
        rightCtx.fillRect(cabX, 32, 120, 192);
        rightCtx.strokeStyle = "rgba(168, 85, 247, 0.4)";
        rightCtx.lineWidth = 1.5;
        rightCtx.strokeRect(cabX, 32, 120, 192);
        rightCtx.lineWidth = 1;

        for (let row = 0; row < 6; row++) {
          const rowY = 48 + row * 28;
          // Power
          rightCtx.beginPath();
          rightCtx.arc(cabX + 20, rowY, 4, 0, Math.PI * 2);
          rightCtx.fillStyle = "#10b981";
          rightCtx.fill();
          // Activity
          rightCtx.beginPath();
          rightCtx.arc(cabX + 48, rowY, 4, 0, Math.PI * 2);
          const actVal = Math.sin(time * 15 + cab * 3 + row * 7) > 0.2;
          rightCtx.fillStyle = actVal ? "#22d3ee" : "rgba(34, 211, 238, 0.2)";
          rightCtx.fill();
        }
      }

      // Section 3: Digital Matrix Stream (x: 2048 to 3072)
      rightCtx.strokeStyle = "rgba(6, 182, 212, 0.25)";
      rightCtx.lineWidth = 2;
      rightCtx.strokeRect(2064, 16, 992, 224);
      rightCtx.lineWidth = 1;

      rightCtx.fillStyle = "#22d3ee";
      rightCtx.font = "bold 18px monospace";
      for (let col = 0; col < 20; col++) {
        const colX = 2100 + col * 44;
        const colSpeed = 10 + (col % 5) * 5;
        const colY = 40 + Math.floor(time * colSpeed) % 160;
        for (let charIdx = 0; charIdx < 4; charIdx++) {
          const charY = colY - charIdx * 20;
          if (charY > 32 && charY < 224) {
            const opacity = 1.0 - charIdx * 0.25;
            rightCtx.fillStyle = `rgba(34, 211, 238, ${opacity})`;
            const binaryChar = Math.random() > 0.5 ? "1" : "0";
            rightCtx.fillText(binaryChar, colX, charY);
          }
        }
      }

      // Notify updates
      leftWallTex.needsUpdate = true;
      rightWallTex.needsUpdate = true;
    };

    const floorTex = textureLoader.load("/blue_white_floor.png");
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(2, 12);
    const floorMat = new THREE.MeshStandardMaterial({ 
      map: floorTex, 
      roughness: 0.18, 
      metalness: 0.25 
    });

    const ceilingTex = textureLoader.load("/tech_ceiling.png");
    ceilingTex.wrapS = THREE.RepeatWrapping;
    ceilingTex.wrapT = THREE.RepeatWrapping;
    ceilingTex.repeat.set(2, 12);
    const ceilingMat = new THREE.MeshStandardMaterial({ 
      map: ceilingTex, 
      roughness: 0.5,
      metalness: 0.15
    });

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.0, 62), leftWallMat);
    leftWall.position.set(-3.5, 2.0, -30);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.0, 62), rightWallMat);
    rightWall.position.set(3.5, 2.0, -30);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Skirting board trim in Kloudera deep blue (independently calculated to skip doors only on their actual wall sides)
    const skirtingMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 });
    
    // Left Wall has doors at Z = -8, -30, -52 (indexes 0, 2, 4)
    const leftSkirtingRanges = [
      { start: 0, end: -7.3 },
      { start: -8.7, end: -29.3 },
      { start: -30.7, end: -51.3 },
      { start: -52.7, end: -60 }
    ];

    // Right Wall has doors at Z = -19, -41 (indexes 1, 3)
    const rightSkirtingRanges = [
      { start: 0, end: -18.3 },
      { start: -19.7, end: -40.3 },
      { start: -41.7, end: -60 }
    ];

    leftSkirtingRanges.forEach((range) => {
      const depth = Math.abs(range.start - range.end);
      const midZ = (range.start + range.end) / 2;
      const leftSkirting = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, depth), skirtingMat);
      leftSkirting.position.set(-3.48, 0.075, midZ);
      leftSkirting.receiveShadow = true;
      scene.add(leftSkirting);
    });

    rightSkirtingRanges.forEach((range) => {
      const depth = Math.abs(range.start - range.end);
      const midZ = (range.start + range.end) / 2;
      const rightSkirting = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, depth), skirtingMat);
      rightSkirting.position.set(3.48, 0.075, midZ);
      rightSkirting.receiveShadow = true;
      scene.add(rightSkirting);
    });

    // Floor
    const floor = new THREE.Mesh(new THREE.BoxGeometry(7, 0.1, 62), floorMat);
    floor.position.set(0, -0.05, -30);
    floor.receiveShadow = true;
    scene.add(floor);



    // Ceiling
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(7, 0.1, 62), ceilingMat);
    ceiling.position.set(0, 4.05, -30);
    scene.add(ceiling);

    // Physical Back Wall to close the end of the gallery corridor
    const backWallMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(7.0, 4.0, 0.1), backWallMat);
    backWall.position.set(0, 2.0, -60.0);
    scene.add(backWall);

    // Large glowing Kloudera logo pasted on the back wall
    const klouderaTex = createKlouderaLogoTexture();
    if (klouderaTex) {
      const klouderaLogo = new THREE.Mesh(
        new THREE.PlaneGeometry(5.0, 2.5),
        new THREE.MeshStandardMaterial({
          map: klouderaTex,
          emissiveMap: klouderaTex,
          emissive: 0xffffff,
          emissiveIntensity: 0.65,
          transparent: true
        })
      );
      klouderaLogo.position.set(0, 2.0, -59.94); // Positioned slightly in front of the back wall to prevent z-fighting
      scene.add(klouderaLogo);

      // Add a glowing teal point light to cast light from the Kloudera brand logo onto the back wall
      const klouderaLight = new THREE.PointLight(0x14b8a6, 0.8, 12);
      klouderaLight.position.set(0, 2.0, -59.5);
      scene.add(klouderaLight);
    }

    // Structural Pillars (Ceiling Light fixtures only, blue wall pillars removed to keep wall animations continuous)
    for (let z = -2; z >= -58; z -= 6) {
      // Check if this position coincides with a door Z position
      const isNearDoor = activeDoors.some((dept, i) => {
        const doorZ = -8 - i * 11;
        return Math.abs(z - doorZ) < 1.5;
      });
      // Check if this position coincides with a partner Z position
      const isNearPartner = PARTNERS.some((partner) => {
        return Math.abs(z - partner.zVal) < 1.5;
      });
      if (isNearDoor || isNearPartner) continue;
 
      // Ceiling light fixture box
      const lightFixture = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.05, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.3 })
      );
      lightFixture.position.set(0, 3.95, z);
      scene.add(lightFixture);
 
      // Glowing light panel
      const lightBulb = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.02, 0.2),
        new THREE.MeshBasicMaterial({ color: 0xfef08a }) // Warm light white/yellow panels
      );
      lightBulb.position.set(0, 3.92, z);
      scene.add(lightBulb);

      // Add a physical PointLight to cast bright light down onto the floor/walls
      const ceilingLight = new THREE.PointLight(0xfffec7, 1.2, 10);
      ceilingLight.position.set(0, 3.7, z);
      ceilingLight.castShadow = performanceMode === "high";
      scene.add(ceilingLight);
    }

    // 3. Render Doors & Signboards along both sides
    const nodeMeshes: THREE.Mesh[] = []; // Raycast targets (doors + robot)
    const doorPlates: THREE.Mesh[] = [];

    activeDoors.forEach((dept, i) => {
      const isLeft = i % 2 === 0;
      const zVal = -8 - i * 11; // Doors spaced by 11 units
      const xVal = isLeft ? -3.45 : 3.45;

      // Door Frame (sleek dark grey frame)
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 2.3, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4 })
      );
      frame.position.set(xVal, 1.15, zVal);
      scene.add(frame);

      // Door Mesh (sleek black office door - neutral, no colored door panel)
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 2.2, 1.2),
        new THREE.MeshStandardMaterial({ 
          color: 0x18181b, 
          roughness: 0.22, 
          metalness: 0.5 
        })
      );
      door.position.set(xVal, 1.1, zVal);
      door.userData = { id: i, url: dept.url, name: dept.name, zVal, isLeft };
      scene.add(door);
      nodeMeshes.push(door);

      // Door Handle (premium reflective gold cylinder knob)
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.12, 8),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.05 })
      );
      handle.position.set(isLeft ? xVal + 0.04 : xVal - 0.04, 1.0, isLeft ? zVal + 0.45 : zVal - 0.45);
      handle.rotation.x = Math.PI / 2;
      scene.add(handle);

      // Signboard / Plaque next to door
      const signBoard = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.35, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.2 })
      );
      signBoard.position.set(
        isLeft ? xVal + 0.02 : xVal - 0.02, 
        1.6, 
        isLeft ? zVal - 0.95 : zVal + 0.95
      );
      scene.add(signBoard);
      doorPlates.push(signBoard);

      // Wall Sconce Lamp next to door (Vibrant Colored Light projection source)
      const sconceLamp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.22, 8),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(dept.color) })
      );
      sconceLamp.position.set(
        isLeft ? xVal + 0.03 : xVal - 0.03, 
        1.75, 
        isLeft ? zVal - 0.95 : zVal + 0.95
      );
      scene.add(sconceLamp);

      // Real PointLight projecting colored ambient glow onto the wall next to the door
      const coloredLight = new THREE.PointLight(new THREE.Color(dept.color), 1.6, 6);
      coloredLight.position.set(
        isLeft ? xVal + 0.12 : xVal - 0.12, 
        1.75, 
        isLeft ? zVal - 0.95 : zVal + 0.95
      );
      coloredLight.castShadow = true;
      scene.add(coloredLight);
    });

    // 3.5 Construct 3D AI Concierge Receptionist in the Entrance area (Volumetric Holographic Assistant)
    const girlTex = createChromaKeyTexture("/chatbot_character.png", "white");

    const robotGroup = new THREE.Group();
    robotGroup.position.set(1.5, 0.0, -4); // Base on the ground, pulled away from the wall to prevent clipping
    scene.add(robotGroup);

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.9 }); // Dark metal pedestal
    const neonCyan = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.45 }); // Glowing cyan light beam
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, side: THREE.DoubleSide }); // Bright scanning laser

    // 1. Pedestal Base
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.1, 32), metalMat);
    pedestal.position.y = 0.05;
    pedestal.castShadow = true;
    robotGroup.add(pedestal);

    // Glowing emitter ring on the pedestal
    const emitterRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.015, 8, 32), laserMat);
    emitterRing.position.y = 0.105;
    emitterRing.rotation.x = Math.PI / 2;
    robotGroup.add(emitterRing);

    // 2. Holographic Projection Light Beam (Transparent cylinder with depthWrite: false)
    const lightBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 1.8, 32, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    lightBeam.position.y = 1.0;
    robotGroup.add(lightBeam);

    // 3. Hologram Girl Projection Plane (Self-illuminating emissive white to preserve natural colors)
    const girlPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.0, 1.5),
      new THREE.MeshStandardMaterial({
        map: girlTex,
        transparent: true,
        opacity: 0.85,
        alphaTest: 0.05,
        emissive: 0xffffff, // White emissive to make texture fully bright
        emissiveIntensity: 0.9, // Glowing hologram self-illumination
        roughness: 0.6,
        metalness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    girlPlane.position.y = 1.0;
    girlPlane.userData = { id: 10, isRobot: true }; // Trigger chat on click
    robotGroup.add(girlPlane);
    nodeMeshes.push(girlPlane);

    // 4. Glowing Horizontal Laser Scanning Ring (Moves up/down in animation loop)
    const scanRing = new THREE.Mesh(new THREE.RingGeometry(0.38, 0.42, 32), laserMat);
    scanRing.position.y = 1.0;
    scanRing.rotation.x = Math.PI / 2;
    robotGroup.add(scanRing);

    // Keep botHead and botBody references pointing to girlPlane so hover highlights and chat dialog work
    const botHead = girlPlane;
    const botBody = girlPlane;

    // Invisible tracking point for robot signboard label projection
    const botSign = new THREE.Mesh(
      new THREE.BoxGeometry(0.01, 0.01, 0.01),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    botSign.position.set(1.8, 1.4, -4);
    scene.add(botSign);
    doorPlates.push(botSign);

    // 3.8 Render Partner Logo Panels flat on the walls
    PARTNERS.forEach((partner, idx) => {
      const xVal = partner.isLeft ? -3.47 : 3.47;
      const idVal = 100 + idx; // IDs starting at 100 to avoid conflicts with doors/chatbot

      // Main poster group to hold frame, trim, screen plane, and interaction sensor
      const posterGroup = new THREE.Group();
      posterGroup.position.set(xVal, partner.yVal ?? 1.8, partner.zVal);
      scene.add(posterGroup);

      // Back frame mesh (glossy black box)
      const frameMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.7, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2 })
      );
      frameMesh.castShadow = true;
      posterGroup.add(frameMesh);

      // Outer metallic glowing outline trim matching the partner's brand color!
      const outline = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.75, 1.25),
        new THREE.MeshStandardMaterial({ 
          color: new THREE.Color(partner.logoColor),
          emissive: new THREE.Color(partner.logoColor),
          emissiveIntensity: 1.2, // Glowing neon frame look!
          roughness: 0.2 
        })
      );
      posterGroup.add(outline);

      // Interactive click-sensor mesh (covers the frame area) - transparent so it can be raycast
      const sensorMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.75, 1.25),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      );
      sensorMesh.userData = { id: idVal, isPartner: true, partnerData: partner };
      posterGroup.add(sensorMesh);
      nodeMeshes.push(sensorMesh);

      // Logo Screen Plane (the canvas texture pasted flat on the wall!)
      const logoTexture = createPartnerLogoTexture(partner.name, partner.logoColor);
      if (logoTexture) {
        logoTexture.needsUpdate = true;
        logoTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
        logoTexture.minFilter = THREE.LinearMipmapLinearFilter;
        logoTexture.magFilter = THREE.LinearFilter;

        const screenPlane = new THREE.Mesh(
          new THREE.PlaneGeometry(1.16, 0.66),
          new THREE.MeshStandardMaterial({ 
            map: logoTexture,
            emissiveMap: logoTexture,
            emissive: 0xffffff,
            emissiveIntensity: 2.2,
            roughness: 0.15,
            metalness: 0.2,
            side: THREE.DoubleSide
          })
        );
        // Position screen flat against the corridor wall face (outside the border trim bounds)
        screenPlane.position.x = partner.isLeft ? 0.03 : -0.03;
        screenPlane.rotation.y = partner.isLeft ? Math.PI / 2 : -Math.PI / 2;
        posterGroup.add(screenPlane);


        
        sensorMesh.userData.screenMesh = screenPlane;
      }
    });

    // 4. Lights (Evenly distributed along the 60-unit gallery)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight1.position.set(0, 8, -15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight2.position.set(0, 8, -45);
    scene.add(dirLight2);

    // 5. Scroll & Drag Navigation Controls
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-9999, -9999);

    let targetCameraX = 0;
    let targetCameraZ = 1.5;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let clickTravelDist = 0;

    // Scroll wheel events (first-person heading dependent)
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (zooming) return;
      
      // Negative delta means scroll forward
      const scrollDir = e.deltaY < 0 ? 1 : -1;
      const stepSize = 0.85;

      // Project forward direction in XZ plane based on targetRotY (yaw)
      const dirX = Math.sin(targetRotY);
      const dirZ = -Math.cos(targetRotY);

      targetCameraX += dirX * stepSize * scrollDir;
      targetCameraZ += dirZ * stepSize * scrollDir;

      // Clamp camera positions to stay inside hallway track bounds
      targetCameraX = Math.max(-1.2, Math.min(1.2, targetCameraX));
      targetCameraZ = Math.max(-56.5, Math.min(1.5, targetCameraZ));
    };

    // Drag-to-look click-drag events
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
      clickTravelDist = 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / currentWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / currentHeight) * 2 + 1;

      if (!isDragging) return;
      if (zooming) return;

      const dx = e.clientX - previousMouseX;
      const dy = e.clientY - previousMouseY;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;

      clickTravelDist += Math.sqrt(dx * dx + dy * dy);

      // Adjust look angles
      targetRotY += dx * 0.0035;
      targetRotX = Math.max(-0.45, Math.min(0.45, targetRotX + dy * 0.0035));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      // Ignore click handlers if user dragged camera
      if (clickTravelDist > 10) return;

      const currentHovered = hoveredNodeRef.current;
      const currentZooming = zoomingRef.current;

      if (currentHovered !== null && !currentZooming) {
        // Special case: click on a partner poster opens the partner details modal popup
        if (currentHovered >= 100 && currentHovered < 100 + PARTNERS.length) {
          playAudio("click");
          const partnerIndex = currentHovered - 100;
          setSelectedPartner(PARTNERS[partnerIndex]);
          return;
        }

        // Special case: click on the robot receptionist opens the chatbot
        if (currentHovered === 10 || currentHovered === 11) {
          playAudio("click");
          window.dispatchEvent(new CustomEvent("open-ai-chat"));
          return;
        }

        const door = nodeMeshes[currentHovered];
        const { id, url, name, zVal, isLeft } = door.userData;
        
        updateZooming(true);
        setUnlockingRoomName(name);
        playAudio("click");

        // Camera smoothly glides directly in front of the door
        const startPos = camera.position.clone();
        const startRot = new THREE.Euler().copy(camera.rotation);

        const endPos = new THREE.Vector3(isLeft ? -2.2 : 2.2, 1.1, zVal);
        const targetRotYVal = isLeft ? -Math.PI / 2 : Math.PI / 2;

        let progress = 0;
        const animateZoom = () => {
          progress += 0.035;
          if (progress < 1) {
            camera.position.lerpVectors(startPos, endPos, progress);
            camera.rotation.y = THREE.MathUtils.lerp(startRot.y, targetRotYVal, progress);
            camera.rotation.x = THREE.MathUtils.lerp(startRot.x, 0, progress);
            requestAnimationFrame(animateZoom);
          } else {
            // Set scroll target variables so camera doesn't bounce after return
            targetCameraX = endPos.x;
            targetCameraZ = endPos.z;
            targetRotY = targetRotYVal;
            targetRotX = 0;

            // Trigger vault mechanical unlocking transition overlay
            setIsUnlocking(true);
            playAudio("transition");
            
            setTimeout(() => {
              onNavigate(url);
            }, 1800);
          }
        };
        animateZoom();
      }
    };

    let touchStartY = 0;
    let touchStartX = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        clickTravelDist = 0;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const deltaY = touchY - touchStartY;
      const deltaX = touchX - touchStartX;

      targetCameraZ = Math.max(-55, Math.min(0, targetCameraZ - deltaY * 0.08));
      targetRotY = Math.max(-0.8, Math.min(0.8, targetRotY + deltaX * 0.005));

      touchStartY = touchY;
      touchStartX = touchX;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("click", onClick);

    // 6. Animation Loop
    let animationFrameId: number;
    const tempV = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      drawWallAnimations(time);
      // Volumetric Hologram animation loop
      if (robotGroup && girlPlane && scanRing) {
        // Gentle holographic bobbing float
        robotGroup.position.y = Math.sin(time * 1.5) * 0.025;
        
        // Always face the user camera
        girlPlane.lookAt(camera.position.x, girlPlane.position.y, camera.position.z);
        
        // Laser scan line sweeps up and down
        scanRing.position.y = 1.0 + Math.sin(time * 2.2) * 0.7;
        
        // Subtle digital transmission flicker/glitch (emulates dynamic holographic projection)
        const hologramMaterial = girlPlane.material as THREE.MeshStandardMaterial;
        hologramMaterial.opacity = 0.8 + Math.random() * 0.08;
      }

      // Smooth camera scroll and rotation look
      if (!zooming) {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCameraX, 0.08);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCameraZ, 0.08);
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotY, 0.1);
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotX, 0.1);
      }

      // Check intersections
      if (!zooming) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodeMeshes);

        if (intersects.length > 0) {
          const intersectedId = intersects[0].object.userData.id;
          if (hoveredNodeRef.current !== intersectedId) {
            updateHoveredNode(intersectedId);
            playAudio("hover");
            
            nodeMeshes.forEach((mesh, idx) => {
              const meshId = mesh.userData.id;
              const hasPlaque = meshId < doorPlates.length;

              if (meshId === intersectedId) {
                if (meshId < 10) {
                  (mesh.material as THREE.MeshStandardMaterial).color.setHex(0x27272a);
                  if (hasPlaque) {
                    const plateMat = doorPlates[meshId].material as THREE.MeshStandardMaterial;
                    if (plateMat && plateMat.emissive) plateMat.emissive.setHex(0x1d4ed8);
                  }
                } else if (meshId === 10) {
                  // Robot glow
                  const bodyMat = botBody.material as THREE.MeshStandardMaterial;
                  const headMat = botHead.material as THREE.MeshStandardMaterial;
                  if (bodyMat && bodyMat.emissive) bodyMat.emissive.setHex(0x1d4ed8);
                  if (headMat && headMat.emissive) headMat.emissive.setHex(0x1d4ed8);
                  if (doorPlates[10]) {
                    const plateMat = doorPlates[10].material as THREE.MeshStandardMaterial;
                    if (plateMat && plateMat.emissive) plateMat.emissive.setHex(0x1d4ed8);
                  }
                } else if (meshId >= 100 && meshId < 100 + PARTNERS.length) {
                  // Partner highlight - glow the dynamic canvas screen plane
                  const screenMesh = mesh.userData.screenMesh;
                  if (screenMesh && screenMesh.material) {
                    (screenMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x222222);
                  }
                }
              } else {
                if (meshId < 10) {
                  (mesh.material as THREE.MeshStandardMaterial).color.setHex(0x18181b);
                  if (hasPlaque) {
                    const plateMat = doorPlates[meshId].material as THREE.MeshStandardMaterial;
                    if (plateMat && plateMat.emissive) plateMat.emissive.setHex(0x000000);
                  }
                } else if (meshId === 10) {
                  if (intersectedId !== 10) {
                    const bodyMat = botBody.material as THREE.MeshStandardMaterial;
                    const headMat = botHead.material as THREE.MeshStandardMaterial;
                    if (bodyMat && bodyMat.emissive) bodyMat.emissive.setHex(0x000000);
                    if (headMat && headMat.emissive) headMat.emissive.setHex(0x000000);
                    if (doorPlates[10]) {
                      const plateMat = doorPlates[10].material as THREE.MeshStandardMaterial;
                      if (plateMat && plateMat.emissive) plateMat.emissive.setHex(0x000000);
                    }
                  }
                } else if (meshId >= 100 && meshId < 100 + PARTNERS.length) {
                  const screenMesh = mesh.userData.screenMesh;
                  if (screenMesh && screenMesh.material) {
                    (screenMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
                  }
                }
              }
            });
          }
        } else {
          if (hoveredNodeRef.current !== null) {
            updateHoveredNode(null);
            nodeMeshes.forEach((mesh, idx) => {
              const meshId = mesh.userData.id;
              const hasPlaque = meshId < doorPlates.length;
              if (meshId < 10) {
                (mesh.material as THREE.MeshStandardMaterial).color.setHex(0x18181b);
                if (hasPlaque) {
                  const plateMat = doorPlates[meshId].material as THREE.MeshStandardMaterial;
                  if (plateMat && plateMat.emissive) plateMat.emissive.setHex(0x000000);
                }
              } else if (meshId === 10) {
                const bodyMat = botBody.material as THREE.MeshStandardMaterial;
                const headMat = botHead.material as THREE.MeshStandardMaterial;
                if (bodyMat && bodyMat.emissive) bodyMat.emissive.setHex(0x000000);
                if (headMat && headMat.emissive) headMat.emissive.setHex(0x000000);
                if (doorPlates[10]) {
                  const plateMat = doorPlates[10].material as THREE.MeshStandardMaterial;
                  if (plateMat && plateMat.emissive) plateMat.emissive.setHex(0x000000);
                }
              } else if (meshId >= 100 && meshId < 100 + PARTNERS.length) {
                const screenMesh = mesh.userData.screenMesh;
                if (screenMesh && screenMesh.material) {
                  (screenMesh.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
                }
              }
            });
          }
        }
      }

      // Calculate projected 2D coordinates for HTML signboard badge placements
      const projected: { x: number; y: number; id: number }[] = [];
      doorPlates.forEach((mesh, idx) => {
        mesh.getWorldPosition(tempV);
        
        // Convert to camera local coordinate space to check if in front or behind
        const localPos = tempV.clone().applyMatrix4(camera.matrixWorldInverse);
        
        // In local coordinates, negative Z is in front. Only show labels within 28 units to prevent clustering
        if (localPos.z < -0.2 && localPos.z > -28.0) {
          tempV.project(camera);

          // Hide labels that are completely offscreen to prevent clustering
          const isOffscreen = tempV.x < -1.15 || tempV.x > 1.15 || tempV.y < -1.15 || tempV.y > 1.15;
          if (!isOffscreen) {
            const x = (tempV.x *  .5 + .5) * currentWidth;
            const y = (tempV.y * -.5 + .5) * currentHeight;
            projected.push({ x, y, id: idx });
          }
        }
      });
      
      setProjectedPositions(projected);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        currentWidth = w || 800;
        currentHeight = h || 600;
        renderer.setSize(currentWidth, currentHeight);
        camera.aspect = currentWidth / currentHeight;
        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(container);

    return () => {
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("click", onClick);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [performanceMode, zooming, activeDoors]);

  // Handle mobile / Lite mode SVG navigation click
  const handleSvgNodeClick = (dept: Department) => {
    playAudio("transition");
    setZooming(true);
    setTimeout(() => {
      onNavigate(dept.url);
    }, 600);
  };

  // Lite Mode Rendering (SVG Cyber-Network Map)
  if (performanceMode === "lite") {
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center bg-black p-4 select-none">
        {/* Core Ring */}
        <div className="absolute h-36 w-36 rounded-full border border-teal-500/20 bg-teal-500/5 animate-[pulse_3s_infinite] flex items-center justify-center shadow-[inset_0_0_20px_rgba(20,184,166,0.1)]">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-purple-500 to-teal-400 opacity-80 animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
        </div>

        {/* Central Title */}
        <div className="z-10 text-center mb-8">
          <h1 className="text-xl font-bold font-mono tracking-widest text-teal-400 uppercase glow-text-teal">
            VIRTUAL COMMAND CORE
          </h1>
          <p className="text-[10px] text-zinc-500 font-mono mt-1">MOBILE COGNITIVE DECK</p>
        </div>

        {/* SVG interactive network mapping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg z-10 px-4">
          {activeDoors.map((dept, i) => (
            <button
              key={i}
              onClick={() => handleSvgNodeClick(dept)}
              className="flex items-center gap-3 p-3 rounded-lg border border-teal-500/10 bg-zinc-900/60 text-left hover:border-teal-500/30 hover:bg-teal-500/5 transition-all cursor-none"
            >
              <span
                className="h-3 w-3 rounded-full flex-shrink-0 animate-pulse shadow-[0_0_5px_currentColor]"
                style={{ color: dept.color, backgroundColor: dept.color }}
              />
              <div>
                <span className="block font-mono text-xs font-semibold text-zinc-200">{dept.name}</span>
                <span className="block font-mono text-[8px] text-zinc-500 uppercase mt-0.5 tracking-wider">
                  {dept.telemetry}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // WebGL 3D render layout
  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen bg-black select-none overflow-hidden"
    >
      {/* Decryption mechanical lock buffer overlay */}
      <UnlockingOverlay isVisible={isUnlocking} roomName={unlockingRoomName} />

      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

      {/* Cyber Grid Backdrop */}
      <div className="absolute inset-0 pointer-events-none cyber-grid animate-grid-flow opacity-15" />

      {/* Dynamic Projected HTML badges for hover previews */}
      {projectedPositions.map((pos) => {
        // Special case: if the ID is 10, this is the 3D Robot receptionist chatbot badge!
        if (pos.id === 10) {
          const isBotHovered = hoveredNode === 10 || hoveredNode === 11;
          return (
            <div
              key="robot-badge"
              className="absolute pointer-events-none"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: "translate(-50%, -120%)",
              }}
            >
              <div
                className={`flex flex-col items-center transition-all duration-300 ${
                  isBotHovered ? "scale-108 opacity-100" : "scale-95 opacity-80"
                }`}
              >
                <div 
                  className="px-3.5 py-2 rounded border text-[9px] font-bold font-mono tracking-wider shadow-lg bg-zinc-950/95 whitespace-nowrap border-sky-400 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.25)] animate-pulse"
                >
                  🤖 AI CONCIERGE BOT
                </div>
                <div className="w-[1px] h-4 mt-0.5 bg-sky-400" />
              </div>
            </div>
          );
        }

        const dept = activeDoors[pos.id];
        if (!dept) return null;
        const isHovered = hoveredNode === pos.id;

        return (
          <div
            key={pos.id}
            className="absolute pointer-events-none"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: "translate(-50%, -120%)",
            }}
          >
            <div
              className={`flex flex-col items-center transition-all duration-300 ${
                isHovered ? "scale-105 opacity-100" : "scale-95 opacity-95"
              }`}
            >
              {/* Department Label */}
              <div
                className="px-3 py-1.5 rounded border text-[10px] font-bold font-mono tracking-wider shadow-lg bg-zinc-950/95 whitespace-nowrap"
                style={{
                  borderColor: isHovered ? dept.color : "rgba(251, 191, 36, 0.5)",
                  color: isHovered ? "#ffffff" : "#fbbf24",
                  boxShadow: isHovered 
                    ? `0 0 15px ${dept.color}60` 
                    : "0 0 10px rgba(251, 191, 36, 0.2)",
                  textShadow: isHovered ? "none" : "0 0 6px rgba(251, 191, 36, 0.4)",
                }}
              >
                {dept.name}
              </div>

              {/* Indicator connector line */}
              <div
                className="w-[1px] h-4 mt-0.5"
                style={{
                  background: isHovered ? dept.color : "rgba(251, 191, 36, 0.5)",
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Hover preview sidebar deck */}
      {hoveredNode !== null && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-6 pointer-events-none animate-[fadeIn_0.2s_ease-out]">
          {(hoveredNode === 10 || hoveredNode === 11) ? (
            <div className="cyber-panel p-5 rounded-lg border text-center transition-all border-sky-400">
              <span className="text-[9px] font-bold tracking-widest font-mono uppercase block mb-1 text-sky-400">
                ASSISTANT_BOT: ONLINE
              </span>
              <h2 className="text-md font-bold font-mono text-white mb-2 uppercase">
                AI CONCIERGE RECEPTIONIST
              </h2>
              <p className="text-zinc-400 text-[10px] leading-relaxed">
                Click to open the conversational AI chat assistant panel to guide your query index search.
              </p>
              <div className="mt-3 text-[9px] text-sky-400 font-bold tracking-widest font-mono animate-pulse">
                &gt; CLICK_ROBOT_TO_CHAT
              </div>
            </div>
          ) : (hoveredNode >= 100 && hoveredNode < 100 + PARTNERS.length) ? (
            <div 
              className="cyber-panel p-5 rounded-lg border text-center transition-all"
              style={{ borderColor: PARTNERS[hoveredNode - 100].logoColor }}
            >
              <span 
                className="text-[9px] font-bold tracking-widest font-mono uppercase block mb-1"
                style={{ color: PARTNERS[hoveredNode - 100].logoColor }}
              >
                PARTNER_ALLIANCE: CONNECTED
              </span>
              <h2 className="text-md font-bold font-mono text-white mb-2 uppercase">
                {PARTNERS[hoveredNode - 100].fullName}
              </h2>
              <p className="text-zinc-400 text-[10px] leading-relaxed">
                {PARTNERS[hoveredNode - 100].desc}
              </p>
              <div 
                className="mt-3 text-[9px] font-bold tracking-widest font-mono animate-pulse"
                style={{ color: PARTNERS[hoveredNode - 100].logoColor }}
              >
                &gt; CLICK_LOGO_TO_DECRYPT
              </div>
            </div>
          ) : (
            <div
              className="cyber-panel p-5 rounded-lg border text-center transition-all"
              style={{ borderColor: activeDoors[hoveredNode]?.color }}
            >
              <span
                className="text-[9px] font-bold tracking-widest font-mono uppercase block mb-1"
                style={{ color: activeDoors[hoveredNode]?.color }}
              >
                {activeDoors[hoveredNode]?.telemetry}
              </span>
              <h2 className="text-md font-bold font-mono text-white mb-2 uppercase">
                {activeDoors[hoveredNode]?.name}
              </h2>
              <p className="text-zinc-400 text-[10px] leading-relaxed">
                {activeDoors[hoveredNode]?.desc}
              </p>
              <div className="mt-3 text-[9px] text-teal-400 font-bold tracking-widest font-mono animate-pulse">
                &gt; CLICK_NODE_TO_TELEPORT
              </div>
            </div>
          )}
        </div>
      )}

      {/* Touch On-Screen Controls Overlay for Mobile Devices */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-black/80 border border-teal-500/30 p-2 rounded-full backdrop-blur-md font-mono text-[10px] shadow-2xl">
        <button
          onClick={() => {
            window.dispatchEvent(new WheelEvent("wheel", { deltaY: -200 }));
          }}
          className="px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 border border-teal-500/40 rounded-full font-bold cursor-pointer"
        >
          ⬆️ FORWARD
        </button>

        <button
          onClick={() => {
            window.dispatchEvent(new WheelEvent("wheel", { deltaY: 200 }));
          }}
          className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500/40 rounded-full font-bold cursor-pointer"
        >
          ⬇️ BACKWARD
        </button>

        {hoveredNode !== null && (
          <button
            onClick={() => {
              const canvas = document.querySelector("canvas");
              if (canvas) canvas.click();
            }}
            className="px-3 py-1.5 bg-cyan-400 text-black font-bold rounded-full cursor-pointer animate-pulse"
          >
            🚪 ENTER
          </button>
        )}
      </div>

      {/* Loading Zoom corridor overlay */}
      {zooming && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-out]">
          <div className="text-center font-mono">
            <div className="relative inline-block h-12 w-12 rounded-full border-2 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4" />
            <p className="text-xs text-teal-400 uppercase tracking-widest animate-pulse">
              Initializing department portal...
            </p>
          </div>
        </div>
      )}

      {/* Partner description popup modal overlay */}
      {selectedPartner && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm select-none p-4 animate-[fadeIn_0.2s_ease-out]">
          {/* Sheet of Paper Container */}
          <div 
            className="relative w-full max-w-lg bg-[#fcfbf9] text-zinc-800 p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-t-[8px] animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)] rounded-sm"
            style={{ 
              borderTopColor: selectedPartner.logoColor,
              fontFamily: "var(--font-geist-mono), Courier, monospace"
            }}
          >
            {/* Paper Top Margin/Header */}
            <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-4 mb-6">
              <div>
                <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono font-bold">ALLIANCE SPECIFICATION SHEET</span>
                <h1 className="text-lg font-bold tracking-tight text-zinc-950 mt-1 uppercase font-mono">
                  {selectedPartner.fullName}
                </h1>
              </div>
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPartner(null)}
                className="text-zinc-400 hover:text-zinc-950 transition-colors cursor-none text-xl p-1 font-mono font-bold"
                aria-label="Close sheet"
              >
                ✕
              </button>
            </div>

            {/* Technical Watermark */}
            <div className="absolute right-6 bottom-16 opacity-[0.03] pointer-events-none select-none text-[80px] font-extrabold uppercase leading-none font-mono">
              {selectedPartner.name.substring(0, 8)}
            </div>

            {/* Document details / content */}
            <div className="space-y-6 text-xs leading-relaxed">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-200 font-mono text-[9px]">
                <div>
                  <span className="block text-zinc-400 uppercase">DOCUMENT ID</span>
                  <span className="font-bold text-zinc-900">KLD-ALL-{selectedPartner.name.toUpperCase().substring(0, 6)}-001</span>
                </div>
                <div>
                  <span className="block text-zinc-400 uppercase">STATUS</span>
                  <span className="font-bold text-emerald-700">VERIFIED ALLIANCE NODE</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-zinc-900 uppercase font-mono mb-2">I. CAPABILITY BRIEF</h3>
                <p className="bg-zinc-100 p-4 border-l-4 border-zinc-400 text-zinc-700 italic">
                  "{selectedPartner.desc}"
                </p>
              </div>

              <div>
                <h3 className="font-bold text-zinc-900 uppercase font-mono mb-2">II. DEPLOYMENT PROFILE</h3>
                <p className="text-zinc-600">
                  This partnership node establishes secure end-to-end integration and syncs telemetry profiles directly to Kloudera's Core AI orchestration engine.
                </p>
              </div>
            </div>

            {/* Footer Stamp */}
            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-[9px] font-mono text-zinc-400">
              <span>© {new Date().getFullYear()} KLOUDERA ALLIANCES</span>
              <span className="px-2.5 py-0.5 border border-zinc-300 text-zinc-500 uppercase font-bold tracking-wider rounded-sm">
                CONFIDENTIAL
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
