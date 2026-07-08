"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

// HUD-styled STD/AMD switch — lives on the intro screen so the theme is
// picked before the user ever sees the lit (or unlit) site underneath.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isAmd = theme === "amd";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isAmd ? "standard" : "AMD"} theme`}
      aria-pressed={isAmd}
      className={`mono pointer-events-auto inline-flex items-center gap-2 ${className}`}
      style={{
        padding: "6px 8px",
        border: "1px solid color-mix(in srgb, var(--em) 35%, transparent)",
        background: "var(--overlay)",
        borderRadius: 3,
        cursor: "pointer",
      }}
    >
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.08em",
          color: isAmd ? "color-mix(in srgb, var(--tx) 35%, transparent)" : "#ff6a00",
          fontWeight: 700,
          transition: "color 0.25s",
        }}
      >
        STD
      </span>

      <span
        style={{
          position: "relative",
          width: 34,
          height: 18,
          borderRadius: 999,
          background: isAmd ? "rgba(255,0,0,0.18)" : "rgba(255,106,0,0.18)",
          border: `1px solid ${isAmd ? "#ff2f2f" : "#ff6a00"}`,
          transition: "background 0.25s, border-color 0.25s",
        }}
      >
        <motion.span
          animate={{ x: isAmd ? 17 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          style={{
            position: "absolute",
            top: 1,
            left: 0,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: isAmd ? "#ff2f2f" : "#ff6a00",
            boxShadow: isAmd ? "0 0 8px rgba(255,47,47,0.7)" : "0 0 8px rgba(255,106,0,0.6)",
          }}
        />
      </span>

      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.08em",
          color: isAmd ? "#ff2f2f" : "color-mix(in srgb, var(--tx) 35%, transparent)",
          fontWeight: 700,
          transition: "color 0.25s",
        }}
      >
        AMD
      </span>
    </button>
  );
}
