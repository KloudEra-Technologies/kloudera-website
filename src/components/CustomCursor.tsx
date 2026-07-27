"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAccessibility } from "./AccessibilityContext";

export const CustomCursor: React.FC = () => {
  const { performanceMode } = useAccessibility();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    if (isTouch) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "IFRAME" ||
        target.closest("iframe") ||
        target.closest(".disable-custom-cursor")
      ) {
        setIsVisible(false);
        return;
      } else {
        if (!isTouch) setIsVisible(true);
      }

      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".interactive") ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver);

    // Inject global CSS rule with exception for iframes & device preview viewports
    const styleEl = document.createElement("style");
    styleEl.id = "global-custom-cursor-override";
    styleEl.innerHTML = `
      *, *::before, *::after, button, a, input, select, textarea, label, [role="button"], .cursor-pointer {
        cursor: none !important;
      }
      iframe, .disable-custom-cursor, .disable-custom-cursor *, iframe * {
        cursor: auto !important;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", onMouseOver);
      const el = document.getElementById("global-custom-cursor-override");
      if (el) el.remove();
    };
  }, []);

  const isIframe = typeof window !== "undefined" && window.self !== window.top;

  if (isIframe || !isVisible || (typeof window !== "undefined" && window.innerWidth < 768)) {
    return null;
  }

  return (
    <>
      {/* Outer Reticle Ring Position Wrapper */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100000] will-change-transform transition-transform duration-[180ms] ease-out"
        style={{ transform: "translate3d(0px, 0px, 0)" }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400/50 mix-blend-screen transition-all duration-200 ease-out relative flex items-center justify-center ${
            isHovered
              ? "h-11 w-11 border-sky-400 bg-sky-500/15 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
              : "h-7 w-7"
          } ${isClicked ? "scale-75 border-white bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.4)]" : ""}`}
        >
          {/* Target Reticle Crosshairs */}
          {performanceMode !== "lite" && (
            <>
              <span className="absolute -left-[4px] top-1/2 h-[1px] w-[5px] -translate-y-1/2 bg-sky-400/70" />
              <span className="absolute -right-[4px] top-1/2 h-[1px] w-[5px] -translate-y-1/2 bg-sky-400/70" />
              <span className="absolute left-1/2 -top-[4px] h-[5px] w-[1px] -translate-x-1/2 bg-sky-400/70" />
              <span className="absolute left-1/2 -bottom-[4px] h-[5px] w-[1px] -translate-x-1/2 bg-sky-400/70" />
            </>
          )}
        </div>
      </div>

      {/* Inner Pin Dot Position Wrapper */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[100000] will-change-transform"
        style={{ transform: "translate3d(0px, 0px, 0)" }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 mix-blend-screen transition-all duration-150 ease-out ${
            isHovered ? "h-3 w-3 bg-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.9)]" : "h-1.5 w-1.5"
          } ${isClicked ? "scale-125 bg-white shadow-[0_0_12px_rgba(255,255,255,1)]" : ""}`}
        />
      </div>
    </>
  );
};

export default CustomCursor;
