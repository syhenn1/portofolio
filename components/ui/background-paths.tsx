"use client";

// A field of slowly drifting diagonal SVG lines. An earlier version of this
// file tried to recreate a community "Background Paths" component from
// memory, but the recalled curve formula mostly plotted outside the SVG's
// own viewBox — only a tiny sliver of each line ever crossed into view, so
// visually nothing rendered. This version defines the geometry directly:
// each line explicitly starts just off the left edge and ends just off the
// right edge, so it's guaranteed to sweep across the visible area.
import { useState } from "react";
import { motion } from "framer-motion";

const VB_W = 696;
const VB_H = 316;
const COUNT = 24;

export function FloatingPaths({ position }: { position: number }) {
  const [paths] = useState(() =>
    Array.from({ length: COUNT }, (_, i) => {
      const t = i / (COUNT - 1);
      const startY = t * VB_H;
      const endY = startY + position * (VB_H * 0.35);
      const bow = position * 70 * (0.4 + t * 0.6);
      const d = `M -60 ${startY.toFixed(1)} C ${VB_W * 0.32} ${(startY - bow).toFixed(1)}, ${VB_W * 0.68} ${(
        endY + bow
      ).toFixed(1)}, ${VB_W + 60} ${endY.toFixed(1)}`;
      return {
        id: i,
        d,
        width: 0.6 + t * 1.1,
        duration: 5 + Math.random() * 4,
      };
    }),
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="h-full w-full" viewBox={`0 0 ${VB_W} ${VB_H}`} fill="none" style={{ color: "var(--tx)" }}>
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeLinecap="round"
            strokeOpacity={0.12 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: [0.3, 1, 0.3],
              opacity: [0.3, 0.7, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: path.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
