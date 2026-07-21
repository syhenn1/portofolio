"use client";

import { motion } from "framer-motion";

// Soft, slowly-drifting frosted "bubbles" behind a section — the Apple
// Liquid Glass look (big blurred orbs behind translucent glass panels),
// not the old sharp neon-glow accents. Purely decorative, sits at z-0 behind
// whatever content the section stacks on top of it.
const BUBBLES = [
  { size: 360, top: "18%", left: "68%", tint: "#06b6d4", opacity: 0.12, dur: 19 },
  { size: 320, top: "58%", left: "10%", tint: "#a78bfa", opacity: 0.1, dur: 22 },
  { size: 300, top: "70%", left: "72%", tint: "var(--em)", opacity: 0.12, dur: 18 },
];

export default function LiquidBubbles({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ zIndex: 0 }}>
      {BUBBLES.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: `radial-gradient(circle, ${b.tint} 0%, transparent 72%)`,
            opacity: b.opacity,
            filter: "blur(70px)",
          }}
          animate={{ x: [0, 30, 0], y: [0, -24, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
        />
      ))}
    </div>
  );
}
