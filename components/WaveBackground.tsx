"use client";

import { useEffect, useRef } from "react";
import { getIntroEntered, subscribeIntroEntered } from "@/lib/introState";
import { useTheme } from "@/lib/theme";

interface Dot {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  driftSpeed: number;
  driftAngle: number;
  driftRadius: number;
}

const SPACING = 48;
const DOT_RADIUS = 1.8;
const MOUSE_RADIUS = 200;
const PUSH_STRENGTH = 50;
const BASE_ALPHA = 0.18;
const HOVER_ALPHA = 0.55;
const PAGE_HEIGHT = 8000;
const COLOR_LIGHT = "255, 106, 0";
const COLOR_AMD = "255, 45, 45";

// Sitewide default background (Hero and the intro splash use LivingNebula
// instead — see layout.tsx). Paused while the intro splash covers the screen,
// same reasoning as LivingNebula: fully hidden behind it, so no point drawing.
export default function WaveBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const dots = useRef<Dot[]>([]);
  const raf = useRef(0);
  const colorRef = useRef(COLOR_LIGHT);
  useEffect(() => {
    colorRef.current = theme === "amd" ? COLOR_AMD : COLOR_LIGHT;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;

    const buildGrid = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const totalH = Math.max(PAGE_HEIGHT, document.documentElement.scrollHeight);
      dots.current = [];
      for (let x = SPACING / 2; x < w; x += SPACING) {
        for (let y = SPACING / 2; y < totalH; y += SPACING) {
          dots.current.push({
            baseX: x, baseY: y, x, y: y,
            driftX: 0, driftY: 0,
            driftSpeed: 0.3 + Math.random() * 0.7,
            driftAngle: Math.random() * Math.PI * 2,
            driftRadius: 2 + Math.random() * 5,
          });
        }
      }
    };

    buildGrid();
    window.addEventListener("resize", buildGrid);

    const onMove = (e: MouseEvent) => {
      const zoom = parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1;
      mouse.current = { x: e.clientX / zoom, y: e.clientY / zoom };
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) {
        const zoom = parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1;
        mouse.current = { x: t.clientX / zoom, y: t.clientY / zoom };
      }
    };
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const scrollY = window.scrollY;

      // Short-circuit: when scrollY is 0 (fully inside Hero), all dots are suppressed, so skip looping.
      if (scrollY === 0) {
        raf.current = requestAnimationFrame(draw);
        return;
      }

      const mx = mouse.current.x;
      const my = mouse.current.y + scrollY;

      for (let i = 0; i < dots.current.length; i++) {
        const d = dots.current[i];
        const screenY = d.baseY - scrollY;

        if (screenY < -SPACING * 2 || screenY > h + SPACING * 2) continue;

        // Skip drawing dots inside the Hero section (top fold)
        if (d.baseY < window.innerHeight) continue;

        let alphaMultiplier = 1;
        const fadeZone = 150;
        if (d.baseY < window.innerHeight + fadeZone) {
          alphaMultiplier = (d.baseY - window.innerHeight) / fadeZone;
        }

        d.driftAngle += d.driftSpeed * 0.01;
        d.driftX = Math.cos(d.driftAngle) * d.driftRadius;
        d.driftY = Math.sin(d.driftAngle * 0.7 + i * 0.01) * d.driftRadius;

        const dx = d.baseX - mx;
        const dy = d.baseY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = d.baseX + d.driftX;
        let targetY = screenY + d.driftY;

        if (dist < MOUSE_RADIUS) {
          const force = (1 - dist / MOUSE_RADIUS) * PUSH_STRENGTH;
          const angle = Math.atan2(dy, dx);
          targetX += Math.cos(angle) * force;
          targetY += Math.sin(angle) * force;
        }

        d.x += (targetX - d.x) * 0.12;
        d.y += (targetY - d.y) * 0.12;

        const screenDx = d.x - mx;
        const screenDy = d.y - (my - scrollY);
        const screenDist = Math.sqrt(screenDx * screenDx + screenDy * screenDy);
        const proximity = Math.max(0, 1 - screenDist / MOUSE_RADIUS);

        const alpha = (BASE_ALPHA + proximity * (HOVER_ALPHA - BASE_ALPHA)) * alphaMultiplier;
        const r = DOT_RADIUS + proximity * 2;

        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorRef.current}, ${alpha})`;
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    };

    const startLoop = () => {
      raf.current = requestAnimationFrame(draw);
    };
    const stopLoop = () => {
      cancelAnimationFrame(raf.current);
    };

    let unsubscribe = () => {};
    if (getIntroEntered()) {
      startLoop();
    } else {
      unsubscribe = subscribeIntroEntered((val) => {
        if (val) startLoop();
        else stopLoop();
      });
    }

    return () => {
      unsubscribe();
      stopLoop();
      window.removeEventListener("resize", buildGrid);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, mixBlendMode: theme === "amd" ? "screen" : "multiply" }}
    />
  );
}
