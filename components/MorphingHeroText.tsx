"use client";

// Adapted from "morphing-cursor" (21st.dev/@jatin-yadav05) — its real mechanic
// is a hover-triggered circular reveal that follows the cursor, swapping in an
// inverse-colored replacement layer wherever the circle currently covers. Used
// here so hovering the "Rifat Syahman" name and the bio below it reveals
// "Software Developer" / the longer bio blurb through the same black circle.
import type React from "react";
import { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useIsClient } from "@/lib/useIsClient";

interface MorphingHeroTextProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  onHoverChange?: (hovered: boolean) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function readZoom() {
  return parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1;
}

export function MorphingHeroText({ front, back, className, onHoverChange, onClick }: MorphingHeroTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const innerTextRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const mounted = useIsClient();

  // Local, container-relative — drives the reveal-window math (unchanged).
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  // The container's own viewport position (zoom-compensated) — needed now that
  // the circle is portaled to <body> and positioned in fixed/viewport space
  // instead of being absolutely positioned inside this component's own box.
  const originRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(undefined);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // A ResizeObserver (not just a window-resize listener) matters here: the
    // back layer is sized off this container, and content below can reflow
    // after mount (e.g. web fonts swapping in and rewrapping the bio
    // paragraph onto an extra line) without the window itself ever resizing.
    // Missing that growth leaves the back layer shorter than the front,
    // effectively cropping the hover text out of the circle reveal.
    const observer = new ResizeObserver(([entry]) => {
      const { inlineSize: width, blockSize: height } = entry.borderBoxSize?.[0] ?? { inlineSize: el.offsetWidth, blockSize: el.offsetHeight };
      setContainerSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.15);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.15);

      if (circleRef.current) {
        const left = originRef.current.x + currentPos.current.x;
        const top = originRef.current.y + currentPos.current.y;
        circleRef.current.style.transform = `translate(${left}px, ${top}px) translate(-50%, -50%)`;
      }
      if (innerTextRef.current) {
        innerTextRef.current.style.transform = `translate(${-currentPos.current.x}px, ${-currentPos.current.y}px)`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const zoom = readZoom();
    originRef.current = { x: rect.left / zoom, y: rect.top / zoom };
    mousePos.current = { x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom };
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const zoom = readZoom();
    originRef.current = { x: rect.left / zoom, y: rect.top / zoom };
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    mousePos.current = { x, y };
    currentPos.current = { x, y };
    setIsHovered(true);
    onHoverChange?.(true);
  }, [onHoverChange]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHoverChange?.(false);
  }, [onHoverChange]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn("relative inline-block select-none", className)}
    >
      {front}

      {/* Portaled to <body>: each section here (Skills, Contact, ...) has its
          own stacking context via `relative z-N`, so no z-index inside one
          section can ever paint over a sibling section's content — the
          circle was getting clipped/covered by whatever came next. Escaping
          to <body> sidesteps that entirely. */}
      {mounted &&
        createPortal(
          <div
            ref={circleRef}
            className="fixed top-0 left-0 pointer-events-none rounded-full overflow-hidden"
            style={{
              zIndex: 500,
              background: "var(--em)",
              width: isHovered ? 220 : 0,
              height: isHovered ? 220 : 0,
              transition: "width 0.5s cubic-bezier(0.33, 1, 0.68, 1), height 0.5s cubic-bezier(0.33, 1, 0.68, 1)",
              willChange: "transform, width, height",
            }}
          >
            <div
              ref={innerTextRef}
              className="absolute"
              style={{
                width: containerSize.width,
                height: containerSize.height,
                top: "50%",
                left: "50%",
                color: "var(--em-ink)",
                willChange: "transform",
              }}
            >
              {back}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
