"use client";

import { motion } from "framer-motion";
import { useTheme, type Theme } from "@/lib/theme";

const OPTIONS: { value: Theme; label: string; dot: string; glow: string }[] = [
  { value: "bw", label: "B/W", dot: "#8a8a86", glow: "rgba(138,138,134,0.55)" },
  { value: "light", label: "STD", dot: "#ff6a00", glow: "rgba(255,106,0,0.6)" },
  { value: "amd", label: "AMD", dot: "#ff2f2f", glow: "rgba(255,47,47,0.7)" },
];

// HUD-styled 3-way theme switch — lives on the intro screen so the theme is
// picked before the user ever sees the lit site underneath.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const activeIndex = OPTIONS.findIndex((o) => o.value === theme);

  return (
    <div
      className={`mono pointer-events-auto relative inline-flex items-center ${className}`}
      style={{
        padding: 3,
        border: "1px solid color-mix(in srgb, var(--em) 35%, transparent)",
        background: "var(--overlay)",
        borderRadius: 3,
      }}
    >
      <motion.div
        className="absolute"
        style={{
          top: 3,
          bottom: 3,
          width: `calc((100% - 6px) / 3)`,
          borderRadius: 2,
          background: "var(--glass-bg)",
          boxShadow: `0 0 10px ${OPTIONS[Math.max(activeIndex, 0)].glow}`,
        }}
        animate={{ left: `calc(3px + ((100% - 6px) / 3) * ${Math.max(activeIndex, 0)})` }}
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
      />
      {OPTIONS.map((opt) => {
        const isActive = opt.value === theme;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            aria-label={`Switch to ${opt.label} theme`}
            aria-pressed={isActive}
            className="relative z-10 flex items-center gap-1.5"
            style={{
              padding: "5px 10px",
              cursor: "pointer",
              background: "transparent",
              border: "none",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: opt.dot,
                boxShadow: isActive ? `0 0 6px ${opt.glow}` : "none",
                transition: "box-shadow 0.25s",
              }}
            />
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.08em",
                fontWeight: 700,
                color: isActive ? opt.dot : "color-mix(in srgb, var(--tx) 35%, transparent)",
                transition: "color 0.25s",
              }}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
