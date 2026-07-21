"use client";

// Adapted from "magnetic-cursor" (21st.dev/@easemize) — site-wide custom
// pointer that pulls `data-magnetic` elements toward the cursor.
//
// Simplified from the original: the cursor no longer morphs into a rectangle
// snapped over the hovered element's bounds (that made it visibly detach from
// the real pointer while hovering), and no longer uses mix-blend-mode (which,
// with this orange over a light background, mathematically renders blue —
// exclusion blend is a+b-2ab, and that combination inverts orange to blue).
// It's now always a plain circle sitting exactly on the real cursor position,
// just scaling up a bit on hover for feedback.
import React, { useRef, useEffect, FC, ReactNode, useState } from "react";
import gsap from "gsap";
import { vec2, Vector2 } from "vecteur";
import { useTheme } from "@/lib/theme";

interface MagneticCursorProps {
  children: ReactNode;
  magneticFactor?: number;
  lerpAmount?: number;
  hoverAttribute?: string;
  cursorSize?: number;
  cursorColor?: string;
  hoverScale?: number;
  disableOnTouch?: boolean;
  speedMultiplier?: number;
  maxScaleX?: number;
  maxScaleY?: number;
}

interface CursorState {
  pos: {
    current: Vector2;
    target: Vector2;
    previous: Vector2;
  };
  isHovered: boolean;
}

