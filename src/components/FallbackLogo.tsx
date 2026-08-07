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

  React.useEffect(() => {
    setSrcIndex(0);
  }, [srcs.join(",")]);

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
  const srcs: string[] = [];

  const cleanName = name.trim();
  const cleanNameLower = cleanName.toLowerCase();
  const strippedName = cleanName.replace(/\s+/g, "");
  const strippedNameLower = strippedName.toLowerCase();

  const extensions = ["png", "svg", "jpg", "jpeg", "webp", "gif", "avif"];

  // Smart aliases
  const aliases: string[] = [];
  if (cleanNameLower.includes("aws") || cleanNameLower.includes("amazon")) {
    aliases.push("AWS");
  }
  if (cleanNameLower.includes("google") || cleanNameLower.includes("gcp")) {
    aliases.push("GCP");
  }
  if (cleanNameLower.includes("cross") && cleanNameLower.includes("cipher")) {
    aliases.push("CrossCipher");
  }
  if (cleanNameLower.includes("sentinel")) {
    aliases.push("Sentinel  ONE");
  }

  // 1. Prioritize database / custom uploaded URL (highest priority)
  if (customLogoUrl) srcs.push(customLogoUrl);

  // 2. Fallback to local overrides (from public/partners/ folder)
  for (const ext of extensions) {
    // Try aliases first
    for (const alias of aliases) {
      srcs.push(`/partners/${alias}.${ext}`);
      srcs.push(`/partners/${alias.toLowerCase()}.${ext}`);
    }

    // Try normal clean formats
    srcs.push(`/partners/${cleanName}.${ext}`);
    srcs.push(`/partners/${cleanNameLower}.${ext}`);
    srcs.push(`/partners/${strippedName}.${ext}`);
    srcs.push(`/partners/${strippedNameLower}.${ext}`);
  }

  // 3. Fallback to official Wikimedia trademark logos for offline coverage
  if (cleanNameLower.includes("trend micro") || cleanNameLower.includes("trendmicro")) {
    srcs.push("https://upload.wikimedia.org/wikipedia/commons/d/da/Trend_Micro_logo.svg");
  }

  // De-duplicate array
  const uniqueSrcs = Array.from(new Set(srcs));

  const textFallback = (
    <div className="flex flex-col items-center justify-center text-slate-600 py-6">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="1.5" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );

  return (
    <FallbackImage
      srcs={uniqueSrcs}
      alt={name}
      className="w-full h-full object-contain p-4"
      style={{ maxHeight: "100px" }}
      fallbackElement={textFallback}
    />
  );
}

export function CertificationLogo({ code, title, customImageUrl }: { code: string; title?: string; customImageUrl?: string }) {
  const srcs: string[] = [];

  const cleanCode = code.trim();
  const cleanCodeLower = cleanCode.toLowerCase();
  const strippedCode = cleanCode.replace(/\s+/g, "");
  const strippedCodeLower = strippedCode.toLowerCase();

  const extensions = ["png", "svg", "jpg", "jpeg", "webp", "gif", "avif"];

  // 1. Prioritize local overrides (from public/certifications/ folder)
  for (const ext of extensions) {
    srcs.push(`/certifications/${cleanCode}.${ext}`);
    srcs.push(`/certifications/${cleanCodeLower}.${ext}`);
    srcs.push(`/certifications/${strippedCode}.${ext}`);
    srcs.push(`/certifications/${strippedCodeLower}.${ext}`);
  }

  // 2. Fallback to database URL
  if (customImageUrl) srcs.push(customImageUrl);

  // De-duplicate array
  const uniqueSrcs = Array.from(new Set(srcs));

  const textFallback = (
    <div className="flex items-center justify-center text-emerald-900/60 py-4">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    </div>
  );

  return (
    <FallbackImage
      srcs={uniqueSrcs}
      alt={code}
      className="w-full h-full object-contain p-3"
      style={{ maxHeight: "80px" }}
      fallbackElement={textFallback}
    />
  );
}
