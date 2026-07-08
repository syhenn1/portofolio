"use client";

import { RefObject, useEffect, useRef } from "react";

export function useMousePositionRef(containerRef?: RefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      const zoom = typeof window !== "undefined" ? (parseFloat(window.getComputedStyle(document.documentElement).zoom) || 1) : 1;
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: (x - rect.left) / zoom, y: (y - rect.top) / zoom };
      } else {
        positionRef.current = { x: x / zoom, y: y / zoom };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}
