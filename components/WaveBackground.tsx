"use client";

import { useEffect, useRef } from "react";

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
const COLOR = "255, 106, 0";

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const dots = useRef<Dot[]>([]);
  const raf = useRef(0);

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
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) mouse.current = { x: t.clientX, y: t.clientY };
    };
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const mx = mouse.current.x;
      const my = mouse.current.y + window.scrollY;
      const scrollY = window.scrollY;

      for (let i = 0; i < dots.current.length; i++) {
        const d = dots.current[i];
        const screenY = d.baseY - scrollY;

        if (screenY < -SPACING * 2 || screenY > h + SPACING * 2) continue;

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

        const alpha = BASE_ALPHA + proximity * (HOVER_ALPHA - BASE_ALPHA);
        const r = DOT_RADIUS + proximity * 2;

        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLOR}, ${alpha})`;
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
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
      style={{ zIndex: 1, mixBlendMode: "multiply" }}
    />
  );
}
