"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "stats", label: "Stats" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function MobileSwipeDots() {
  const [active, setActive] = useState("hero");
  const { theme } = useTheme();
  const activeColor = theme === "amd" ? "#ff2f2f" : "#ff6a00";
  const inactiveColor = theme === "amd" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)";

  useEffect(() => {
    const ratios: Record<string, number> = {};

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios[entry.target.id] = entry.intersectionRatio;
        }
        const best = Object.entries(ratios).reduce(
          (a, b) => (b[1] > a[1] ? b : a),
          ["hero", 0]
        );
        if (best[1] > 0.1) setActive(best[0]);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="fixed right-3 top-1/2 -translate-y-1/2 z-40 md:hidden flex flex-col gap-2 items-center"
      style={{ pointerEvents: "none" }}
      role="navigation"
      aria-label="Section navigation"
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <motion.button
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            aria-label={`Go to ${label}`}
            title={label}
            animate={{
              height: isActive ? 22 : 6,
              backgroundColor: isActive ? activeColor : inactiveColor,
              boxShadow: isActive ? `0 0 10px ${activeColor}99` : "none",
            }}
            whileTap={{ scale: 0.75 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{
              width: 5,
              borderRadius: 999,
              border: "none",
              padding: 0,
              cursor: "pointer",
              outline: "none",
              display: "block",
              pointerEvents: "auto",
            }}
          />
        );
      })}
    </div>
  );
}
