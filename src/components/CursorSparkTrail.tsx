"use client";

import React, { useEffect, useRef } from "react";

export const CursorSparkTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Settings matched to TRON lightcycle snippet (Red version - High Glow)
    const activeColor = "#ff003c"; // Neon Red
    const trailLifespan = 0.85; // Elegant lingering trail
    const glowThickness = 8; // Keep the core thin and sharp for laser look

    interface TrailPoint {
      x: number;
      y: number;
      life: number;
      decay: number;
    }

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      decay: number;
      size: number;
      color: string;
    }

    class GridShockwave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      life: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.maxRadius = 160 * (glowThickness / 8);
        this.life = 1.0;
        this.color = activeColor;
      }

      update() {
        this.radius += (this.maxRadius - this.radius) * 0.12;
        this.life -= 0.025;
      }

      draw(context: CanvasRenderingContext2D) {
        if (this.life <= 0) return;
        context.save();
        context.globalAlpha = Math.max(this.life, 0);
        context.globalCompositeOperation = "lighter"; // Additive blending for glows
        
        // Stacked blurs for shockwave glow
        context.shadowColor = this.color;
        context.strokeStyle = this.color;

        // Outer glow
        context.shadowBlur = 40;
        context.lineWidth = 4;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.stroke();

        // Inner sharp glow
        context.shadowBlur = 15;
        context.lineWidth = 2;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.stroke();

        // Inner core flash ring
        context.strokeStyle = "#ffffff";
        context.shadowBlur = 0;
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(this.x, this.y, Math.max(1, this.radius * 0.6), 0, Math.PI * 2);
        context.stroke();

        context.restore();
      }
    }

    const trailPoints: TrailPoint[] = [];
    const shockwaves: GridShockwave[] = [];
    const particles: Spark[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Pointer move handler
    const handlePointerMove = (e: MouseEvent) => {
      const decayVal = 0.012 + (1 - trailLifespan) * 0.035;
      trailPoints.push({
        x: e.clientX,
        y: e.clientY,
        life: 1.0,
        decay: decayVal,
      });

      // Spawn micro sparklets
      if (Math.random() < 0.45) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * glowThickness,
          y: e.clientY + (Math.random() - 0.5) * glowThickness,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          life: 1.0,
          decay: 0.03,
          size: Math.random() * 3 + 1.5,
          color: activeColor,
        });
      }
    };

    // Spark blast on click
    const triggerSparkBlast = (x: number, y: number) => {
      shockwaves.push(new GridShockwave(x, y));

      const particleCount = 28;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const blastSpeed = Math.random() * 9 + 3;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * blastSpeed,
          vy: Math.sin(angle) * blastSpeed,
          life: 1.0,
          decay: 0.02,
          size: Math.random() * 4 + 2,
          color: activeColor,
        });
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(".glass-panel") || (e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) {
        return;
      }
      triggerSparkBlast(e.clientX, e.clientY);
    };

    // Mobile touches
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handlePointerMove({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (!(e.target as HTMLElement).closest("button") && !(e.target as HTMLElement).closest("a")) {
          triggerSparkBlast(touch.clientX, touch.clientY);
        }
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    // Render loop
    const render = () => {
      // Clear canvas with trail fade
      ctx.fillStyle = "rgba(3, 7, 18, 0.32)"; // Dark theme match
      ctx.fillRect(0, 0, width, height);

      // 1. Update and draw shockwaves (fast simple circular path)
      if (shockwaves.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = shockwaves.length - 1; i >= 0; i--) {
          const sw = shockwaves[i];
          sw.update();
          
          ctx.shadowColor = sw.color;
          ctx.strokeStyle = sw.color;
          ctx.shadowBlur = 20;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = "#ffffff";
          ctx.shadowBlur = 0;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, Math.max(1, sw.radius * 0.6), 0, Math.PI * 2);
          ctx.stroke();

          if (sw.life <= 0) shockwaves.splice(i, 1);
        }
        ctx.restore();
      }

      // 2. Draw light ribbon (Optimized: single continuous path rendering to eliminate latency)
      if (trailPoints.length >= 2) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalCompositeOperation = "lighter";

        // Build a single path for the entire trail
        ctx.beginPath();
        ctx.moveTo(trailPoints[0].x, trailPoints[0].y);
        for (let i = 1; i < trailPoints.length; i++) {
          ctx.lineTo(trailPoints[i].x, trailPoints[i].y);
        }

        // Draw Outer Neon Red Bloom in one call
        ctx.shadowBlur = 40;
        ctx.shadowColor = activeColor;
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = glowThickness + 4;
        ctx.globalAlpha = 0.85;
        ctx.stroke();

        // Draw Mid Laser line in one call
        ctx.shadowBlur = 15;
        ctx.lineWidth = glowThickness * 0.6;
        ctx.globalAlpha = 0.95;
        ctx.stroke();

        // Draw Inner White Core in one call
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = glowThickness * 0.25;
        ctx.globalAlpha = 1.0;
        ctx.stroke();

        ctx.restore();
      }

      // Update trail point lifespans
      for (let i = trailPoints.length - 1; i >= 0; i--) {
        const p = trailPoints[i];
        p.life -= p.decay;
        if (p.life <= 0) trailPoints.splice(i, 1);
      }

      // 3. Draw sparks
      if (particles.length > 0) {
        ctx.save();
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;

          if (p.life > 0) {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            particles.splice(i, 1);
          }
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        pointerEvents: "none",
        zIndex: 9999, // Overlay above background but completely non-blocking
        opacity: 1.0,
      }}
    />
  );
};
