import React, { useState } from "react";

interface FallbackImageProps {
  srcs: string[];
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackElement: React.ReactNode;
}

function FallbackImage({ srcs, alt, className, style, fallbackElement }: FallbackImageProps) {
  const [srcIndex, setSrcIndex] = useState(0);

  const handleError = () => {
    if (srcIndex < srcs.length - 1) {
      setSrcIndex(srcIndex + 1);
    }
  };

  if (srcIndex >= srcs.length || !srcs[srcIndex]) {
    return <>{fallbackElement}</>;
  }

  return (
    <img
      src={srcs[srcIndex]}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
    />
  );
}

export function PartnerLogo({ name, customLogoUrl }: { name: string; customLogoUrl?: string }) {
  const n = name.toLowerCase();
  const cleanName = n.replace(/[^a-z0-9]/g, "");
  
  const srcs: string[] = [];
  if (customLogoUrl) srcs.push(customLogoUrl);
  
  // Local overrides (from public/partners/ folder)
  srcs.push(`/partners/${cleanName}.png`);
  srcs.push(`/partners/${cleanName}.svg`);
  srcs.push(`/partners/${cleanName}.jpg`);
  srcs.push(`/partners/${cleanName}.jpeg`);
  srcs.push(`/partners/${cleanName}.webp`);
  
  // Official Wikimedia trademark fallbacks
  if (n.includes("microsoft")) {
    srcs.push("https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo_%282012%29.svg");
  } else if (n.includes("mongodb")) {
    srcs.push("https://upload.wikimedia.org/wikipedia/commons/3/32/MongoDb-logo.svg");
  } else if (n.includes("aws") || n.includes("amazon")) {
    srcs.push("https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg");
  } else if (n.includes("google")) {
    srcs.push("https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg");
  } else if (n.includes("fortinet")) {
    srcs.push("https://upload.wikimedia.org/wikipedia/commons/2/25/Fortinet_logo.svg");
  } else if (n.includes("trend micro")) {
    srcs.push("https://upload.wikimedia.org/wikipedia/commons/d/da/Trend_Micro_logo.svg");
  }

  const textFallback = (
    <div className="flex flex-col items-center justify-center p-3 text-center">
      <div className="w-10 h-10 rounded-lg bg-blue-950/40 border border-blue-900/30 flex items-center justify-center mb-1 text-cyan-400 font-mono font-bold text-sm">
        {name.slice(0, 2).toUpperCase()}
      </div>
      <span className="text-[10px] text-slate-500 font-mono font-semibold">{name}</span>
    </div>
  );

  return (
    <FallbackImage
      srcs={srcs}
      alt={name}
      className="w-full h-full object-contain p-4"
      style={{ maxHeight: "100px" }}
      fallbackElement={textFallback}
    />
  );
}

export function CertificationLogo({ code, title, customImageUrl }: { code: string; title?: string; customImageUrl?: string }) {
  const c = code.toLowerCase();
  const cleanCode = c.replace(/[^a-z0-9]/g, "");

  const srcs: string[] = [];
  if (customImageUrl) srcs.push(customImageUrl);

  // Local overrides (from public/certifications/ folder)
  srcs.push(`/certifications/${cleanCode}.png`);
  srcs.push(`/certifications/${cleanCode}.svg`);
  srcs.push(`/certifications/${cleanCode}.jpg`);
  srcs.push(`/certifications/${cleanCode}.jpeg`);
  srcs.push(`/certifications/${cleanCode}.webp`);

  // Official Wikimedia fallbacks
  if (c.includes("iso 27001")) {
    srcs.push("https://upload.wikimedia.org/wikipedia/commons/e/ec/ISO_logo_%282016%29.svg");
  } else if (c.includes("soc 2")) {
    srcs.push("https://upload.wikimedia.org/wikipedia/commons/a/ab/AICPA_logo.svg");
  } else if (c.includes("pci")) {
    srcs.push("https://upload.wikimedia.org/wikipedia/commons/b/bc/PCI_DSS-Logo.svg");
  }

  const textFallback = (
    <div className="flex flex-col items-center justify-center p-2 text-center">
      <div className="px-2 py-1 rounded border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 font-mono text-[9px] font-bold">
        {code}
      </div>
    </div>
  );

  return (
    <FallbackImage
      srcs={srcs}
      alt={code}
      className="w-full h-full object-contain p-3"
      style={{ maxHeight: "80px", filter: "brightness(0.9) contrast(1.1)" }}
      fallbackElement={textFallback}
    />
  );
}
