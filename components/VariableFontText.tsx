"use client";

// Adapted from "variable-font-and-cursor" (danielpetho/fancy, MIT) — reacts to
// cursor position within a container by shifting a variable font's axes
// (e.g. weight), not a literal cursor replacement.
import React, { ElementType, useCallback, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMousePositionRef } from "@/lib/useMousePositionRef";

interface FontVariationAxis {
  name: string;
  min: number;
  max: number;
}

interface FontVariationMapping {
  x: FontVariationAxis;
  y: FontVariationAxis;
}

interface VariableFontTextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: ElementType;
  fontVariationMapping: FontVariationMapping;
  containerRef: React.RefObject<HTMLElement | null>;
}

export default function VariableFontText({
  children,
  as = "span",
  fontVariationMapping,
  className,
  containerRef,
  ...props
}: VariableFontTextProps) {
  const mousePositionRef = useMousePositionRef(containerRef);
  const spanRef = useRef<HTMLSpanElement>(null);

  const interpolateFontVariationSettings = useCallback(
    (xPosition: number, yPosition: number) => {
      const container = containerRef.current;
      if (!container) return "0 0";

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const xProgress = Math.min(Math.max(xPosition / containerWidth, 0), 1);
      const yProgress = Math.min(Math.max(yPosition / containerHeight, 0), 1);

      const xValue =
        fontVariationMapping.x.min + (fontVariationMapping.x.max - fontVariationMapping.x.min) * xProgress;
      const yValue =
        fontVariationMapping.y.min + (fontVariationMapping.y.max - fontVariationMapping.y.min) * yProgress;

      return `'${fontVariationMapping.x.name}' ${xValue}, '${fontVariationMapping.y.name}' ${yValue}`;
    },
    [fontVariationMapping, containerRef],
  );

  useAnimationFrame(() => {
    const settings = interpolateFontVariationSettings(mousePositionRef.current.x, mousePositionRef.current.y);
    if (spanRef.current) {
      spanRef.current.style.fontVariationSettings = settings;
    }
  });

  const MotionComponent = motion.create(as);

  return (
    <MotionComponent className={cn(className)} ref={spanRef} {...props}>
      <span className="inline-block">{children}</span>
    </MotionComponent>
  );
}
