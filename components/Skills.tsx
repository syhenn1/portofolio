"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { skills, categoryColors, type Skill } from "@/lib/data";
import type { TechKey } from "@/components/MechanicalKeyboard3D";

const MechanicalKeyboard3D = dynamic(
  () => import("@/components/MechanicalKeyboard3D"),
  { ssr: false },
);

// ─── Mobile keycap ────────────────────────────────────────────────────────────
function Keycap({ skill, color, index, size = 44 }: {
  skill: Skill; color: string; index: number; size?: number;
}) {
  const Icon = skill.Icon;
  const sz   = Math.round(size * 0.44);
  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.035, duration: 0.28, ease: "easeOut" }}
    >
      <motion.div
        className="flex items-center justify-center select-none"
        style={{
          width: size, height: size,
          borderRadius: 9,
          background: "linear-gradient(145deg, #252016 0%, #191310 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderTop: `2px solid ${color}55`,
          boxShadow: "0 6px 0 0 #080503, 0 0 0 1px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10)",
          cursor: "default",
        }}
        whileHover={{
          y: 3,
          boxShadow: "0 3px 0 0 #080503, 0 0 0 1px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
        whileTap={{
          y: 5,
          boxShadow: "0 1px 0 0 #080503, 0 0 0 1px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 3px 6px rgba(0,0,0,0.40)",
        }}
      >
        {Icon ? (
          <Icon size={sz} />
        ) : (
          <Image src={skill.src!} alt={skill.name} width={sz} height={sz} style={{ objectFit: "contain" }} />
        )}
      </motion.div>
      <span style={{ fontSize: 9, color: "#475569", fontWeight: 600, textAlign: "center", lineHeight: 1.2, maxWidth: size + 8 }}>
        {skill.name}
      </span>
    </motion.div>
  );
}

// ─── Tech info panel (desktop) ────────────────────────────────────────────────
function TechInfoPanel({ tech }: { tech: TechKey | null }) {
  const TechIcon = tech?.I;
  return (
    <div style={{ width: 400 }}>
      <AnimatePresence mode="wait">
        {tech ? (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, x: -24, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -14, y: 4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              padding: "36px 40px 40px",
              borderRadius: 28,
              background: "rgba(18,11,6,0.94)",
              border: `1px solid ${tech.c}40`,
              boxShadow: `0 0 80px ${tech.c}22, 0 40px 80px rgba(0,0,0,0.65)`,
              backdropFilter: "blur(24px)",
            }}
          >
            {/* icon */}
            <div style={{
              width: 96, height: 96,
              borderRadius: 24,
              background: `${tech.c}1a`,
              border: `1px solid ${tech.c}50`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 28,
              boxShadow: `0 0 32px ${tech.c}18`,
            }}>
              {TechIcon
                ? <TechIcon size={52} style={{ color: tech.c }} />
                : tech.s
                ? <Image src={tech.s} alt={tech.name} width={52} height={52} style={{ objectFit: "contain" }} />
                : null}
            </div>

            {/* name */}
            <h3 style={{ fontSize: 42, fontWeight: 900, color: "#f4ede0", marginBottom: 10, lineHeight: 1, letterSpacing: "-0.02em" }}>
              {tech.name}
            </h3>

            {/* category badge */}
            <span style={{
              display: "inline-block",
              padding: "5px 14px",
              borderRadius: 20,
              background: `${tech.c}20`,
              border: `1px solid ${tech.c}55`,
              fontSize: 10,
              fontWeight: 700,
              color: tech.c,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}>
              {tech.cat}
            </span>

            {/* description */}
            <p style={{ fontSize: 16, color: "#6b5f55", lineHeight: 1.75, margin: 0 }}>
              {tech.desc}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              padding: "48px 40px",
              borderRadius: 28,
              border: "1px dashed rgba(255,255,255,0.07)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 16,
              color: "rgba(255,255,255,0.18)",
            }}
          >
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
              <rect x="2" y="6" width="20" height="13" rx="2" />
              <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M10 14h4M18 14h.01" strokeLinecap="round" />
            </svg>
            <div>
              <p style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.22)", margin: "0 0 8px", lineHeight: 1 }}>
                Hover a key
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: "rgba(255,255,255,0.15)" }}>
                Colored keycaps are tech tools.<br />Hover them to see details.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Skills section ───────────────────────────────────────────────────────────
export default function Skills() {
  const [hoveredTech, setHoveredTech] = useState<TechKey | null>(null);
  const categories = Object.entries(skills);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const kbOpacity = useTransform(scrollYProgress, [0, 0.12, 0.80, 1.0], [0, 1, 1, 0]);

  // Spin is driven inside Three.js (no CSS rotateY on canvas ancestor — that breaks drei Html overlays)
  const introRotYRef = useRef<number>(Math.PI / 2); // keyboard starts sideways
  useEffect(() => {
    // Sync current value on mount (handles page load with section already in view)
    const v = scrollYProgress.get();
    introRotYRef.current = v < 0.22 ? (1 - v / 0.22) * (Math.PI / 2) : 0;
    return scrollYProgress.on("change", (val: number) => {
      introRotYRef.current = val < 0.22 ? (1 - val / 0.22) * (Math.PI / 2) : 0;
    });
  }, [scrollYProgress]);

  return (
    // overflow-hidden removed — drei Html icon overlays are DOM elements clipped by it
    <section ref={sectionRef} id="skills" className="relative z-2">

      {/* heading — stays inside the normal padding */}
      <div className="max-w-7xl mx-auto pt-14 px-3 sm:px-5">
        <motion.div
          className="mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="slabel mb-3">tech stack</div>
          <h2 className="text-3xl sm:text-5xl font-black">
            Tools & <span className="gtx">Teknologi</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Senjata yang saya pakai untuk membangun produk.</p>
        </motion.div>
      </div>

      {/* ── desktop: scroll-driven fade; spin is inside Three.js so Html icons stay correct ── */}
      <motion.div
        className="hidden lg:block relative"
        style={{ height: "72vh", minHeight: 640, opacity: kbOpacity }}
      >
        {/* Info panel — flat, no CSS 3D transform on it */}
        <motion.div
          className="absolute z-10"
          style={{ left: "clamp(24px, 4vw, 80px)", top: "50%", transform: "translateY(-50%)" }}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          <TechInfoPanel tech={hoveredTech} />
        </motion.div>

        {/* No CSS perspective/rotateY wrapper here — drei Html overlays break under CSS 3D transforms */}
        <MechanicalKeyboard3D onHover={setHoveredTech} introRotY={introRotYRef} />
      </motion.div>

        {/* ── mobile: flat keycap grid by category (no card wrappers) ─── */}
        <div className="lg:hidden space-y-8 px-3 sm:px-5 pb-14 max-w-7xl mx-auto">
          {categories.map(([cat, items], i) => {
            const color = categoryColors[cat] || "#10b981";
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ width: 3, height: 18, borderRadius: 2, background: color }} />
                  <span className="mono" style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.07em" }}>
                    {cat}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))", gap: 10 }}>
                  {Object.entries(items).map(([key, skill], j) => (
                    <Keycap key={key} skill={skill} color={color} index={j} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

    </section>
  );
}
