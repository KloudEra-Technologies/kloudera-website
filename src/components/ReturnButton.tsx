"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export function ReturnButton() {
  const [is3DMode, setIs3DMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("kloudera_view_mode");
    if (savedMode === "3d") {
      setIs3DMode(true);
    }
  }, []);

  if (is3DMode) {
    return (
      <Link
        href="/"
        className="px-5 py-2 border-2 border-cyan-400 bg-cyan-950/80 text-cyan-300 font-mono text-[10.5px] font-bold tracking-wider rounded-full hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_20px_rgba(34,211,238,0.45)] flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>←</span>
        <span>RETURN TO 3D GALLERY</span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className="px-5 py-2 border-2 border-blue-500/80 bg-blue-950/50 text-blue-300 font-mono text-[10.5px] font-bold tracking-wider rounded-full hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] flex items-center justify-center gap-1.5 cursor-pointer"
    >
      <span>←</span>
      <span>RETURN TO HOME</span>
    </Link>
  );
}