export const MagneticCursor: FC<MagneticCursorProps> = ({
  children,
  lerpAmount = 0.1,
  magneticFactor = 0.2,
  hoverAttribute = "data-magnetic",
  cursorSize = 24,
  cursorColor,
  hoverScale = 1.6,
  disableOnTouch = true,
  speedMultiplier = 0.02,
  maxScaleX = 1,
  maxScaleY = 0.3,
}) => {
  const { theme } = useTheme();
  const resolvedCursorColor =
    cursorColor ?? (theme === "amd" ? "#ff3b3b" : theme === "light" ? "#ff6a00" : "#141414");
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorStateRef = useRef<CursorState | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const configRef = useRef({ magneticFactor, speedMultiplier, maxScaleX, maxScaleY, lerpAmount, hoverScale });

  useEffect(() => {
    configRef.current = { magneticFactor, speedMultiplier, maxScaleX, maxScaleY, lerpAmount, hoverScale };
  }, [magneticFactor, speedMultiplier, maxScaleX, maxScaleY, lerpAmount, hoverScale]);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (disableOnTouch && isTouchDevice) return;
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    gsap.set(cursorEl, { xPercent: -50, yPercent: -50 });

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!cursorStateRef.current) {
      cursorStateRef.current = {
        pos: {
          current: vec2(-100, -100),
          target: vec2(-100, -100),
          previous: vec2(-100, -100),
        },
        isHovered: false,
      };
    }

    const update = () => {
      const state = cursorStateRef.current;
      if (!state) return;

      const { speedMultiplier, maxScaleX, maxScaleY, lerpAmount, hoverScale } = configRef.current;
      const effectiveLerp = prefersReducedMotion ? 1 : lerpAmount;

      state.pos.current.lerp(state.pos.target, effectiveLerp);
      const delta = state.pos.current.clone().sub(state.pos.previous);
      state.pos.previous.copy(state.pos.current);

      const speed = Math.sqrt(delta.x * delta.x + delta.y * delta.y) * speedMultiplier;
      const baseScale = state.isHovered ? hoverScale : 1;
      gsap.set(cursorEl, {
        x: state.pos.current.x,
        y: state.pos.current.y,
        rotate: Math.atan2(delta.y, delta.x) * (180 / Math.PI),
        scaleX: baseScale * (1 + Math.min(speed, maxScaleX)),
        scaleY: baseScale * (1 - Math.min(speed, maxScaleY)),
        overwrite: "auto",
      });
    };

    const initializePosition = (event: MouseEvent) => {
      const state = cursorStateRef.current;
      if (!state) return;
      const zoom = parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1;
      const x = event.clientX / zoom;
      const y = event.clientY / zoom;
      state.pos.current.x = x;
      state.pos.current.y = y;
      state.pos.target.x = x;
      state.pos.target.y = y;
      state.pos.previous.x = x;
      state.pos.previous.y = y;
      gsap.set(cursorEl, { x, y, opacity: 1 });
    };

    const onMouseMove = (event: PointerEvent) => {
      const state = cursorStateRef.current;
      if (!state) return;

      const zoom = parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1;
      state.pos.target.x = event.clientX / zoom;
      state.pos.target.y = event.clientY / zoom;

      const isInViewport =
        event.clientX >= 0 &&
        event.clientX <= window.innerWidth &&
        event.clientY >= 0 &&
        event.clientY <= window.innerHeight;

      gsap.to(cursorEl, { opacity: isInViewport ? 1 : 0, duration: 0.2, overwrite: "auto" });
    };

    const handleMouseLeave = () => gsap.to(cursorEl, { opacity: 0, duration: 0.3 });
    const handleMouseEnter = () => gsap.to(cursorEl, { opacity: 1, duration: 0.3 });

    gsap.ticker.add(update);
    window.addEventListener("pointermove", onMouseMove);
    window.addEventListener("pointermove", initializePosition, { once: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const cleanupFunctions: (() => void)[] = [];

    // All interactive elements trigger cursor scale feedback, but only [data-magnetic] triggers actual pull effect
    const interactiveElements = gsap.utils.toArray<HTMLElement>(`a, button, [role="button"], [${hoverAttribute}]`);
    interactiveElements.forEach((el) => {
      const hasMagnetic = el.hasAttribute(hoverAttribute);
      const xTo = hasMagnetic ? gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" }) : null;
      const yTo = hasMagnetic ? gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" }) : null;

      const handlePointerEnter = () => {
        const state = cursorStateRef.current;
        if (state) state.isHovered = true;
      };

      const handlePointerLeave = () => {
        const state = cursorStateRef.current;
        if (state) state.isHovered = false;
      };

      let rafId: number | null = null;
      const handlePointerMove = (event: PointerEvent) => {
        if (!hasMagnetic || !xTo || !yTo) return;
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          const { clientX, clientY } = event;
          const { height, width, left, top } = el.getBoundingClientRect();
          const { magneticFactor } = configRef.current;
          const zoom = parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1;
          xTo(((clientX - (left + width / 2)) * magneticFactor) / zoom);
          yTo(((clientY - (top + height / 2)) * magneticFactor) / zoom);
          rafId = null;
        });
      };

      const handlePointerOut = () => {
        if (xTo && yTo) {
          xTo(0);
          yTo(0);
        }
      };

      el.addEventListener("pointerenter", handlePointerEnter);
      el.addEventListener("pointerleave", handlePointerLeave);
      if (hasMagnetic) {
        el.addEventListener("pointermove", handlePointerMove);
        el.addEventListener("pointerout", handlePointerOut);
      }

      cleanupFunctions.push(() => {
        el.removeEventListener("pointerenter", handlePointerEnter);
        el.removeEventListener("pointerleave", handlePointerLeave);
        if (hasMagnetic) {
          el.removeEventListener("pointermove", handlePointerMove);
          el.removeEventListener("pointerout", handlePointerOut);
        }
      });
    });

    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("pointermove", onMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [disableOnTouch, isTouchDevice, hoverAttribute]);

  if (disableOnTouch && isTouchDevice) return <>{children}</>;

  const containerStyles: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 9999,
    pointerEvents: "none",
    willChange: "transform",
    width: cursorSize,
    height: cursorSize,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const outerRingStyles: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: `1.5px solid ${resolvedCursorColor}`,
    boxShadow: `0 0 8px ${resolvedCursorColor}44`,
    boxSizing: "border-box",
    opacity: 0.8,
  };

  const innerNebulaStyles: React.CSSProperties = {
    position: "absolute",
    width: "35%",
    height: "35%",
    borderRadius: "50%",
    background: `radial-gradient(circle, ${resolvedCursorColor} 0%, ${resolvedCursorColor}bb 60%, transparent 100%)`,
    boxShadow: `0 0 12px 3px ${resolvedCursorColor}, 0 0 20px ${resolvedCursorColor}88`,
    opacity: 0.95,
  };

  return (
    <>
      <div ref={cursorRef} className="magnetic-cursor" style={containerStyles}>
        <div style={outerRingStyles} />
        <div style={innerNebulaStyles} />
      </div>
      {children}
    </>
  );
};
